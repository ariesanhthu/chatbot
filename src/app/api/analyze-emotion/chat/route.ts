import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { TextSplit } from "@/utils/textsplit";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  // 1️⃣ Read JSON and validate
  const payload = await req.json();
  const text = typeof payload.text === "string" ? payload.text.trim() : "";

  if (!text) {
    return NextResponse.json(
      { error: "Missing `text` in request body" },
      { status: 400 }
    );
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY not set");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  // 2️⃣ Build messages array
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "Đánh giá và phân loại đoạn chat của người dùng. Trả về đúng một từ: disgust, angry, fear, sad, neutral, surprise, happy",
    },
    { role: "user", content: text },
  ];

  try {
    // 3️⃣ Call the Groq Chat Completions API
    const completion = await client.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages,
    });

    const choice = completion.choices?.[0]?.message.content;
    if (!choice) {
      console.error("Invalid response:", completion);
      return NextResponse.json(
        { error: "Invalid response from Groq API" },
        { status: 500 }
      );
    }

    // 4️⃣ Return the emotion 
    const result: string = await TextSplit(choice);

    console.log("Emotion detected:", result);
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (err: any) {
    console.error("Groq API error:", err);
    const msg = err.error
      ? `Groq API error: ${JSON.stringify(err.error)}`
      : err.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
