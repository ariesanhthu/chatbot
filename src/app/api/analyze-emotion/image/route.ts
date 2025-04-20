import { NextResponse } from 'next/server';
import { Client } from '@gradio/client';

export async function POST(request: Request) {
  try {
    // 1. Lấy FormData và file ảnh
    const formData = await request.formData(); 
    const file = formData.get('image'); 
    if (!(file instanceof Blob)) {
      return NextResponse.json({ success: false, message: 'No image provided' }, { status: 400 });
    }

    // 2. Kết nối đến Gradio Space
    const client = await Client.connect('Arischi05/gradio_deepface'); 
    // Nếu cần token: Client.connect('user/space', { hf_token: process.env.HF_TOKEN })

    // 3. Gọi predict với tham số tương ứng
    const result = await client.predict('/predict', {
      image: file,
    });
    console.log(result);
    // DEEPFACE có thể nhận diện nhiều gương mặt trong hình
    // const responseData = {
    //   type: 'data',
    //   time: '2025-04-20T13:19:20.405Z',
    //   data: ['happy'],
    //   endpoint: '/predict',
    //   fn_index: 2
    // };
    // 4. Trả về kết quả
    return NextResponse.json({ success: true, data: result.data[0] });
  } catch (err: any) {
    console.error('Error in emotion API:', err);
    return NextResponse.json({ success: false, message: err.message || 'Internal error' }, { status: 500 });
  }
}
