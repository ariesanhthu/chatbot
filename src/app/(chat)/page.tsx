"use client";

import { useState } from "react";
import { Chat } from "../components/Chat";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockMessages } from "../components/Block-messages";
import { Message } from "@/lib/interface";
import { date } from "zod";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { id: "1", role: "user", content: input, timestamp: date()._type }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        console.error("Lỗi API:", response.statusText);
        return;
      }

      const data: Message | null = await response.json();

      if (!data || !data.content) {
        console.error("API trả về dữ liệu không hợp lệ:", data);
        return;
      }

      setMessages([...newMessages, data]);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-2rem)]">
      <Card className="flex flex-col h-full border-2 bg-slate-950 shadow-lg max-w-4xl mx-auto">

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation by sending a message...
              </div>
            ) : (
              messages.map((msg, index) => (
                <BlockMessages key={index} role={msg.role} content={msg.content} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sử dụng Chat Component */}
        <Chat
          id="chat-1"
          isReadonly={false}
          messages={messages}
          input={input}
          setInput={setInput}
          handleSubmit={sendMessage} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
