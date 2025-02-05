from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb+srv://vohoangquoc992001:oygNwh2tdUQ0b2Tq@cluster0.zz9ez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(MONGO_URI)
db = client["chat_app"]
conversation_collection = db["conversations"]
message_collection = db["messages"]