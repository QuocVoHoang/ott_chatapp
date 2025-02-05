from fastapi import APIRouter
from bson import ObjectId
from models.models import Message
from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
from typing import List, Optional, Dict
from message.message_service import websocket_manager, message_helper
from mongo_init import db, message_collection

message_router = APIRouter()


@message_router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
  await websocket_manager.connect(websocket)
  try:
    while True:
      data = await websocket.receive_text()
      message_data = {
        "sender_id": user_id,
        "content": data,
        "timestamp": datetime.utcnow(),
      }
      print('new message: ', data)
      await db.messages.insert_one(message_data)
      await websocket_manager.broadcast(f"{user_id}: {data}")
  except WebSocketDisconnect:
      websocket_manager.disconnect(websocket)


@message_router.get("/", response_model=List[dict])
async def get_messages():
  """
  Lấy tất cả các bản ghi từ collection `messages`
  """
  messages = await message_collection.find().to_list(length=100)
  return [message_helper(msg) for msg in messages]