import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BotId } from '@/lib/ExternalData';

// POST để tạo message mới
export async function POST(
  request: Request,
  context: any
): Promise<Response> {
  try {
    
    // Await the dynamic parameters before using them
    // const params = await context.params;
    // const conversationId = params.id; 
    const { id: conversationId } = await context.params as { id: string };


    const { message, userId } = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Invalid message data. Required: message content and userId' },
        { status: 400 }
      );
    }
    
    // Insert message vào database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: userId,
        content: message.content,
        message_type: message.type || 'text', // Giả định rằng message_type_enum có giá trị 'text'
      })
      .select();
    
    if (error) {
      console.error('Error saving message:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Message API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST để lưu phản hồi từ bot
export async function PUT(
  request: Request,
  context: any
): Promise<Response> {
  try {
    // Await the dynamic parameters before using them
    // const params = await context.params;
    // const conversationId = params.id;
    const { id: conversationId } = await context.params as { id: string };

    const { botMessage } = await request.json();
    
    // Kiểm tra dữ liệu đầu vào
    if (!botMessage) {
      return NextResponse.json(
        { error: 'Invalid bot message data' },
        { status: 400 }
      );
    }
    
    // Insert bot message vào database
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: BotId, // Sử dụng BotId từ ExternalData
        content: botMessage.content,
        message_type: botMessage.type || 'text',
      })
      .select();
    
    if (error) {
      console.error('Error saving bot message:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Bot message API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET để lấy messages của một conversation
export async function GET(
  request: Request,
  context: any
): Promise<Response>
{
  try {
    // Await the dynamic parameters before using them
    // const params = await context.params;
    const {id: conversationId} = await context.params as { id: string };

    
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Message API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}