"use client"
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function EmotionRecognizer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotion, setEmotion] = useState<string | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    }
  }, []);

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");
    await analyzeEmotion(imageData);
  };

  const analyzeEmotion = async (imageData: string) => {
    const response = await fetch("/api/analyze-emotion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });

    const result = await response.json();
    setEmotion(result.emotion);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video ref={videoRef} autoPlay className="w-64 h-64 border" />
      <canvas ref={canvasRef} className="hidden" />
      <Button onClick={captureImage}>Chụp ảnh & Nhận diện</Button>
      {emotion && <p className="text-xl">Cảm xúc: {emotion}</p>}
    </div>
  );
}
