'use client';

import { useState } from 'react';
import Link from 'next/link';

const services = [
  {
    name: "ToreMock",
    price: "無料〜3,000円/月",
    features: [
      "AIによる発音・文法評価",
      "ネイティブ講師の添削オプション",
      "TOEFL公式に準拠した問題",
      "スマホアプリ対応",
      "24時間いつでも練習可能"
    ],
    pros: [
      "コストパフォーマンスが最高",
      "AIとネイティブのハイブリッド評価で効率的",
      "実際のTOEFL形式に完全対応",
      "何度でも繰り返し練習できる"
    ],
    cons: [
      "サービス開始から日が浅い",
      "他社と比べて教材数が少ない（ただし質は高い）"
    ],
    recommended: "スピーキング対策を手頃な価格で効率的に行いたい人",
    rating: 4.7,
    url: "https://toremock.com/exams"
  },
  {
    name: "英会話スクールA",
    price: "15,000円〜/月",
    features: [
      "マンツーマンレッスン",
      "TOEFL専門講師",
      "オンライン予約システム",
      "スコア保証制度あり"
    ],
    pros: [
      "直接講師からフィードバックがもらえる",
      "質問がその場でできる",
      "モチベーション維持しやすい"
    ],
    cons: [
      "料金が高い",
      "予約が取りにくい時間帯がある",
      "通学の手間がかかる",
      "レッスン回数に制限あり"
    ],
    recommended: "予算に余裕があり、対面指導を重視する人",
    rating: 4.1,
    url: "#"
  },
  {
    name: "オンライン英会話B",
    price: "6,000円〜/月",
    features: [
      "フィリピン人講師とのレッスン",
      "予約は24時間前まで可能",
      "TOEFL対策教材あり"
    ],
    pros: [
      "比較的リーズナブル",
      "スケジュールの融通が利く",
      "自宅から受講可能"
    ],
    cons: [
      "講師の質にばらつきがある",
      "ネイティブ講師は追加料金",
      "TOEFL専門の講師が少ない",
      "通信環境によって品質が変わる"
    ],
    recommended: "毎日短時間でも英語を話す練習をしたい人",
    rating: 3.8,
    url: "#"
  },
  {
    name: "大手予備校C",
    price: "30,000円〜/コース",
    features: [
      "TOEFL専門クラス",
      "少人数制グループレッスン",
      "模擬テスト付き",
      "教材費込み"
    ],
    pros: [
      "体系的なカリキュラム",
      "経験豊富な講師陣",
      "他の受講生と切磋琢磨できる"
    ],
    cons: [
      "非常に高額",
      "固定されたスケジュール",
      "個別フィードバックが少ない",
      "通学が必要"
    ],
    recommended: "本格的に学びたい、予算に余裕がある人",
    rating: 4.0,
    url: "#"
  }
];

export default function TOEFLSpeakingServicesPage() {
  const [sortBy, setSortBy] = useState<'rating' | 'price'>('rating');

  // サービスをソート
  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else {
      // 価格は文字列なので、簡易的に順位で並べ替え
      const priceOrder = { 
        "ToreMock": 1, 
        "オンライン英会話B": 2, 
        "英会話スクールA": 3, 
        "大手予備校C": 4 
      };
      return priceOrder[a.name as keyof typeof priceOrder] - priceOrder[b.name as keyof typeof priceOrder];
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">TOEFLスピーキング対策どこでする？安くて質の高いサービスはコレ</h1>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg text-gray-700 mb-4">
          TOEFLのスピーキングセクションは多くの受験者が苦手とする分野です。効果的な対策には適切なサービスの選択が重要ですが、
          料金や指導方法など比較すべき点は多岐にわたります。この記事では、コストパフォーマンスに優れたTOEFLスピーキング対策サービスを
          徹底比較し、あなたに最適な選択肢を紹介します。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">TOEFLスピーキングセクションの特徴と対策のポイント</h2>
        
        <p className="mb-4">
          TOEFLスピーキングセクションは4つの問題で構成され、独立型タスクと統合型タスクに分かれています。
          試験では準備時間が短く、即座に英語で考えをまとめて話す能力が求められます。
        </p>
        
        <p className="mb-4">
          効果的な対策には以下のポイントが重要です：
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>実践的な練習：</strong>本番と同じ形式・時間制限での反復練習</li>
          <li className="mb-2"><strong>適切なフィードバック：</strong>発音、文法、内容構成に関する具体的な改善点の指摘</li>
          <li className="mb-2"><strong>テンプレートの習得：</strong>スピーキング回答の基本構造を身につける</li>
          <li className="mb-2"><strong>時間管理：</strong>限られた準備時間内で要点をまとめる訓練</li>
        </ul>
        
        <p className="mb-4">
          これらの要素を踏まえ、スピーキング対策サービスを選ぶ際のポイントは以下の通りです：
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>コスト：</strong>長期的に継続できる価格設定か</li>
          <li className="mb-2"><strong>フィードバックの質：</strong>具体的かつ的確な改善点が示されるか</li>
          <li className="mb-2"><strong>練習の頻度：</strong>どれだけ多くの練習機会が得られるか</li>
          <li className="mb-2"><strong>実践性：</strong>実際のTOEFL試験に近い形式で練習できるか</li>
          <li className="mb-2"><strong>利便性：</strong>いつでもどこでも練習できるか</li>
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
        {sortedServices.map((service, index) => (
          <div key={service.name} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{index + 1}. {service.name}</h3>
                <div className="flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-gray-700">{service.rating}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-4">
                <span className="font-medium text-gray-700">料金：</span>
                <span className="text-lg font-semibold text-gray-900">{service.price}</span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">特徴</h4>
                  <ul className="list-disc pl-5 text-gray-700">
                    {service.features.map((feature, i) => (
                      <li key={i} className="mb-1">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <div className="mb-4">
                    <h4 className="font-medium text-green-700 mb-2">メリット</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {service.pros.map((pro, i) => (
                        <li key={i} className="mb-1">{pro}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-red-700 mb-2">デメリット</h4>
                    <ul className="list-disc pl-5 text-gray-700">
                      {service.cons.map((con, i) => (
                        <li key={i} className="mb-1">{con}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">こんな人におすすめ</h4>
                    <p className="text-gray-700">{service.recommended}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                {service.name === "ToreMock" ? (
                  <Link href={service.url} target="_blank" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
                    詳細を見る
                  </Link>
                ) : (
                  <button className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-300">
                    詳細を見る
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 prose max-w-none">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">TOEFLスピーキング対策の効率的な進め方</h2>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">1. 基本的なテンプレートを習得する</h3>
        <p className="mb-4">
          まずは回答の基本構造をマスターしましょう。特に<Link href="https://toremock.com" className="text-blue-600 hover:underline">ToreMock</Link>のようなサービスでは、
          スコアを上げるための効果的なテンプレートが提供されています。これを覚えることで、
          限られた時間内に論理的な回答を組み立てる基礎が身につきます。
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">2. 毎日短時間でも練習を継続する</h3>
        <p className="mb-4">
          スピーキングは継続的な練習が最も重要です。毎日15分でも構わないので、
          定期的に英語を話す習慣をつけましょう。オンラインサービスなら通勤時間や隙間時間も
          有効活用できます。
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">3. 録音して自分の発音をチェックする</h3>
        <p className="mb-4">
          自分の話した英語を録音して聞き直すことで、客観的に発音やイントネーションの
          問題点を把握できます。AIによる評価システムを使えば、さらに効率的に改善点を
          特定できるでしょう。
        </p>
        
        <h3 className="text-xl font-medium text-gray-800 mt-6 mb-3">4. フィードバックを元に集中的に弱点を克服する</h3>
        <p className="mb-4">
          受けたフィードバックを単に見るだけでなく、具体的な改善行動につなげることが大切です。
          例えば、文法の誤りが多い場合は関連する文法項目を復習し、発音に問題がある場合は
          シャドーイングなどの訓練を取り入れましょう。
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">まとめ：あなたに最適なTOEFLスピーキング対策サービスは？</h2>
        
        <p className="mb-4">
          今回比較したサービスの中で、コストパフォーマンスと学習効率の両面から見ると、
          <Link href="https://toremock.com" className="text-blue-600 hover:underline">ToreMock</Link>が最もバランスの取れた選択肢と言えるでしょう。
          特にAIによる即時フィードバックと必要に応じたネイティブ講師の添削を組み合わせることで、
          効率的かつ経済的にスキルアップが可能です。
        </p>
        
        <p className="mb-4">
          ただし、個人の学習スタイルや予算によって最適なサービスは異なります。
          対面でのコミュニケーションを重視する方は英会話スクールも選択肢になりますし、
          すでに基礎力がある方はオンライン英会話で会話量を増やす方法も効果的です。
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-8">
          <p className="text-blue-800">
            <strong>筆者のアドバイス：</strong> TOEFLスピーキング対策は継続性が鍵です。まずは
            <Link href="https://toremock.com" className="text-blue-600 hover:underline font-medium">ToreMock</Link>
            の無料トライアルで自分に合うかどうか試してみることをおすすめします。AIと人間のハイブリッド評価システムは、
            コスト効率と学習効果の両立という点で非常に優れています。
          </p>
        </div>
      </div>
    </div>
  );
} 