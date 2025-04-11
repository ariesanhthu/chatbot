import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { data } from "@tensorflow/tfjs";

export async function GET(request: Request): Promise<Response> {
  try {
    // Parse the request URL to get query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Query the "users" table for a user with the given email
    const { data: user, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (error || !user) {
      console.error("User lookup error:", error);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    console.log(data);
    // Return the user id in the response
    return NextResponse.json({ userId: user.id }, { status: 200 });
  } catch (err: any) {
    console.error("Error in GET /api/user:", err);
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
