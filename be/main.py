from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from conversation.conversation_controller import conversation_router
from message.message_controller import message_router

app = FastAPI(docs_url="/docs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# class ConnectionManager:
#     def __init__(self):
#         self.active_connections: List[WebSocket] = []

#     async def connect(self, websocket: WebSocket):
#         await websocket.accept()
#         self.active_connections.append(websocket)

#     def disconnect(self, websocket: WebSocket):
#         self.active_connections.remove(websocket)

#     async def broadcast(self, message: str):
#         for connection in self.active_connections:
#             await connection.send_text(message)
# manager = ConnectionManager()

# @app.websocket("/ws/{user_id}")
# async def websocket_endpoint(websocket: WebSocket, user_id: str):
#     await manager.connect(websocket)
#     try:
#         while True:
#             data = await websocket.receive_text()
#             message_data = {
#                 "sender_id": user_id,
#                 "content": data,
#                 "timestamp": datetime.utcnow(),
#             }
#             print('new message: ', data)
#             await db.messages.insert_one(message_data)  # Lưu tin nhắn vào MongoDB
#             await manager.broadcast(f"{user_id}: {data}")
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)


# # Helper function để convert ObjectId thành string
# def message_helper(message) -> dict:
#     return {
#         "id": str(message["_id"]),
#         "sender": message.get("sender"),
#         "content": message.get("content"),
#         "timestamp": message.get("timestamp"),
#     }


# @app.get("/messages", response_model=List[dict])
# async def get_messages():
#     """
#     Lấy tất cả các bản ghi từ collection `messages`
#     """
#     messages = await message_collection.find().to_list(length=100)
#     return [message_helper(msg) for msg in messages]

app.include_router(
    router=conversation_router,
    prefix="/conversation",
    tags=["Conversation Controller"]
)

app.include_router(
    router=message_router,
    prefix="/message",
    tags=["Message Controller"]
)