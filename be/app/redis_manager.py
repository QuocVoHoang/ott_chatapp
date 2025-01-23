import aioredis
from typing import Optional

class RedisManager:
    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self.redis = None

    async def connect(self):
        self.redis = await aioredis.from_url(self.redis_url, decode_responses=True)

    async def disconnect(self):
        if self.redis:
            await self.redis.close()

    async def publish(self, channel: str, message: str):
        await self.redis.publish(channel, message)

    async def subscribe(self, channel: str):
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(channel)
        return pubsub

redis_manager = RedisManager("redis://localhost:6379")
