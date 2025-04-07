import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    // Update role by id
    const { data, error } = await supabase
      .from('roles')
      .update({ name })
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('Error updating role:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('PUT API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Delete role by id
    const { data, error } = await supabase
      .from('roles')
      .delete()
      .eq('id', params.id)
      .select();

    if (error) {
      console.error('Error deleting role:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('DELETE API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
