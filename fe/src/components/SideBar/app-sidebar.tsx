"use client"


import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Contact } from 'lucide-react';
import { NavUser } from "./nav-user"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import React, { useEffect, useState } from "react";


const navMain = [
  {
    title: "Inbox",
    icon: Inbox,
    isActive: true,
  },
  {
    title: "Contact",
    icon: Contact,
    isActive: false,
  }
]

const mailsSample = [
  {
    name: "William Smith",
    email: "williamsmith@example.com",
    subject: "Meeting Tomorrow",
    date: "09:34 AM",
    teaser:
      "Hi team, just a reminder about our meeting tomorrow at 10 AM.\nPlease come prepared with your project updates.",
  },
  {
    name: "Alice Smith",
    email: "alicesmith@example.com",
    subject: "Re: Project Update",
    date: "Yesterday",
    teaser:
      "Thanks for the update. The progress looks great so far.\nLet's schedule a call to discuss the next steps.",
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = useState(navMain[0])
  const [conversations, setConversations] = useState<any[]>()
  const { setOpen } = useSidebar()

  const userId = useSelector((state: RootState) => state.user.userUid)

  const getUserConversations = async() => {
    if(userId) {
      const response = await axios.get(`http://127.0.0.1:8000/conversation/user/${userId}`)
      console.log('all conver', response.data)
      setConversations(response.data)
    }
  }

  useEffect(() => {
    getUserConversations()
  }, [userId])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <a href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Command className="size-4" />
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        // setActiveItem(item)
                        
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>

      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {conversations?.map((conversation) => (
                <a
                  href="#"
                  key={conversation._id}
                  className="flex flex-col items-start gap-2 whitespace-nowrap border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <span className="font-medium">{conversation.name}</span>
                  <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                    TEASER
                  </span>
                </a>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
