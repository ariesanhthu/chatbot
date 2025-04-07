import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(request: Request): Promise<Response> {
  try {
    // Ensure GROQ_API_KEY is configured
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 });
    }

    // Parse and validate input
    const body = await request.json();
    if (!body || !body.messages || !Array.isArray(body.messages)) {
      console.error("Invalid input:", body);
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    if (body.messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Validate and normalize messages
    const validMessages = body.messages.map((msg: any) => {
      if (!msg.role || !msg.content) {
        throw new Error("Each message must include a role and content");
      }
      if (!["system", "user", "assistant"].includes(msg.role)) {
        throw new Error(`Invalid role: ${msg.role}`);
      }
      return { role: msg.role, content: String(msg.content) };
    });

    // Prepare messages for Groq API (add a system prompt as needed)
    const messages = [
      {
        role: "system",
        content: "Sử dụng tiếng việt, không được sử dụng tiếng trung quốc, trả về kết quả dưới 10 từ.",
      },
      ...validMessages,
    ];

    console.log("Sending request to Groq API with messages:", JSON.stringify(messages, null, 2));

    // Call Groq API
    const chatCompletion = await client.chat.completions.create({
      messages,
      model: "deepseek-r1-distill-llama-70b",
    });

    if (!chatCompletion || !chatCompletion.choices || chatCompletion.choices.length === 0) {
      console.error("Invalid API result:", chatCompletion);
      return NextResponse.json({ error: "Invalid API result" }, { status: 500 });
    }

    // Full response from Groq API
    const fullResponse: string = chatCompletion.choices[0].message.content || "";

    // Simulate streaming by splitting the full response into chunks.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Break response into chunks (e.g., 10 characters each)
        const chunkSize = 10;
        const chunks = fullResponse.match(new RegExp(`.{1,${chunkSize}}`, "g")) || [];
        let i = 0;

        function pushChunk() {
          if (i < chunks.length) {
            controller.enqueue(encoder.encode(chunks[i]));
            i++;
            // Delay between chunks (simulate streaming)
            setTimeout(pushChunk, 200);
          } else {
            controller.close();
          }
        }
        pushChunk();
      },
    });

    return new NextResponse(stream, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
