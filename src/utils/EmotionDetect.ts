import { Client } from "@gradio/client";

// Định nghĩa kiểu dữ liệu trả về
interface EmotionResponse {
  success: boolean;
  emotion?: string;
  score?: number;
  error?: string;
}

// Định nghĩa kiểu dữ liệu cho kết quả JSON từ API
interface EmotionAPIResponse {
  emotion: string;
  score: number;
}

/**
 * Gọi API phát hiện cảm xúc và trả về kết quả
 * @param imageBlob - Blob hình ảnh cần phân tích
 * @returns Promise với thông tin về cảm xúc được phát hiện
 */
export async function detectEmotion(imageBlob: Blob): Promise<EmotionResponse> {
  try {
    // Kết nối đến API Gradio
    const client = await Client.connect("Arischi05/face-emotion-api");
    
    // Gọi hàm dự đoán với hình ảnh
    const result = await client.predict("/predict", { 
      img: imageBlob, 
    });
    
    // Parse chuỗi JSON kết quả
    const resultString = result.data as string;
    // Thay thế dấu nháy đơn bằng dấu nháy kép để JSON.parse hoạt động
    const resultJson = JSON.parse(resultString.replace(/'/g, '"')) as EmotionAPIResponse;
    
    return {
      success: true,
      emotion: resultJson.emotion,
      score: resultJson.score
    };
  } catch (error) {
    console.error("Error calling emotion detection API:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}