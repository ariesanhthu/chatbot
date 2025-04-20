// hooks/useMessageService.ts
import { useCallback } from "react";

interface MessagePayload {
  conversationId: string;
  message: { content: string; type: string };
  userId: string;
}

/**
 * Hook encapsulate các API call liên quan đến việc lưu message.
 */
export function useMessageService() {
  // Hàm lưu message của user (sử dụng POST)
  const saveUserMessage = useCallback(
    async ({ conversationId, message, userId }: MessagePayload) => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: {
              content: message,
              type: 'text'
            },
            userId: userId
          })
      });
      if (!response.ok) {
        throw new Error(`Lỗi khi lưu user message: ${response.statusText}`);
      }
      return response.json();
    },
    []
  );
  
  const saveBotMessage = useCallback(
    async ({ conversationId, message }: MessagePayload) => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botMessage: { content: message, type: "text" },
        }),
      });
      if (!response.ok) {
        throw new Error(`Lỗi khi lưu bot message: ${response.statusText}`);
      }
      return response.json();
    },
    []
  );

  return { saveUserMessage, saveBotMessage };
}
