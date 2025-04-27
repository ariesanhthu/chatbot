"use client";
import { ChatSidebar } from "../components/ChatSidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EmotionJournal } from "../components/EmotionalJournal";
import { Button } from "@/components/ui/button";
import { BookOpen, X } from "lucide-react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isJournalVisible, setIsJournalVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden relative pt-20">
      <ChatSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
      <main className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? "ml-0" : "ml-32"}`}
      >
        {children}
      </main>

      {/* Journal Panel */}
      <div 
        className={cn(
          "fixed right-0 top-0 h-full transition-all duration-300 ease-in-out",
          "dark:bg-gray-800 bg-gray-100 dark:text-gray-100 text-gray-900",
          "border-l dark:border-gray-700 border-gray-200",
          "mt-20",
          isJournalVisible ? "w-64" : "w-0"
        )}
      >
        {isJournalVisible && (
          <>
            <div className="p-5 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsJournalVisible(false)}
                title="Ẩn nhật ký cảm xúc"
                className="hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Ẩn nhật ký cảm xúc</span>
              </Button>
            </div>
            <EmotionJournal />
          </>
        )}
      </div>

      {/* Toggle button for showing journal when hidden */}
      {!isJournalVisible && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "fixed right-4 top-24",
            "bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700",
            "text-gray-900 dark:text-gray-100",
            "border dark:border-gray-700 border-gray-200"
          )}
          onClick={() => setIsJournalVisible(true)}
          title="Hiện nhật ký cảm xúc"
        >
          <BookOpen className="h-5 w-5" />
          <span className="sr-only">Hiện nhật ký cảm xúc</span>
        </Button>
      )}
    </div>
  );
}