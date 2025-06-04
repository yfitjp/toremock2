'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
// Import data and types from the central source
import { getSortedArticlesData, ArticleData, CategoryKey } from '../lib/article-data';

// Remove local Article type definition
// type Article = {
//   id: string;
//   title: string;
//   description: string;
//   category: CategoryKey;
//   date: string;
//   readTime: string;
//   imageSrc: string;
//   tags: string[];
//   featured?: boolean;
//   popular?: boolean;
//   comingSoon?: boolean;
// };

// Remove local CategoryKey type definition (imported now)
// type CategoryKey = 'TOEIC' | 'TOEFL' | '英語試験' | '学習法';

// Remove local articles array definition
// const articles: Article[] = [
//   // ... data was here ...
// ];

// カテゴリー情報 (CategoryKey is now imported)
const categoryInfo: Record<CategoryKey, { description: string; icon: JSX.Element }> = {
  'TOEIC': {
    description: 'TOEIC試験対策や学習方法、効率的なスコアアップ戦略などを紹介します。',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  'TOEFL': {
    description: 'TOEFL iBTの各セクション対策や、効果的な学習アプローチを解説します。',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  '英語試験': {
    description: '英検やIELTSなど、様々な英語資格試験の特徴や対策法を紹介します。',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  '学習法': {
    description: '効率的な英語学習方法や、モチベーション維持のコツなどを解説します。',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  }
};

export default function ArticlesHomePage() {
  // Fetch all articles from the central source
  const allArticles = getSortedArticlesData(); // Use the imported function

  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // ★ Current page state

  const ITEMS_PER_PAGE = 30; // ★ Articles per page

  // URLからカテゴリー、検索クエリ、ページ番号を取得
  useEffect(() => {
    const category = searchParams.get('category') as CategoryKey | null;
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1', 10); // ★ Get page from URL
    console.log('[Articles Page] useEffect - Category:', category, 'Query:', query, 'Page:', page);

    if (category && Object.keys(categoryInfo).includes(category)) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setSearchTerm(query);
    setCurrentPage(isNaN(page) || page < 1 ? 1 : page); // ★ Set current page, default to 1 if invalid
    
  }, [searchParams]);

  // カテゴリーまたはページ変更時にURLも更新 (検索クエリも考慮)
  const updateUrl = (category: CategoryKey | null, page: number, currentQuery: string) => {
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    if (currentQuery) {
      params.set('q', currentQuery);
    }
    if (page > 1) { // ★ Add page to URL only if it's not the first page
      params.set('page', page.toString());
    }
    const newUrl = `/articles?${params.toString()}`;
    console.log('[Articles Page] updateUrl - New URL:', newUrl);
    router.push(newUrl, { scroll: false }); // ★ Add scroll: false
  };
  
  const handleCategoryChange = (category: CategoryKey | null) => {
    const currentQuery = searchParams.get('q') || '';
    // Reset to page 1 when category changes
    updateUrl(category, 1, currentQuery);
  };

  const handlePageChange = (newPage: number) => { // ★ Page change handler
    const currentQuery = searchParams.get('q') || '';
    const currentCategory = selectedCategory;
    updateUrl(currentCategory, newPage, currentQuery);
  };
  
  // カテゴリーと検索クエリでフィルタリング
  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const searchTermLower = searchTerm.toLowerCase(); // 検索語を小文字に変換
    const matchesSearch = searchTerm
      ? article.title.toLowerCase().includes(searchTermLower) ||
        article.description.toLowerCase().includes(searchTermLower) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTermLower)))
      : true;
    // console.log(`[Articles Page] Filtering ${article.id}: Cat=${matchesCategory}, Search=${matchesSearch}`); // 個別デバッグ用
    return matchesCategory && matchesSearch && !article.comingSoon;
  });
  console.log('[Articles Page] Filtered Articles Count:', filteredArticles.length, 'Category:', selectedCategory, 'SearchTerm:', searchTerm);
    
  // 利用可能なカテゴリーを抽出（すでに型定義されたものに限定）
  const categories = Array.from(new Set(allArticles.map(article => article.category)));
  
  // 注目記事を抽出
  const featuredArticles = allArticles.filter(article => article.featured);
  
  // 人気記事を抽出
  const popularArticles = allArticles.filter(article => article.popular);

  // Calculate total pages and current articles to display
  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);
  console.log(`[Articles Page] Pagination - Current: ${currentPage}, Total: ${totalPages}, Displaying: ${currentArticles.length}`);

  // Determine the title for the article list section
  let listTitle = '記事一覧';
  if (selectedCategory && searchTerm) {
    listTitle = `${selectedCategory} の記事一覧（「${searchTerm}」の検索結果）`;
  } else if (selectedCategory) {
    listTitle = `${selectedCategory} の記事一覧`;
  } else if (searchTerm) {
    listTitle = `「${searchTerm}」の検索結果`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Sections to show only when NO category is selected AND NO search is performed */}
      {selectedCategory === null && searchTerm === '' && (
        <>
          {/* ヒーローセクション */}
          <div className="mb-16">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-xl">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4 self-start">
                    英語学習・テスト対策の総合情報
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    確実なスコアアップを<br />サポートする情報ポータル
                  </h1>
                  <p className="text-slate-300 mb-6 text-lg">
                    TOEIC、TOEFL、英検などの試験対策や効率的な学習法を解説。
                    英語テスト攻略に必要な情報を提供します。
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link href="/articles/toeic-mocktest-comparison" 
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors">
                      人気記事を読む
                    </Link>
                    <Link href="/"
                      className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-800 font-medium rounded-lg shadow-md transition-colors">
                      ToreMockで模試を受ける
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block relative h-full min-h-[300px] bg-slate-700">
                  <Image 
                    src="/images/toremock-hero.jpg" 
                    alt="英語学習をしている女性" 
                    fill 
                    className="object-cover" 
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* カテゴリーセクション */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              <span className="inline-block w-3 h-8 bg-blue-600 rounded-full mr-3"></span>
              カテゴリーから探す
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map(category => (
                <div 
                  key={category} 
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-slate-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-3">{categoryInfo[category]?.icon || '📄'}</div>
                    <h3 className="text-xl font-bold text-slate-800">{category}</h3>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{categoryInfo[category]?.description || '関連する記事を探す'}</p>
                  <button
                    onClick={() => handleCategoryChange(category)}
                    className="w-full py-2 px-4 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm text-center"
                  >
                    {category}の記事を見る
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* 人気記事 */}
          {popularArticles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                <span className="inline-block w-3 h-8 bg-blue-600 rounded-full mr-3"></span>
                人気の記事
              </h2>
              
              <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
                {popularArticles.map((article, index) => (
                  <div 
                    key={article.id}
                    className={`flex flex-col md:flex-row ${index < popularArticles.length - 1 ? 'border-b border-slate-200' : ''}`}
                  >
                    <div className="relative md:w-1/4 h-40 md:h-auto bg-slate-100 flex-shrink-0"> 
                      <Image 
                        src={article.imageSrc || '/images/placeholder.jpg'}
                        alt={article.title}
                        fill 
                        className="object-cover" 
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    </div>
                    <div className="p-6 md:w-3/4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                          {article.category}
                        </span>
                        <div className="flex items-center text-slate-500 text-sm">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {article.readTime}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {article.description}
                      </p>
                      <div className="flex flex-wrap justify-between items-center">
                        <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                          {article.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <Link
                          href={`/articles/${article.id}`}
                          className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-medium"
                        >
                          記事を読む
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
      
      {/* フィルター付き記事一覧 (Always visible, but title changes) */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            <span className="inline-block w-3 h-8 bg-blue-600 rounded-full mr-3"></span>
            {listTitle}
          </h2>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-slate-700">並び替え:</span>
            <select className="bg-white border border-slate-300 rounded-md py-1 px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option>新着順</option>
              <option>人気順</option>
            </select>
          </div>
        </div>
        
        {/* カテゴリーフィルター (Always visible) */}
        <div className="flex flex-wrap justify-center mb-10">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`m-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === null 
                ? 'bg-slate-800 text-white' 
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            すべて
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`m-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === category 
                  ? 'bg-slate-800 text-white' 
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* 記事一覧 グリッド (Always uses currentArticles) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentArticles.length > 0 ? ( // ★ Change to currentArticles
            currentArticles.map(article => ( // ★ Change to currentArticles
              <div 
                key={article.id} 
                className={`border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white`}
              >
                {/* 画像部分 - Adjust aspect ratio here: remove h-48, add aspect-[3/2] */}
                <div className="relative bg-slate-200 aspect-[3/2]">
                  <Image 
                    src={article.imageSrc || '/images/placeholder.jpg'}
                    alt={article.title}
                    fill 
                    className="object-cover" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {article.featured && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                      注目記事
                    </div>
                  )}
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  {/* 上部コンテンツエリア（タイトル、説明など） */}
                  <div>
                    <div className="flex justify-between items-center text-sm text-slate-500 mb-3">
                      <span className="font-medium text-slate-700">{article.category}</span>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-slate-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                  
                  {/* 下部コンテンツエリア（タグ、ボタン）。mt-autoで親要素の下部にプッシュ */}
                  <div className="mt-auto">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    <Link
                      href={`/articles/${article.id}`}
                      className="block text-center py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-700 transition-colors"
                    >
                      記事を読む
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
              <p className="text-xl text-slate-600 mb-4">
                {searchTerm 
                  ? `「${searchTerm}」に一致する記事は見つかりませんでした。` 
                  : '該当する記事は見つかりませんでした。'}
              </p>
              <button 
                onClick={() => router.push('/articles')} 
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors"
              >
                記事一覧に戻る
              </button>
            </div>
          )}
        </div>
        
        {/* ページネーション */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium border border-slate-300 rounded-l-md ${currentPage === 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                前へ
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Show first page, last page, and pages around current page
                const showPage = 
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 2 && pageNum <= currentPage + 2) ||
                  (currentPage <= 3 && pageNum <= 5) || // show first 5 if current is 1,2,3
                  (currentPage >= totalPages - 2 && pageNum >= totalPages - 4); // show last 5 if current is near end

                const showEllipsisBefore = pageNum === currentPage - 3 && currentPage > 4 && totalPages > 7;
                const showEllipsisAfter = pageNum === currentPage + 3 && currentPage < totalPages - 3 && totalPages > 7;

                if (showEllipsisBefore) {
                  return <span key={`ellipsis-before-${pageNum}`} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-y border-slate-300">...</span>;
                }
                if (showPage) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 text-sm font-medium border-y border-slate-300 ${currentPage === pageNum ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-300'}`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (showEllipsisAfter) {
                  return <span key={`ellipsis-after-${pageNum}`} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border-y border-slate-300">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium border border-slate-300 rounded-r-md ${currentPage === totalPages ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* CTA セクション (Show always or conditionally based on selectedCategory) */}
      {/* Option 1: Show always */}
      <div className="mb-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl p-8 shadow-lg text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">模試で英語力をチェックしませんか？</h2>
          <p className="mb-6 text-slate-300">
            ToreMockでは、TOEIC、TOEFL、英検の本番さながらの模試を提供しています。
            リアルな形式で実力を測り、効率的に学習を進めましょう。
          </p>
          <Link 
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors"
          >
            模試を受けてみる
          </Link>
        </div>
      </div>
      
      {/* ニュースレター登録 (Show always or conditionally) */}
      {/* Option 1: Show always */}
      <div className="mb-16 bg-white rounded-xl p-8 shadow-md border border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <svg className="h-8 w-8 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">英語テスト対策に役立つ情報を定期的にお届けします</h2>
          <p className="text-slate-600 mb-6">
            最新の試験傾向や効果的な対策法など、英語テスト攻略に役立つ情報をメールでお届けします。
            無料でご登録いただけます。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="メールアドレスを入力"
              className="flex-grow px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <button className="px-6 py-2 bg-slate-800 text-white font-medium rounded-md hover:bg-slate-700 transition-colors">
              登録する
            </button>
          </div>
          
          <p className="text-xs text-slate-500 mt-3">
            ※ご登録いただいたメールアドレスは、ニュースレターの配信にのみ使用します。
          </p>
        </div>
      </div>

    </div>
  );
} 