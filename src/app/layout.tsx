import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FRA-Mitra - AI-Powered FRA Atlas & Decision Support System",
  description: "Comprehensive web platform for monitoring Forest Rights Act (FRA) implementation in India with AI-powered analytics and WebGIS-based decision support",
  keywords: ["Forest Rights Act", "FRA", "India", "Tribal Rights", "GIS", "Decision Support System", "AI", "Forest Management"],
  authors: [{ name: "FRA-Mitra Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
