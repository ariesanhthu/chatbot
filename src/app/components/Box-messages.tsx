"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Image as ImageIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import CameraComponent from "./Camera";

// Định nghĩa các interface cho SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: () => void;
  isLoading?: boolean;
  onFileUpload?: (file: File) => void;
}


export function MessageInput({
  input,
  setInput,
  handleSubmit,
  isLoading = false,
  onFileUpload,
}: MessageInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [silenceCount, setSilenceCount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const lastTranscriptRef = useRef<string>("");
  const intervalTranscriptRef = useRef("");
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to latest stopRecording to avoid stale closure in interval
  const stopRecordingRef = useRef<() => void>(() => {});

  // Initialize SpeechRecognition
  useEffect(() => {
    const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'vi-VN';

    rec.onresult = (e: any) => {
      const { resultIndex, results } = e;
      const result = results[resultIndex][0];
      const text = result.transcript;

      if (results[resultIndex].isFinal) {
        setFinalTranscript(p => p + text + ' ');
        setInterimTranscript('');
        lastTranscriptRef.current = text;
      } else {
        setInterimTranscript(text);
        lastTranscriptRef.current = text;
      }
    };

    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e.error);
      toast.error(`Lỗi nhận dạng giọng nói: ${e.error}`);
      setIsRecording(false);
    };

    rec.onend = () => {
      if (isRecording) rec.start();
    };

    setRecognition(rec);

    return () => {
      rec.stop();
      if (mediaRecorderRef.current?.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, []);

  // Keep stopRecordingRef current
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    recognition?.stop();
    setIsRecording(false);
    toast.success('Đã dừng ghi âm');

    const finalText = (finalTranscript + interimTranscript).trim();
    if (finalText) setInput(finalText);
    setFinalTranscript('');
    setInterimTranscript('');
  };
  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  // Silence detection interval
  useEffect(() => {
    if (isRecording) {
      const id = setInterval(() => {
        const curr = lastTranscriptRef.current;
        if (curr === intervalTranscriptRef.current) {
          setSilenceCount(c => {
            if (c + 1 >= 3) {
              stopRecordingRef.current();
              return 0;
            }
            return c + 1;
          });
        } else {
          intervalTranscriptRef.current = curr;
          setSilenceCount(0);
        }
      }, 1000);
      checkIntervalRef.current = id;
    } else {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      setSilenceCount(0);
    }
    return () => {
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!isLoading) handleSubmit();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) onFileUpload(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = e => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        console.log('Audio recorded:', blob);
      };
      mr.start();
      recognition?.start();
      lastTranscriptRef.current = '';
      setFinalTranscript('');
      setInterimTranscript('');
      setSilenceCount(0);
      setIsRecording(true);
      toast.success('Đã bắt đầu ghi âm');
    } catch (err) {
      console.error(err);
      toast.error('Không thể bắt đầu ghi âm. Kiểm tra quyền microphone.');
    }
  };

  const handleVoiceRecord = () => {
    if (isRecording) stopRecordingRef.current(); else startRecording();
  };

  const inputValue = isRecording ? (finalTranscript + interimTranscript) : input;

  return (
    <div className="border-t p-4 space-y-2 w-screen">
      {isRecording && (finalTranscript || interimTranscript) && (
        <div className="bg-gray-100 p-3 rounded-md text-sm">
          {finalTranscript && <p className="font-medium text-gray-700">{finalTranscript}</p>}
          {interimTranscript && <p className="text-gray-500 italic">{interimTranscript}</p>}
        </div>
      )}
      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <ImageIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Upload image</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("shrink-0", isRecording && "text-red-500 animate-pulse")}
                onClick={handleVoiceRecord}
                disabled={isLoading}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isRecording ? "Đang ghi âm..." : "Ghi âm giọng nói"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoading}>
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input
          value={inputValue}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); } }}
          disabled={isLoading}
        />
        <Button variant="default" size="icon" onClick={handleSendMessage}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        accept="image/*,.pdf,.doc,.docx,.txt"
        disabled={isLoading}
      />
    </div>
  );
}
