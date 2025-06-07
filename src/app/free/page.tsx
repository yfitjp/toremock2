'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { useEffect, useState } from 'react';
import { SUBSCRIPTION_PLANS } from '@/app/lib/subscriptions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpenCheck, CheckSquare, Presentation, ListChecks, BarChart3, Repeat } from 'lucide-react';
import ComparisonTable from '@/app/components/ComparisonTable';
import { testimonials, Testimonial } from '@/app/lib/testimonial-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "今すぐ無料で受験 | ToreMock",
  description: "ToreMockなら、登録後すぐに無料で英語模試が受けられます。TOEIC®/TOEFL®/英検®形式の問題で、今の実力を1分でチェック。",
  openGraph: {
    title: "今すぐ無料で受験 | ToreMock",
    description: "ToreMockなら、登録後すぐに無料で英語模試が受けられます。TOEIC®/TOEFL®/英検®形式の問題で、今の実力を1分でチェック。",
  },
  twitter: {
    title: "今すぐ無料で受験 | ToreMock",
    description: "ToreMockなら、登録後すぐに無料で英語模試が受けられます。TOEIC®/TOEFL®/英検®形式の問題で、今の実力を1分でチェック。",
  },
};

export default function FreeTrialPage() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  // Calculate average rating and count
  const totalReviews = testimonials.length;
  const averageRating = totalReviews > 0
    ? testimonials.reduce((sum, t) => sum + t.rating, 0) / totalReviews
    : 0;
  const averageRatingRounded = Math.round(averageRating * 10) / 10; // Round to one decimal place

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  className="text-left lg:w-1/2"
                >
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">今すぐ無料で実力チェック</span>
                    <span className="block text-blue-600">1分で結果がわかる英語模試</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                    TOEIC®、TOEFL®、英検®のオンライン模試が【今なら無料】で受験できます。本番さながらの試験で、あなたの現在の実力を正確に把握しませんか？
                  </p>

                  <div className="mt-8 sm:flex">
                    <div className="rounded-md shadow">
                      <Link
                        href="/exams"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                      >
                        無料模試を探す
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      {user ? (
                        <Link
                          href="/mypage"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow"
                        >
                          マイページ
                        </Link>
                      ) : (
                        <Link
                          href="/auth/signup?callbackUrl=/exams"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow"
                        >
                          登録して始める
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="mt-12 lg:mt-0 lg:w-1/2"
                >
                  <div className="relative mx-auto w-full max-w-lg">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <div className="relative">
                      <div className="relative rounded-xl shadow-xl bg-white p-6 border-2 border-white transform hover:scale-105 transition-all duration-300">
                        <div className="absolute -top-4 -right-4 z-50">
                          <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 font-bold px-5 py-2 rounded-lg shadow-lg transform rotate-12 text-base">
                            無料で挑戦！
                          </div>
                        </div>
                        <div className="bg-blue-600 text-white p-5 rounded-lg mb-5 shadow-lg">
                          <h3 className="text-2xl font-bold mb-2">今すぐ<span className="text-yellow-300 text-3xl font-extrabold">無料</span>で模試を体験</h3>
                          <p className="text-blue-100">受験可能な模試を多数ご用意しています</p>
                        </div>
                        <div className="flex justify-center">
                          <Link
                            href="/exams"
                            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                          >
                            無料模試を受ける
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                        <div className="mt-4 text-center text-sm text-gray-500">
                          <p>※会員登録後すぐに受験していただけます</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* 学習の流れセクション */}
      <div className="py-24 bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-20"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">学習の流れ</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              3ステップで簡単スタート
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              トレモックで効率的に英語力を向上させるための簡単なステップをご紹介します。
            </p>
          </motion.div>

          <div className="relative">
             {/* Connecting line (visible on md screens and up) */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 transform -translate-y-1/2" style={{top: 'calc(5rem)'}}></div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
              {/* Step 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="absolute -top-8 flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold shadow-md border-4 border-white">1</div>
                <div className="mt-8 mb-4 text-blue-500">
                  <ListChecks size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">模試を選択して受験</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  豊富なラインナップから、目標とする試験やレベルに合った模試を選びます。本番と同じ形式で、集中して問題に取り組みましょう。
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="relative flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="absolute -top-8 flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold shadow-md border-4 border-white">2</div>
                <div className="mt-8 mb-4 text-blue-500">
                  <BarChart3 size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">結果を即時確認</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  試験終了後、すぐにスコアが表示されます。AIによる詳細な分析で、自分の弱点を正確に把握し、次の学習計画に活かせます。
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative flex flex-col items-center text-center bg-white p-8 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="absolute -top-8 flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white text-2xl font-bold shadow-md border-4 border-white">3</div>
                <div className="mt-8 mb-4 text-blue-500">
                  <Repeat size={48} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">繰り返し学習</h3>
                <p className="text-gray-600 leading-relaxed text-sm flex-grow">
                  間違えた問題を中心に復習し、知識を定着させます。豊富な模試を繰り返し解くことで、実践的な英語力を着実に身につけることができます。
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 特徴セクション */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">特徴</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                トレモックが選ばれる理由
              </p>
              <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
                本番さながらの環境で実力を試し、詳細な分析と豊富な問題であなたの英語学習を加速させます。
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl border border-blue-100 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tl from-blue-300 to-blue-500 text-white shadow-md">
                   <Presentation size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">本番さながらの環境</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  実際の試験と同じ形式、時間配分で模試を受験できます。リスニング音声の再生速度調整や、リーディングの時間計測など、本番を意識した機能が充実。試験当日の緊張感を和らげ、実力を最大限に発揮できるようサポートします。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl border border-blue-100 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tl from-blue-300 to-blue-500 text-white shadow-md">
                   <CheckSquare size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">AIによる詳細分析</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  解答結果をAIが瞬時に分析。セクションごとの正答率だけでなく、問題タイプ別の理解度や弱点分野を可視化します。苦手な問題傾向を把握し、復習すべきポイントを明確にすることで、効率的なスコアアップを実現します。（プレミアムプラン以上）
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-lg hover:shadow-xl border border-blue-100 transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-tl from-blue-300 to-blue-500 text-white shadow-md">
                   <BookOpenCheck size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">質の高い豊富な問題</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  TOEIC® L&R TEST、TOEFL iBT®、英検®（準1級・1級）に対応した最新傾向の模試を多数用意。経験豊富な専門家チームが作成・監修した質の高い問題で、実践的な演習が可能です。定期的に新しい模試も追加され、常に新鮮な気持ちで学習に取り組めます。
                </p>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* FAQ セクション */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">FAQ</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">よくある質問</p>
              <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
                サービスに関するよくある質問とその回答をまとめました。
              </p>
            </div>

            <div className="mt-12 max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-blue-600">
                    本当に無料で模試が受けられますか？
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed pt-2">
                    はい、完全無料で各試験タイプの模試を1回ずつお試しいただけます。アカウント登録後すぐにご利用可能で、スコアもその場で確認できます。より詳細なAI分析や全模試の無制限アクセスをご希望の場合は、プレミアムプランをご検討ください。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-blue-600">
                    対応している支払い方法は何ですか？
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed pt-2">
                    現在、各種クレジットカード（Visa, Mastercard, American Expressなど）に対応しております。安全なStripe決済システムを利用しているため、安心してご利用いただけます。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-blue-600">
                    プレミアムプランのメリットは何ですか？
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed pt-2">
                    プレミアムプランにご登録いただくと、全ての模試が受け放題になるほか、AIによる詳細な弱点分析、スピーキング・ライティングの添削、苦手分野に特化した復習機能など、学習効率を最大化するための全ての機能をご利用いただけます。
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium text-gray-900 hover:text-blue-600">
                    スマートフォンでも受験できますか？
                  </AccordionTrigger>
                  <AccordionContent className="text-base text-gray-600 leading-relaxed pt-2">
                    はい、ToreMockはスマートフォンやタブレットにも対応しています。ただし、長文読解やライティングセクションなど、一部の問題はPCでの受験を推奨しております。快適な学習環境のために、画面の大きいデバイスでのご利用をおすすめします。
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <div className="mt-8 text-center">
                <Link
                  href="/faq"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  その他の質問を見る &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 利用者の声セクション
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">利用者の声</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                ToreMockで目標を達成
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                実際にToreMockをご利用いただいた方々からの声をご紹介します。
              </p>
            </div>

            <div className="mt-12 relative">
              <div className="relative w-full overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${(100 / testimonials.length) * (testimonials.length > 3 ? (scrollY % testimonials.length) : 0)}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="w-full md:w-1/3 flex-shrink-0 px-4">
                      <div className="bg-white rounded-lg shadow-lg p-8 h-full flex flex-col">
                        <div className="flex-grow">
                          <p className="text-gray-600 mb-6">"{testimonial.comment}"</p>
                        </div>
                        <div className="flex items-center">
                          <Image
                            src={`/images/avatars/avatar-${(index % 16) + 1}.png`}
                            alt={`ToreMockユーザー ${testimonial.name}さんの口コミ`}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          <div className="ml-4">
                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                            <p className="text-gray-500 text-sm">{testimonial.date}</p>
                          </div>
                          <div className="ml-auto flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.064 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                            </svg>
                          ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-white rounded-lg shadow-md">
                    <p className="text-lg font-semibold text-gray-800">
                        平均評価: <span className="text-yellow-500 text-xl">{averageRatingRounded}</span> / 5.0
                        <span className="text-sm text-gray-500 ml-2">({totalReviews}件のレビュー)</span>
                    </p>
                </div>
            </div>
          </motion.div>
        </div>
      </div>
      */}

      {/* プラン比較・料金セクション */}
      <div id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">料金プラン</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                あなたに最適なプランを選択
              </p>
              <p className="max-w-2xl mt-5 mx-auto text-xl text-gray-500">
                無料プランでも十分な機能をお試しいただけますが、プレミアムプランで学習をさらに加速させましょう。
              </p>
            </div>
          
            <ComparisonTable />
          </motion.div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">準備はできましたか？</span>
            <span className="block text-blue-200">今すぐToreMockを始めましょう。</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            無料アカウントを作成して、あなたの英語力を次のレベルへ引き上げましょう。
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/auth/signup?callbackUrl=/exams"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                無料で始める
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400"
              >
                プランを見る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 