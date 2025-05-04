"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
exports.default = RootLayout;
const google_1 = require("next/font/google");
require("./globals.css");
// import Navbar from './components/Navbar'; // LayoutSwitcher内で使用するため不要
// import Footer from './components/Footer'; // LayoutSwitcher内で使用するため不要
const AuthContext_1 = require("./contexts/AuthContext");
const ToastProvider_1 = require("./components/ToastProvider");
const LayoutSwitcher_1 = __importDefault(require("./components/LayoutSwitcher")); // LayoutSwitcherをインポート
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
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
    // 他のメタデータ (必要であれば追加)
};
function RootLayout({ children, }) {
    const siteName = "ToreMock";
    const siteUrl = "https://toremock.com";
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
    };
    return (<html lang="ja">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      </head>
      <body className={inter.className}>
        <AuthContext_1.AuthProvider>
          <ToastProvider_1.ToastProvider>
            <LayoutSwitcher_1.default>
              {children}
            </LayoutSwitcher_1.default>
          </ToastProvider_1.ToastProvider>
        </AuthContext_1.AuthProvider>
      </body>
    </html>);
}
