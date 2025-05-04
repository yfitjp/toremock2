'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SuccessPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
function SuccessPage() {
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        // 3秒後にマイページにリダイレクト
        const timer = setTimeout(() => {
            router.push('/mypage');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);
    return (<div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              サブスクリプションの登録が完了しました！
            </h1>
            <p className="text-gray-600 mb-4">
              ご登録ありがとうございます。プレミアム機能をご利用いただけます。
            </p>
            <p className="text-sm text-gray-500">
              3秒後にマイページに移動します...
            </p>
          </div>
        </div>
      </div>
    </div>);
}
