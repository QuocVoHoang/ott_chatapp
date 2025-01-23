from pymongo import MongoClient

client = MongoClient("mongodb+srv://vohoangquoc992001:eJFmmqfI1apl9IJf@cluster0.ydozx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

db = client.todo_db

collection_name = db['todo_collection']