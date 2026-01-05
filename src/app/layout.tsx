import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["thai", "latin"],
  variable: "--font-sarabun",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Real Estate Contracts",
  description: "Manage and sign real estate contracts",
};

import { MobileNav } from "@/components/MobileNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${sarabun.variable} antialiased font-sans bg-gray-50 text-gray-900`}
      >
        {children}
        <MobileNav />
      </body>
    </html>
  );
}
