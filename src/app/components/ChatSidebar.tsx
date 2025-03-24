"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  title: string;
}

const ChatSidebar = () => {
  const [chats, setChats] = useState<Chat[]>([
    { id: "1", title: "Hỏi về bài tập toán" },
    { id: "2", title: "Tư vấn tâm lý" },
    { id: "3", title: "Làm thế nào để học hiệu quả?" },
  ]);

  // Xóa cuộc trò chuyện theo ID
  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 h-screen p-4 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Lịch sử Chat</h2>

      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex justify-between items-center p-3 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition group"
          >
            <span className="text-gray-800 dark:text-gray-200 truncate">{chat.title}</span>

            {/* Nút Xóa chỉ hiện khi hover */}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition text-gray-500 hover:text-red-500"
              onClick={() => handleDeleteChat(chat.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;
