import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SUBSCRIPTION_PLANS } from "@/app/lib/subscriptions";
import Link from 'next/link';
import { Check, Minus } from 'lucide-react';

// 比較表で表示する機能リストを定義
const comparisonFeatures = [
  '無料模試へのアクセス',
  '有料模試へのアクセス',
  '各模試の詳細な解説',
  'スコア分析と学習アドバイス',
  'パーソナライズされた学習プラン', // Premium/Eliteに含まれると解釈
  'ネイティブ講師によるレッスン', // Eliteのみ
  '模試の復習に便利な単語帳機能', // Eliteのみ
  '専門家による専用カリキュラムの作成', // Eliteのみ
];

// 各プランが特定の機能を持っているか判定するヘルパー関数
const hasFeature = (planFeatures: string[], targetFeature: string): boolean => {
  const lowerCaseTarget = targetFeature.toLowerCase();
  // 無料アクセスはFreeはもちろん、全アクセス権のあるPremium/Eliteもtrue
  if (lowerCaseTarget === '無料模試へのアクセス') {
      return planFeatures.some(f => 
          f.toLowerCase().includes('無料模試へのアクセス') || 
          f.toLowerCase().includes('すべての模試へのアクセス') || 
          f.toLowerCase().includes('プレミアムプランのすべての機能')
      );
  }
  if (lowerCaseTarget === '有料模試へのアクセス') {
      // Premium/Eliteプランの特徴に"すべて"が含まれるか確認
      return planFeatures.some(f => f.toLowerCase().includes('すべての模試へのアクセス') || f.toLowerCase().includes('プレミアムプランのすべての機能'));
  }
  if (lowerCaseTarget === 'パーソナライズされた学習プラン') {
      // Premium/Eliteプランの特徴に個別プランが含まれるか、または包括的な表現があるか
      return planFeatures.some(f => f.toLowerCase().includes('パーソナライズ') || f.toLowerCase().includes('学習プラン') || f.toLowerCase().includes('プレミアムプランのすべての機能'));
  }
  // その他の機能は直接比較、またはEliteの包括的表現を確認
  return planFeatures.some(f => f.toLowerCase().includes(lowerCaseTarget) || f.toLowerCase().includes('プレミアムプランのすべての機能'));
};

export default function ComparisonTable() {
  const plans = [SUBSCRIPTION_PLANS.FREE, SUBSCRIPTION_PLANS.PREMIUM, SUBSCRIPTION_PLANS.ELITE];

  return (
    <div className="w-full overflow-x-auto mt-16 mb-12"> {/* Add margin */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">プラン比較表</h2> {/* Increased size */}
      <div className="shadow-lg rounded-lg border border-gray-200"> {/* Add container */}
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/3">機能</TableHead> {/* Increased size */}
              {plans.map((plan) => (
                <TableHead key={plan.name} className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  {plan.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {comparisonFeatures.map((feature) => (
              <TableRow key={feature} className="hover:bg-gray-50">
                <TableCell className="px-6 py-4 whitespace-normal text-base font-medium text-gray-900">{feature}</TableCell> {/* Increased size */}
                {plans.map((plan) => (
                  <TableCell key={`${plan.name}-${feature}`} className="px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center"> {/* Increased size */}
                    {/* Conditional rendering for '有料模試へのアクセス' on Free plan */}
                    {feature === '有料模試へのアクセス' && plan.name === 'Free' ? (
                      <span className="text-sm font-medium">個別購入</span>
                    ) : hasFeature(plan.features, feature) ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <Minus className="h-5 w-5 text-gray-400 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {/* Price Row */}
            <TableRow className="bg-gray-50">
               <TableCell className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">価格 (月額)</TableCell> {/* Increased size */}
               {plans.map((plan) => (
                  <TableCell key={`${plan.name}-price`} className="px-6 py-4 whitespace-nowrap text-xl font-semibold text-gray-900 text-center"> {/* Increased size */}
                    ¥{plan.price.toLocaleString()}
                  </TableCell>
               ))}
            </TableRow>
            {/* Button Row */}
             <TableRow>
               <TableCell className="px-6 py-4"></TableCell>
               {plans.map((plan) => (
                 <TableCell key={`${plan.name}-button`} className="px-6 py-4 text-center">
                   {plan.name === 'Free' ? (
                     <Link
                       href="/exams"
                       className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors" /* Increased size */
                     >
                       模試を見る
                     </Link>
                   ) : plan.name === 'Premium' ? (
                      <Link
                        href="/subscription"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors" /* Increased size */
                      >
                        プランに登録
                      </Link>
                   ) : ( // Elite
                      <button
                        disabled={true}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed" /* Increased size */
                      >
                        受付停止中
                      </button>
                   )}
                 </TableCell>
               ))}
             </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 