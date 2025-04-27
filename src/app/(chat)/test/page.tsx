"use client"

import { useState } from "react"
import { ChatArea } from "@/app/components/chat/ChatArea"
// import { Sidebar } from "@/components/sidebar"
// import { EmotionJournal } from "@/components/emotion-journal"
// import { useSidebar } from "@/components/sidebar-provider"

export default function Home() {
//   const { isSidebarVisible, sidebarState } = useSidebar()
  const [isJournalVisible, setIsJournalVisible] = useState(true)

  return (
    <main className="flex h-screen bg-gray-50">
      {/* <Sidebar /> */}
      <div
        className={`flex-1 transition-all duration-300
        `}
      >
        <div className="relative flex h-full">
          <div className={`flex-1 transition-all duration-300 ${isJournalVisible ? "mr-64" : "mr-0"}`}>
            <ChatArea
              onToggleJournal={() => setIsJournalVisible(!isJournalVisible)}
              isJournalVisible={isJournalVisible}
            />
          </div>

        </div>
      </div>
    </main>
  )
}
