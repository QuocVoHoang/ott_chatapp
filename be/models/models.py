from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import datetime
from bson import ObjectId
from enum import Enum

class MessageType(str, Enum):
  text = "text"
  image = "image"
  file = "file"
  video = "video"

class PyObjectId(str):
  @classmethod
  def __get_validators__(cls):
    yield cls.validate

  @classmethod
  def validate(cls, v):
    if not ObjectId.is_valid(v):
      raise ValueError("Invalid ObjectId")
    return str(v)


class Conversation(BaseModel):
  name: str
  participants: List[str]
  conversation_picture: str
  created_at: datetime = Field(default_factory=datetime.utcnow)
  updated_at: datetime = Field(default_factory=datetime.utcnow)


class Message(BaseModel):
  conversation_id: PyObjectId
  type: MessageType
  sender: str
  content: str
  created_at: datetime = Field(default_factory=datetime.utcnow)
  updated_at: datetime = Field(default_factory=datetime.utcnow)


##############################
class ConversationCreate(BaseModel):
  name: str
  participants: List[str]
  
class TextMessageCreate(BaseModel):
  conversation_id: str
  type: str = "text"
  sender: str
  content: str
  
