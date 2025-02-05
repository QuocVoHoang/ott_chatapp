from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List, Optional, Dict
from models.models import ConversationCreate
from mongo_init import conversation_collection

conversation_router = APIRouter()


@conversation_router.post("/")
async def create_conversation(conversation: ConversationCreate):
  """
  create a new conversation
  """
  conversation_data = {
    "name": conversation.name,
    "participants": conversation.participants,
    "created_at": datetime.utcnow(),
    "updated_at": datetime.utcnow(),
  }

  result = await conversation_collection.insert_one(conversation_data)

  return {"conversation_id": str(result.inserted_id), "message": "Conversation created successfully"}

@conversation_router.get("/user/{user_id}")
async def get_user_conversations(user_id: str):
  """
  get all conversations of a user (id)
  """
  conversations = await conversation_collection.find({"participants": user_id}).to_list(length=100)

  if not conversations:
    raise HTTPException(status_code=404, detail="No conversations found")

  for conv in conversations:
    conv["_id"] = str(conv["_id"])

  return conversations