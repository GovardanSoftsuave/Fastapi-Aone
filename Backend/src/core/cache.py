import redis.asyncio as redis
from core.config import settings

class Cache:
    def __init__(self):
        self.redis_url = settings.REDIS_URL
        self.client = None

    async def connect(self):
        if not self.client:
            self.client = redis.from_url(self.redis_url, encoding="utf-8", decode_responses=True)

    async def close(self):
        if self.client:
            await self.client.close()
            self.client = None

    async def get(self, key: str):
        if not self.client:
            await self.connect()
        return await self.client.get(key)

    async def set(self, key: str, value: str, expire: int = None):
        if not self.client:
            await self.connect()
        return await self.client.set(key, value, ex=expire)

    async def delete(self, key: str):
        if not self.client:
            await self.connect()
        return await self.client.delete(key)

cache = Cache()
