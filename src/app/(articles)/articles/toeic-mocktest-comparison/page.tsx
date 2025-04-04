'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const sites = [
  {
    name: "ToreMock",
    price: "無料〜2,000円",
    features: [
      "本番と同じ形式の問題",
      "詳細な分析レポート",
      "リスニング・リーディング両方対応",
      "プレミアム会員なら全ての模試に無制限アクセス可能"
    ],
    pros: [
      "業界最安値の価格設定",
      "オンライン専用で時間や場所を選ばない",
      "解説が非常に分かりやすい",
      "プレミアム会員なら月額制で大幅にお得"
    ],
    cons: [
      "新規サービスのため問題数が他社より少ない（随時追加中）"
    ],
    rating: 4.8,
    url: "https://toremock.com",
    urlText: "公式サイトを見る"
  },
  {
    name: "模試サービスA",
    price: "1回3,500円〜",
    features: [
      "TOEIC公式問題集に準拠",
      "スコア予測",
      "苦手分野の分析"
    ],
    pros: [
      "長年の実績あり",
      "問題のクオリティが高い"
    ],
    cons: [
      "価格が高め",
      "オンライン受験のUIが使いにくい",
      "解説が物足りない"
    ],
    rating: 3.7,
    url: "#",
    urlText: "詳細を見る"
  },
  {
    name: "模試サービスB",
    price: "3,000円〜/回",
    features: [
      "スマホアプリ対応",
      "パート別練習可能",
      "弱点分析レポート"
    ],
    pros: [
      "スマホで手軽に受験できる",
      "問題数が多い"
    ],
    cons: [
      "本番の試験形式と若干異なる",
      "リスニング問題の音質に難あり",
      "料金体系がわかりにくい"
    ],
    rating: 3.5,
    url: "#",
    urlText: "詳細を見る"
  }
];

export default function ComparisonArticle() {
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');

  // サイトを評価順または価格順でソート
  const sortedSites = [...sites].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      // 価格は文字列なので、この例では固定順
      const priceOrder = { "ToreMock": 1, "模試サービスB": 2, "模試サービスA": 3 };
      return priceOrder[a.name as keyof typeof priceOrder] - priceOrder[b.name as keyof typeof priceOrder];
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">TOEIC模試を安く受けたい！人気サイトの料金と特徴を徹底比較</h1>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 mb-4">
          TOEIC対策には実践的な模擬試験が欠かせませんが、模試を繰り返し受けるとなると費用も馬鹿になりません。
          本記事では、コストパフォーマンスに優れたTOEIC模試サービスを徹底比較し、あなたに最適なサービスを見つける手助けをします。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">TOEIC模試のメリットと選び方</h2>
        
        <p className="mb-4">
          TOEIC模試を定期的に受けることには、以下のようなメリットがあります：
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">本番と同じ形式・時間配分で実践的な演習ができる</li>
          <li className="mb-2">自分の現在のレベルを客観的に把握できる</li>
          <li className="mb-2">弱点を分析して効率的な学習計画が立てられる</li>
          <li className="mb-2">本番の緊張感に慣れることができる</li>
        </ul>
        
        <p className="mb-4">
          模試サービスを選ぶ際のポイントは以下の通りです：
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>価格：</strong>継続して利用するならコストパフォーマンスは重要</li>
          <li className="mb-2"><strong>問題の質：</strong>本番に近い難易度と形式かどうか</li>
          <li className="mb-2"><strong>解説の充実度：</strong>間違えた問題をしっかり理解できるか</li>
          <li className="mb-2"><strong>分析機能：</strong>弱点を的確に把握できる機能があるか</li>
          <li className="mb-2"><strong>受験のしやすさ：</strong>オンラインでいつでも受験できるか</li>
        </ul>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-600">並び替え：</span>
          <button 
            onClick={() => setSortBy('rating')}
            className={`mr-2 px-3 py-1 text-sm rounded-md ${
              sortBy === 'rating' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            評価順
          </button>
          <button 
            onClick={() => setSortBy('price')}
            className={`px-3 py-1 text-sm rounded-md ${
              sortBy === 'price' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            価格順
          </button>
        </div>
      </div>
      
      <div className="space-y-8">
        {sortedSites.map((site, index) => (
          <div key={site.name} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{index + 1}. {site.name}</h3>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(site.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-gray-700">{site.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <span className="font-medium text-gray-700">料金：</span>
                <span className="text-lg font-semibold text-gray-900">{site.price}</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">主な特徴</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {site.features.map((feature, i) => (
                      <li key={i} className="mb-1">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-green-700 mb-2">メリット</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {site.pros.map((pro, i) => (
                        <li key={i} className="mb-1">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-red-700 mb-2">デメリット</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {site.cons.map((con, i) => (
                        <li key={i} className="mb-1">{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                {site.name === "ToreMock" ? (
                  <Link href={site.url} target="_blank" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
                    {site.urlText}
                  </Link>
                ) : (
                  <button className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
                    {site.urlText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 prose max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">TOEIC模試でスコアアップするための活用法</h2>
        
        <p className="mb-4">
          模試を受けただけでは意味がありません。以下のようにして模試を最大限に活用しましょう。
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">1. 複数回受験して傾向をつかむ</h3>
        <p className="mb-4">
          1回だけでなく、定期的に模試を受けて自分の得意・不得意な問題タイプを把握しましょう。
          特に<Link href="/exams" className="text-blue-600 hover:underline">ToreMock</Link>のような
          リーズナブルな価格で何度も受験できるサービスを活用すると効果的です。
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">2. 解説をしっかり読み込む</h3>
        <p className="mb-4">
          間違えた問題だけでなく、正解した問題の解説も読んでください。
          なぜその答えが正解なのか、他の選択肢がなぜ不正解なのかを理解することが重要です。
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3. 弱点を重点的に対策する</h3>
        <p className="mb-4">
          模試の結果から見えてきた弱点に焦点を当てて学習しましょう。
          例えば、Part 5の文法問題が苦手なら、文法書で該当する項目を重点的に学習するといった具合です。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">まとめ：あなたに最適なTOEIC模試サービスは？</h2>
        
        <p className="mb-4">
          今回比較した中で、コストパフォーマンスという点では<Link href="https://toremock.com" className="text-blue-600 hover:underline">ToreMock</Link>が
          圧倒的におすすめです。特にプレミアム会員になれば月額制で全ての模試に無制限にアクセスできるため、
          何度も練習したい方には最適でしょう。
        </p>
        
        <p className="mb-4">
          ただし、自分の学習スタイルや予算に合わせて選ぶことが大切です。無料で試せるサービスも多いので、
          実際に試してみて使いやすさを確認してみることをおすすめします。
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-blue-800">
            <strong>筆者のおすすめ：</strong> まずは<Link href="https://toremock.com" className="text-blue-600 hover:underline font-medium">ToreMock</Link>の無料模試で
            実力を測定してみましょう。使い勝手が良ければ、プレミアム会員になって本格的に対策を始めるのがコスパ最強の方法です。
          </p>
        </div>
      </div>
    </div>
  );
} 