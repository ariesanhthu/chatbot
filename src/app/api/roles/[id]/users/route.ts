import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: Request,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    // Await the dynamic parameters before using them
    const params = await context.params;
    const roleId = params.id;

    if (!roleId) {
      return NextResponse.json(
        { error: "Missing roleId parameter" },
        { status: 400 }
      );
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if role exists
    const { data: role, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("id", roleId)
      .single();

    if (roleError || !role) {
      console.error("Role not found:", roleError);
      return NextResponse.json({ error: "Role not found" }, { status: 404 });
    }

    // Look for the user with the provided email
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, role_id")
      .eq("email", email)
      .single();

    if (userError) {
      console.error("Error finding user:", userError);
      return NextResponse.json({ error: "Error finding user" }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user already has a role
    if (user.role_id) {
      return NextResponse.json(
        { error: "User already has a role" },
        { status: 400 }
      );
    }

    // Update the user's role_id
    const { data, error } = await supabase
      .from("users")
      .update({ role_id: roleId })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "User added to role successfully",
      data 
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
