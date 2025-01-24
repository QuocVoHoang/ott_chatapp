from fastapi import APIRouter, HTTPException, WebSocket
# from database.database import manager_collection, manager_db
from typing import List
from bson import ObjectId
from models.models import User, Message
from database.database import db

manager_router = APIRouter()

# @manager_router.get("/")
# async def get_all_message():
#   todos = list_serial(manager_collection.find())
#   return todos

active_connections: List[WebSocket] = []

@manager_router.post("/register")
async def register_user(user: User):
  existing_user = await db.users.find_one({"username": user.username})
  if existing_user:
    raise HTTPException(status_code=400, detail="Username already exists")
  
  await db.users.insert_one(user.dict())
  return {"message": "User registered successfully"}

@manager_router.post("/send-message")
async def send_message(message: Message):
  await db.messages.insert_one(message.dict())
  return {"message": "Message sent successfully"}

@manager_router.get("/get-messages/{user_id}")
async def get_messages(user_id: str):
  messages = await db.messages.find({"$or": [
    {"sender_id": user_id},
    {"receiver_id": user_id}
  ]}).to_list(length=100)
  return messages

@manager_router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
  await websocket.accept()
  active_connections.append(websocket)
  try:
    while True:
      data = await websocket.receive_text()
      for connection in active_connections:
        await connection.send_text(f"User {user_id}: {data}")
  except Exception as e:
    active_connections.remove(websocket)

# @manager_router.post("/")
# async def post_todo(todo: Todo):
#   manager_collection.insert_one(dict(todo))
  
# @manager_router.put("/{id}")
# async def put_todo(id: str, todo: Todo):
#   manager_collection.find_one_and_update({"_id": ObjectId(id)}, {"$set": dict(todo)})
  
# @manager_router.delete("/{id}")
# async def delete_todo(id: str):
#   manager_collection.find_one_and_delete({"_id": ObjectId(id)})
