import os
from pymongo import MongoClient

db = None

def connect_database():
	# Connect to MongoDB
	global db
	db_url = os.environ['DB_URL']
	print(f"Connecting to {db_url}")
	client = MongoClient(db_url)
	db = client.compurator
	print("Connected to database")
	return db

def get_user_auth(event):
	# Get user info from authorizer
	authorizer_response = event
	print("requestContext: ", authorizer_response["requestContext"]["authorizer"])
	google_id = authorizer_response["requestContext"]["authorizer"]["user_id"]
	name = authorizer_response["requestContext"]["authorizer"]["user_name"]
	return {"g_id": google_id, "name": name}

def check_user(user_info):
	# Check to see if the user in the the user collections if not store into user collection
	user = db.users.find_one({"google_client_id": user_info["g_id"]})
	if user is None:
		user = {"google_client_id": user_info["g_id"], "name": user_info["name"]}
		db.users.insert_one(user)
		print("user(", user_info["g_id"],") not found, new user created")
	print("user:", user)
	return user