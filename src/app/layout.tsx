import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Navbar from './components/Navbar'; // LayoutSwitcher内で使用するため不要
// import Footer from './components/Footer'; // LayoutSwitcher内で使用するため不要
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ToastProvider';
import LayoutSwitcher from "./components/LayoutSwitcher"; // LayoutSwitcherをインポート

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ToreMock - オンライン模擬試験プラットフォーム",
  description: "高品質な英語のオンライン模擬試験を提供するプラットフォーム",
};

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
            {/* LayoutSwitcherでラップする */}
            <LayoutSwitcher>
              {children}
            </LayoutSwitcher>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
