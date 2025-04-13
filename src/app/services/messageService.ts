// messageService.ts
export async function saveUserMessage(conversationId: string, message: string, userId: string) {
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: {
          content: message,
          type: 'text'
        },
        userId: userId
      })
    });
    console.log("userMsgRes message API response", response);
    return response.json();
  }
  
  export async function saveBotMessage(conversationId: string, botMessage: string, userId: string) {
    const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botMessage: { content: botMessage, type: "text" },
        }),
      });
      console.log("Bot message API response", response);

    return response.json();
  }
  