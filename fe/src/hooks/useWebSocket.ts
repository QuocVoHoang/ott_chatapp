"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

const useWebSocket = (userId: string) => {
  const protocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss" : "ws";
  const url = `${protocol}://localhost:8000/message/ws/${userId}`;

  const [events, setEvents] = useState<any[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const currentConversationIdRef = useRef<string>("");

  const getCurrentConversationMessages = async (conversationId: string) => {
    if (conversationId) {
      const response = await axios.get(`http://127.0.0.1:8000/message/conversation/${conversationId}`);
      setMessages(response.data);
    }
  };

  const setCurrentConversationId = (id: string) => {
    currentConversationIdRef.current = id;
    getCurrentConversationMessages(id);
  };

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);

        console.log("Received message:", messageData);

        if (messageData.conversation_id === currentConversationIdRef.current) {
          setMessages((prev) => [...prev, messageData]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        if (socketRef.current?.readyState !== WebSocket.OPEN) {
          socketRef.current = new WebSocket(url);
        }
      }, 3000);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (!currentConversationIdRef.current || !socketRef.current) return;

    const newSentMessage: IMessage = {
      conversation_id: currentConversationIdRef.current,
      sender: userId,
      content: message
    };

    try {
      socketRef.current.send(JSON.stringify(newSentMessage));
      // setMessages((prev) => [...prev, newSentMessage]);
    } catch (error) {
      console.error("Error sending WebSocket message:", error);
    }
  };

  return { 
    messages, 
    sendMessage,
    setCurrentConversationId 
  };
};

export default useWebSocket;
