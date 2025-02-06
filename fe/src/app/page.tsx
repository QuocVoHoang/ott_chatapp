'use client'
import { useEffect, useState } from "react"
import useWebSocket from "../hooks/useWebSocket"

import { AppSidebar } from "@/components/SideBar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RootState } from "@/lib/redux/store"
import { useSelector } from "react-redux"
import { Box, Button, Input } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import MessageItem from "@/components/MessageItem/MessageItem"

export default function Page() {
  const userId = useSelector((state: RootState) => state.user.userUid)
  const { 
    messages, 
    sendMessage,
    setCurrentConversationId
  } = useWebSocket(userId)

  const [input, setInput] = useState("")

  const handleSendMessage = () => {
    sendMessage(input)
    setInput("")
  }
  
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar setCurrentConversationId={setCurrentConversationId}/>
      <SidebarInset>
        <header className="h-[62px] sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">All Inboxes</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <Box 
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box
            sx={{
              height: "calc(100vh - 142px)",
              backgroundColor: "#81a7e6",
              overflow: "auto",
              padding: "10px"
            }}
          >
            {messages.map((message, index) => {
              let isShowPicture = false
              if(index === 0) {
                isShowPicture = true
              } else {
                if(message.sender === messages[index-1].sender) {
                  isShowPicture = false
                } else {
                  isShowPicture = true
                }
              }
              return (
                <MessageItem 
                  key={index}
                  message={message}
                  isShowPicture={isShowPicture}
                />
              )})}
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "80px",
              backgroundColor: "#e6d081",
              display: "flex",
              paddingX: "50px"
            }}
          >
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              sx={{
                width: "calc(100% - 100px)",
                height: "60px"
              }}
            />
            <Button 
              sx={{
                width: "100px",
                backgroundColor: "#ce81e6"
              }}
              onClick={handleSendMessage}
            >
              <SendIcon/>
            </Button>
            
          </Box>
        </Box>
      </SidebarInset>
    </SidebarProvider>
  )
}

