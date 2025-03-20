// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import clsx from "clsx";

// // Kiểu dữ liệu cho Block
// interface BlockProps {
//   role: "user" | "assistant";
//   content: string;
// }

// export function BlockMessages({ role, content }: BlockProps) {
//   // Kiểm tra nếu content chứa <think>
//   const thinkMatch = content.match(/<think>(.*?)<\/think>/);
//   const hasThink = !!thinkMatch;

//   return (
//     <div
//       className={clsx(
//         "p-4 rounded-lg border shadow-sm w-full",
//         role === "user" ? "bg-gray-100 text-black" : "bg-blue-100 text-blue-800"
//       )}
//     >
//       <strong>{role === "user" ? "Bạn" : "Bot"}:</strong>

//       {/* Xử lý hiệu ứng <think> */}
//       {hasThink && (
//         <div className="italic text-gray-500 bg-gray-200 p-2 rounded-md">
//           💭 {thinkMatch![1]}
//         </div>
//       )}

//       {/* Hiển thị Markdown */}
//       <div className="prose max-w-none mt-2">
//         <ReactMarkdown
//           remarkPlugins={[remarkGfm]}
//           components={{
//             h1: ({ node, ...props }) => <h1 className="text-2xl font-bold" {...props} />,
//             h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-2" {...props} />,
//             h3: ({ node, ...props }) => <h3 className="text-lg font-semibold mt-2" {...props} />,
//             strong: ({ node, ...props }) => <strong className="text-black font-bold" {...props} />,
//             em: ({ node, ...props }) => <em className="italic text-gray-600" {...props} />,
//             pre: ({ node, ...props }) => <pre className="bg-gray-800 text-white p-2 rounded-lg" {...props} />,
//             blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-600" {...props} />,
//             code: ({ children, className, ...props }) => (
//               <code className="bg-gray-200 text-sm p-1 rounded-md" {...props}>
//                 {children}
//               </code>
//             ),
//           }}
//         >
//           {/* Xóa <think> để tránh hiển thị lại */}
//           {content.replace(/<think>.*?<\/think>/, "")} 
//         </ReactMarkdown>
//       </div>

//     </div>
//   );
// }
"use client";

import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User } from "lucide-react";

interface BlockMessagesProps {
  role: "user" | "assistant";
  content: string;
}

export function BlockMessages ({ role, content }: { role: "user" | "assistant"; content: string | null })
{
  if (!content || typeof content !== "string") return null;

 const isUser = role === "user";
  const hasThink = content.includes("<think>");
  const thinkMatch = content.match(/<think>(.*?)<\/think>/);

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex gap-3 max-w-[80%] rounded-lg p-4",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <User className="h-5 w-5" />
          ) : (
            <Bot className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          {hasThink && (
            <div className="text-sm italic bg-background/50 p-2 rounded">
              💭 {thinkMatch ? thinkMatch[1] : ""}
            </div>
          )}

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h1 className="text-xl font-bold mb-2 mt-3" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="text-lg font-bold mb-2 mt-3" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="text-md font-bold mb-2 mt-3" {...props} />
                ),
                p: ({ ...props }) => (
                  <p className="mb-2" {...props} />
                ),
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-4 mb-2" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal pl-4 mb-2" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="mb-1" {...props} />
                ),
                code: ({ children, className, ...props}) => (
                  <code className="bg-gray-200 text-sm p-1 rounded-md" {...props}>
                   {children}
                 </code>
                ),
                pre: ({ ...props }) => (
                  <pre className="bg-muted/50 rounded-lg p-2 mb-2 overflow-x-auto" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote className="border-l-4 border-primary/20 pl-4 italic mb-2" {...props} />
                ),
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