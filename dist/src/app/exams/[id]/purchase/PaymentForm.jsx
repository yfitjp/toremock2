'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PaymentForm;
const react_1 = require("react");
const react_stripe_js_1 = require("@stripe/react-stripe-js");
const link_1 = __importDefault(require("next/link"));
function PaymentForm({ examId, price, clientSecret }) {
    const stripe = (0, react_stripe_js_1.useStripe)();
    const elements = (0, react_stripe_js_1.useElements)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [message, setMessage] = (0, react_1.useState)(null);
    const [succeeded, setSucceeded] = (0, react_1.useState)(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            return;
        }
        setLoading(true);
        setMessage(null);
        try {
            // 支払いシステムは現在開発中です
            setMessage('支払いシステムは現在開発中です。しばらくお待ちください。');
            setLoading(false);
            // 実際の支払い処理が実装されたら以下のコードを使用します
            /*
            const cardElement = elements.getElement(CardElement);
            
            if (!cardElement) {
              setMessage('カード情報の取得に失敗しました');
              setLoading(false);
              return;
            }
      
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
              payment_method: {
                card: cardElement,
              }
            });
      
            if (error) {
              setMessage(error.message || '支払い処理中にエラーが発生しました');
            } else if (paymentIntent.status === 'succeeded') {
              setSucceeded(true);
              setMessage('支払いが完了しました');
            }
            */
            // デモ用に成功状態を設定
            setTimeout(() => {
                setSucceeded(true);
            }, 1000);
        }
        catch {
            setMessage('支払い処理中にエラーが発生しました');
        }
        finally {
            setLoading(false);
        }
    };
    if (succeeded) {
        return (<div className="text-center">
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md mb-4">
          支払いが完了しました！
        </div>
        <link_1.default href={`/exams/${examId}/purchase/success?examId=${examId}`} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          購入完了ページへ
        </link_1.default>
      </div>);
    }
    return (<form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-md mb-4">
        <p className="text-gray-900 font-medium">支払い金額: {price}円</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="card-element" className="block text-sm font-medium text-gray-900">
          クレジットカード情報
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <react_stripe_js_1.CardElement options={{
            style: {
                base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                        color: '#aab7c4',
                    },
                },
                invalid: {
                    color: '#9e2146',
                },
            },
        }}/>
        </div>
      </div>

      {message && (<div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {message}
        </div>)}

      <button type="submit" disabled={!stripe || loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
        {loading ? '処理中...' : '支払いを完了する'}
      </button>
    </form>);
}
