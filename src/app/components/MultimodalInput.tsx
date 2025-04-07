// import { VoiceInput } from './VoiceInput';

// interface MultimodalInputProps {
//   input: string;
//   setInput: (value: string) => void;
//   handleSubmit: () => void;
//   isLoading: boolean;
// }

// export function MultimodalInput({ input, setInput, handleSubmit, isLoading }: MultimodalInputProps) {
//   return (
//     <div className="flex gap-2 w-full">
//       <input
//         type="text"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         placeholder="Type a message or use voice..."
//         className="flex-1 border rounded p-2"
//       />
//       <VoiceInput input={input} setInput={setInput} />
//       <button onClick={handleSubmit} disabled={isLoading}>
//         Send
//       </button>
//     </div>
//   );
// }
"use client";

import { MessageInput } from "./Box-messages";

interface MultimodalInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
}

export function MultimodalInput({
  input,
  setInput,
  handleSubmit,
  isLoading,
}: MultimodalInputProps) {
  const handleFileUpload = (file: File) => {
    console.log("File uploaded:", file);
    // Implement file upload logic here
  };

  return (
    <MessageInput
      input={input}
      setInput={setInput}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      onFileUpload={handleFileUpload}
    />
  );
}