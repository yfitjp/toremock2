'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscriptionManagement;
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const useAuth_1 = require("@/app/hooks/useAuth");
function SubscriptionManagement() {
    const { user } = (0, useAuth_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    // カスタマーポータルに移動
    const handleManageSubscription = async () => {
        if (!user)
            return;
        setLoading(true);
        setMessage(null);
        try {
            const token = await user.getIdToken();
            const response = await fetch('/api/subscription/manage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    userId: user.uid,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'サブスクリプション管理画面の表示に失敗しました');
            }
            // Stripeカスタマーポータルに移動
            window.location.href = data.url;
        }
        catch (error) {
            console.error('サブスクリプション管理エラー:', error);
            setMessage({
                text: error instanceof Error ? error.message : 'サブスクリプション管理画面の表示に失敗しました',
                type: 'error',
            });
        }
        finally {
            setLoading(false);
        }
    };
    if (!user) {
        return null;
    }
    return (<div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">サブスクリプション管理</h2>
      
      {message && (<div className={`p-3 rounded-md mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
                    'bg-blue-50 text-blue-800 border border-blue-200'}`}>
          {message.text}
        </div>)}
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
        <button onClick={handleManageSubscription} disabled={loading} className={`py-2 px-4 rounded-md text-sm font-medium border border-gray-300 ${loading ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
          {loading ? '読込中...' : '支払い情報を管理'}
        </button>
        
        <link_1.default href="/subscription/cancel" className="inline-flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200">
          サブスクリプションを解約
        </link_1.default>
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        ※解約は次回の更新日をもって適用されます。それまでは引き続きサービスをご利用いただけます。
      </p>
    </div>);
}
