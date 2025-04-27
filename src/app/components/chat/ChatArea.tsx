"use client"

import { useState, useRef, useEffect } from "react"
import { ChatInput } from "@/app/components/chat/ChatInput"
// import { MessageList } from "@/components/message-list"
import { Menu, BookOpen, X } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { useSidebar } from "@/components/sidebar-provider"
import type { Message } from "@/types/chat"

interface ChatAreaProps {
  onToggleJournal?: () => void
  isJournalVisible?: boolean
}

export function ChatArea({ onToggleJournal, isJournalVisible }: ChatAreaProps) {
//   const { isMobile, isSidebarVisible, setIsSidebarVisible } = useSidebar()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputPosition, setInputPosition] = useState<"center" | "bottom">("center")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (content: string, type: "text" | "audio" | "image" = "text", file?: File) => {
    // Create user message
    // const userMessage: Message = {
    //   id: Date.now().toString(),
    //   content,
    //   sender: "user",
    //   timestamp: new Date(),
    //   type,
    //   file,
    // }

    // Add user message to chat
    // setMessages((prev) => [...prev, userMessage])

    // Move input to bottom after first message
    if (inputPosition === "center") {
      setInputPosition("bottom")
    }

    // Simulate bot response after a delay
    // setTimeout(() => {
    //   const botMessage: Message = {
    //     id: (Date.now() + 1).toString(),
    //     content: "This is a simulated response from the chatbot. In a real application, this would come from your API.",
    //     role: "assistant",
    //     // timestamp: new Date(),
    //     // type: "text",
    //   }
    //   setMessages((prev) => [...prev, botMessage])
    // }, 1000)
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Mobile hamburger menu and journal toggle */}
      <div className="absolute left-4 right-4 top-4 z-20 flex justify-between">
        


        <div className="ml-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleJournal}
            title={isJournalVisible ? "Ẩn nhật ký cảm xúc" : "Hiện nhật ký cảm xúc"}
          >
            {isJournalVisible ? <X className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
            <span className="sr-only">{isJournalVisible ? "Ẩn nhật ký cảm xúc" : "Hiện nhật ký cảm xúc"}</span>
          </Button>
        </div>
      </div>

      {/* Messages area */}
      {/* <div className="flex-1 overflow-y-auto p-4 pt-16">
         {messages.length === 0 ? ( 
          <div className="flex h-full items-center justify-center">
            <div className="max-w-md text-center">
              <h2 className="mb-2 text-2xl font-bold">Welcome to Chatbot</h2>
              <p className="text-gray-600">Start a conversation by typing a message below.</p>
            </div>
          </div>
        ) : (
        //   <MessageList messages={messages} />
        <div>
            <h1>mess</h1>
        </div>
        )
        }
        <div ref={messagesEndRef} />
      </div> */}

      {/* Input area */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          inputPosition === "center"
            ? "absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4"
            : "sticky bottom-0 w-full px-4 py-4"
        }`}
      >
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}
