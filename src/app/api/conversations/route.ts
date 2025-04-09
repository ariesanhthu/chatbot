import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_GROUP_ID = "de14929c-1e0f-4168-a1bf-d88aad3b1085";

export async function POST(request: Request): Promise<Response> {
  try {
    // Parse the request body for conversation data
    const { user_id, title, group_id } = await request.json();

    if (!user_id || !title) {
      return NextResponse.json(
        { error: "Missing required fields: user_id and title are required." },
        { status: 400 }
      );
    }

    // Use the provided group_id or default to DEFAULT_GROUP_ID.
    const conversationGroupId = group_id || DEFAULT_GROUP_ID;

    // Insert a new conversation record, associating it with the provided or default group_id
    const { data, error } = await supabase
      .from("conversations")
      .insert([{ user_id, title, group_id: conversationGroupId }])
      .select();

    if (error) {
      console.error("Error inserting conversation:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("Conversation API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
