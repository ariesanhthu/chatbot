"use client";
import { ChatSidebar } from "../components/ChatSidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden relative pt-20">
      <ChatSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <main className="flex-1 p-6 transition-all duration-300 ease-in-out mt-10">{children}</main>
    </div>
  );
}
