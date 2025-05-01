'use client'
// hooks/useChatService.ts

import { chatService } from './../services/chatService';
import { useState, useCallback, useEffect } from 'react'
import type { ChatPromptPayload } from './../services/chatService';
import { MessageProps, MessageRole, MessageType } from "@/lib/interface";
import { BotId } from '@/lib/ExternalData';
import { TextSplit } from "@/utils/textsplit";
import { speakText } from '@/utils/texttospeech';

export function useChatService(conversationId: string, userId: string | null) {
  const [messages, setMessages] = useState<MessageProps[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/conversations/${conversationId}/messages`)
        const result = await response.json()
        console.log(result.data);
        if (result.success) {
          const formattedMessages: MessageProps[] = result.data.map((msg: any) => ({
            id: msg.id,
            conversationId: msg.conversation_id,
            content: msg.content,
            senderId: msg.sender_id,
            messageType: msg.message_type,
            role: msg.sender_id === BotId ? MessageRole.ASSISTANT : MessageRole.USER,
            timestamp: new Date(msg.create_at),
          }))
          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId])

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
        
        const textsplit = await TextSplit(botContent);

        console.log("textplit: ", textsplit);
        // 5️⃣ Push bot message lên UI
        const botMessage: MessageProps = {
          id: crypto.randomUUID(),
          conversationId,
          content: textsplit,
          senderId: BotId,
          messageType: MessageType.TEXT,
          role: MessageRole.ASSISTANT,
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, botMessage])

        speakText(textsplit, { lang: 'vi-VN', rate: 1, pitch: 1 });

        // 6️⃣ Lưu bot message
        if(conversationId !== '1')
          chatService.saveBotMessage(conversationId, textsplit);
  
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
