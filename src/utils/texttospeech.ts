// utils/textToSpeech.ts
import { TextSplit } from "./textsplit";
export function speakText(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
  }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API không được hỗ trợ trong trình duyệt này.');
      return;
    }
    const textsplit = TextSplit(text);
    console.log("textplit: ", textsplit);
    
    const utterance = new SpeechSynthesisUtterance(textsplit);

    // Cấu hình giọng đọc tùy chọn
    utterance.lang = options?.lang ?? 'vi-VN';
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;
  
    window.speechSynthesis.speak(utterance);
  }
  