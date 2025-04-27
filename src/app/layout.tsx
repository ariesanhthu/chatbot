import type { Metadata } from "next";
import { Toaster } from 'sonner';
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from './components/theme-provider';
import "./globals.css";
import { Navbar } from "./components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
import {
  ClerkProvider
} from '@clerk/nextjs'

import { AuthProvider } from "@/context/AuthContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chatbot tư vấn học đường",
  description: "AI Chatbot tư vấn học đường",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <html lang="vi">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster position="top-center" />
              <Navbar />
              {children}
            </ThemeProvider>
          </body>
        </html>
      </AuthProvider>
    </ClerkProvider>

  );
}
