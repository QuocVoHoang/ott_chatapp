from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import chat
from app.redis_manager import redis_manager
from fastapi.responses import HTMLResponse
import redis

app = FastAPI(docs_url="/docs")

app.add_middleware(
  CORSMiddleware,
  allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)



r = redis.Redis(
  host='novel-alien-58175.upstash.io',
  port=6379,
  password='AeM_AAIjcDFhNDEzYTA1OTMyZWI0ZjNjOWMzYmQ1NzQ1ZjZhYWVhNXAxMA',
  ssl=True
)

r.set('foo', 'bar')
print(r.get('foo'))