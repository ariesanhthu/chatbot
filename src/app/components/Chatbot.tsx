"use client";
import { useState } from "react";
import { useChatbot } from "../hooks/useChatbot";

export default function Chatbot() {
  const { generateResponse, loading } = useChatbot();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setInput("");

    const botReply = await generateResponse(userMessage);
    setMessages([...messages, { user: userMessage, bot: botReply }]);
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow-lg">
      <h2 className="text-xl font-bold mb-2">Chatbot</h2>
      <div className="space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 border rounded">
            <p><strong>User:</strong> {msg.user}</p>
            <p><strong>Bot:</strong> {msg.bot}</p>
          </div>
        ))}
      </div>
      <input
        className="w-full p-2 border rounded mt-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
      <button className="w-full mt-2 p-2 bg-blue-500 text-white rounded" onClick={sendMessage} disabled={loading}>
        {loading ? "Đang tải mô hình..." : "Gửi"}
      </button>
    </div>
  );
}
