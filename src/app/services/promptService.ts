import { MessageProps } from "@/lib/interface";
// promptService.ts
export async function sendPrompt(messages: MessageProps[]) {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    return data.response;
  }
  
  export async function sendAnalysisPrompt(message: string) {
    const response = await fetch('/api/analyze-emotion/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    return data.analysis;
  }
  