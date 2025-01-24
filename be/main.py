# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from message.message_controller import message_router
# from manager.manager_controller import manager_router

# app = FastAPI(docs_url="/docs")

# app.add_middleware(
#   CORSMiddleware,
#   allow_origins=["*"],
#   allow_credentials=True,
#   allow_methods=["*"],
#   allow_headers=["*"],
# )

# app.include_router(
#     router=message_router,
#     prefix="/message",
#     tags=["Message Controller"]
# )

# app.include_router(
#     router=manager_router,
#     prefix="/manager",
#     tags=["Manager Controller"]
# )



from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
from datetime import datetime
import uuid
from bson import ObjectId
from models.models import Message, User

app = FastAPI()

client = AsyncIOMotorClient("mongodb+srv://vohoangquoc992001:eJFmmqfI1apl9IJf@cluster0.ydozx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["chat_app"] 
collection = db["messages"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL Frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



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
manager = ConnectionManager()

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = {
                "sender_id": user_id,
                "content": data,
                "timestamp": datetime.utcnow(),
            }
            print('new message: ', data)
            await db.messages.insert_one(message_data)  # Lưu tin nhắn vào MongoDB
            await manager.broadcast(f"{user_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/register")
async def register_user(user: User):
    existing_user = await db.users.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    await db.users.insert_one(user.dict())
    return {"message": "User registered successfully"}


# Helper function để convert ObjectId thành string
def message_helper(message) -> dict:
    return {
        "id": str(message["_id"]),
        "sender": message.get("sender"),
        "content": message.get("content"),
        "timestamp": message.get("timestamp"),
    }


@app.get("/messages", response_model=List[dict])
async def get_messages():
    """
    Lấy tất cả các bản ghi từ collection `messages`
    """
    messages = await collection.find().to_list(length=100)
    return [message_helper(msg) for msg in messages]