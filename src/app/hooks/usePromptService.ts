// hooks/usePromptService.ts
import { useCallback } from "react";
import { MessageProps , MessageRole, MessageType} from "@/lib/interface";
import { BotId } from "@/lib/ExternalData";
/**
 * Hook chứa các hàm gọi API liên quan đến gửi prompt và nhận phản hồi từ model.
 */
export function usePromptService() {
  // Gửi prompt chat để nhận phản hồi từ bot
  const sendPrompt = useCallback(
    async (messages: MessageProps[]) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
            messages.map(msg => ({
            role: msg.senderId === BotId ? MessageRole.ASSISTANT : MessageRole.USER,
            content: msg.content
          }))),
      });
      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API chat: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data || !data.content) {
        throw new Error("API chat trả về dữ liệu không hợp lệ");
      }
      return data.content;
    },
    []
  );

  // Gửi prompt để phân tích trạng thái của user
  const sendAnalysisPrompt = useCallback(
    async (messages: string) => {
      const response = await fetch(`/api/analyze-emotion/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      if (!response.ok) {
        throw new Error(`Lỗi khi gọi API phân tích: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data || !data.analysis) {
        throw new Error("API phân tích trả về dữ liệu không hợp lệ");
      }
      return data.analysis;
    },
    []
  );

  return { sendPrompt, sendAnalysisPrompt };
}
