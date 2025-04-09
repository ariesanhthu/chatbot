import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(): Promise<Response> {
  try {
    // Query the chat_groups table and select all fields along with related conversations
    const { data, error } = await supabase
      .from('chat_groups')
      .select(`
        *,
        conversations (
          id,
          user_id,
          title,
          created_at
        )
      `);

    if (error) {
      console.error("Error fetching chat groups:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Chat groups API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
