from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.redis_manager import redis_manager
import asyncio

router = APIRouter()

connected_clients = []

@router.websocket("/ws/chat/{room}")
async def chat_websocket(websocket: WebSocket, room: str):
    await websocket.accept()
    connected_clients.append(websocket)

    # Subscribe vào channel Redis
    pubsub = await redis_manager.subscribe(room)

    try:
        # Tạo một task để nhận tin nhắn từ Redis và gửi tới client
        async def redis_listener():
            async for message in pubsub.listen():
                if message["type"] == "message":
                    for client in connected_clients:
                        await client.send_text(message["data"])

        # Chạy listener trong một task riêng
        task = asyncio.create_task(redis_listener())

        while True:
            # Nhận tin nhắn từ client
            data = await websocket.receive_text()
            # Gửi tin nhắn đến Redis
            await redis_manager.publish(room, data)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
        task.cancel()
    finally:
        await pubsub.unsubscribe(room)
