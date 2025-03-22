// // // // import Image from "next/image";
// // // // import Chatbot from "./components/Chatbot";
// // // // export default function Home() {
// // // //   return (
// // // //     <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
// // // //       <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
// // // //         <Chatbot />
// // // //       </main>
// // // //       <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
// // // //         <a
// // // //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// // // //           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // // //           target="_blank"
// // // //           rel="noopener noreferrer"
// // // //         >
// // // //           <Image
// // // //             aria-hidden
// // // //             src="/file.svg"
// // // //             alt="File icon"
// // // //             width={16}
// // // //             height={16}
// // // //           />
// // // //           Learn
// // // //         </a>
// // // //         <a
// // // //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// // // //           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // // //           target="_blank"
// // // //           rel="noopener noreferrer"
// // // //         >
// // // //           <Image
// // // //             aria-hidden
// // // //             src="/window.svg"
// // // //             alt="Window icon"
// // // //             width={16}
// // // //             height={16}
// // // //           />
// // // //           Examples
// // // //         </a>
// // // //         <a
// // // //           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
// // // //           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
// // // //           target="_blank"
// // // //           rel="noopener noreferrer"
// // // //         >
// // // //           <Image
// // // //             aria-hidden
// // // //             src="/globe.svg"
// // // //             alt="Globe icon"
// // // //             width={16}
// // // //             height={16}
// // // //           />
// // // //           Go to nextjs.org →
// // // //         </a>
// // // //       </footer>
// // // //     </div>
// // // //   );
// // // // }
// // // // -----------------------------------------
// // // // import EmotionRecognizer from "./components/EmotionRecognizer";

// // // // export default function Home() {
// // // //   return (
// // // //     <main className="flex justify-center items-center min-h-screen">
// // // //       <EmotionRecognizer />
// // // //       {/* <Chatbot /> */}
// // // //     </main>
// // // //   );
// // // // }

// // // "use client";

// // // import { useState } from "react";

// // // export default function ChatPage() {
// // //   const [query, setQuery] = useState("");
// // //   const [response, setResponse] = useState("");
// // //   const fetchResponse = async () => {
    
// // //     const res = await fetch("https://5827-34-106-55-65.ngrok-free.app/chat?query=hello", {
// // //       headers: {
// // //         "ngrok-skip-browser-warning": "true"
// // //       }
// // //     });
// // //     const data = await res.json();
// // //     console.log(data);
// // //     setResponse(data.response);
// // //   };

// // //   return (
// // //     <div className="p-4">
// // //       <h1 className="text-xl font-bold">FastAPI Chat với LLaMA</h1>
// // //       <input
// // //         type="text"
// // //         value={query}
// // //         onChange={(e) => setQuery(e.target.value)}
// // //         placeholder="Nhập tin nhắn..."
// // //         className="border p-2 mt-2"
// // //       />
// // //       <button onClick={fetchResponse} className="bg-blue-500 text-white p-2 ml-2">
// // //         Gửi
// // //       </button>
// // //       <p className="mt-4 text-black">Phản hồi từ AI: {response}</p>
// // //     </div>
// // //   );
// // // }
// // "use client";

// // import { useState } from "react";
// // import { Input } from "@/components/ui/input";
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { ScrollArea } from "@/components/ui/scroll-area";
// // import { BlockMessages } from "./components/Block-messages";
// // interface Message {
// //   role: "user" | "assistant";
// //   content: string;
// // }

// // export default function ChatPage() {
// //   const [messages, setMessages] = useState<Message[]>([]);
// //   const [input, setInput] = useState("");

// //   const sendMessage = async () => {
// //     if (!input.trim()) return;

// //     const newMessages: Message[] = [...messages, { role: "user" as const, content: input }];
// //     setMessages(newMessages);
// //     setInput("");

// //     const response = await fetch("/api/chat", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ messages: newMessages }),
// //     });

// //     const data: Message = await response.json();
// //     setMessages([...newMessages, data]);
// //   };

// //   return (
// //     <div className="mx-auto mt-10 space-y-4 w-full h-full">
// //       <Card className="overflow-hidden">
// //         <ScrollArea className="h-full p-4 space-y-4">
// //           {messages.map((msg, index) => (
// //             <BlockMessages key={index} role={msg.role} content={msg.content} />
// //           ))}
// //         </ScrollArea>
// //       </Card>

// //       <div className="flex gap-2">
// //         <Input
// //           type="text"
// //           value={input}
// //           onChange={(e) => setInput(e.target.value)}
// //           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
// //           placeholder="Nhập tin nhắn..."
// //         />
// //         <Button onClick={sendMessage}>Gửi</Button>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Send } from "lucide-react";
// import { BlockMessages } from "./components/Block-messages";
// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// export default function Home() {
//   const [messages, setMessages] = useState<Message[]>([]);
//     const [input, setInput] = useState("");
  
//     const sendMessage = async () => {
//       if (!input.trim()) return;
    
//       const newMessages: Message[] = [...messages, { role: "user" as const, content: input }];
//       setMessages(newMessages);
//       setInput("");
    
//       try {
//         const response = await fetch("/api/chat", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ messages: newMessages }),
//         });
    
//         if (!response.ok) {
//           console.error("Lỗi API:", response.statusText);
//           return;
//         }
    
//         const data: Message | null = await response.json();
    
//         if (!data || !data.content) {
//           console.error("API trả về dữ liệu không hợp lệ:", data);
//           return;
//         }
    
//         setMessages([...newMessages, data]);
//       } catch (error) {
//         console.error("Lỗi khi gọi API:", error);
//       }
//     };
    

//   return (
//     <div className="container mx-auto p-4 h-[calc(100vh-2rem)]">
//       <Card className="flex flex-col h-full border-2">
//         <div className="p-4 border-b bg-primary/5">
//           <h2 className="text-2xl font-bold text-center">Chatbot</h2>
//         </div>
        
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-4">
//             {messages.length === 0 ? (
//               <div className="text-center text-muted-foreground py-8">
//                 Start a conversation by sending a message...
//               </div>
//             ) : (
//               messages.map((msg, index) => (
//                 <BlockMessages key={index} role={msg.role} content={msg.content} />
//               ))
//             )}
//           </div>
//         </ScrollArea>

//         <div className="p-4 border-t bg-background">
//           <form 
//             onSubmit={(e) => {
//               e.preventDefault();
//               sendMessage();
//             }}
//             className="flex gap-2"
//           >
//             <Input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   e.preventDefault(); // Ngăn Enter submit form hai lần
//                   sendMessage();
//                 }
//               }}
//               placeholder="Nhập tin nhắn..."
//               className="flex-1"
//             />
//             <Button type="submit" size="icon">
//               <Send className="h-4 w-4" />
//             </Button>
//           </form>
//         </div>
//       </Card>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { Chat } from "./components/Chat"
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Send } from "lucide-react";
import { BlockMessages } from "./components/Block-messages";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        console.error("Lỗi API:", response.statusText);
        return;
      }

      const data: Message | null = await response.json();

      if (!data || !data.content) {
        console.error("API trả về dữ liệu không hợp lệ:", data);
        return;
      }

      setMessages([...newMessages, data]);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-2rem)]">
      <Card className="flex flex-col h-full border-2">
        <div className="p-4 border-b bg-primary/5">
          <h2 className="text-2xl font-bold text-center">Chatbot</h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation by sending a message...
              </div>
            ) : (
              messages.map((msg, index) => (
                <BlockMessages key={index} role={msg.role} content={msg.content} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sử dụng Chat Component */}
        <Chat
          id="chat-1"
          isReadonly={false}
          messages={messages}
          input={input}
          setInput={setInput}
          handleSubmit={sendMessage} 
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
}
