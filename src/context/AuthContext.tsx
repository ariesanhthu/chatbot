"use client";

import { createContext, useContext, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { getUserID } from "@/lib/auth";

interface AuthContextType {
  user: any; // Alternatively, define your own User type if desired
  email: string | null;
  userId: string | null;
  isLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null);
  
  // Get user details using Clerk's useUser hook
  const { user, isLoaded } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress || null;

  // Get ID User
  useEffect(() => {

    const fetchUser = async () => {
      if (!email || !isLoaded) {
        return;
      }
      
      try {
        const id = await getUserID(email);
        if (id) {
          setUserId(id);
          console.log("User ID loaded:", id);
        } else {
          console.error("User ID not found for email:", email);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
  
    fetchUser();
  }, [email, isLoaded]);

  const value: AuthContextType = { user, email, userId, isLoaded };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
