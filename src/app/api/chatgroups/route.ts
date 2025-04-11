import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request): Promise<Response> {
  try {
    // Lấy userId từ query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' }, 
        { status: 400 }
      );
    }

    // Truy vấn 1: Lấy tất cả chat groups và conversations liên quan đến userId
    const { data: allGroups, error: groupsError } = await supabase
      .from('chat_groups')
      .select(`
        id,
        name,
        description,
        created_at,
        conversations!inner (
          id,
          user_id,
          title,
          created_at,
          group_id
        )
      `)
      .eq('conversations.user_id', userId);

    if (groupsError) {
      console.error("Error fetching chat groups:", groupsError);
      return NextResponse.json({ error: groupsError.message }, { status: 500 });
    }

    // Truy vấn 2: Lấy tất cả conversations không thuộc group nào của user
    const { data: ungroupedConversations, error: convsError } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .is('group_id', null);

    if (convsError) {
      console.error("Error fetching ungrouped conversations:", convsError);
      return NextResponse.json({ error: convsError.message }, { status: 500 });
    }

    // Tạo một "fake group" để chứa các conversations không thuộc group nào
    const result = [...(allGroups || [])];
    
    // Thêm "fake group" chỉ khi có ungrouped conversations
    if (ungroupedConversations && ungroupedConversations.length > 0) {
      result.push({
        id: "ungrouped",
        name: "Ungrouped Chats",
        description: "Conversations that don't belong to any group",
        created_at: new Date().toISOString(),
        conversations: ungroupedConversations
      });
    }

    return NextResponse.json({ data: result });
  } catch (err: any) {
    console.error("Chat groups API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}