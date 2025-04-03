'use client';

import { motion } from 'framer-motion';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">事業者名</h2>
              <p className="text-gray-900">藤井佑成</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">所在地</h2>
              <p className="text-gray-900">
                〒274-0077<br />
                千葉県船橋市薬園台6-8-2
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">連絡先</h2>
              <p className="text-gray-900">
                メールアドレス：contact.yfit@gmail.com<br />
                電話番号：080-4686-0794<br />
                受付時間：平日 9:00-18:00
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">販売価格</h2>
              <p className="text-gray-900">
                各模試の価格は商品ページに表示される価格に準じます。<br />
                消費税は価格に含まれています。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">支払方法</h2>
              <p className="text-gray-900">
                クレジットカード決済（VISA, MasterCard, American Express）
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">商品の提供時期</h2>
              <p className="text-gray-900">
                お支払い完了後、直ちにご利用いただけます。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">返品・キャンセルについて</h2>
              <p className="text-gray-900">
                デジタルコンテンツの性質上、購入後の返品・キャンセルはお受けできません。<br />
                ただし、技術的な問題により模試を受験できない場合は、個別にご対応させていただきます。
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 