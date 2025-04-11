import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function DELETE(
    request: Request,
    context: any
  ) : Promise<Response> {
    try {
      const {id} = context.params as { id: string };

      // Delete conversation by id
      const { data, error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)
        .select();
  
      if (error) {
        console.error('Error deleting conversation:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
  
      return NextResponse.json({ data });
    } catch (err: any) {
      console.error('DELETE API error:', err);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
  }
  