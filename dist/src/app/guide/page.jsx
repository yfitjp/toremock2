'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GuidePage;
const framer_motion_1 = require("framer-motion");
function GuidePage() {
    return (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">ご利用ガイド</h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. はじめに</h2>
              <p className="text-gray-900">
                ToreMockは、本番さながらの環境で模擬試験を受験できるオンラインプラットフォームです。このガイドでは、ToreMockの基本的な使い方をご説明します。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. アカウント作成方法</h2>
              <ol className="list-decimal list-inside text-gray-900 space-y-2">
                <li>トップページの「ログイン」ボタンをクリックします。</li>
                <li>「アカウントを作成」を選択します。</li>
                <li>必要な情報を入力し、利用規約とプライバシーポリシーに同意します。</li>
                <li>「登録」ボタンをクリックします。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 模試の受験方法</h2>
              <ol className="list-decimal list-inside text-gray-900 space-y-2">
                <li>「模試一覧」から受験したい模試を選択します。</li>
                <li>模試の詳細を確認し、「模試を受験」ボタンをクリックします。</li>
                <li>音声テストを実施後、試験を開始します。</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 結果の確認方法</h2>
              <p className="text-gray-900">
                模試終了後、すぐに結果が表示されます。過去の結果はマイページからいつでも確認できます。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 推奨環境</h2>
              <ul className="list-disc list-inside text-gray-900 space-y-2">
                <li>Google Chrome 最新版</li>
                <li>Firefox 最新版</li>
                <li>Safari 最新版</li>
                <li>Microsoft Edge 最新版</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. サポート</h2>
              <p className="text-gray-900">
                ご不明な点がございましたら、お問い合わせフォームからご連絡ください。平日9:00-18:00の間で、通常24時間以内に回答いたします。
              </p>
            </section>
          </div>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
