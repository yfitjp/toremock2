'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';

// 記事データ型定義
type CategoryKey = 'TOEIC' | 'TOEFL' | '英語試験' | '学習法';

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

// 記事データ
const articles: Record<string, Article> = {
  'toeic-mocktest-comparison': {
    id: 'toeic-mocktest-comparison',
    title: 'TOEIC模試を安く受けたい！人気サイトの料金と特徴を徹底比較',
    description: 'コスパ最強のTOEIC模試サービスを比較。高品質で低価格の模試はどれ？料金、特徴、メリットを詳しく解説します。',
    category: 'TOEIC',
    date: '2023年4月1日',
    readTime: '8分',
    imageSrc: '/images/toeic-comparison.jpg',
    tags: ['TOEIC', '模試', '比較'],
    featured: true
  },
  'toefl-speaking-services': {
    id: 'toefl-speaking-services',
    title: 'TOEFLスピーキング対策どこでする？安くて質の高いサービスはコレ',
    description: 'TOEFLスピーキングを効率的に対策するためのサービスを比較。コストパフォーマンスに優れたサービスを見つけましょう。',
    category: 'TOEFL',
    date: '2023年4月5日',
    readTime: '10分',
    imageSrc: '/images/toefl-speaking.jpg',
    tags: ['TOEFL', 'スピーキング', 'オンライン学習'],
    popular: true
  },
  'toeic-beginners-guide': {
    id: 'toeic-beginners-guide',
    title: 'TOEIC初心者向け勉強法5選！料金と使いやすさで選ぶなら？',
    description: 'TOEIC初心者におすすめの勉強法を紹介。自分に合った方法で効率的にスコアアップを目指しましょう。',
    category: 'TOEIC',
    date: '2023年4月10日',
    readTime: '12分',
    imageSrc: '/images/toeic-beginners.jpg',
    tags: ['TOEIC', '初心者', '勉強法'],
    popular: true
  }
};

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

// 関連記事生成関数
const getRelatedArticles = (current: Article): Article[] => {
  return Object.values(articles)
    .filter(article => article.id !== current.id)
    .filter(article => 
      article.category === current.category || 
      article.tags.some(tag => current.tags.includes(tag))
    )
    .slice(0, 2);
};

export default function ArticleDetail() {
  const params = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    const currentArticle = articles[params.id];
    if (!currentArticle) {
      notFound();
      return;
    }
    setArticle(currentArticle);
    setRelatedArticles(getRelatedArticles(currentArticle));
  }, [params.id]);
  
  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* メインコンテンツエリア */}
        <div className="lg:col-span-8">
          {/* 記事ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <Link href={`/articles?category=${article.category}`} className="flex items-center text-slate-700 hover:text-slate-900">
                {categoryInfo[article.category].icon}
                <span className="font-medium ml-1">{article.category}</span>
              </Link>
              <span className="mx-2">•</span>
              <time dateTime={article.date}>{article.date}</time>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>{article.readTime}</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-slate-900 mb-6">{article.title}</h1>
            
            {/* タグ */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* サムネイル画像プレースホルダー */}
            <div className="relative h-64 sm:h-80 bg-slate-200 rounded-xl mb-8 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-slate-400" style={{ transform: 'scale(2)' }}>
                  {categoryInfo[article.category].icon}
                </div>
              </div>
            </div>
          </div>
          
          {/* 記事本文 */}
          <div className="prose max-w-none mb-12">
            <p className="lead text-lg text-slate-700 mb-6">
              {article.description}
            </p>
            
            {article.id === 'toeic-mocktest-comparison' && (
              <>
                <p className="mb-6">
                  TOEIC対策には実践的な模擬試験が欠かせませんが、模試を繰り返し受けるとなると費用も馬鹿になりません。
                  本記事では、コストパフォーマンスに優れたTOEIC模試サービスを徹底比較し、あなたに最適なサービスを見つける手助けをします。
                </p>
                
                <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">TOEIC模試のメリットと選び方</h2>
                
                <p className="mb-4">
                  TOEIC模試を定期的に受けることには、以下のようなメリットがあります：
                </p>
                
                <ul className="list-disc pl-6 mb-6">
                  <li className="mb-2">本番と同じ形式・時間配分で実践的な演習ができる</li>
                  <li className="mb-2">自分の現在のレベルを客観的に把握できる</li>
                  <li className="mb-2">弱点を分析して効率的な学習計画が立てられる</li>
                  <li className="mb-2">本番の緊張感に慣れることができる</li>
                </ul>
                
                <div className="bg-slate-50 border-l-4 border-green-500 p-4 my-6">
                  <p className="text-slate-700">
                    <strong>ポイント：</strong> 模試は単に受けるだけでなく、結果をしっかり分析して次の学習に活かすことが重要です。
                    解答解説をしっかり読み、間違えた問題の理由を理解しましょう。
                  </p>
                </div>
                
                <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">おすすめの模試サービス比較</h2>
                
                {/* ToreMockの紹介 */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden mb-8">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">ToreMock</h3>
                    <div className="flex items-center mb-4">
                      <span className="text-amber-500 flex">
                        {'★★★★★'.split('').map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </span>
                      <span className="ml-2 text-slate-600">4.8/5.0</span>
                    </div>
                    <p className="text-slate-700 mb-4">
                      コストパフォーマンスに優れた模試サービス。無料プランから利用でき、プレミアム会員なら月額制で
                      全ての模試に無制限アクセス可能。解説が非常に分かりやすく、初心者にもおすすめです。
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2">主な特徴</h4>
                        <ul className="list-disc pl-5 text-slate-700 space-y-1">
                          <li>本番と同じ形式の問題</li>
                          <li>詳細な分析レポート</li>
                          <li>リスニング・リーディング両方対応</li>
                          <li>プレミアム会員なら全ての模試に無制限アクセス可能</li>
                        </ul>
                      </div>
                      <div>
                        <div className="mb-3">
                          <h4 className="font-medium text-green-700 mb-2">メリット</h4>
                          <ul className="list-disc pl-5 text-slate-700 space-y-1">
                            <li>業界最安値の価格設定</li>
                            <li>オンライン専用で時間や場所を選ばない</li>
                            <li>解説が非常に分かりやすい</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-700 mb-2">デメリット</h4>
                          <ul className="list-disc pl-5 text-slate-700 space-y-1">
                            <li>新規サービスのため問題数が他社より少ない（随時追加中）</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <Link href="/" 
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      ToreMockを試してみる
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* CTA セクション */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl p-6 md:p-8 shadow-lg text-white mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4">この記事は参考になりましたか？</h2>
              <p className="mb-6 text-slate-300">
                英語テスト情報局が提携する「ToreMock」では、{article.category}の本番さながらの模試を提供しています。
                リアルな形式で実力を測り、効率的に学習を進めましょう。
              </p>
              <Link 
                href={`/?category=${article.category}`} 
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
              >
                <span>{article.category}の模試を受ける</span>
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* サイドバーエリア */}
        <aside className="lg:col-span-4 space-y-8">
          {/* 関連記事 */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">関連記事</h3>
            <ul className="space-y-4">
              {relatedArticles.map(relArticle => (
                <li key={relArticle.id}>
                  <Link href={`/articles/${relArticle.id}`} className="group block">
                    <div className="flex items-start space-x-3">
                      <div className="relative h-16 w-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                          {categoryInfo[relArticle.category].icon}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 group-hover:text-slate-700">{relArticle.category}</span>
                        <h4 className="text-sm font-medium text-slate-800 group-hover:text-green-600 transition-colors line-clamp-2">
                          {relArticle.title}
                        </h4>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
              {relatedArticles.length === 0 && (
                <p className="text-sm text-slate-500">関連記事はありません。</p>
              )}
            </ul>
          </div>

          {/* 関連模試へのリンク */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">ToreMockで実力試し！</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-green-600 scale-150">
                {categoryInfo[article.category].icon}
              </div>
              <p className="text-sm text-slate-700">
                この記事のカテゴリ「{article.category}」に関連する模試に挑戦しませんか？
              </p>
            </div>
            <Link 
              href={`/?category=${article.category}`} 
              className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {article.category} の模試を見る
            </Link>
          </div>

          {/* シェアボタン */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">記事をシェア</h3>
            <div className="flex space-x-3">
              {/* Twitter */} 
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`} 
                 target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center w-10 h-10 rounded-full bg-sky-500 hover:bg-sky-600 text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                 target="_blank" rel="noopener noreferrer" 
                 className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              {/* 他のSNSボタンも追加可能 */}
            </div>
          </div>

          {/* 目次 (将来的な実装) */}
          {/* 
          <div className="sticky top-24 bg-white p-6 rounded-lg shadow-md border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">目次</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="#section1" className="hover:text-green-600">セクション1</a></li>
              <li><a href="#section2" className="hover:text-green-600">セクション2</a></li>
            </ul>
          </div>
          */}
        </aside>
      </div>
    </div>
  );
} 