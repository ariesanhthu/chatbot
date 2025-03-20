import { NextResponse } from "next/server";

export async function GET() {
  const HF_MODEL_URL = "https://huggingface.co/your-username/face-emotion-model/resolve/main/model.json";
  const hfToken = process.env.HF_TOKEN;

  const response = await fetch(HF_MODEL_URL, {
    headers: { Authorization: `Bearer ${hfToken}` },
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch model" }, { status: response.status });
  }

  const modelJson = await response.json();
  return NextResponse.json(modelJson);
}
