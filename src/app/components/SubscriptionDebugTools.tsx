'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { motion } from 'framer-motion';

export default function SubscriptionDebugTools() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ message: string; success: boolean } | null>(null);

  // 環境チェック
  const isDevelopment = process.env.NODE_ENV === 'development';

  // サブスクリプションデータを手動で更新
  const updateSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const token = await user.getIdToken();
      
      const response = await fetch('/api/subscription/webhook-test', {
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
        throw new Error(data.error || 'サブスクリプションの更新に失敗しました');
      }
      
      setResult({
        message: data.message || 'サブスクリプションを有効化しました',
        success: true,
      });
      
      // 3秒後にページをリロード
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('サブスクリプション更新エラー:', error);
      setResult({
        message: error instanceof Error ? error.message : 'サブスクリプションの更新に失敗しました',
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // 開発環境でなければ表示しない
  if (!isDevelopment || !user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 p-4 border border-gray-300 bg-white rounded-md shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-md font-semibold text-gray-700">開発者ツール</h3>
        <span className="text-xs py-1 px-2 bg-yellow-100 text-yellow-800 rounded-full">開発環境のみ</span>
      </div>
      
      {result && (
        <div className={`p-3 mb-4 rounded-md ${
          result.success ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {result.message}
          {result.success && <p className="text-xs mt-1">3秒後にページをリロードします...</p>}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Webhookの動作をテストします。Firestoreのサブスクリプションデータを手動で更新します。
          </p>
          <button
            onClick={updateSubscription}
            disabled={loading}
            className={`text-sm py-2 px-4 rounded-md ${
              loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {loading ? '処理中...' : 'サブスクリプションを有効化'}
          </button>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs text-gray-500">
            ユーザーID: {user.uid}
          </p>
          <p className="text-xs text-gray-500">
            メール: {user.email}
          </p>
        </div>
      </div>
    </motion.div>
  );
} 