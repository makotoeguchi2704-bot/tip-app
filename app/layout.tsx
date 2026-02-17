import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "TIPBOX",
  description: "QRコードでチップを送れるピクセルアートアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${pixel.variable} antialiased`} style={{ fontFamily: "var(--font-pixel), monospace" }}>
        <header className="border-b-4 border-retro-green bg-retro-dark py-4 text-center">
          <Link href="/" className="text-2xl tracking-widest text-retro-green hover:text-retro-amber transition-colors sm:text-3xl">
            TIPBOX
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
