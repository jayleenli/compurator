'''
workspace handler

Contains all endpoints for /workspaces


'''
import os
import json
import sys
from pymongo import MongoClient
from bson import ObjectId
import mongoSetup as ms
from utility.laptop_info import get_attributes, find_company_name
from utility.sentiment_analysis import get_amazon_sentiment, get_seller_reputation

# Connects to MongoDB
db = ms.connect_database()

def get_workspaces(event, context):
	'''
	GET /workspaces endpoint
	Given a correct Google JWT token for a user, this endpoint will return all the workspaces of the user
	Also if the user has never logged into the account before, it will create on in the users collection

	'''

	global db
	users_collection = db["users"]
	workspace_collection = db["workspaces"]
	products_collection = db["products"]

	body = ""
	authorizer_response = event

	#Grab the user information from ms
	print("requestContext: ", authorizer_response["requestContext"]["authorizer"])
	user_info = ms.get_user_auth(authorizer_response)
	user_google_id = user_info["g_id"]
	user_name = user_info["name"]

	#See if the user exists and create them if not
	ms.check_user(user_info)

	#Find workspaces for the user
	cursor = workspace_collection.find({"owner": user_google_id})
	#If there is no workspaces return no workspaces
	if (cursor.count() == 0):
		body = {"workspaces":[]}
	else:
		#Return workspaces of the user
		build_body = {"workspaces": []}

		for workspace in cursor:
			print("workspace", workspace)
			build_workspace = {"workspace_id": 0, "products": []}
			build_workspace["name"] = workspace["name"]
			build_workspace["workspace_id"] = str(workspace["_id"])
			#Go through the products array and add product info
			products = workspace["products"]

			for p_id in products:
				#Get info from products collection
				product_cursor = products_collection.find({"p_id": p_id})

				if (product_cursor.count() == 0):
					#for some reason the product does not exist in product collection
					error = {"error": "This product does not exist."}
					build_workspace["products"].append(error)
				else:
					#a product is returned, there should not be more than one product per product id
					#Only for loop once but idk how to return just one
					for product in product_cursor:
						del product["_id"] #Deleted the _id that is auto generated from Mongo
						build_workspace["products"].append(product)

			build_body["workspaces"].append(build_workspace)

		body = build_body

	response = {
		"statusCode": 200,
		"body": json.dumps(body),
		"headers": {
			"Access-Control-Allow-Origin": "*"
		}
	}

	return response



def get_workspace_by_id(event, context):
	'''
	GET /workspaces/{workspaceId} endpoint
	Given a correct Google JWT token for a user, this endpoint will return the workspace of the specified ID
	Should only work if the user owns that workspace

	'''
	global db
	users_collection = db["users"]
	workspace_collection = db["workspaces"]
	products_collection = db["products"]

	body = ""
	statusCode = 200

	authorizer_response = event

	# Grab the user information from ms
	print("requestContext: ", authorizer_response["requestContext"]["authorizer"])
	user_info = ms.get_user_auth(authorizer_response)
	user_google_id = user_info["g_id"]
	user_name = user_info["name"]
	workspace_Id = authorizer_response["pathParameters"]["workspaceId"]

	check_owner = True

	# get the workspaces for this user
	got_workspace = workspace_collection.find_one({"_id": ObjectId(workspace_Id)}, {"_id": 0})

	# check if workspace exists
	if got_workspace is None:
		statusCode = 404
		body = {"Error": "Workspace does not exist"}
		print("cannot get nonexistent workspace")
	# check if user has permission to get workspace
	elif got_workspace["owner"] != user_google_id:
		statusCode = 403
		body = {"Error": "User does not own workspace"}
		print("cannot get workspace; user is not owner of workspace, permission denied")
	# workspace exists and user is owner
	else:
		# delete unnecessary info
		got_workspace.pop("owner")
		# get details for all products in products list of workspace
		if "products" in got_workspace:
			products = got_workspace["products"]
			detailed_products = []
			for p_id in products:
				product = products_collection.find_one({"p_id": p_id}, {"_id": 0})
				if product:
					try:
						product["notes"] = got_workspace["notes"][p_id]
					except KeyError:
						pass
					detailed_products.append(product)
			got_workspace["products"] = detailed_products

		body = got_workspace
		print("retrieved workspace successfully")


	response = {
		"statusCode": statusCode,
		"body": json.dumps(body),
		"headers": {
			"Access-Control-Allow-Origin": "*"
		}
	}

	return response

def patch_workspace_by_id(event, context):
	'''
	PATCH /workspaces/{workspaceId} endpoint
	Given a correct Google JWT token that matches the owner of the workspace and correct json for an updated workspace
	endpoint will update the workspace with new info

	Format for PATCH JSON

	Each field is optional, the ones that are specified will be updated into the workspace.
	{
		"name" : "new title",
		"product" : {
			"title": "title of product",
			"price": "$420.69",
			"p_id": "uniqueIDToIdentifyProduct",
			"url": "linkToProduct",
			"img_url": "linkToImageOfProduct"
		},
		"note" : {
			"p_id": "productIdOfProductThatHasNote",
			"content": "contentOfNoteForProduct"
		}
	}

	'''

	global db
	users_collection = db["users"]
	workspace_collection = db["workspaces"]
	products_collection = db["products"]

	body = ""
	statusCode = 200

	authorizer_response = event

	# Grab the user information from ms
	user_info = ms.get_user_auth(authorizer_response)
	user_g_id = user_info["g_id"]
	user_name = user_info["name"]
	workspace_Id = authorizer_response["pathParameters"]["workspaceId"]

	# flag for allowing check for if user is owner of workspace
	check_owner = True

	patch_info = json.loads(authorizer_response["body"])

	# Then find the workspaces for this user
	cursor = workspace_collection.find({"_id": ObjectId(workspace_Id)})
	print("user:", user_g_id, "; owner:", cursor[0]["owner"])

	# if workspace not found
	if cursor.count() == 0:
		statusCode = 404
		body = {"Error":"Workspace does not exist!"}
		print("cannot modify nonexistent workspace")
	# else if user google id does not match workspace owner id, deny permission to modify workspace
	elif check_owner and user_g_id != cursor[0]["owner"]:
		statusCode = 403
		body = {"Error": "User does not own workspace"}
		print("user is not owner of workspace, permission denied; workspace not modified")
	else:
		# Update the ones that were passed into POST request with correct data.
		for key in patch_info:
			# everytime patch is called only adding one product
			if key == "product":
				# Check to see if the url given exists in db, if not add

				patch_product = patch_info[key]
				product_id = patch_product["p_id"]

				product_result = products_collection.update_one({"p_id": product_id}, {"$set": patch_product}, upsert=True)
				result = workspace_collection.update_one({"_id": ObjectId(workspace_Id)}, {"$addToSet": {"products": product_id}})

				# add product to product collections if not already in collection
				if product_result.upserted_id:
					print("added new product", product_id, "to collection of products")
					laptop_name = patch_product["title"]

					review_score = get_amazon_sentiment(product_id)
					if review_score is not None:
						print("retrieved valid sentiment", review_score)
						products_collection.update_one({"p_id": product_id}, {"$set": {"review_score": review_score}})

					# uncomment below when we get seller (str type)
					seller = find_company_name(laptop_name)
					seller_reputation = get_seller_reputation(seller)
					products_collection.update_one({"p_id": product_id}, {"$set": {"seller_rep": seller_reputation}} )

				# modify product details if product is already in product collection
				elif product_result.modified_count > 0:
					print("changes applied to existing product", product_id)
				# no changes made to product collection somehow
				elif product_result.matched_count > 0 and product_result.matched_count != product_result.modified_count:
					print("no changes to existing product", product_id)
				print("match:", product_result.matched_count, "; modified:", product_result.modified_count, ";", product_result.upserted_id)

				# append product to list of products if id not included
				if result.modified_count > 0:
					print("appended product", product_id, "to list of products of workspace with ID", workspace_Id)
				# do not modify list of products if id already exists
				elif result.matched_count > 0 and result.matched_count != result.modified_count:
					print("no changes made, product", product_id, "already exists in workspace")
				print("match:", result.matched_count, "; modified:", result.modified_count, ";", result.upserted_id)

			elif key == "note":
				# get the current notes sub-document from the given workspace
				patch_note = patch_info[key]
				workspace = workspace_collection.find_one({"_id": ObjectId(workspace_Id)}, {"notes": 1})
				workspace_notes = None
				if "notes" not in workspace:
					workspace_notes = dict()
				else:
					workspace_notes = workspace["notes"]
				# update the note for a specific product
				workspace_notes[patch_note["p_id"]] = patch_note["content"]
				result = workspace_collection.update_one({"_id": ObjectId(workspace_Id)}, {"$set": {"notes": workspace_notes}})

				if result.modified_count > 0:
					print("added or editted note for product", patch_note["p_id"])
				elif result.matched_count > 0 and result.matched_count != result.modified_count:
					print("no changes made to notes")
				else:
					print("unsuccessful modification of note")
				print("match:", result.matched_count, "; modified:", result.modified_count)

			else:
				# any field other than product will be updated with new data
				result = workspace_collection.update_one({"_id": ObjectId(workspace_Id)}, {"$set": {key: patch_info[key]}})
				# update field if new data is different from existing data
				if result.modified_count > 0:
					print("set", key, "to", patch_info[key])
				# do not update field if new data is same as existing data
				elif result.matched_count > 0 and result.matched_count != result.modified_count:
					print("no changes from", patch_info[key], "; key", key, "not set")
				# unexpected behavior to update
				else:
					print("unsuccessful modification to ", key)
				print("match:", result.matched_count, "; modified:", result.modified_count)

		body = {"Message": "Success"}

	response = {
		"statusCode": statusCode,
		"body": json.dumps(body),
		"headers": {
			"Access-Control-Allow-Origin": "*"
		}
	}

	return response


def create_workspace(event, context):
	'''
	POST /workspaces
	Creates a new workspace with given JWT token, returns the id of the workspace
	'''
	global db

	body = {}

	authorizer_response = event

	try:
		user_info = ms.get_user_auth(event)

		# Create new workspace owned by user with default untitled name
		new_workspace = {"owner": user_info["g_id"], "name": "Untitled Workspace", "products": []}
		new_id = db.workspaces.insert_one(new_workspace).inserted_id
		print("new workspace inserted, workspace id:", str(new_id))
		body["_id"] = str(new_id)

		response = {
			"statusCode": 200,
			"body": json.dumps(body),
			"headers": {
				"Access-Control-Allow-Origin": "*"
			}
		}
		return response
	except:
		e = sys.exc_info()[0]
		errorCode = {"code": 1}
		errorCode["message"] = "ERROR: " + str(e)
		response = {
			"statusCode": 500,
			"errorCode": json.dumps(errorCode),
			"body": json.dumps(body),
			"headers": {
				"Access-Control-Allow-Origin": "*"
			}
		}
		print("ERROR:", sys.exc_info()[1])
		return response

def delete_workspace_by_id(event, context):
	global db
	users_collection = db["users"]
	workspace_collection = db["workspaces"]

	body = ""
	statusCode = 200
	errorCode = {}

	authorizer_response = event

	try:
		user_info = ms.get_user_auth(authorizer_response)
		workspaceId = authorizer_response["pathParameters"]["workspaceId"]
		user_g_id = user_info["g_id"]
		user_name = user_info["name"]

		#Then find the workspaces for this user
		cursor = workspace_collection.find({"_id": ObjectId(workspaceId)})

		for workspace in cursor:
			if (cursor.count() == 0):
				#If workspace does not exist return 404
				statusCode = 404
				errorCode["message"] = "ERROR: Workspace does not exist!"
			elif (workspace["owner"] != user_g_id):
				statusCode = 404
				errorCode["message"] = "ERROR: User does not own this workspace."
			else:
				#Everything is daijoubu
				workspace_collection.remove({ "_id": ObjectId(workspaceId)})
				body = "Workspace Deleted"

		if (statusCode != 200):
			#If the request is not ok
			body = {"errorCode" : errorCode}

		response = {
			"statusCode": statusCode,
			"body": json.dumps(body),
			"headers": {
				"Access-Control-Allow-Origin": "*"
			}
		}
		return response

	except:
		e = sys.exc_info()[0]
		errorCode = {"code": 1}
		errorCode["message"] = "ERROR: " + str(e)
		response = {
			"statusCode": 500,
			"errorCode": json.dumps(errorCode),
			"body": json.dumps(body),
			"headers": {
				"Access-Control-Allow-Origin": "*"
			}
		}
		print("ERROR:", sys.exc_info()[1])
		return response

def delete_pid_from_workspace_by_id(event, context):
	global db
	users_collection = db["users"]
	workspace_collection = db["workspaces"]
	products_collection = db["products"]

	body = ""
	statusCode = 200
	errorCode = {}

	authorizer_response = event

	try:
		user_info = ms.get_user_auth(authorizer_response)
		workspaceId = authorizer_response["pathParameters"]["workspaceId"]
		p_id = authorizer_response["pathParameters"]["pid"]
		user_g_id = user_info["g_id"]
		user_name = user_info["name"]

		#Then find the workspaces for this user
		cursor = workspace_collection.find({"_id": ObjectId(workspaceId)})

		for workspace in cursor:
			if (cursor.count() == 0):
				#If workspace does not exist return 404
				statusCode = 404
				errorCode["message"] = "ERROR: Workspace does not exist!"
			elif (workspace["owner"] != user_g_id):
				statusCode = 404
				errorCode["message"] = "ERROR: User does not own this workspace."
			else:
				#Now check products
				products_arr = workspace["products"]

				if (p_id not in products_arr):
					statusCode = 404
					errorCode["message"] = "ERROR: product id does not exist!"
				else:
					workspace_collection.update(
						{ "_id" : ObjectId(workspaceId)},
						{ "$pull": { "products" : { "$in": [p_id] } } }
					)

					body = "Product id deleted from workspace"

		if (statusCode != 200):
			#If the request is not ok
			body = {"errorCode" : errorCode}

		response = {
			"statusCode": statusCode,
			"body": json.dumps(body),
			"headers": {
				"Access-Control-Allow-Origin": "*"
			}
		}
		return response

	except:
		e = sys.exc_info()[0]
		errorCode = {"code": 1}
		errorCode["message"] = "ERROR: " + str(e)
		response = {
			"statusCode": 500,
			"errorCode": json.dumps(errorCode),
			"body": json.dumps(body),
			"headers": {
				"Access-Control-Allow-Origin": "*"
			}
		}
		print("ERROR:", sys.exc_info()[1])
		return response
