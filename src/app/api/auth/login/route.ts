import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request): Promise<Response> {
  try {
    const { email, password } = await request.json();

    // Attempt to sign in using Supabase's signInWithPassword function
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Log the returned data for debugging
    console.log("Login data:", data);

    // Create a response object with the login data
    const response = NextResponse.json({ data });

    // If a session is returned, set cookies for access and refresh tokens.
    if (data.session) {
      response.cookies.set("sb-access-token", data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
      response.cookies.set("sb-refresh-token", data.session.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
