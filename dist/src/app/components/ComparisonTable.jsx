"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComparisonTable;
const table_1 = require("@/components/ui/table");
const subscriptions_1 = require("@/app/lib/subscriptions");
const link_1 = __importDefault(require("next/link"));
const lucide_react_1 = require("lucide-react");
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
const hasFeature = (planFeatures, targetFeature) => {
    const lowerCaseTarget = targetFeature.toLowerCase();
    // 無料アクセスはFreeはもちろん、全アクセス権のあるPremium/Eliteもtrue
    if (lowerCaseTarget === '無料模試へのアクセス') {
        return planFeatures.some(f => f.toLowerCase().includes('無料模試へのアクセス') ||
            f.toLowerCase().includes('すべての模試へのアクセス') ||
            f.toLowerCase().includes('プレミアムプランのすべての機能'));
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
function ComparisonTable() {
    const plans = [subscriptions_1.SUBSCRIPTION_PLANS.FREE, subscriptions_1.SUBSCRIPTION_PLANS.PREMIUM, subscriptions_1.SUBSCRIPTION_PLANS.ELITE];
    return (<div className="w-full overflow-x-auto mt-16 mb-12"> {/* Add margin */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">プラン比較表</h2> {/* Increased size */}
      <div className="shadow-lg rounded-lg border border-gray-200"> {/* Add container */}
        <table_1.Table className="min-w-full divide-y divide-gray-200">
          <table_1.TableHeader className="bg-gray-50">
            <table_1.TableRow>
              <table_1.TableHead className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-1/3">機能</table_1.TableHead> {/* Increased size */}
              {plans.map((plan) => (<table_1.TableHead key={plan.name} className="px-6 py-4 text-center text-sm font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                  {plan.name}
                </table_1.TableHead>))}
            </table_1.TableRow>
          </table_1.TableHeader>
          <table_1.TableBody className="bg-white divide-y divide-gray-200">
            {comparisonFeatures.map((feature) => (<table_1.TableRow key={feature} className="hover:bg-gray-50">
                <table_1.TableCell className="px-6 py-4 whitespace-normal text-base font-medium text-gray-900">{feature}</table_1.TableCell> {/* Increased size */}
                {plans.map((plan) => (<table_1.TableCell key={`${plan.name}-${feature}`} className="px-6 py-4 whitespace-nowrap text-base text-gray-500 text-center"> {/* Increased size */}
                    {/* Conditional rendering for '有料模試へのアクセス' on Free plan */}
                    {feature === '有料模試へのアクセス' && plan.name === 'Free' ? (<span className="text-sm font-medium">個別購入</span>) : hasFeature(plan.features, feature) ? (<lucide_react_1.Check className="h-5 w-5 text-blue-500 mx-auto"/>) : (<lucide_react_1.Minus className="h-5 w-5 text-gray-400 mx-auto"/>)}
                  </table_1.TableCell>))}
              </table_1.TableRow>))}
            {/* Price Row */}
            <table_1.TableRow className="bg-gray-50">
               <table_1.TableCell className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900">価格 (月額)</table_1.TableCell> {/* Increased size */}
               {plans.map((plan) => (<table_1.TableCell key={`${plan.name}-price`} className="px-6 py-4 whitespace-nowrap text-xl font-semibold text-gray-900 text-center"> {/* Increased size */}
                    ¥{plan.price.toLocaleString()}
                  </table_1.TableCell>))}
            </table_1.TableRow>
            {/* Button Row */}
             <table_1.TableRow>
               <table_1.TableCell className="px-6 py-4"></table_1.TableCell>
               {plans.map((plan) => (<table_1.TableCell key={`${plan.name}-button`} className="px-6 py-4 text-center">
                   {plan.name === 'Free' ? (<link_1.default href="/exams" className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors" /* Increased size */>
                       模試を見る
                     </link_1.default>) : plan.name === 'Premium' ? (<link_1.default href="/subscription" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors" /* Increased size */>
                        プランに登録
                      </link_1.default>) : ( // Elite
            <button disabled={true} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-500 bg-gray-100 cursor-not-allowed" /* Increased size */>
                        受付停止中
                      </button>)}
                 </table_1.TableCell>))}
             </table_1.TableRow>
          </table_1.TableBody>
        </table_1.Table>
      </div>
    </div>);
}
