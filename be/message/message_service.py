from fastapi import WebSocket, WebSocketDisconnect
from datetime import datetime
from typing import List, Optional, Dict

class ConnectionManager:
  def __init__(self):
    self.active_connections: List[WebSocket] = []

  async def connect(self, websocket: WebSocket):
    await websocket.accept()
    self.active_connections.append(websocket)

  def disconnect(self, websocket: WebSocket):
    self.active_connections.remove(websocket)

  async def broadcast(self, message: str):
    for connection in self.active_connections:
      await connection.send_text(message)
            
websocket_manager = ConnectionManager()

# Helper function để convert ObjectId thành string
def message_helper(message) -> dict:
  return {
    "id": str(message["_id"]),
    "sender": message.get("sender"),
    "content": message.get("content"),
    "timestamp": message.get("timestamp"),
  }


