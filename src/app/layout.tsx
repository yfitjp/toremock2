'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useState, useEffect } from 'react';
import "./globals.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToreMock - オンライン模擬試験プラットフォーム",
  description: "高品質な英語のオンライン模擬試験を提供するプラットフォーム",
};

// MobileViewDetectorコンポーネント
// クライアントサイドでウィンドウサイズを検出し、モバイルビューを適用する
function MobileViewDetector({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 初回レンダリング時にウィンドウサイズをチェック
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // 初期チェック
    checkMobile();
    
    // リサイズイベントのリスナーを追加
    window.addEventListener('resize', checkMobile);
    
    // クリーンアップ
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={isMobile ? 'mobile-view' : ''}>
      {children}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <MobileViewDetector>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </MobileViewDetector>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
