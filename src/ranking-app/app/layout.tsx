"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import { Inter } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

const queryClient = new QueryClient();

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`dark ${inter.className}`}>
        <NextUIProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
