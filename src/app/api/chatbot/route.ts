import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json(); // Nhận input từ client
  const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/nguyenhh3305/model1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`, // Thay bằng token của bạn
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: message }),
      }
    );

    const result = await response.json();

    // Debug: In response từ API Hugging Face
    console.log("Response từ Hugging Face:", result);
    if (!Array.isArray(result) || result.length === 0 || !result[0]?.generated_text) {
      return NextResponse.json({ error: "Lỗi từ mô hình Hugging Face", details: result }, { status: 500 });
    }

    return NextResponse.json({ reply: result[0].generated_text });
  } catch (error) {
    return NextResponse.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}
// # Load model directly
// from transformers import AutoModel
// model = AutoModel.from_pretrained("nguyenhh3305/model1")
