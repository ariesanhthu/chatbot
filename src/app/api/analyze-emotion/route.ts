import { NextResponse } from "next/server";
import * as tf from "@tensorflow/tfjs";

let model: tf.GraphModel | null = null;
const HF_MODEL_URL = "https://huggingface.co/your-username/face-emotion-model/resolve/main/model.json";

async function loadModel() {
  if (!model) {
    model = await tf.loadGraphModel("/api/proxy-huggingface");
  }
}

export async function POST(req: Request) {
  await loadModel();
  const { image } = await req.json();
  
  // TODO: Xử lý ảnh và trả về kết quả
  return NextResponse.json({ emotion: "Happy" });
}
