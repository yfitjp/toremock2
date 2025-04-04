'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

const studyMethods = [
  {
    id: 'online-mock',
    title: 'オンライン模試で実践力を養う',
    description: 'TOEIC形式に慣れるための最も効果的な方法の一つが模擬試験です。特にオンラインで受けられる模試は、いつでもどこでも自分のペースで受験できる利点があります。',
    detail: 'まずは無料で利用できる模試から始めて、本番の形式に慣れましょう。模試を受けた後は必ず解説をしっかり読み、間違えた問題の理由を理解することが大切です。定期的に模試を受けることで、自分の弱点を把握し、効率的に学習を進められます。',
    tips: [
      '月に1〜2回のペースで模試を受けると効果的です',
      '解答後、すぐに解説を読んで理解を深めましょう',
      '弱点パートを特定し、集中的に対策しましょう',
      'スコアの推移をグラフにして、モチベーション維持に役立てましょう'
    ],
    recommendedServices: [
      {
        name: 'ToreMock',
        price: '無料〜2,000円/回',
        features: '詳細な解説、弱点分析レポート付き、リーズナブルな価格',
        url: 'https://toremock.com'
      },
      {
        name: '他社サービスA',
        price: '3,500円/回',
        features: '公式問題に近い難易度',
        url: '#'
      }
    ],
    rating: 4.8
  },
  {
    id: 'vocabulary-app',
    title: '単語アプリで基礎語彙力を強化',
    description: 'TOEIC学習の基礎となるのは語彙力です。スマホの単語学習アプリを活用すれば、通勤時間や隙間時間を有効活用できます。',
    detail: 'TOEIC頻出単語に特化したアプリを選びましょう。スペースド・リピティション（間隔反復）システムを採用したアプリがおすすめです。これは記憶の定着に効果的な方法で、覚えにくい単語を集中的に復習できます。',
    tips: [
      '毎日15〜20分の学習を習慣にしましょう',
      '音声付きのアプリを選び、発音も一緒に覚えましょう',
      '例文と一緒に単語を覚えると定着率が上がります',
      '単語帳は最低でも2周は繰り返しましょう'
    ],
    recommendedServices: [
      {
        name: '単語アプリA',
        price: '基本無料（一部課金）',
        features: 'TOEIC頻出3000語収録、例文音声付き',
        url: '#'
      },
      {
        name: '単語アプリB',
        price: '月額500円',
        features: 'AI学習システム、弱点単語を自動復習',
        url: '#'
      }
    ],
    rating: 4.5
  },
  {
    id: 'listening-practice',
    title: '毎日のリスニング習慣でヒアリング力向上',
    description: 'リスニングは毎日の継続が何よりも重要です。英語のポッドキャストやニュースを活用して、日常的に英語を耳にする環境を作りましょう。',
    detail: '初心者は最初からニュースやポッドキャストは難しいと感じるかもしれません。その場合は、簡単な英語を使用した教材から始めるのがおすすめです。徐々にレベルを上げていくことで、着実にリスニング力を高められます。',
    tips: [
      '通勤・通学時間をリスニング練習に充てましょう',
      '最初は英語のスクリプトを見ながら聞くと効果的です',
      'シャドーイング（音声の後に続けて話す練習）も取り入れましょう',
      '同じ音声を繰り返し聞くことで、細部まで理解できるようになります'
    ],
    recommendedServices: [
      {
        name: 'ニュースサイトA',
        price: '無料',
        features: '初心者向け英語ニュース、スクリプト付き',
        url: '#'
      },
      {
        name: 'ポッドキャストB',
        price: '無料',
        features: 'ビジネス英語に特化、TOEIC頻出表現多数',
        url: '#'
      }
    ],
    rating: 4.2
  },
  {
    id: 'grammar-basics',
    title: '文法の基礎固めで読解力アップ',
    description: 'TOEICのPart 5、6や長文読解の対策には、基本的な文法知識が不可欠です。特に品詞の理解や時制の使い分けなど、基礎的な文法項目から学習を始めましょう。',
    detail: 'TOEIC対策の文法書を1冊選び、最初から順に進めていくのが効果的です。各文法項目を学んだ後は、必ず練習問題を解いて理解度を確認しましょう。暗記だけでなく、実際に使える知識として定着させることが重要です。',
    tips: [
      '文法書は1周目は全体の流れを掴み、2周目以降で詳細を学びましょう',
      'TOEIC頻出の文法項目（時制、仮定法、関係詞など）を重点的に学習しましょう',
      '文法ルールを覚えるだけでなく、例文も一緒に覚えると応用力がつきます',
      '学んだ文法を使って、自分で英文を作る練習も有効です'
    ],
    recommendedServices: [
      {
        name: '文法書A',
        price: '2,200円',
        features: 'TOEIC対策に特化、練習問題多数',
        url: '#'
      },
      {
        name: 'オンライン文法講座B',
        price: '月額1,980円',
        features: '動画解説、演習問題付き',
        url: '#'
      }
    ],
    rating: 4.0
  },
  {
    id: 'part-specific',
    title: 'パート別特化学習で苦手克服',
    description: 'TOEICは7つのパートに分かれています。それぞれのパートには攻略法があり、パート別に特化した学習を行うことで効率的にスコアアップできます。',
    detail: '最初に全パートの基礎を学んだ後、特に苦手なパートや点数を伸ばしやすいパートに焦点を当てた学習が効果的です。例えばPart 7の長文読解が苦手なら、スキミングやスキャニングの技術を集中的に練習しましょう。',
    tips: [
      'まずは各パートの特徴と解き方のコツを理解しましょう',
      '時間配分の練習も重要です（特にリーディングセクション）',
      'Part 1, 2のリスニングは、先読みの技術を磨きましょう',
      'Part 5の文法問題は、選択肢の消去法も使えるようになると効率的です'
    ],
    recommendedServices: [
      {
        name: 'パート別対策本A',
        price: '各1,500円前後',
        features: 'パートごとの攻略法、実践問題付き',
        url: '#'
      },
      {
        name: 'ToreMock パート別演習',
        price: '無料〜1,000円',
        features: 'パートごとに集中練習、詳細な解説付き',
        url: 'https://toremock.com/exams'
      }
    ],
    rating: 4.3
  }
];

export default function TOEICBeginnersGuidePage() {
  const [selectedMethod, setSelectedMethod] = useState(studyMethods[0].id);

  // 現在選択されている学習法
  const currentMethod = studyMethods.find(method => method.id === selectedMethod) || studyMethods[0];
  
  // 評価順にソート
  const sortedMethods = [...studyMethods].sort((a, b) => b.rating - a.rating);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">TOEIC初心者向け勉強法5選！料金と使いやすさで選ぶなら？</h1>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 mb-4">
          TOEICの勉強を始めたばかりの方は、何から手をつければいいか迷いがちです。
          効率的に学習を進めるためには、自分に合った勉強法を見つけることが大切です。
          この記事では、TOEIC初心者におすすめの勉強法を5つ紹介します。それぞれの方法の特徴や料金、使いやすさを比較し、
          あなたに最適な学習法選びをサポートします。
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
          <p className="text-yellow-800">
            <strong>初心者の目標設定：</strong> まずは400〜600点を目指しましょう。基礎固めをしながら徐々にスコアを上げていくことで、
            モチベーションを維持しやすくなります。
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">TOEIC初心者が知っておくべき基本</h2>
        
        <p className="mb-4">
          勉強法を紹介する前に、TOEICテストの基本構成を理解しておきましょう：
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>リスニングセクション（45分）：</strong> Part 1〜4、100問</li>
          <li className="mb-2"><strong>リーディングセクション（75分）：</strong> Part 5〜7、100問</li>
          <li className="mb-2"><strong>満点：</strong> 990点（リスニング495点、リーディング495点）</li>
          <li className="mb-2"><strong>テスト時間：</strong> 約2時間</li>
        </ul>
        
        <p className="mb-4">
          初心者が効率的にスコアアップするためには、基礎力の強化と実践的な演習をバランスよく取り入れることが重要です。
          以下で紹介する5つの勉強法を組み合わせて、自分だけの学習プランを作成してみましょう。
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">おすすめ勉強法5選</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="flex overflow-x-auto scrollbar-hide">
            {studyMethods.map((method, index) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedMethod === method.id 
                    ? 'bg-blue-600 text-white border-b-2 border-blue-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {index + 1}. {method.title}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{currentMethod.title}</h3>
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(currentMethod.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1 text-gray-700">{currentMethod.rating}</span>
              </div>
            </div>
            
            <p className="text-gray-800 font-medium mb-3">{currentMethod.description}</p>
            <p className="text-gray-700 mb-6">{currentMethod.detail}</p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium text-blue-800 mb-2">学習のポイント</h4>
              <ul className="list-disc pl-5 text-blue-800">
                {currentMethod.tips.map((tip, i) => (
                  <li key={i} className="mb-1 text-sm">{tip}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-3">おすすめサービス</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentMethod.recommendedServices.map((service, i) => (
                  <div key={i} className="border rounded-lg p-4 bg-gray-50">
                    <h5 className="font-medium text-gray-900 mb-1">{service.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">料金: {service.price}</p>
                    <p className="text-sm text-gray-700 mb-3">{service.features}</p>
                    {service.name.includes('ToreMock') ? (
                      <Link 
                        href={service.url} 
                        target="_blank"
                        className="text-sm text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded inline-block transition-colors"
                      >
                        サービスを見る
                      </Link>
                    ) : (
                      <button className="text-sm text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded inline-block transition-colors">
                        サービスを見る
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 prose max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">初心者向け TOEIC学習プラン例</h2>
        
        <p className="mb-4">
          上記の勉強法を組み合わせた、初心者向けの3ヶ月学習プランの例を紹介します。
          このプランは1日1時間程度の学習を想定しています。
        </p>
        
        <div className="overflow-hidden shadow-md rounded-lg border border-gray-200 mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期間</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平日の学習</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">週末の学習</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1ヶ月目</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc pl-5">
                    <li>単語学習（20分）</li>
                    <li>リスニング練習（20分）</li>
                    <li>基礎文法（20分）</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc pl-5">
                    <li>ミニ模試（各パート別に練習）</li>
                    <li>弱点分析と復習</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2ヶ月目</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc pl-5">
                    <li>単語学習（15分）</li>
                    <li>パート別練習（30分）</li>
                    <li>長文読解トレーニング（15分）</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc pl-5">
                    <li>ハーフ模試（リスニングorリーディング）</li>
                    <li>弱点分析と復習</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">3ヶ月目</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc pl-5">
                    <li>単語復習（10分）</li>
                    <li>苦手パート集中対策（30分）</li>
                    <li>時間制限付き問題演習（20分）</li>
                  </ul>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc pl-5">
                    <li>完全版模試（フルサイズ）</li>
                    <li>弱点分析と復習</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mb-4">
          効果的な学習には、継続性と適切なフィードバックが重要です。特に初心者は、
          模試などで定期的に自分の実力を確認し、学習方針を調整していくことをおすすめします。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">まとめ：最適な勉強法の選び方</h2>
        
        <p className="mb-4">
          TOEIC学習で最も重要なのは、自分に合った学習法を見つけることです。この記事で紹介した5つの方法から、
          自分の学習スタイルや予算に合ったものを組み合わせて、オリジナルの学習プランを作成しましょう。
        </p>
        
        <p className="mb-4">
          特におすすめなのは、基礎固めとしての単語・文法学習と、実践力を養うための
          <Link href="https://toremock.com" className="text-blue-600 hover:underline">オンライン模試</Link>
          の組み合わせです。基礎と実践をバランスよく取り入れることで、効率的にスコアアップを目指せます。
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-blue-800">
            <strong>最後のアドバイス：</strong> 継続は力なり。短期間で一気に学習するよりも、
            毎日少しずつでも続けることが大切です。まずは
            <Link href="https://toremock.com" className="text-blue-600 hover:underline font-medium">無料で受けられる模試</Link>
            で現在の実力を把握し、具体的な目標設定から始めてみましょう。
          </p>
        </div>
      </div>
    </div>
  );
} 