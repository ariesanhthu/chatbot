"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Avatar } from "./Avatar";
import { ThemeToggle } from "./ThemeToggle";

interface User {
  name: string;
  role: "Admin" | "Teacher" | "Student";
}

const Navbar = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  // Giả lập API lấy thông tin user
  useEffect(() => {
    // Fetch user từ backend hoặc local storage (cần thay thế bằng API thật)
    setTimeout(() => {
      setUser({
        name: "Nguyễn Văn A",
        role: "Teacher",
      });
    }, 1000);
  }, []);

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 dark:bg-gray-900 shadow-md fixed top-0 z-50">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        AI Chatbot
      </Link>

      {/* Menu điều hướng */}
      <div className="hidden md:flex gap-6">
        <Link href="/" className={`hover:text-blue-500 ${pathname === "/" ? "text-blue-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}>
          Trang chủ
        </Link>
        {user?.role === "Teacher" && (
          <Link href="/dashboard" className={`hover:text-blue-500 ${pathname === "/teacher-dashboard" ? "text-blue-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}>
            Dashboard
          </Link>
        )}
        <Link href="/chat" className={`hover:text-blue-500 ${pathname === "/chat" ? "text-blue-500 font-semibold" : "text-gray-700 dark:text-gray-300"}`}>
          Trò chuyện
        </Link>
      </div>

      {/* Avatar + Menu dropdown */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar name={user.name} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuItem disabled>{user.name}</DropdownMenuItem>
              <DropdownMenuItem className="text-gray-500" disabled>
                {user.role}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile">Hồ sơ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/logout">Đăng xuất</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link href="/login">Đăng nhập</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
