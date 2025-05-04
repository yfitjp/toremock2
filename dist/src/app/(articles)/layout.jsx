"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamic = exports.metadata = void 0;
exports.default = ArticlesLayout;
const google_1 = require("next/font/google");
require("../globals.css");
const link_1 = __importDefault(require("next/link"));
const image_1 = __importDefault(require("next/image"));
const ArticlesHeader_1 = __importDefault(require("./components/ArticlesHeader"));
// Toremockとは異なるフォントを使用
const notoSans = (0, google_1.Noto_Sans_JP)({
    weight: ['400', '500', '700'],
    subsets: ["latin"]
});
exports.metadata = {
    title: "トレモック情報局 | 英語力向上のための総合情報ポータル",
    description: "TOEIC、TOEFL、英検など英語試験対策や英語学習に関する情報を提供するトレモックの総合情報サイトです。",
    // ToreMock本体のfaviconを使用
    icons: {
        icon: '/favicon.ico',
    },
};
// これがこのレイアウトを独立させる重要な設定
exports.dynamic = 'force-dynamic';
function ArticlesLayout({ children, }) {
    const currentYear = new Date().getFullYear();
    return (<html lang="ja">
      <head>
        {/* Next.jsが自動的にメタデータやタイトルを挿入 */}
      </head>
      <body className={`${notoSans.className} bg-slate-50`} style={{ margin: 0, padding: 0 }}>
        <div className="flex flex-col min-h-screen">
          {/* トップバー */}
          <div className="bg-slate-900 text-slate-300 py-2 text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div>
                英語テストの最新情報を毎日更新中！
              </div>
              <div className="flex items-center space-x-4">
                <a href="https://x.com/TMock" className="hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/toremock/" className="hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* ヘッダーコンポーネントを使用 */}
          <ArticlesHeader_1.default />
          
          {/* パンくずリスト */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <nav className="flex text-sm text-slate-500">
                <link_1.default href="/articles" className="hover:text-slate-700">ホーム</link_1.default>
                <span className="mx-2">/</span>
                <span className="text-slate-700">記事一覧</span>
              </nav>
            </div>
          </div>
          
          <main className="flex-grow py-6">
            {children}
          </main>
          
          {/* フッター */}
          <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center mb-4">
                    <image_1.default src="/toremock-logo.png" alt="トレモック情報局 ロゴ" width={36} height={36} className="mr-3"/>
                    <h3 className="text-xl font-bold">トレモック情報局</h3>
                  </div>
                  <p className="text-slate-300 text-sm mb-6">
                    TOEIC、TOEFL、英検などの英語試験対策から効率的な学習方法まで、
                    英語テスト対策に役立つ情報を提供しています。ToreMockで本格的な模試も提供中！
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://x.com/TMock" className="text-slate-300 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </a>
                    <a href="https://www.instagram.com/toremock/" className="text-slate-300 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">コンテンツ</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li><link_1.default href="/articles" className="hover:text-white transition">トップページ</link_1.default></li>
                    <li><link_1.default href="/articles?category=TOEIC" className="hover:text-white transition">TOEIC対策</link_1.default></li>
                    <li><link_1.default href="/articles?category=TOEFL" className="hover:text-white transition">TOEFL対策</link_1.default></li>
                    <li><link_1.default href="/articles?category=英語試験" className="hover:text-white transition">英検・その他</link_1.default></li>
                    <li><link_1.default href="/articles?category=学習法" className="hover:text-white transition">学習法</link_1.default></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">関連サイト</h3>
                  <ul className="space-y-2 text-slate-300 text-sm">
                    <li><link_1.default href="/" className="hover:text-white transition">ToreMock 公式サイト</link_1.default></li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold mb-4 mt-6">お問い合わせ</h3>
                  <p className="text-slate-300 text-sm">
                    <a href="mailto:contact.yfit@gmail.com" className="text-slate-300 hover:text-white transition">contact.yfit@gmail.com</a>
                  </p>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-12 pt-8 text-center">
                <p className="text-slate-400 text-sm">
                  © {currentYear} トレモック情報局 All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>);
}
