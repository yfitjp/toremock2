'use client';

import { motion } from 'framer-motion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'よくある質問',
  description: 'ToreMockのよくある質問（FAQ）ページです。模試の受験時間、支払い方法、結果の確認など、お客様から多く寄せられる質問とその回答をまとめています。',
};

export default function FAQPage() {
  const faqs = [
    {
      question: '模試の受験時間はどのくらいですか？',
      answer: '模試によって異なりますが、一般的なTOEIC® L&R模試は120分です。各模試の詳細ページで確認できます。'
    },
    {
      question: '支払い方法は何がありますか？',
      answer: 'クレジットカード（VISA, MasterCard, JCB, American Express）でのお支払いに対応しています。'
    },
    {
      question: '模試の結果はいつまで見られますか？',
      answer: '模試の結果は、受験後いつでもマイページから確認することができます。'
    },
    {
      question: '模試は途中で中断できますか？',
      answer: '申し訳ありませんが、本番の試験と同様の環境を提供するため、模試の途中中断はできません。'
    },
    {
      question: '音声の再生に問題がある場合はどうすればよいですか？',
      answer: 'ブラウザの設定で音声の許可が必要です。また、お使いのデバイスの音声出力設定もご確認ください。'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">よくある質問</h1>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.section
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Q. {faq.question}
                </h2>
                <p className="text-gray-900">
                  A. {faq.answer}
                </p>
              </motion.section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 