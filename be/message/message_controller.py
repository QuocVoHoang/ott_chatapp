from fastapi import APIRouter
# from config.database import message_collection
from schema.schemas import list_serial
from bson import ObjectId
from models.models import Message

message_router = APIRouter()

# @message_router.get("/")
# async def get_all_message():
#   messages = list_serial(message_collection.find())
#   return messages

# @message_router.post("/")
# async def create_new_message(new_message: Message):
#   message_collection.insert_one(dict(new_message))
  
# @message_router.put("/{id}")
# async def put_todo(id: str, todo: Todo):
#   message_collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(todo)})
  
# @message_router.delete("/{id}")
# async def delete_todo(id: str):
#   message_collection.find_one_and_delete({"_id": ObjectId(id)})
