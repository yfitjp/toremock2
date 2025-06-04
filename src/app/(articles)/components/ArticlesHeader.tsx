'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

export default function ArticlesHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/articles?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* ロゴとタイトル */}
          <div className="flex items-center justify-between">
            <Link href="/articles" className="flex items-center no-underline">
              <Image 
                src="/toremock-logo.png"
                alt="トレモック情報局 ロゴ" 
                width={36} 
                height={36} 
                className="mr-3"
              />
              <h1 className="text-2xl font-bold text-blue-600">トレモック<span className="text-slate-800">情報局</span></h1>
            </Link>
            {/* モバイルメニューボタン */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-slate-500"
                aria-label="メニューを開閉する"
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* 検索ボックス (formでラップ) */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64 lg:w-80">
            <input 
              type="text" 
              placeholder="記事を検索..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-slate-700 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
            />
            <div className="absolute left-3 top-2.5 text-slate-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </form>
          
          {/* 模試サイトリンク */}
          <div className="hidden md:block">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>無料で模試を受ける</span>
              <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {/* ナビゲーション (デスクトップ) */}
      <nav className="hidden md:block bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between">
            <div className="flex space-x-1">
              <Link href="/articles" className="py-3 px-4 hover:bg-slate-700 rounded-md transition-colors">ホーム</Link>
              <Link href="/articles?category=TOEIC" className="py-3 px-4 hover:bg-slate-700 rounded-md transition-colors">TOEIC</Link>
              <Link href="/articles?category=TOEFL" className="py-3 px-4 hover:bg-slate-700 rounded-md transition-colors">TOEFL</Link>
              <Link href="/articles?category=英語試験" className="py-3 px-4 hover:bg-slate-700 rounded-md transition-colors">英検・その他</Link>
              <Link href="/articles?category=学習法" className="py-3 px-4 hover:bg-slate-700 rounded-md transition-colors">学習法</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-slate-800 text-white absolute top-full left-0 right-0 shadow-lg z-10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/articles" className="block py-2 px-3 hover:bg-slate-700 rounded-md transition-colors" onClick={toggleMobileMenu}>ホーム</Link>
            <Link href="/articles?category=TOEIC" className="block py-2 px-3 hover:bg-slate-700 rounded-md transition-colors" onClick={toggleMobileMenu}>TOEIC</Link>
            <Link href="/articles?category=TOEFL" className="block py-2 px-3 hover:bg-slate-700 rounded-md transition-colors" onClick={toggleMobileMenu}>TOEFL</Link>
            <Link href="/articles?category=英語試験" className="block py-2 px-3 hover:bg-slate-700 rounded-md transition-colors" onClick={toggleMobileMenu}>英検・その他</Link>
            <Link href="/articles?category=学習法" className="block py-2 px-3 hover:bg-slate-700 rounded-md transition-colors" onClick={toggleMobileMenu}>学習法</Link>
            <div className="border-t border-slate-700 pt-3 mt-2">
              <Link 
                href="/" 
                className="block w-full text-center py-2 px-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                onClick={toggleMobileMenu}
              >
                無料で模試を受ける
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
} 