import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MessageRole } from "@/lib/interface";
const client = new Groq({ apiKey: process.env.GROQ_API_KEY! });
interface ChatCompletionNonFunctionMessageParam {
  role: "system" | "user" | "assistant";
  content: string;
}
export async function POST(
    req: Request,
)
 {
  try {

    // Kiểm tra xem có GROQ_API_KEY không
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY không được cấu hình");
      return NextResponse.json(
        { error: "API key không được cấu hình" },
        { status: 500 }
      );
    }

    // Parse và kiểm tra dữ liệu đầu vào
    const body = await req.json();
    
    // if (!body || !body.messages || !Array.isArray(body.messages)) {
    //   console.error("Dữ liệu đầu vào không hợp lệ:", body);
    //   return NextResponse.json(
    //     { error: "Dữ liệu đầu vào không hợp lệ" },
    //     { status: 400 }
    //   );
    // }

    // Kiểm tra xem có tin nhắn nào không
    if (body.message == null) {
      return NextResponse.json(
        { error: "Không có tin nhắn nào được gửi" },
        { status: 400 }
      );
    }

    // Kiểm tra và chuẩn hóa định dạng tin nhắn
    // const validMessages = body.messages.map((msg: any) => {
    //   // Đảm bảo mỗi tin nhắn có role và content
    //   if (!msg.role || !msg.content) {
    //     throw new Error("Tin nhắn không có role hoặc content");
    //   }
      
    //   // Đảm bảo role là một trong các giá trị hợp lệ
    //   if (!["system", "user", "assistant"].includes(msg.role)) {
    //     throw new Error(`Role không hợp lệ: ${msg.role}`);
    //   }
      
    //   return {
    //     role: msg.role,
    //     content: String(msg.content) // Đảm bảo content là string
    //   };
    // });
   
    // Chuẩn bị tin nhắn cho API
    const messages: ChatCompletionNonFunctionMessageParam[] = [
      { 
        role: "system", 
        content: "Đánh giá và phân loại đoạn chat của người dùng. Yêu cầu: chỉ trả về 1 số duy nhất tương ứng với các trạng thái: (0: 'bình thường'), (1: 'tốt'), (2: 'không ổn'), (3: 'trầm cảm')" 
      },
      {
        role: MessageRole.USER, 
        content: body.message},
    ];

    console.log("Gửi yêu cầu đến Groq API với tin nhắn:", JSON.stringify(messages, null, 2));

    // Gọi API Groq với try-catch riêng để xử lý lỗi API
    try {
      const chatCompletion = await client.chat.completions.create({
        messages,
        model: "deepseek-r1-distill-llama-70b",
      });

      // Kiểm tra kết quả
      if (!chatCompletion || !chatCompletion.choices || chatCompletion.choices.length === 0) {
        console.error("Kết quả API không hợp lệ:", chatCompletion);
        return NextResponse.json(
          { error: "Kết quả API không hợp lệ" },
          { status: 500 }
        );
      }
      const responseValue = chatCompletion.choices[0].message.content as string;

      // Mapping từ giá trị số sang trạng thái chữ
      const statusMap: { [key: string]: string } = {
        '0': 'bình thường',
        '1': 'tốt',
        '2': 'không ổn',
        '3': 'trầm cảm'
      };

      // Lấy status dưới dạng chữ, nếu không khớp sẽ là undefined
      const userStatus = statusMap[responseValue.trim()];
      
      if (!userStatus) {
        throw new Error(`Giá trị nhận được (${responseValue}) không hợp lệ`);
      }
 
      // Trả về kết quả
      return NextResponse.json({data: userStatus,status: 200});
    } catch (apiError: any) {
      // Log lỗi API chi tiết
      console.error("Lỗi khi gọi Groq API:", apiError);
      
      // Kiểm tra nếu có thông tin lỗi từ API
      if (apiError.error) {
        return NextResponse.json(
          { error: `Lỗi Groq API: ${JSON.stringify(apiError.error)}` },
          { status: 500 }
        );
      }
      
      return NextResponse.json(
        { error: `Lỗi API: ${apiError.message || "Không xác định"}` },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log lỗi chi tiết
    console.error("Lỗi xử lý yêu cầu:", error);
    
    // Trả về thông báo lỗi phù hợp
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Lỗi xử lý: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Đã xảy ra lỗi không xác định" },
      { status: 500 }
    );
  }
}

