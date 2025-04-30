// pages/api/tts.ts
import { NextRequest, NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

type TtsRequest = {
  text: string;
  lang?: string;
  rate?: number;
  pitch?: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, lang = 'vi-VN', rate = 1, pitch = 0 } = body as TtsRequest;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const client = new textToSpeech.TextToSpeechClient();

    // Build the TTS request
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { languageCode: lang, ssmlGender: 'NEUTRAL' },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: rate,
        pitch: pitch,
      },
    });

    // Convert binary audio data to Base64
    const audioBase64 = response.audioContent 
      ? Buffer.from(response.audioContent as Uint8Array).toString('base64') 
      : '';

    return NextResponse.json({ audio: audioBase64 });
  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
