'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

// 記事データ
const articles = [
  {
    id: 'toeic-mocktest-comparison',
    title: 'TOEIC模試を安く受けたい！人気サイトの料金と特徴を徹底比較',
    description: 'コスパ最強のTOEIC模試サービスを比較。高品質で低価格の模試はどれ？料金、特徴、メリットを詳しく解説します。',
    category: 'TOEIC',
    date: '2023年4月1日',
    readTime: '8分',
    imageSrc: '/images/toeic-comparison.jpg',
    tags: ['TOEIC', '模試', '比較']
  },
  {
    id: 'toefl-speaking-services',
    title: 'TOEFLスピーキング対策どこでする？安くて質の高いサービスはコレ',
    description: 'TOEFLスピーキングを効率的に対策するためのサービスを比較。コストパフォーマンスに優れたサービスを見つけましょう。',
    category: 'TOEFL',
    date: '2023年4月5日',
    readTime: '10分',
    imageSrc: '/images/toefl-speaking.jpg',
    tags: ['TOEFL', 'スピーキング', 'オンライン学習']
  },
  {
    id: 'toeic-beginners-guide',
    title: 'TOEIC初心者向け勉強法5選！料金と使いやすさで選ぶなら？',
    description: 'TOEIC初心者におすすめの勉強法を紹介。自分に合った方法で効率的にスコアアップを目指しましょう。',
    category: 'TOEIC',
    date: '2023年4月10日',
    readTime: '12分',
    imageSrc: '/images/toeic-beginners.jpg',
    tags: ['TOEIC', '初心者', '勉強法']
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

export default function ArticlesHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // カテゴリーでフィルタリング
  const filteredArticles = selectedCategory 
    ? articles.filter(article => article.category === selectedCategory)
    : articles;
    
  // 利用可能なカテゴリーを抽出
  const categories = Array.from(new Set(articles.map(article => article.category)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">英語学習情報サイト</h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          TOEIC、TOEFL、英検などの試験対策から効率的な学習方法まで、英語学習に役立つ情報を発信しています。
        </p>
      </div>
      
      {/* カテゴリーフィルター */}
      <div className="flex flex-wrap justify-center mb-10">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`m-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
            selectedCategory === null 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          すべて
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`m-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedCategory === category 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* 記事一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <div 
            key={article.id} 
            className={`border rounded-lg overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg ${
              article.comingSoon ? 'opacity-70' : ''
            }`}
          >
            {/* 画像部分（本番環境では実際の画像を使用） */}
            <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
              <div className="text-blue-500 font-medium text-lg">
                {article.category}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span>{article.date}</span>
                <span className="mx-2">•</span>
                <span>{article.readTime}</span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {article.title}
              </h2>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {article.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
              
              {article.comingSoon ? (
                <div className="text-center py-2 bg-gray-200 text-gray-700 rounded-md font-medium">
                  近日公開予定
                </div>
              ) : (
                <Link
                  href={`/articles/${article.id}`}
                  className="block text-center py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  記事を読む
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* ニュースレター登録 */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">英語学習に役立つ情報を定期的にお届けします</h2>
          <p className="text-gray-700 mb-6">
            最新の学習法や試験対策のコツなど、英語力アップに役立つ情報をメールでお届けします。
            無料でご登録いただけます。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="メールアドレスを入力"
              className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
              登録する
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            ※ご登録いただいたメールアドレスは、ニュースレターの配信にのみ使用します。
          </p>
        </div>
      </div>
    </div>
  );
} 