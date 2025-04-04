import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "英語学習情報サイト | 英語力向上のための総合情報ポータル",
  description: "TOEIC、TOEFL、英検など英語試験対策や英語学習に関する情報を提供する総合情報サイトです。",
};

export default function ArticlesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-800">英語学習情報サイト</h1>
            </div>
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <p className="text-gray-500 text-sm text-center">
                © {new Date().getFullYear()} 英語学習情報サイト All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 