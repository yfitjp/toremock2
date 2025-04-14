'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';

// 記事データ
type Article = {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  date: string;
  readTime: string;
  imageSrc: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  comingSoon?: boolean;
};

// カテゴリータイプを定義
type CategoryKey = 'TOEIC' | 'TOEFL' | '英語試験' | '学習法';

// 記事データ
const articles: Article[] = [
  {
    id: 'toeic-mocktest-comparison',
    title: 'TOEIC模試を安く受けたい！人気サイトの料金と特徴を徹底比較',
    description: 'コスパ最強のTOEIC模試サービスを比較。高品質で低価格の模試はどれ？料金、特徴、メリットを詳しく解説します。',
    category: 'TOEIC',
    date: '2025年4月15日',
    readTime: '8分',
    imageSrc: '/images/toeic-comparison.jpg',
    tags: ['TOEIC', '模試', '比較'],
    featured: true
  },
  {
    id: 'toefl-speaking-services',
    title: 'TOEFLスピーキング対策どこでする？安くて質の高いサービスはコレ',
    description: 'TOEFLスピーキングを効率的に対策するためのサービスを比較。コストパフォーマンスに優れたサービスを見つけましょう。',
    category: 'TOEFL',
    date: '2025年4月15日',
    readTime: '10分',
    imageSrc: '/images/toefl-speaking.jpg',
    tags: ['TOEFL', 'スピーキング', 'オンライン学習'],
    popular: true
  },
  {
    id: 'toeic-beginners-guide',
    title: 'TOEIC初心者向け勉強法5選！料金と使いやすさで選ぶなら？',
    description: 'TOEIC初心者におすすめの勉強法を紹介。自分に合った方法で効率的にスコアアップを目指しましょう。',
    category: 'TOEIC',
    date: '2025年4月15日',
    readTime: '12分',
    imageSrc: '/images/toeic-beginners.jpg',
    tags: ['TOEIC', '初心者', '勉強法'],
    popular: true
  },
  {
    id: 'coming-soon-1',
    title: '英検とTOEICはどっちを受ける？違いと選び方を解説',
    description: '英検とTOEICの特徴や違いを比較し、自分の目的に合った試験の選び方を解説します。',
    category: '英語試験',
    date: '近日公開',
    readTime: '準備中',
    imageSrc: '/images/eiken-toeic.jpg',
    tags: ['英検', 'TOEIC', '比較'],
    comingSoon: true
  },
  {
    id: 'coming-soon-2',
    title: 'リーディングが苦手な人必見！速読のコツと練習法',
    description: 'TOEICやTOEFLのリーディングセクションで高得点を取るための速読テクニックと効果的な練習方法を紹介。',
    category: '学習法',
    date: '近日公開',
    readTime: '準備中',
    imageSrc: '/images/reading-skills.jpg',
    tags: ['リーディング', '速読', 'スキルアップ'],
    comingSoon: true
  }
];

// カテゴリー情報
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // URLからカテゴリーと検索クエリを取得
  useEffect(() => {
    const category = searchParams.get('category') as CategoryKey | null;
    const query = searchParams.get('q') || '';
    
    if (category && Object.keys(categoryInfo).includes(category)) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory(null);
    }
    setSearchTerm(query);
    
  }, [searchParams]);
  
  // カテゴリー変更時にURLも更新 (検索クエリも考慮)
  const handleCategoryChange = (category: CategoryKey | null) => {
    const currentQuery = searchParams.get('q') || '';
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    if (currentQuery) {
      params.set('q', currentQuery);
    }
    router.push(`/articles?${params.toString()}`);
  };
  
  // カテゴリーと検索クエリでフィルタリング
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory ? article.category === selectedCategory : true;
    const matchesSearch = searchTerm
      ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.tags && article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      : true;
    return matchesCategory && matchesSearch && !article.comingSoon;
  });
    
  // 利用可能なカテゴリーを抽出（すでに型定義されたものに限定）
  const categories = Array.from(new Set(articles.map(article => article.category)));
  
  // 注目記事を抽出
  const featuredArticles = articles.filter(article => article.featured);
  
  // 人気記事を抽出
  const popularArticles = articles.filter(article => article.popular);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                src="/images/toeic-comparison.jpg" 
                alt="英語学習をしている女性" 
                fill 
                className="object-cover" 
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 注目記事 */}
      {featuredArticles.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              <span className="inline-block w-3 h-8 bg-blue-600 rounded-full mr-3"></span>
              注目の記事
            </h2>
            <Link href="/articles" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
              すべての記事を見る
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.map(article => (
              <div 
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-slate-200"
              >
                <div className="relative h-56 bg-slate-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">{categoryInfo[article.category]?.icon || '📄'}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                      {article.category}
                    </span>
                    <div className="text-slate-500 text-sm">{article.date}</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {article.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {article.tags.map(tag => (
                        <span key={tag} className="text-xs text-slate-500">#{tag}</span>
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
                <div className="relative md:w-1/4 h-40 md:h-auto bg-slate-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">{categoryInfo[article.category]?.icon || '📄'}</div>
                  </div>
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
      
      {/* フィルター付き記事一覧 */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            <span className="inline-block w-3 h-8 bg-blue-600 rounded-full mr-3"></span>
            記事一覧
          </h2>
          <div className="flex items-center space-x-3 text-sm">
            <span className="text-slate-700">並び替え:</span>
            <select className="bg-white border border-slate-300 rounded-md py-1 px-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500">
              <option>新着順</option>
              <option>人気順</option>
            </select>
          </div>
        </div>
        
        {/* カテゴリーフィルター */}
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
        
        {/* 記事一覧 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map(article => (
              <div 
                key={article.id} 
                className={`border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white`}
              >
                {/* 画像部分 */}
                <div className="relative h-48 bg-slate-200">
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
                
                <div className="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <div className="flex justify-between items-center text-sm text-slate-500 mb-3">
                    <span className="font-medium text-slate-700">{article.category}</span>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 flex-grow">
                    {article.title}
                  </h2>
                  
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {article.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    href={`/articles/${article.id}`}
                    className="block text-center py-2 bg-slate-800 text-white rounded-md font-medium hover:bg-slate-700 transition-colors mt-auto"
                  >
                    記事を読む
                  </Link>
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
        <div className="flex justify-center mt-10">
          <div className="inline-flex rounded-md shadow">
            <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-l-md hover:bg-slate-50">
              前へ
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-white bg-slate-800 border border-slate-800">
              1
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50">
              2
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50">
              3
            </a>
            <a href="#" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-r-md hover:bg-slate-50">
              次へ
            </a>
          </div>
        </div>
      </div>
      
      {/* CTA セクション */}
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
      
      {/* ニュースレター登録 */}
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