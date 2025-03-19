import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

interface PurchaseButtonProps {
  examId: string;
  price?: number;
  isDisabled?: boolean;
}

export default function PurchaseButton({ examId, price = 0, isDisabled = false }: PurchaseButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/auth/signin?callbackUrl=/exams/${examId}`);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // チェックアウトページにリダイレクト
      router.push(`/exams/${examId}/checkout`);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || '購入処理中にエラーが発生しました');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePurchase}
        disabled={isLoading || isDisabled}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            処理中...
          </div>
        ) : (
          <>¥{price.toLocaleString()} で購入</>
        )}
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
} 