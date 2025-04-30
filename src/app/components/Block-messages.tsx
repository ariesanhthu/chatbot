"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";
interface BlockMessagesProps {
  role: "user" | "assistant";
  content: string;
}

export function BlockMessages({ role, content }: BlockMessagesProps) {
  if (!content || typeof content !== "string") return null; // Bảo vệ content không bị null
   // Helper function to detect if content is markdown
   const isMarkdown = (content: string): boolean => {
    // Check for common markdown patterns
    const markdownPatterns = [
      /^#+\s/, // Headers
      /\*\*.+\*\*/, // Bold
      /\*.+\*/, // Italic
      /\[.+\]$$.+$$/, // Links
      /```[\s\S]*```/, // Code blocks
      /^\s*[-*+]\s/, // Unordered lists
      /^\s*\d+\.\s/, // Ordered lists
      /\|.+\|/, // Tables
      /<Thinking>[\s\S]*<\/think>/, // Think blocks
    ]

    return markdownPatterns.some((pattern) => pattern.test(content))
  }
  const isUser = role === "user";
  const hasThink = content.includes("<think>");
  const thinkMatch = content.match(/<think>(.*?)<\/think>/);

  return (
    <div className={cn("flex gap-3 mb-4", isUser ? "justify-end" : "justify-start")}>
      <div className={cn("flex gap-3 max-w-[80%] rounded-lg p-4", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}>
        <div className="flex-shrink-0 mt-1">
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        <div className="flex-1 space-y-2">
          {hasThink && <div className="text-sm italic p-2 rounded">💭 {thinkMatch ? thinkMatch[1] : ""}</div>}

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => <h1 className="text-xl font-bold mb-2 mt-3" {...props} />,
                h2: ({ ...props }) => <h2 className="text-lg font-bold mb-2 mt-3" {...props} />,
                h3: ({ ...props }) => <h3 className="text-md font-bold mb-2 mt-3" {...props} />,
                p: ({ ...props }) => <p className="mb-2" {...props} />,
                ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                li: ({ ...props }) => <li className="mb-1" {...props} />,
                code: ({ children, className, ...props }) => (
                  <code className="bg-gray-200 text-sm p-1 rounded-md" {...props}>{children}</code>
                ),
                pre: ({ ...props }) => <pre className="bg-muted/50 rounded-lg p-2 mb-2 overflow-x-auto" {...props} />,
                blockquote: ({ ...props }) => <blockquote className="border-l-4 border-primary/20 pl-4 italic mb-2" {...props} />,
              }}
            >
              {content.replace(/<think>.*?<\/think>/, "")}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
