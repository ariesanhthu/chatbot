// pages/api/detectEmotion.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Client } from "@gradio/client";

// Định nghĩa kiểu dữ liệu trả về cho API
interface EmotionResponse {
  success: boolean;
  emotion?: string;
  score?: number;
  error?: string;
}

// Định nghĩa kiểu dữ liệu cho kết quả JSON từ API Gradio
interface EmotionAPIResponse {
  emotion: string;
  score: number;
}

/**
 * Gọi API Gradio phát hiện cảm xúc từ imageBlob và trả về kết quả
 * @param imageBlob - Blob hình ảnh cần phân tích
 * @returns EmotionResponse với thông tin cảm xúc, điểm số hoặc lỗi nếu có
 */
export async function detectEmotion(imageBlob: Blob): Promise<EmotionResponse> {
  try {
    // Kết nối đến API Gradio
    const client = await Client.connect("Arischi05/face-emotion-api");

    // Gọi hàm predict với hình ảnh
    const result = await client.predict("/predict", { img: imageBlob });

    // Parse chuỗi JSON kết quả (chuyển dấu nháy đơn sang nháy kép để JSON.parse hoạt động)
    const resultString = result.data as string;
    const resultJson = JSON.parse(resultString.replace(/'/g, '"')) as EmotionAPIResponse;

    return {
      success: true,
      emotion: resultJson.emotion,
      score: resultJson.score,
    };
  } catch (error) {
    console.error("Error calling emotion detection API:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * API handler cho endpoint /api/detectEmotion
 * Phương thức POST với body chứa trường image (base64 string)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmotionResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed",
    });
  }

  try {
    // Giả sử hình ảnh được gửi qua body dưới dạng base64 encoded string
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({
        success: false,
        error: "No image provided",
      });
    }

    // Chuyển đổi base64 string thành Buffer
    const buffer = Buffer.from(image, "base64");

    // Tạo Blob từ Buffer; (Node.js phiên bản mới có hỗ trợ Blob, nếu không hãy dùng thư viện thay thế)
    const imageBlob = new Blob([buffer]);

    // Gọi hàm detectEmotion để phân tích hình ảnh
    const result = await detectEmotion(imageBlob);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in detectEmotion API handler:", err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
