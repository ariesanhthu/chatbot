"use client";

import { useState } from "react";
import { Chat } from "@/app/components/Chat";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { BlockMessages } from "@/app/components/Block-messages";
import { MessageProps, MessageRole, MessageType } from "@/lib/interface";

import { useAuth } from "@/context/AuthContext";
import { BotId } from "@/lib/ExternalData";
import { useParams } from "next/navigation";
export default function ChatPage(){

    const { id } = useParams() as { id: string};
    // const { id } = params; // Lấy chatId từ URL

  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { userId} = useAuth();

  const sendMessage = async () => {
    if (!input.trim()) return;
    // Tạo message của người dùng
    const userMessage = {
        id: crypto.randomUUID(),
        conversationId: id,
        content: input,
        senderId: userId, 
        messageType: MessageType.TEXT, // NHỚ CẬP NHẬT THÊM TYPE
        role: MessageRole.USER,
        timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);
    
    try {
      // 1. Lưu user message vào database
      const userMsgRes = await fetch(`/api/conversations/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: {
            content: input,
            type: 'text'
          },
          userId: userId
        }),
      });
      console.log("userMsgRes message API response", userMsgRes);
      
      // 2. Gọi API chat để lấy phản hồi từ model
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: newMessages.map(msg => ({
            role: msg.senderId === BotId ? MessageRole.ASSISTANT : MessageRole.USER,
            content: msg.content
          }))
        }),
      });
      
      if (!chatResponse.ok) {
        console.error("Lỗi API chat:", chatResponse.statusText);
        return;
      }
      
      const chatData = await chatResponse.json();
      if (!chatData || !chatData.content) {
        console.error("API trả về dữ liệu không hợp lệ:", chatData);
        return;
      }
      
      // Tạo bot message
      const botMessage = {
        id:crypto.randomUUID(),
        conversationId: id,
        content: chatData.content,
        senderId: BotId,
        messageType: MessageType.TEXT,
        role: MessageRole.ASSISTANT,
        timestamp: new Date()
      };

      // Cập nhật UI
      setMessages([...newMessages, botMessage]);
      
      // 3. Lưu bot message vào database
      const botMsgRes = await fetch(`/api/conversations/${id}/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botMessage: { content: chatData.content, type: "text" }
        }),
      });
      console.log("Bot message API response", botMsgRes);
      
      
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 w-screen h-[calc(100vh-2rem)]">
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
          id={id}
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
