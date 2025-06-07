'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. 個人情報の取り扱いについて</h2>
              <p className="text-gray-900">
                当サイトは、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
                本プライバシーポリシーでは、当サイトが収集する情報とその使用方法について説明します。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. 収集する情報</h2>
              <p className="text-gray-900">
                当サイトでは、以下の情報を収集する場合があります：
              </p>
              <ul className="list-disc list-inside text-gray-900 mt-2">
                <li>メールアドレス</li>
                <li>受験結果データ</li>
                <li>アクセスログ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. 情報の利用目的</h2>
              <p className="text-gray-900">
                収集した情報は、サービスの提供、改善、およびカスタマーサポートの目的で利用されます。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. 個人情報の第三者提供</h2>
              <p className="text-gray-900">
                当サイトでは、以下の場合を除き、収集した個人情報を第三者に提供することはありません：
              </p>
              <ul className="list-disc list-inside text-gray-900 mt-2">
                <li>ユーザーの同意がある場合</li>
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. セキュリティ対策</h2>
              <p className="text-gray-900">
                当サイトでは、個人情報の漏洩、滅失、毀損の防止その他の個人情報の安全管理のために必要かつ適切な措置を講じています。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Cookieの使用について</h2>
              <p className="text-gray-900">
                当サイトでは、ユーザー体験の向上やサービスの改善のためにCookieを使用しています。
                ブラウザの設定により、Cookieの使用を制限することが可能です。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. お問い合わせ窓口</h2>
              <p className="text-gray-900">
                個人情報の取り扱いに関するお問い合わせは、お問い合わせフォームまたは以下の窓口までご連絡ください：
              </p>
              <div className="mt-2 text-gray-900">
                <p>ToreMock カスタマーサポート</p>
                <p>メール：info@toremock.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. プライバシーポリシーの変更</h2>
              <p className="text-gray-900">
                当サイトは、必要に応じて本プライバシーポリシーを変更することがあります。
                変更後のプライバシーポリシーは、当サイトに掲載した時点から効力を生じるものとします。
              </p>
            </section>

            <div className="text-right text-sm text-gray-500 mt-8">
              最終更新日：2025年6月10日
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 