import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserID } from '@/lib/auth';
import { useId } from 'react';

const statusMap: Record<string, 'tốt' | 'bình thường' | 'không ổn' | 'trầm cảm'> = {
  happy: 'tốt',
  surprise: 'tốt',
  neutral: 'bình thường',
  sad: 'không ổn',
  fear: 'trầm cảm',
  angry: 'không ổn',
  disgust: 'không ổn',
};

// export const runtime = 'edge'; // if you intend Edge

export async function POST(req: Request) {
  const body = (await req.json()) as { status: string; userId: string | null};
  console.log('► body from client:', body);
  // 1. Parse & validate
  
  const { status: rawStatus, userId } = body;
  console.log(rawStatus);
  if (!rawStatus?.trim()) {
    return NextResponse.json({ error: 'Thiếu status' }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
  }

  // 2. Map status
  const mapped = statusMap[rawStatus.trim().toLowerCase()];
  if (!mapped) {
    return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
  }

  // 3. Upsert in Supabase
  const today = new Date().toISOString().slice(0, 10);
  const { data, error: selectError } = await supabase
    .from('user_status')
    .select('count')
    .eq('user_id', userId)
    .eq('status', mapped)
    .eq('date', today);
  if (selectError) throw selectError;

  if (data?.length) {
    await supabase
      .from('user_status')
      .update({ count: (data[0].count ?? 0) + 1 })
      .eq('user_id', userId)
      .eq('status', mapped)
      .eq('date', today);
  } else {
    await supabase
      .from('user_status')
      .insert({ user_id: userId, status: mapped, count: 1, date: today });
  }

  return NextResponse.json({ message: 'Đã lưu thành công' }, { status: 200 });
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
