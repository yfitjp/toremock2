'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TermsPage;
const framer_motion_1 = require("framer-motion");
function TermsPage() {
    return (<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <framer_motion_1.motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">利用規約</h1>
          
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. はじめに</h2>
              <p className="text-gray-900">
                本利用規約は、ToreMock（以下「当サイト」）の利用条件を定めるものです。
                当サイトを利用する際は、本規約に同意していただく必要があります。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. 定義</h2>
              <p className="text-gray-900">
                本規約において、以下の用語は以下の意味で使用します：
              </p>
              <ul className="list-disc list-inside text-gray-900 mt-2">
                <li>「ユーザー」：当サイトを利用する全ての方を指します</li>
                <li>「コンテンツ」：当サイトで提供される全ての情報、画像、テキスト等を指します</li>
                <li>「サービス」：当サイトが提供する全ての機能を指します</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. 利用登録</h2>
              <p className="text-gray-900">
                当サイトの利用には、利用登録が必要です。登録時に提供する情報は、正確かつ最新のものである必要があります。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. 禁止事項</h2>
              <p className="text-gray-900">
                以下の行為は禁止されています：
              </p>
              <ul className="list-disc list-inside text-gray-900 mt-2">
                <li>他人のアカウントを使用する行為</li>
                <li>当サイトのコンテンツを無断で複製・転載する行為</li>
                <li>当サイトの運営を妨害する行為</li>
                <li>他のユーザーに迷惑をかける行為</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. 知的財産権</h2>
              <p className="text-gray-900">
                当サイトのコンテンツに関する知的財産権は、当サイトに帰属します。
                ユーザーは、当サイトの許可なく、これらのコンテンツを使用することはできません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. 免責事項</h2>
              <p className="text-gray-900">
                当サイトは、サービスの提供について、明示的または黙示的な保証を行いません。
                また、サービスの利用により生じた損害について、一切の責任を負いません。
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. 利用規約の変更</h2>
              <p className="text-gray-900">
                当サイトは、必要に応じて本規約を変更することがあります。
                変更後の規約は、当サイトに掲載した時点から効力を生じるものとします。
              </p>
            </section>

            <div className="text-right text-sm text-gray-500 mt-8">
              最終更新日：2025年5月11日
            </div>
          </div>
        </framer_motion_1.motion.div>
      </div>
    </div>);
}
