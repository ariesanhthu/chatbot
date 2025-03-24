import ChatSidebar from "../components/ChatSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-100 p-4 shadow-lg">
        <ChatSidebar />
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
