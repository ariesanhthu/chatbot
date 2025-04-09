import { Message } from "@/types/chat";
import { Avatar } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === "assistant";

  return (
    <div className={`flex items-start space-x-4 ${isBot ? "bg-secondary/50" : ""} p-4 rounded-lg`}>
      <Avatar className={isBot ? "bg-primary" : "bg-secondary"}>
        {isBot ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
      </Avatar>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium">
          {isBot ? "AI Assistant" : "You"}
        </p>
        <p className="text-sm text-muted-foreground">{message.content}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}