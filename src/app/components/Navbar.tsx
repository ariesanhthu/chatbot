"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon, Bell, Settings, LogOut } from "lucide-react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  LayoutDashboard
} from "lucide-react";

import axios from "axios";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  const { isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await axios.get("/api/check-role");
        setIsAdmin(res.data.isAdmin);
      } catch (error) {
        console.error("Error fetching role:", error);
      }
    };

    fetchRole();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold pl-20 text-xl text-primary">
            Chatbot tư vấn học đường
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          {!isSignedIn ? (
            <div className="flex gap-4">
                <div className="text-white btn rounded-lg bg-gray-950 py-2 px-4 hover:bg-gray-900 transition">
                    <SignInButton fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/">
                        Sign In
                    </SignInButton>
                </div>

                <div className="px-4 py-2 border-gray-950 border text-black rounded-lg hover:bg-gray-200 transition">
                    <SignUpButton signInFallbackRedirectUrl="/" fallbackRedirectUrl="/">
                        Sign Up
                    </SignUpButton>
                </div>
          </div>
        ) : (
          <UserButton afterSignOutUrl="/">
              {/* KIỂM TRA TÀI KHOẢN */}
              {
                isAdmin ? (
                  <UserButton.MenuItems>
                   <UserButton.Link
                     label="Quản lý trang"
                     labelIcon={<LayoutDashboard fill="#3e9392" size={15} stroke="0"/>}
                     href="/admin/dashboard"
                   />
                 </UserButton.MenuItems>
                 )  : null
              }
              
          </UserButton>
        )}

        </div>
      </div>
    </nav>
  );
}