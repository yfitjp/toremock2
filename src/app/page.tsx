'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { useEffect, useState } from 'react';

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
    <div className="bg-white dark:bg-gray-900">
      {/* ヒーローセクション */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900">
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
                    <span className="block">英語力を測定するなら</span>
                    <span className="block text-blue-600">TOREMOCK</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl">
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
                      <div className="relative rounded-lg shadow-lg overflow-hidden bg-white p-5">
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">今すぐ無料で模試を体験</h3>
                          <p className="text-sm text-blue-600">アカウント登録なしで受験できる無料模試をご用意しています</p>
                        </div>
                        <div className="flex justify-center">
                          <Link
                            href="/exams"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                          >
                            無料模試を受ける
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </Link>
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
      <div className="py-16 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">特徴</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
                TOREMOCKが選ばれる理由
              </p>
              <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-300">
                本番さながらの環境で実力を試し、詳細な分析で弱点を克服できます
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 bg-blue-600 rounded-lg p-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-2">本番さながらの環境</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    実際の試験と同じ形式、同じ時間配分で模擬試験を受けることができます。
                    本番の雰囲気を体験し、試験に慣れることができます。
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 bg-blue-600 rounded-lg p-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-2">詳細な分析</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    試験結果を詳細に分析し、あなたの強みと弱みを明確にします。
                    効率的な学習計画を立てるのに役立ちます。
                  </p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-300"
                >
                  <div className="absolute -top-4 -left-4 bg-blue-600 rounded-lg p-3 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 mt-2">豊富な問題</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    TOEIC®、TOEFL®、英検®など、様々な試験の模擬問題を用意しています。
                    定期的に新しい問題が追加されます。
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTAセクション */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">料金プラン</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              英語学習を加速させる最適なプラン
            </p>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300">
              まずは無料プランで体験、実力が伸びを実感したらプレミアムへ
            </p>
          </motion.div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
            {/* 無料プラン */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">無料プラン</h3>
                <p className="mt-4 text-gray-500 dark:text-gray-300">英語学習の第一歩に最適</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">¥0</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-300">/月</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">基本的な模試にアクセス</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">基本的な解説と採点</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">学習進捗の記録</span>
                  </li>
                </ul>
                <div className="mt-8">
                  {!user ? (
                    <Link
                      href="/auth/signup"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      無料で始める
                    </Link>
                  ) : (
                    <Link
                      href="/exams"
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 transition-colors duration-300"
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
              className="relative bg-blue-600 rounded-2xl shadow-xl overflow-hidden transform"
            >
              <div className="absolute top-0 right-0 w-40 h-40 transform translate-x-20 -translate-y-20">
                <div className="absolute transform rotate-45 bg-blue-800 text-center text-white font-semibold py-1 left-[-40px] top-[32px] w-[170px]">
                  人気
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white">プレミアムプラン</h3>
                <p className="mt-4 text-blue-100">本気で英語力を伸ばしたい方に</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-white">¥4,980</span>
                  <span className="text-base font-medium text-blue-100">/月</span>
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-white">すべての模試に無制限アクセス</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-white">AI搭載の詳細な解説</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-white">パーソナライズされた学習プラン</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-white">進捗分析レポート</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-3 text-white">新規模試の優先アクセス</span>
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
          </div>
        </div>
      </div>

      {/* 利用者の声セクション */}
      <div className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
              className="bg-blue-50 dark:bg-blue-900 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  "TOREMOCKのおかげでTOEICスコアが200点以上アップしました。詳細な分析レポートが特に役立ちました。"
                </div>
                <div className="mt-6">
                  <div className="font-medium text-gray-900 dark:text-white">田中 美咲</div>
                  <div className="text-blue-600">TOEIC 950点達成</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-blue-50 dark:bg-blue-900 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  "AI搭載の個別学習プランが素晴らしいです。自分の弱点に合わせた問題を解くことで、効率的に学習を進められました。"
                </div>
                <div className="mt-6">
                  <div className="font-medium text-gray-900 dark:text-white">山田 健一</div>
                  <div className="text-blue-600">英検1級合格</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-blue-50 dark:bg-blue-900 rounded-xl p-8 relative"
            >
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="relative">
                <div className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  "本番さながらの模試環境で実践的なトレーニングができました。専門家のサポートも心強かったです。"
                </div>
                <div className="mt-6">
                  <div className="font-medium text-gray-900 dark:text-white">佐藤 優子</div>
                  <div className="text-blue-600">TOEFL 110点達成</div>
                </div>
              </div>
            </motion.div>
          </div>
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
      `}</style>
    </div>
  );
}
