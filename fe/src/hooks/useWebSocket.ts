"use client"

import { useEffect, useRef, useState } from "react";
import axios from "axios"

interface IMessage {
  sender: string, 
  content: string,
  timestamp: string,
}

const useWebSocket = (userId: string) => {
  const url = `ws://localhost:8000/message/ws/${userId}`
  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  const getMongoMessages = async() => {
    const response = await axios.get(`http://127.0.0.1:8000/message/`);
    setMessages(response.data)
  }
  useEffect(() => {
    getMongoMessages()
  }, [])

  useEffect(() => {
    console.log('messages: ', messages)
  }, [messages])

  
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      setEvents((prev) => [...prev, event.data]);
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    }

    socket.onclose = () => {
      console.log("WebSocket closed");
    }

    return () => {
      socket.close();
    }
  }, [url])

  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.send(message)
      setMessages(prev => [...prev, message])
    }
  }

  return { 
    messages, 
    sendMessage 
  }
}

export default useWebSocket
