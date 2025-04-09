export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }
  
  export interface ChatState {
    messages: Message[];
    isRecording: boolean;
    isProcessing: boolean;
    error: string | null;
    speechRate: number;
    speechPitch: number;
  }
  
  export interface VoiceControlsProps {
    speechRate: number;
    speechPitch: number;
    onRateChange: (value: number) => void;
    onPitchChange: (value: number) => void;
    onStop: () => void;
    onPause: () => void;
    onResume: () => void;
  }