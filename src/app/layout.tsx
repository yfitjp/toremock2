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
    template: "%s | ToreMock(トレモック)",
    default: "ToreMock - オンライン英語模試",
  },
  description: "高品質な英語のオンライン模擬試験を提供するプラットフォーム。TOEIC®/TOEFL®/英検®の模試が1回無料で受験可能。",
  // OGP設定
  openGraph: {
    title: "ToreMock - オンライン英語模試",
    description: "高品質な英語のオンライン模擬試験を提供するプラットフォーム。TOEIC®/TOEFL®/英検®の模試が1回無料で受験可能。",
    url: "https://toremock.com", // サイトのURL
    siteName: "ToreMock",
    images: [
      {
        url: '/og-image.png', 
        width: 1200,
        height: 630,
        alt: 'ToreMock OGP Image',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  // Twitterカード設定
  twitter: {
    card: 'summary_large_image',
    title: "ToreMock - オンライン英語模試",
    description: "高品質な英語のオンライン模擬試験を提供するプラットフォーム。",
    site: '@TMock', 
    images: ['/og-image.png'], 
  },
  // アイコン設定
  icons: {
    icon: '/favicon.ico', // /public/favicon.ico
    shortcut: '/favicon-16x16.png', // /public/favicon-16x16.png
    apple: '/apple-touch-icon.png', // /public/apple-touch-icon.png
  },
  // Google Search Consoleの設定
  other: {
    "google-site-verification": "EDRe6uY-RLnEEWm6nU-tkniIUg-JK2wGVR7VwtZy74s"
  },
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteUrl} />
        <meta name="robots" content="index, follow" />
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
