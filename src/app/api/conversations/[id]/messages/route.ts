import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
): Promise<Response> {
  try {
    // Extract the conversationId from the dynamic route parameters
    const { id } = await params;

    // Parse the request body for required fields: sender_id, content, and message_type
    const { sender_id, content, message_type } = await request.json();

    if (!sender_id || !content || !message_type) {
      return NextResponse.json({ error: "Missing required fields: sender_id, content, and message_type are required." }, { status: 400 });
    }

    // Insert a new message record into the "messages" table
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          conversation_id: id,
          sender_id,
          content,
          message_type,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting message:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Message API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
