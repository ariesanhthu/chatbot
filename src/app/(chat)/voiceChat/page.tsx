"use client";

import { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function ContinuousChat() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Hook for speech recognition
  const { transcript, resetTranscript } = useSpeechRecognition();

  // Update input with transcript when recording is active
  useEffect(() => {
    if (isRecording) {
      setInput(transcript);
    }
  }, [transcript, isRecording]);

  // Start streaming chat response (sends the prompt to the API)
  const handleSend = async () => {
    if (!input.trim()) return;
    // Add user message to conversation
    setMessages((prev) => [...prev, `User: ${input}`]);
    // Save prompt locally before clearing input
    const currentPrompt = input;
    setInput("");
    setIsStreaming(true);

    // Create an AbortController for canceling the stream if needed
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentPrompt }),
        signal: abortController.signal,
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedResponse = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value);
        accumulatedResponse += chunk;

        // Update the chatbot's response in real time
        setMessages((prev) => {
          if (prev.length > 0 && prev[prev.length - 1].startsWith("Chatbot: ")) {
            return [...prev.slice(0, -1), `Chatbot: ${accumulatedResponse}`];
          }
          return [...prev, `Chatbot: ${accumulatedResponse}`];
        });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast("Chat stopped by user");
      } else {
        console.error("Error streaming chat:", error);
        toast.error("Error in chat response");
      }
    } finally {
      setIsStreaming(false);
    }
  };

  // Stop the streaming chat response
  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
    }
  };

  // Start voice recognition
  const handleStartRecording = () => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      toast.error("Speech recognition is not supported in your browser.");
      return;
    }
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: "vi-VN" });
  };

  // Stop voice recognition
  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
    setIsRecording(false);
    // Optionally, reset transcript if you want to clear after stopping
    // resetTranscript();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-lg p-4 mb-4 h-80 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        {messages.map((msg, idx) => (
          <p key={idx} className="mb-2">{msg}</p>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Type your message or use voice..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isStreaming}>
          Send
        </Button>
        {isStreaming && (
          <Button variant="destructive" onClick={handleStop}>
            Stop
          </Button>
        )}
      </div>
      <div className="flex gap-2">
        {!isRecording ? (
          <Button onClick={handleStartRecording}>
            Start Voice
          </Button>
        ) : (
          <Button variant="destructive" onClick={handleStopRecording}>
            Stop Voice
          </Button>
        )}
      </div>
    </div>
  );
}
