// hooks/useChatHandler.ts
import { useState, useCallback } from "react";
import { saveUserMessage, saveBotMessage } from "../services/messageService";
import { sendPrompt, sendAnalysisPrompt } from "../services/promptService";
import { MessageProps, MessageRole, MessageType } from "@/lib/interface";

interface ChatHandlerParams {
  conversationId: string;
  userId: string;
  BotId: string;
}

/**
 * Hook tổng hợp xử lý logic chat, bao gồm lưu message, gửi prompt và phân tích trạng thái người dùng.
 */
export function useChatHandler({ conversationId, userId, BotId }: ChatHandlerParams) {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");

  const sendMessage = useCallback(
    async (input: string) => {
      setIsLoading(true);
      try {
        // 1. Lưu message của user vào database.
        const userMsgRes = saveUserMessage(
          conversationId,
          input,
          userId,
        );
        if (!userMsgRes) {
          throw new Error("Lỗi khi lưu user message");
        }
        
        // Tạo đối tượng message của user và cập nhật UI.
        const userMessage: MessageProps = {
          id: crypto.randomUUID(),
          conversationId,
          content: input,
          senderId: userId,
          messageType: MessageType.TEXT,
          role: MessageRole.USER,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);

        // 2. Gửi prompt để nhận phản hồi từ bot.
        // Ở đây gửi toàn bộ lịch sử tin nhắn, bao gồm vừa thêm mới, và chuyển đổi role.
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
    
        const botReply = await sendPrompt(newMessages);

        // 3. Tạo bot message và cập nhật UI.
        const botMessage: MessageProps = {
          id: crypto.randomUUID(),
          conversationId,
          content: botReply,
          senderId: BotId,
          messageType: MessageType.TEXT,
          role: MessageRole.ASSISTANT,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);

        // 4. Lưu message của bot vào database.
        const resultBot = saveBotMessage(
          conversationId,
          botReply,
          userId,
        );
        if (!resultBot) {
          throw new Error("Lỗi khi lưu bot message");
        }

        // 5. Gửi prompt khác để phân tích trạng thái của user dựa trên input hoặc lịch sử chat.
        // Ví dụ, bạn xây dựng prompt theo mẫu tùy ý.
        const analysisPrompt = `Phân tích cảm xúc của người dùng dựa trên tin nhắn: "${input}"`;
        const analysis = await sendAnalysisPrompt(analysisPrompt);
        setAnalysisResult(analysis);

      } catch (error) {
        console.error("Lỗi khi xử lý chat:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, userId, BotId, messages] // lưu ý: nếu messages là dependency, hãy suy nghĩ khi state thay đổi
  );

  return { messages, isLoading, analysisResult, sendMessage };
}
