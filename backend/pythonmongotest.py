from pymongo import MongoClient

client = MongoClient("mongodb+srv://master:animeanime@cluster0-swsn8.mongodb.net/test?retryWrites=true&w=majority")
db = client.cheese
users_collection = db["customers"]


#Check to see if the user in the the user collections if not store into user collection
cursor = users_collection.find()
print("CURSOR", cursor)

for doc in cursor:
    print(doc)

array = list(cursor)
print("doc", array)

