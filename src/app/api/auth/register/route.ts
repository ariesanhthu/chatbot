import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request): Promise<Response> {
  try {
    const { name, email, password} = await request.json();

    // Call signUp on supabase.auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        },
      },
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Thêm dữ liệu vào bảng users
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: name,
          email: email,
          status: 'tốt',
          role_id: '113f8999-3ba3-4b2e-aa20-23dd7feae0c4', // mặc định - Student
        }
      ]);

    if (insertError) {
      console.error("Error inserting user data:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Registration API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
