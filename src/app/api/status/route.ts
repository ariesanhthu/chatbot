import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserID } from '@/lib/auth';
import { useId } from 'react';

const statusMap: Record<string, 'tốt' | 'bình thường' | 'không ổn'> = {
  happy: 'tốt',
  surprise: 'tốt',
  neutral: 'bình thường',
  sad: 'không ổn',
  fear: 'không ổn',
  angry: 'không ổn',
  disgust: 'không ổn',
};

export async function POST(req: Request) {
  try {

    // Xử lý payload
    const {emotion, userId} = (await req.json()) as {emotion: string, userId: string};
    // const emotion: string = body.emotion;
    // const userId: string = body.userId;
    

    if (!emotion?.trim()) {
      return NextResponse.json({ error: 'Thiếu emotion' }, { status: 400 });
    }

    const raw = emotion.trim().toLowerCase();
    const userStatus = statusMap[raw];

    console.log('Cảm xúc: ',userStatus);

    if (userStatus === 'bình thường' || !userStatus) {
      return NextResponse.json({ message: 'OK' }, { status: 200 });
    }

    const today = new Date().toISOString().split('T')[0];
    // Lưu dữ liệu vào database
    const { data, error } = await supabase
      .from('user_status')
      .select('*')
      .eq('user_id', userId)
      .eq('status', userStatus)
      .eq('date', today);
    if (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
      if (data && data.length > 0) {
        // Nếu record đã tồn tại, tăng trường count lên 1
        const currentCount = data[0].count || 0;
        const { error: updateError } = await supabase
          .from('user_status')
          .update({ count: currentCount + 1 })
          .eq('user_id', userId)
          .eq('status', userStatus)
          .eq('date', today);
  
        if (updateError) {
          console.error('Lỗi khi cập nhật dữ liệu:', updateError);
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
      } else {
        // Nếu chưa có record, tạo mới với count bắt đầu từ 1
        const { error: insertError } = await supabase
          .from('user_status')
          .insert([{ user_id: userId, status: userStatus, count: 1, date: today }]).select();
  
        if (insertError) {
          console.error('Lỗi khi thêm dữ liệu:', insertError);
          return NextResponse.json({ error: insertError.message }, { status: 500 });
        }
      }
    // } else {
    //   console.error('No such user:', userId);
    // }
    
    console.log('Cập nhật hoặc thêm dữ liệu thành công');
    // Trả về phản hồi thành công


    return NextResponse.json({ message: 'Đã lưu thành công' }, { status: 200 });
  } catch (err: any) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: err.message ?? 'Internal error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("userid", useId);
    const { data: data, error } = 
      await supabase
      .from('user_status')
      .select('user_id, status, count, date')
      .eq('user_id', userId);

    if (error) {
      console.error("User lookup error:", error);
      return NextResponse.json(
        { error: "User not found"},
        { status: 404 }
      );
    }

    console.log(data);

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (err: any) {
    console.error("Error in GET /api/user_status:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
