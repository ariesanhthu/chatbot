'use client'
// hooks/useChatService.ts

import { chatService } from './../services/chatService';
import { useState, useCallback } from 'react'
import type { ChatPromptPayload } from './../services/chatService';
import { MessageProps, MessageRole, MessageType } from "@/lib/interface";
import { BotId } from '@/lib/ExternalData';

export function useChatService(conversationId: string, userId: string | null) {
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return

      setIsLoading(true)

      // 1️⃣ Tạo và push user message lên UI
      const userMessage: MessageProps = {
        id: crypto.randomUUID(),
        conversationId,
        content,
        senderId: userId,
        messageType: MessageType.TEXT,
        role: MessageRole.USER,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, userMessage])

      try {
        // 2️⃣ Chạy song song: lưu user message + phân tích cảm xúc
        const saveUserPromise = chatService.saveUserMessage({
          conversationId,
          content,
          type: MessageType.TEXT,
          userId,
        })

        // 3️⃣ Gửi prompt chat (cũng song song)
        const promptPayload: ChatPromptPayload = {
          messages: [...messages, userMessage].map(msg => ({
            role: msg.senderId === BotId ? MessageRole.ASSISTANT : MessageRole.USER,
            content: msg.content,
          })),
        }
        // 4️⃣ Đợi chatPrompt hoàn thành
        const botContent = await chatService.sendChatPrompt(promptPayload)

        // 5️⃣ Push bot message lên UI
        const botMessage: MessageProps = {
          id: crypto.randomUUID(),
          conversationId,
          content: botContent,
          senderId: BotId,
          messageType: MessageType.TEXT,
          role: MessageRole.ASSISTANT,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, botMessage])

        // 6️⃣ Lưu bot message
        if(conversationId !== '1')
          chatService.saveBotMessage(conversationId, botContent);
  
          const emotionResult = await chatService.analyzeEmotion(content)
          console.log('Emotion detected:', emotionResult)

          chatService.saveUserStatus(userId, emotionResult)

      } catch (err) {
        console.error('Lỗi khi gửi message:', err)
      } finally {
        setIsLoading(false)
      }
    },
    [conversationId, userId, messages],
  )

  return { messages, isLoading, sendMessage }
}
