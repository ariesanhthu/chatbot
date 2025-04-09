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
  Camera,
  Image as ImageIcon,
  Mic,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

// Mở rộng Window interface
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
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Khởi tạo SpeechRecognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'vi-VN'; // Sử dụng tiếng Việt

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptText = result[0].transcript;
          
          if (result.isFinal) {
            // Kết quả cuối cùng
            setFinalTranscript(prev => prev + transcriptText + " ");
            setInterimTranscript("");
            lastTranscriptRef.current = transcriptText;
          } else {
            // Kết quả tạm thời
            setInterimTranscript(transcriptText);
            lastTranscriptRef.current = transcriptText;
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          toast.error(`Lỗi nhận dạng giọng nói: ${event.error}`);
          setIsRecording(false);
        };

        recognition.onend = () => {
          if (isRecording) {
            recognition.start();
          }
        };

        setRecognition(recognition);
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // Thiết lập interval kiểm tra sau mỗi giây
  useEffect(() => {
    if (isRecording) {
      // Thiết lập interval kiểm tra sau mỗi giây
      const interval = setInterval(() => {
        const currentTranscript = lastTranscriptRef.current;
        
        // Nếu transcript không thay đổi, tăng silenceCount
        if (currentTranscript === lastTranscriptRef.current) {
          setSilenceCount(prev => {
            const newCount = prev + 1;
            // Nếu đã im lặng 3 giây, dừng ghi âm
            if (newCount >= 3) {
              stopRecording();
              return 0;
            }
            return newCount;
          });
        } else {
          // Nếu transcript thay đổi, reset silenceCount
          setSilenceCount(0);
        }
      }, 1000);
      
      checkIntervalRef.current = interval;
    } else {
      // Dọn dẹp interval khi không ghi âm
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      setSilenceCount(0);
    }
    
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isRecording]);

  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;
    handleSubmit();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onFileUpload) return;
    onFileUpload(file);
  };

  const startRecording = async () => {
    try {
      // Bắt đầu ghi âm
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Có thể lưu audioBlob hoặc gửi lên server nếu cần
        console.log('Audio recorded:', audioBlob);
      };

      mediaRecorder.start();
      
      // Bắt đầu nhận dạng giọng nói
      if (recognition) {
        recognition.start();
      }
      
      lastTranscriptRef.current = "";
      setSilenceCount(0);
      setFinalTranscript("");
      setInterimTranscript("");
      setIsRecording(true);
      toast.success("Đã bắt đầu ghi âm");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Không thể bắt đầu ghi âm. Vui lòng kiểm tra quyền truy cập microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (recognition) {
      recognition.stop();
    }
    
    setIsRecording(false);
    toast.success("Đã dừng ghi âm");
    
    // Cập nhật input với transcript cuối cùng
    const finalText = finalTranscript + interimTranscript;
    if (finalText.trim()) {
      setInput(input + finalText);
      setFinalTranscript("");
      setInterimTranscript("");
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      startRecording();
      setInput(interimTranscript);
    } else {
      stopRecording();
    }
  };

  // Tính toán giá trị hiển thị trong input
  const inputValue = isRecording 
    ? input + finalTranscript + interimTranscript 
    : input;

  return (
    <div className="border-t p-4 space-y- w-screen">
      {/* File Drop Zone */}
      <div className="border-2 border-dashed rounded-lg p-4 text-center hidden">
        <p className="text-muted-foreground">
          Drop files here or click to upload
        </p>
      </div>

      {/* Hiển thị transcript khi đang ghi âm */}
      {isRecording && (finalTranscript || interimTranscript) && (
        <div className="bg-gray-100 p-3 rounded-md text-sm">
          {finalTranscript && (
            <p className="font-medium text-gray-700">{finalTranscript}</p>
          )}
          {interimTranscript && (
            <p className="text-gray-500 italic">{interimTranscript}</p>
          )}
        </div>
      )}

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
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
                className="shrink-0"
                disabled={isLoading}
              >
                <Camera className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Take photo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "shrink-0",
                  isRecording && "text-red-500 animate-pulse"
                )}
                onClick={handleVoiceRecord}
                disabled={isLoading}
              >
                <Mic className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? "Đang ghi âm..." : "Ghi âm giọng nói"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach file</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                disabled={isLoading}
              >
                <Smile className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add emoji</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Input
          value={inputValue}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          disabled={isLoading}
        />

        <Button
          variant="default"
          size="icon"
          className="shrink-0"
          onClick={handleSendMessage}
          disabled={!input.trim() || isLoading}
        >
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