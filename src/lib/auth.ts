import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
export async function getUserID(email: string): Promise<string | null> {
  if (!email) {
    console.error("Email not available");
    return null;
  }

  try {
    const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
    const result = await res.json();

    if (res.ok) {
      return result.userId;
    } else {
      console.error("API error:", result.error);
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching user id:", error);
    return null;
  }
}