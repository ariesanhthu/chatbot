"use client"
import { useState, useEffect } from "react";
import { pipeline } from "@xenova/transformers";

export function useChatbot() {
  const [chatPipeline, setChatPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModel() {
      const generator = await pipeline("text-generation", "nguyenhh3305/model");
      setChatPipeline(generator);
      setLoading(false);
    }
    loadModel();
  }, []);

  async function generateResponse(message: string) {
    if (!chatPipeline) return "Loading model...";
    const output = await chatPipeline(message, { max_length: 100 });
    return output[0].generated_text;
  }

  return { generateResponse, loading };
}
