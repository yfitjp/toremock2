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
  title: {
    template: "%s | ToreMock",
    default: "ToreMock - オンライン英語模試",
  },
  description: "高品質な英語のオンライン模擬試験を提供するプラットフォーム。TOEIC®/TOEFL®/英検®の模試が1回無料で受験可能。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteName = "ToreMock";
  const siteUrl = "https://toremock.com";

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
  };

  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <LayoutSwitcher>
              {children}
            </LayoutSwitcher>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
