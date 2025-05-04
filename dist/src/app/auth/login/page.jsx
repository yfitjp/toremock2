'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
function LoginPage() {
    const router = (0, navigation_1.useRouter)();
    (0, react_1.useEffect)(() => {
        // 新しいログインページにリダイレクト
        router.replace('/auth/signin');
    }, [router]);
    return (<div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-900">リダイレクト中...</p>
      </div>
    </div>);
}
