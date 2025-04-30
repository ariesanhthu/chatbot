// utils/textToSpeech.ts
import { TextSplit } from "./textsplit";
export async function speakText(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
  }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech Synthesis API không được hỗ trợ trong trình duyệt này.');
      return;
    }
    const textsplit = await TextSplit(text);
    console.log("textplit: ", textsplit);
    
    const utterance = new SpeechSynthesisUtterance(textsplit);

    // Cấu hình giọng đọc tùy chọn
    utterance.lang = options?.lang ?? 'vi-VN';
    utterance.rate = options?.rate ?? 1;
    utterance.pitch = options?.pitch ?? 1;
  
    window.speechSynthesis.speak(utterance);
  }

//setup for google
// utils/textToSpeech.ts

// import { TextSplit } from './textsplit';

// export async function speakText(
//   text: string,
//   options?: { lang?: string; rate?: number; pitch?: number }
// ) {
//   const content = await TextSplit(text);

//   // 1) Call our API route
//   const resp = await fetch('/api/tts', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       text: content,
//       lang: options?.lang,
//       rate: options?.rate,
//       pitch: options?.pitch,
//     }),
//   });
//   if (!resp.ok) {
//     console.error('TTS API error', await resp.text());
//     return;
//   }

//   // 2) Parse Base64 audio
//   const { audio: audioBase64 } = await resp.json();

//   // 3) Convert Base64 to binary Uint8Array
//   const raw = window.atob(audioBase64);
//   const arr = new Uint8Array(raw.length);
//   for (let i = 0; i < raw.length; i++) {
//     arr[i] = raw.charCodeAt(i);
//   }

//   // 4) Create a Blob and play it
//   const blob = new Blob([arr], { type: 'audio/mp3' });
//   const url = URL.createObjectURL(blob);
//   const audio = new Audio(url);
//   audio.play();
// }
