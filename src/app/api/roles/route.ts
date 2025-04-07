import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Retrieve all roles
  const { data, error } = await supabase.from('roles').select('*, users:users(*)');

  if (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  console.log(data);
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    // Validate input - ensure name is provided
    if (!name) {
      return NextResponse.json({ error: 'Role name is required' }, { status: 400 });
    }

    // Insert new role
    const { data, error } = await supabase.from('roles').insert([{ name }]).select();
    console.log(data);
    if (error) {
      console.error('Error creating role:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('Registration API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
