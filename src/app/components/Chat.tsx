// import { MultimodalInput } from './MultimodalInput';
// import { MessageInput } from './Box-messages';
// interface ChatProps {
//   id: string;
//   isReadonly: boolean;
//   messages: any[]; // You can replace `any[]` with a more specific type if available
//   input: string;
//   setInput: (value: string) => void;
//   handleSubmit: () => void;
//   isLoading: boolean;
// }

// export function Chat({
//   id,
//   isReadonly,
//   messages,
//   input,
//   setInput,
//   handleSubmit,
//   isLoading,
// }: ChatProps) {
//   return (
//     <div className="chat-container">
//       {/* Other chat components like messages list */}
//       <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
//         {!isReadonly && (
//           <MultimodalInput
//             input={input}
//             setInput={setInput}
//             handleSubmit={handleSubmit}
//             isLoading={isLoading}
//           />
//         )}
//         {/* Message Input */}
//        <MessageInput onSend={handleSendMessage} onFileUpload={handleFileUpload} />
    
//       </form>
//     </div>
//   );
// }
"use client";

import { MultimodalInput } from "./MultimodalInput";
import { cn } from "@/lib/utils";
import { MessageProps } from "@/lib/interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef,useState } from "react";

interface ChatProps {
  id: string;
  isReadonly: boolean;
  messages: MessageProps[];
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

export function Chat({
  id,
  isReadonly,
  messages,
  input,
  setInput,
  handleSubmit,
  isLoading,
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputPosition, setInputPosition] = useState<"center" | "bottom">("center")
  
  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex h-full flex-col max-h-[calc(100vh-4rem)]">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              {/* Message Content */}
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[75%] rounded-lg p-3",
                  message.role === "user"
                    ? "text-primary bg-slate-900"
                    : "bg-slate-700"
                )}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
              
              {/* Timestamp - Moved outside the message box */}
              <div
                className={cn(
                  "text-xs mt-1 opacity-70",
                  message.role === "user"
                    ? "text-foreground/70"
                    : "text-muted-foreground"
                )}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area - Aligned with chat area */}
      {/* <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          inputPosition === "center"
            ? "absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4"
            : "sticky bottom-0 w-full px-4 py-4"
        }`}
      >
        <form
          className="flex mx-auto px-4 py-4 md:py-6 gap-2 w-full max-w-3xl"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {!isReadonly && (
            <MultimodalInput
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          )}
        </form>
      </div>
    </div>
  );
}