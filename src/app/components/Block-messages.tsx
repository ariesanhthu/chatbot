"use client";
import { Bot, User } from "lucide-react";
import MemoizedMarkdown from "./memoized-markdown"
import { MessageProps } from "@/lib/interface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface BlockMessagesProps {
  messages: MessageProps[];
  isLoading: boolean;
}

export function BlockMessages({ messages = [], isLoading }: BlockMessagesProps) {

  return (
    <div className="space-y-4">
      {(messages || []).map((message) => (
        <div
          key={message.id}
          className={`flex items-start space-x-3 ${
            message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
          }`}
        >
          <Avatar className="h-8 w-8">
            {message.role === "assistant" ? (
              <>
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </>
            ) : (
              <>
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </>
            )}
          </Avatar>
          <div
            className={`max-w-[80%] rounded-lg p-3 ${
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            <MemoizedMarkdown content={message.content} />
            <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
          </div>
        </div>
      ))}
      {!isLoading && (
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="bg-muted rounded-lg p-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-current rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
