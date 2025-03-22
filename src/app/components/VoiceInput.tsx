'use client';

import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';

export function VoiceInput({ input, setInput }: { input: string; setInput: (value: string) => void }) {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [isRecording, setIsRecording] = useState(false);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Voice recognition is not supported in your browser.</p>;
  }

  const handleStart = () => {
    setIsRecording(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const handleStop = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening();
    setInput(transcript); // Set input value to the recognized speech
  };

  return (
    <div className="flex gap-2 items-center">
      <Button onClick={handleStart} disabled={isRecording}>
        🎤 {listening ? 'Listening...' : 'Start Voice'}
      </Button>
      <Button onClick={handleStop} disabled={!listening}>
        ⏹ Stop
      </Button>
      <Button onClick={resetTranscript} disabled={!transcript}>
        🔄 Reset
      </Button>
    </div>
  );
}
