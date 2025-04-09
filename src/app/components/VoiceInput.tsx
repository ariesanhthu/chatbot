// 'use client';

// import { useState } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { Button } from '@/components/ui/button';

// export function VoiceInput({ input, setInput }: { input: string; setInput: (value: string) => void }) {
//   const { transcript, listening, resetTranscript } = useSpeechRecognition();
//   const [isRecording, setIsRecording] = useState(false);

//   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
//     return <p>Voice recognition is not supported in your browser.</p>;
//   }

//   const handleStart = () => {
//     setIsRecording(true);
//     SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
//   };

//   const handleStop = () => {
//     setIsRecording(false);
//     SpeechRecognition.stopListening();
//     setInput(transcript); // Set input value to the recognized speech
//   };

//   return (
//     <div className="flex gap-2 items-center">
//       <Button onClick={handleStart} disabled={isRecording}>
//         🎤 {listening ? 'Listening...' : 'Start Voice'}
//       </Button>
//       <Button onClick={handleStop} disabled={!listening}>
//         ⏹ Stop
//       </Button>
//       <Button onClick={resetTranscript} disabled={!transcript}>
//         🔄 Reset
//       </Button>
//     </div>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "../components/chat-message";
import { VoiceControls } from "../components/voice-controls";
import { useToast } from "../hooks/use-toast";
import { ChatState, Message } from "@/types/chat";

const SILENCE_THRESHOLD = 3000; // 3 seconds

export default function Home() {
  const { toast } = useToast();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isRecording: false,
    isProcessing: false,
    error: null,
    speechRate: 1,
    speechPitch: 1,
  });

  const silenceTimer = useRef<NodeJS.Timeout>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setState(prev => ({ ...prev, error: "Browser doesn't support speech recognition." }));
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    if (transcript && listening) {
      // Reset silence timer
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }

      silenceTimer.current = setTimeout(() => {
        handleMessageSubmit();
      }, SILENCE_THRESHOLD);
    }
  }, [transcript, listening]);

  const startListening = () => {
    resetTranscript();
    setState(prev => ({ ...prev, isRecording: true, error: null }));
    SpeechRecognition.startListening({ continuous: true });
  };

  const stopListening = () => {
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
    }
    SpeechRecognition.stopListening();
    setState(prev => ({ ...prev, isRecording: false }));
  };

  const handleMessageSubmit = async () => {
    if (!transcript.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: transcript,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isProcessing: true,
    }));

    resetTranscript();
    stopListening();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...state.messages, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isProcessing: false,
      }));

      // Speak the response
      const utterance = new SpeechSynthesisUtterance(data.response);
      utterance.rate = state.speechRate;
      utterance.pitch = state.speechPitch;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Error:", error);
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: "Failed to get response",
      }));
      toast({
        title: "Error",
        description: "Failed to get response from the AI",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="flex-1 space-y-4">
        <ScrollArea className="h-[60vh] rounded-lg border" ref={scrollRef}>
          <div className="space-y-4 p-4">
            {state.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {state.isProcessing && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-4">
          <VoiceControls
            speechRate={state.speechRate}
            speechPitch={state.speechPitch}
            onRateChange={(rate) => setState(prev => ({ ...prev, speechRate: rate }))}
            onPitchChange={(pitch) => setState(prev => ({ ...prev, speechPitch: pitch }))}
            onStop={() => window.speechSynthesis.cancel()}
            onPause={() => window.speechSynthesis.pause()}
            onResume={() => window.speechSynthesis.resume()}
          />

          <div className="flex items-center justify-center space-x-4">
            <Button
              size="lg"
              variant={state.isRecording ? "destructive" : "default"}
              onClick={state.isRecording ? stopListening : startListening}
              disabled={!browserSupportsSpeechRecognition || state.isProcessing}
              className="w-40"
            >
              {state.isRecording ? (
                <>
                  <MicOff className="mr-2 h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          {state.error && (
            <p className="text-destructive text-center">{state.error}</p>
          )}

          {transcript && (
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm">Current transcript: {transcript}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}