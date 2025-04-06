'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useEffect, useState } from 'react';
import { SUBSCRIPTION_PLANS } from './lib/subscriptions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpenCheck, CheckSquare, Presentation } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

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
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
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
                    <span className="block">トレモックで英語力を</span>
                    <span className="block text-blue-600">次のレベルへ</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
                    TOEIC®、TOEFL®、英検®などの模擬試験を手軽にオンラインで受験できるプラットフォームです。
                    豊富な問題数と詳細な解説で、効率的な学習をサポートします。
                  </p>

                  <div className="mt-8 sm:flex">
                    <div className="rounded-md shadow">
                      <Link
                        href="/exams"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105"
                      >
                        模試を探す
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
                          href="/auth/signin"
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all duration-300 transform hover:scale-105 shadow"
                        >
                          ログイン
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
                    <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                    <div className="relative">
                      <div className="relative rounded-xl shadow-xl bg-gradient-to-br from-white to-blue-50 p-6 border-2 border-blue-200 transform hover:scale-105 transition-all duration-300">
                        <div className="absolute -top-4 -right-4 z-50">
                          <div className="bg-yellow-400 text-blue-900 font-bold px-5 py-2 rounded-lg shadow-lg transform rotate-12 text-base">
                            無料で挑戦！
                          </div>
                        </div>
                        <div className="bg-blue-600 text-white p-5 rounded-lg mb-5 shadow-lg">
                          <h3 className="text-xl font-bold mb-2">今すぐ<span className="text-yellow-300 text-2xl font-extrabold">無料</span>で模試を体験</h3>
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
                          <p>※ログイン後すぐに受験していただけます</p>
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

      {/* 特徴セクション */}
      <div className="py-20 bg-white">
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

            <div className="mt-10 grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3">

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-600">
                   <Presentation size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">本番さながらの環境</h3>
                <p className="text-gray-600 leading-relaxed">
                  実際の試験と同じ形式、時間配分で模試を受験できます。リスニング音声の再生速度調整や、リーディングの時間計測など、本番を意識した機能が充実。試験当日の緊張感を和らげ、実力を最大限に発揮できるようサポートします。
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-600">
                   <CheckSquare size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">AIによる詳細分析</h3>
                <p className="text-gray-600 leading-relaxed">
                  解答結果をAIが瞬時に分析。セクションごとの正答率だけでなく、問題タイプ別の理解度や弱点分野を可視化します。苦手な問題傾向を把握し、復習すべきポイントを明確にすることで、効率的なスコアアップを実現します。（プレミアムプラン以上）
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6 flex items-center justify-center h-24 w-24 rounded-full bg-blue-100 text-blue-600">
                   <BookOpenCheck size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">質の高い豊富な問題</h3>
                <p className="text-gray-600 leading-relaxed">
                  TOEIC® L&R TEST、TOEFL iBT®、英検®（準1級・1級）に対応した最新傾向の模試を多数用意。経験豊富な専門家チームが作成・監修した質の高い問題で、実践的な演習が可能です。定期的に新しい模試も追加され、常に新鮮な気持ちで学習に取り組めます。
                </p>
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* 学習の流れセクション */}
      <div className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">学習の流れ</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              3ステップで簡単スタート
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              トレモックで効率的に英語力を向上させるための簡単なステップをご紹介します。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-600 text-white text-3xl font-bold mx-auto mb-6 shadow-lg">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">模試を選択して受験</h3>
              <p className="text-gray-600 leading-relaxed">
                豊富なラインナップから、目標とする試験やレベルに合った模試を選びます。本番と同じ形式で、集中して問題に取り組みましょう。
              </p>
              <div className="mt-4 h-24 flex justify-center items-center">
                 <p className="text-gray-400 italic">（模試選択イメージ）</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-600 text-white text-3xl font-bold mx-auto mb-6 shadow-lg">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">結果分析と弱点把握</h3>
              <p className="text-gray-600 leading-relaxed">
                受験後すぐに結果が表示され、AIによる詳細な分析レポートを確認できます。自分の強みと弱点を正確に把握しましょう。
              </p>
               <div className="mt-4 h-24 flex justify-center items-center">
                 <p className="text-gray-400 italic">（結果分析イメージ）</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center h-24 w-24 rounded-full bg-blue-600 text-white text-3xl font-bold mx-auto mb-6 shadow-lg">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">復習と反復学習</h3>
              <p className="text-gray-600 leading-relaxed">
                分析結果をもとに、間違えた問題や苦手分野を中心に復習します。解説を読み込み、繰り返し挑戦することで着実に実力アップ。
              </p>
               <div className="mt-4 h-24 flex justify-center items-center">
                 <p className="text-gray-400 italic">（復習イメージ）</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 対応試験一覧セクション */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">対応試験一覧</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              主要な英語資格試験に対応
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              あなたの目標達成をサポートするため、人気の英語試験の模試をご用意しています。
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* TOEIC */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden p-6 border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-10 mb-4 flex items-center justify-center font-bold text-xl text-blue-700">TOEIC® L&R TEST</div>
              <p className="text-gray-600 text-sm mb-4">
                ビジネスシーンでの英語コミュニケーション能力を測定する世界共通のテスト。リスニングとリーディングの能力を評価します。
              </p>
              <Link href="/exams?category=toeic" className="mt-auto text-sm font-medium text-blue-600 hover:text-blue-800">
                TOEIC模試を見る &rarr;
              </Link>
            </motion.div>

            {/* TOEFL */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden p-6 border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-10 mb-4 flex items-center justify-center font-bold text-xl text-red-700">TOEFL iBT®</div>
              <p className="text-gray-600 text-sm mb-4">
                主に北米の大学・大学院への留学に必要な英語能力を測定するテスト。読む・聞く・話す・書くの4技能を総合的に評価します。
              </p>
              <Link href="/exams?category=toefl" className="mt-auto text-sm font-medium text-red-600 hover:text-red-800">
                TOEFL模試を見る &rarr;
              </Link>
            </motion.div>

            {/* 英検 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-gray-50 rounded-xl shadow-md overflow-hidden p-6 border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-10 mb-4 flex items-center justify-center font-bold text-xl text-green-700">英検®</div>
              <p className="text-gray-600 text-sm mb-4">
                日本国内で最も広く認知されている英語能力検定試験。幅広いレベルに対応しており、現在は準1級・1級の模試を提供しています。
              </p>
              <Link href="/exams?category=eiken" className="mt-auto text-sm font-medium text-green-600 hover:text-green-800">
                英検模試を見る &rarr;
              </Link>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            ※ TOEIC and TOEFL are registered trademarks of ETS. This web page is not endorsed or approved by ETS.<br />
            ※ 英検®は、公益財団法人 日本英語検定協会の登録商標です。このコンテンツは、公益財団法人 日本英語検定協会の承認や推奨、その他の検討を受けたものではありません。
          </motion.p>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">今すぐ模試を受けて、英語力を測定しましょう</span>
            </h2>
            <p className="mt-4 text-lg leading-6 text-indigo-100">
              無料模試から始めて、あなたの英語力を確認。詳細な分析で弱点を把握し、効率的に学習を進めましょう。
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/exams"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                >
                  模試を探す
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                {!user && (
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 bg-opacity-60 hover:bg-opacity-70 transition-all duration-300 transform hover:scale-105"
                  >
                    無料登録
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 料金プランセクション */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">料金プラン</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              英語学習を加速させる最適なプラン
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              まずは無料プランで体験、実力が伸びを実感したらプレミアムへ
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {/* 無料プラン */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">無料プラン</h3>
                <p className="mt-4 text-gray-500">英語学習の第一歩に最適</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900">¥0</span>
                  <span className="text-base font-medium text-gray-500">/月</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">基本的な模試にアクセス</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">基本的な解説と採点</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700">学習進捗の記録</span>
                  </li>
                </ul>
                <div className="mt-8">
                  {!user ? (
                    <Link
                      href="/auth/signup"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
                    >
                      無料で始める
                    </Link>
                  ) : (
                    <Link
                      href="/exams"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
                    >
                      模試一覧を見る
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>

            {/* プレミアムプラン */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.6 }}
              className="relative bg-gradient-to-b from-blue-200 to-blue-400 rounded-2xl shadow-xl overflow-hidden transform"
            >
              <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-20">
                <div className="absolute transform rotate-45 bg-blue-600 text-center text-white font-semibold py-1 left-[-40px] top-[32px] w-[170px]">
                  人気
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-blue-900">プレミアムプラン</h3>
                <p className="mt-4 text-blue-900">本気で英語力を伸ばしたい方に</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-blue-900">¥1,980</span>
                  <span className="text-base font-medium text-blue-900">/月</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-blue-900">すべての模試に無制限アクセス</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-blue-900">AI搭載の詳細な解説</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-blue-900">パーソナライズされた学習プラン</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-blue-900">進捗分析レポート</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-blue-900">新規模試の優先アクセス</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <Link
                    href="/subscription"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors duration-300"
                  >
                    プレミアムを始める
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* エリートプラン */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.7 }}
              className="relative bg-gradient-to-b from-amber-50 to-amber-100 rounded-2xl shadow-xl overflow-hidden border border-amber-200"
            >
              <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-20">
                <div className="absolute transform rotate-45 bg-amber-500 text-center text-white font-semibold py-1 left-[-40px] top-[32px] w-[190px]">
                  受付停止中
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center">
                  <h3 className="text-2xl font-bold text-amber-800">{SUBSCRIPTION_PLANS.ELITE.name}</h3>
                  <span className="ml-2 px-2 py-0.5 bg-amber-200 text-amber-800 text-xs font-semibold rounded">限定プラン</span>
                </div>
                <p className="mt-4 text-amber-700">最高レベルの学習体験を提供</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-amber-900">¥{SUBSCRIPTION_PLANS.ELITE.price.toLocaleString()}</span>
                  <span className="text-base font-medium text-amber-700">/月</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-amber-700">プレミアムプランのすべての機能</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-amber-700">プロ講師による個別指導（月2回）</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-amber-700">AIによる発音・スピーキング評価</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <div
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-amber-300 rounded-md text-amber-700 bg-white opacity-70 cursor-not-allowed"
                  >
                    ご応募多数につき受付停止中
                  </div>
                  <p className="mt-2 text-xs text-amber-600 text-center">※エリートプランは定員に達したため現在新規受付を停止しております</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 利用者の声セクション */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">利用者の声</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              実際の利用者様からの評価
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-blue-50 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-lg leading-relaxed text-gray-700">
                  "ToreMockのおかげでTOEICスコアが200点以上アップしました。詳細な分析レポートが特に役立ちました。"
                </div>
                <div className="mt-6">
                  <div className="font-medium text-gray-900">20代 女性</div>
                  <div className="text-blue-600">TOEIC® 870点達成</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-blue-50 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-lg leading-relaxed text-gray-700">
                  "AI搭載の個別学習プランが素晴らしいです。自分の弱点に合わせた問題を解くことで、効率的に学習を進められました。"
                </div>
                <div className="mt-6">
                  <div className="font-medium text-gray-900">40代 男性</div>
                  <div className="text-blue-600">英検®1級合格</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-blue-50 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-lg leading-relaxed text-gray-700">
                  "本番さながらの模試環境で実践的なトレーニングができました。専門家のサポートも心強かったです。"
                </div>
                <div className="mt-6">
                  <div className="font-medium text-gray-900">10代 女性</div>
                  <div className="text-blue-600">TOEFL® 112点達成</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* よくある質問(FAQ)セクション */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">よくある質問</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              疑問点を解決
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="bg-white p-6 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">無料プランとプレミアムプランの違いは何ですか？</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  無料プランでは一部の基本的な模試と解説にアクセスできます。プレミアムプランでは、全ての模試への無制限アクセス、AIによる詳細な分析レポート、パーソナライズされた学習プランなど、より高度な機能をご利用いただけます。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white p-6 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">支払い方法は何がありますか？</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  クレジットカード（Visa, Mastercard, American Express, JCB）でのお支払いに対応しています。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white p-6 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">解約はいつでもできますか？</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  はい、いつでもマイページから簡単に解約手続きが可能です。契約期間の途中で解約された場合でも、契約終了日までサービスをご利用いただけます。日割りでの返金は行っておりませんのでご了承ください。
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white p-6 rounded-lg shadow-sm">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">スマートフォンやタブレットでも利用できますか？</AccordionTrigger>
                <AccordionContent className="text-gray-600 mt-2">
                  はい、トレモックはレスポンシブデザインに対応しており、PC、スマートフォン、タブレットなど、様々なデバイスのブラウザから快適にご利用いただけます。
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        /* Shadcn/ui Accordion スタイル調整 */
        [data-state=open] > svg { transform: rotate(180deg); }
        [data-state=closed] > svg { transform: rotate(0deg); }
        [data-state=open] > span { /* Trigger内のテキストも調整 */
           color: #2563eb; /* 例: 青色 */
        }
        AccordionTrigger > svg {
          transition: transform 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
