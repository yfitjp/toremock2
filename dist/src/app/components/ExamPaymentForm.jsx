"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExamPaymentForm;
const react_1 = require("react");
const react_stripe_js_1 = require("@stripe/react-stripe-js");
const navigation_1 = require("next/navigation");
function ExamPaymentForm({ examId, paymentIntentId, title, amount }) {
    const stripe = (0, react_stripe_js_1.useStripe)();
    const elements = (0, react_stripe_js_1.useElements)();
    const router = (0, navigation_1.useRouter)();
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/exams/${examId}?success=true`,
                },
            });
            if (error) {
                // エラーメッセージを日本語化
                let message = 'お支払い処理中にエラーが発生しました。';
                if (error.type === 'card_error' || error.type === 'validation_error') {
                    message = error.message || message;
                }
                setErrorMessage(message);
                setIsLoading(false);
            }
            // 成功した場合は自動的にreturn_urlにリダイレクトされます
        }
        catch (error) {
            console.error('Payment error:', error);
            setErrorMessage('お支払い処理中にエラーが発生しました。もう一度お試しください。');
            setIsLoading(false);
        }
    };
    return (<div>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">購入内容</h2>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{title}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">一回限りの購入</p>
            </div>
            <div className="text-lg font-bold">¥{(amount / 100).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <react_stripe_js_1.PaymentElement />
        </div>

        {errorMessage && (<div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-md">
            {errorMessage}
          </div>)}

        <button type="submit" disabled={!stripe || isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? (<div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中...
            </div>) : ('支払いを確定する')}
        </button>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          安全な支払い処理は Stripe により提供されています
        </p>
      </form>
    </div>);
}
