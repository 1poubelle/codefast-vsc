import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeFast SaaS - Build Your SaaS Faster Than Ever",
  description: "Launch your next SaaS product in days, not months. Complete authentication, payments, and dashboard - all ready to customize and deploy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
