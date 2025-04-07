// "use client";

// import React from "react";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { cn } from "@/lib/utils";
// import { Bot, User } from "lucide-react";

// interface BlockMessagesProps {
//   role: "user" | "assistant";
//   content: string;
// }

// export function BlockMessages({ role, content }: BlockMessagesProps) {
//   // Function to extract and remove <think> tags content
//   const extractThinkContent = (text: string) => {
//     const thinkRegex = /<think>([\s\S]*?)<\/think>/g;

//     const thoughts: string[] = [];
//     const cleanContent = text.replace(thinkRegex, (_, thought) => {
//       thoughts.push(thought);
//       return "";
//     });
//     return { thoughts, cleanContent };
//   };

//   const { thoughts, cleanContent } = extractThinkContent(content);
//   const isUser = role === "user";

//   return (
//     <div
//       className={cn(
//         "message max-w-[80%] p-4 shadow-sm fade-in",
//         isUser
//           ? "user-message ml-auto bg-white text-gray-900 border border-gray-200 dark:text-white dark:border-gray-700"
//           : "bot-message bg-white text-gray-900 border border-gray-200 dark:text-white dark:border-gray-700"
//       )}
//     >
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 dark:bg-blue-900 dark:text-blue-300">
//           {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
//         </div>
//         <div className="flex-1">
//           <p className="font-medium text-gray-800 dark:text-gray-200">
//             {isUser ? "You" : "AI Assistant"}
//           </p>
//           <div className="mt-1">
//             <ReactMarkdown
//               remarkPlugins={[remarkGfm]}
//               components={{
//                 code: ({ node, inline, className, children, ...props }: any) => {
//                   return (
//                     <code
//                       className={cn(
//                         "rounded px-1",
//                         inline
//                           ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
//                           : "block bg-gray-800 text-white p-4 my-4"
//                       )}
//                       {...props}
//                     >
//                       {children}
//                     </code>
//                   );
//                 },
//                 blockquote({ node, children, ...props }) {
//                   return (
//                     <blockquote
//                       className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 italic text-neutral-600 dark:text-neutral-300 my-4"
//                       {...props}
//                     >
//                       {children}
//                     </blockquote>
//                   );
//                 },
//                 h1({ node, children, ...props }) {
//                   return (
//                     <h1
//                       className="text-2xl font-bold mt-6 mb-4"
//                       {...props}
//                     >
//                       {children}
//                     </h1>
//                   );
//                 },
//                 h2({ node, children, ...props }) {
//                   return (
//                     <h2
//                       className="text-xl font-bold mt-5 mb-3"
//                       {...props}
//                     >
//                       {children}
//                     </h2>
//                   );
//                 },
//                 h3({ node, children, ...props }) {
//                   return (
//                     <h3
//                       className="text-lg font-bold mt-4 mb-2"
//                       {...props}
//                     >
//                       {children}
//                     </h3>
//                   );
//                 },
//               }}
//             >
//               {cleanContent}
//             </ReactMarkdown>
//           </div>
//         </div>
//       </div>

//       {/* Think content */}
//       {thoughts.length > 0 && role === "assistant" && (
//         <div className="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2">
//           {thoughts.map((thought, index) => (
//             <div
//               key={index}
//               className="p-2 italic bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 rounded-lg"
//             >
//               <span className="mr-2">💭</span>
//               <ReactMarkdown remarkPlugins={[remarkGfm]}>{thought}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
//       )}
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

export function BlockMessages({ role, content }: BlockMessagesProps) {
  if (!content || typeof content !== "string") return null; // Bảo vệ content không bị null

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
          {hasThink && <div className="text-sm italic bg-background/50 p-2 rounded">💭 {thinkMatch ? thinkMatch[1] : ""}</div>}

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
