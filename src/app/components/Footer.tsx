'use client';

import Link from 'next/link';
import { Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              ToreMock
            </h2>
            <p className="text-gray-300 text-sm mb-4 transform hover:scale-105 transition-all duration-200">
              高品質なオンライン模擬試験プラットフォーム。あなたの目標達成をサポートします。
            </p>
            <div className="mt-5">
              <div className="flex space-x-4 mb-3">
                <a 
                  href="https://x.com/TMock" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                  aria-label="X (Twitter)"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="https://instagram.com/toremock" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-pink-400 transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
              <a 
                href="https://toremock.com/articles" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-300 transition-colors duration-200 text-sm flex items-center group"
              >
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                  トレモック情報局
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">サービス</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/exams" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    模試一覧
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/mypage" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    マイページ
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/guide" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    ご利用ガイド
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">サポート</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    お問い合わせ
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    よくある質問
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-100">法的情報</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    利用規約
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    プライバシーポリシー
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal" 
                  className="text-gray-300 hover:text-white transition-all duration-200 flex items-center group"
                >
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                    特定商取引法に基づく表記
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300 hover:text-gray-100 transition-colors duration-200">
            © {new Date().getFullYear()} ToreMock. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 