// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Or whatever font you use
import "./globals.css";

// 1. Import the new Providers component
import { Providers } from "./providers"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ForkLens",
  description: "Visualize GitHub Repositories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 2. Wrap the children inside Providers */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}