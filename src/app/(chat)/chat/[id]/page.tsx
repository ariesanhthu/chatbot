"use client";

import { useState } from "react";
import { Chat } from "@/app/components/Chat";
import { ScrollArea } from "@/components/ui/scroll-area";

import { BlockMessages } from "@/app/components/Block-messages";

import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { useChatService } from "@/app/hooks/useChatService";

export default function ChatPage(){

    const { id } = useParams() as { id: string};
    // const { id } = params; // Lấy chatId từ URL
    const { userId } = useAuth()

  // Dùng hook service mới
  const { messages, isLoading, sendMessage } = useChatService(id, userId)
  const [input, setInput] = useState<string>('')

  // Gọi sendMessage và xoá input
  const handleSubmit = () => {
    if (!input.trim()) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="container mx-auto p-4 w-screen h-[calc(100vh-2rem)] mt-10">
      <div className="flex flex-col h-full shadow-lg max-w-4xl mx-auto">
        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation by sending a message...
              </div>
            ) :
              <BlockMessages messages={messages} isLoading={isLoading} />
              
            }
          </div>
        </ScrollArea>

        <div className="relative flex h-full">
          <div className="flex-1 transition-all duration-300 mr-64">
            <Chat
              id={id}
              isReadonly={false}
              messages={messages}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
