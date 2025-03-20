import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: "system", content: "Sử dụng tiếng việt, không được sử dụng tiếng trung quốc, trả về kết quả dưới 100 từ." },
        ...messages,
      ],
      model: "deepseek-r1-distill-llama-70b",
    });

    return NextResponse.json(chatCompletion.choices[0].message);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
}

