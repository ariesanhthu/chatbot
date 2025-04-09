import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export async function getUserId(): Promise<string | null> {
  // Retrieve the current session from Supabase
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error getting session:", error);
    toast.error("Error retrieving session.");
    return null;
  }

  // Check if session is present and contains user information
  if (data.session && data.session.user) {
    return data.session.user.id;
  } else {
    console.error("No session or user found.");
    toast.error("User session not found.");
    return null;
  }
}
