from fastapi import APIRouter, HTTPException
from bson import ObjectId
from models.models import Message, TextMessageCreate
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
from typing import List, Optional, Dict
from message.message_service import websocket_manager, message_helper
from mongo_init import db, message_collection, conversation_collection

message_router = APIRouter()


@message_router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
  await websocket_manager.connect(websocket, user_id)
  try:
    while True:
      data = await websocket.receive_json()
      
      if "conversation_id" not in data or "content" not in data:
        await websocket.send_json({"error": "Invalid message format"})
        continue

      conversation_id = data["conversation_id"]
      content = data["content"]

      conversation = await conversation_collection.find_one({"_id": ObjectId(conversation_id)})
      if not conversation:
        await websocket.send_json({"error": "Conversation not found"})
        continue

      if user_id not in conversation["participants"]:
        await websocket.send_json({"error": "Sender is not in this conversation"})
        continue

      message_data = {
        "conversation_id": conversation_id,
        "sender": user_id,
        "content": content,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "type": "text"
      }

      result = await message_collection.insert_one(message_data)
      message_data["_id"] = str(result.inserted_id)
      await websocket_manager.broadcast(message_data, conversation_id)
  except WebSocketDisconnect:
    websocket_manager.disconnect(websocket, user_id)


@message_router.post("/send-text")
async def send_text_message(message: TextMessageCreate):
  """
  Send message to a conversation via conversation_id.
  """
  conversation = await conversation_collection.find_one({"_id": ObjectId(message.conversation_id)})
  if not conversation:
    raise HTTPException(status_code=404, detail="Conversation not found")

  if message.sender not in conversation["participants"]:
    raise HTTPException(status_code=403, detail="Sender is not in this conversation")
  
  message_data = {
    "conversation_id": message.conversation_id,
    "sender": message.sender,
    "content": message.content,
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow(),
    "type": message.type,
  }
  result = await message_collection.insert_one(message_data)
  return {"message_id": str(result.inserted_id), "message": "Message sent successfully"}

@message_router.get("/conversation/{conversation_id}")
async def get_conversation_messages(conversation_id: str):
  """
  Get all messages in a converastion.
  """
  messages = await message_collection.find({"conversation_id": conversation_id}).sort("created_at", 1).to_list(length=100)

  if not messages:
    # raise HTTPException(status_code=404, detail="No messages found in this conversation")
    return []

  for msg in messages:
    msg["_id"] = str(msg["_id"])

  return messages


# @message_router.get("/", response_model=List[dict])
# async def get_messages():
#   """
#   Get all messages from collection `messages`
#   """
#   messages = await message_collection.find().to_list(length=100)
#   return [message_helper(msg) for msg in messages]