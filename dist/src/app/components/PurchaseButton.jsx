"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PurchaseButton;
const react_1 = require("react");
const navigation_1 = require("next/navigation");
const useAuth_1 = require("@/app/hooks/useAuth");
function PurchaseButton({ examId, price = 0, isDisabled = false }) {
    const { user } = (0, useAuth_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handlePurchase = async () => {
        if (!user) {
            router.push(`/auth/signin?callbackUrl=/exams`);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const idToken = await user.getIdToken();
            if (!idToken) {
                throw new Error('認証トークンの取得に失敗しました');
            }
            // APIを呼び出してStripe Checkout Sessionを作成 (/api/create-checkout-session を使用)
            console.log(`Creating checkout session for exam: ${examId} via /api/create-checkout-session`);
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    userId: user.uid, // userIdも渡す
                    email: user.email, // emailも渡す
                    examId: examId
                }),
            });
            const session = await response.json();
            if (!response.ok) {
                throw new Error(session.error || '決済セッションの作成に失敗しました');
            }
            if (!session.sessionUrl) {
                throw new Error('決済ページのURLが取得できませんでした');
            }
            // sessionUrl を使ってStripe Checkoutへリダイレクト
            console.log(`Redirecting to Stripe Checkout via URL: ${session.sessionUrl}`);
            window.location.href = session.sessionUrl;
            // リダイレクトされるので、以降のローディング解除は不要な場合が多い
        }
        catch (err) {
            console.error('Purchase error:', err);
            setError(err.message || '購入処理中にエラーが発生しました');
            setIsLoading(false);
        }
    };
    return (<div>
      <button onClick={handlePurchase} disabled={isLoading || isDisabled || !user} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
        {isLoading ? (<div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            処理中...
          </div>) : (price > 0 ? `¥${price.toLocaleString()} で購入` : '購入する')}
      </button>

      {error && (<div className="mt-2 text-sm text-red-600">
          {error}
        </div>)}
    </div>);
}
