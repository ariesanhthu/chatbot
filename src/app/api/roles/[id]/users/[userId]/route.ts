import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,
  context: { params: { id: string; userId: string } }
): Promise<Response> {
  try {
    // Await the dynamic parameters before using them
    const params = await context.params;
    const roleId = params.id;
    const userId = params.userId;

    if (!roleId || !userId) {
      return NextResponse.json(
        { error: "Missing roleId or userId parameter" },
        { status: 400 }
      );
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

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, role_id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify that the user currently has the role we want to remove
    if (user.role_id !== roleId) {
      console.error("User does not belong to this role");
      return NextResponse.json(
        { error: "User does not belong to this role" },
        { status: 400 }
      );
    }

    // Remove the role from the user by setting role_id to nullx`
    const { data, error } = await supabase
      .from("users")
      .update({ role_id: null })
      .eq("id", userId)
      .eq("role_id", roleId);

    if (error) {
      console.error("Error removing user from role:", error);
      return NextResponse.json(
        { error: "Failed to remove user from role" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "User removed from role successfully", data });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
