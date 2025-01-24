from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
import uuid

class Message(BaseModel):
  sender_id: str
  receiver_id: str
  content: str
  timestamp: datetime = Field(default_factory=datetime.utcnow)

class User(BaseModel):
    username: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
