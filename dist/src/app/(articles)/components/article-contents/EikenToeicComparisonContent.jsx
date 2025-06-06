"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const EikenToeicComparisonContent = () => {
    return (<div className="prose prose-lg max-w-none">
      <p>
        英語学習を進める中で、「英検®」と「TOEIC® L&R TEST」のどちらを受験すべきか迷う方は少なくありません。
        どちらも英語力を測定するメジャーな試験ですが、目的や評価されるスキル、試験形式には違いがあります。
        ここでは、それぞれの特徴を比較し、どちらの試験があなたの目的に合っているかを考えるヒントを提供します。
      </p>

      <h2>英検®とは？</h2>
      <ul>
        <li><strong>特徴:</strong> 日本国内で最も広く認知されている英語能力検定試験。5級から1級まで幅広いレベルに対応し、4技能（読む・聞く・書く・話す ※級による）を総合的に評価します。</li>
        <li><strong>主な目的:</strong> 進学（特に国内の高校・大学）、就職・転職での英語力証明、個人の英語学習のマイルストーン設定など。</li>
        <li><strong>評価スキル:</strong> 日常会話から社会的な話題まで、幅広い場面での総合的な英語運用能力。</li>
        <li><strong>形式:</strong> 筆記（リーディング・ライティング）、リスニング、面接形式のスピーキング（3級以上）。</li>
        <li><strong>スコア/級:</strong> 級別の合否判定とCSEスコアによる評価。</li>
      </ul>

      <h2>TOEIC® L&R TESTとは？</h2>
      <ul>
        <li><strong>特徴:</strong> ビジネスシーンや日常生活における「聞く」「読む」能力を測定する世界共通のテスト。</li>
        <li><strong>主な目的:</strong> 就職・転職活動での英語力アピール、企業内での昇進・昇格要件、海外赴任基準、大学の単位認定など。</li>
        <li><strong>評価スキル:</strong> 主にビジネスや日常生活に関連するリスニングとリーディングの能力。</li>
        <li><strong>形式:</strong> マークシート方式のリスニング（約45分・100問）とリーディング（75分・100問）。</li>
        <li><strong>スコア/級:</strong> 10点から990点のスコアで評価（合否はない）。</li>
      </ul>

      <h2>どちらを選ぶべきか？比較のポイント</h2>
      <ol>
        <li><strong>目的で選ぶ:</strong>
          <ul>
            <li>国内での進学・就職、総合的な英語力を証明したい → **英検®**</li>
            <li>ビジネス英語力、特にリスニング・リーディング力をアピールしたい、昇進・昇格を目指したい → **TOEIC® L&R**</li>
          </ul>
        </li>
        <li><strong>評価スキルで選ぶ:</strong>
          <ul>
            <li>スピーキングやライティングを含む4技能を伸ばしたい → **英検®**</li>
            <li>ビジネスコミュニケーションに必要なリスニング・リーディング力を測りたい → **TOEIC® L&R**</li>
          </ul>
        </li>
        <li><strong>試験形式で選ぶ:</strong>
          <ul>
            <li>面接形式のスピーキングテストがある方が良い → **英検®**</li>
            <li>マークシート形式で客観的なスコアが欲しい → **TOEIC® L&R**</li>
          </ul>
        </li>
        <li><strong>現在のレベルで選ぶ:</strong>
          <ul>
            <li>初心者から上級者まで、自分のレベルに合わせて挑戦したい → **英検®** (幅広い級がある)</li>
            <li>ある程度の英語力があり、ビジネスレベルの英語力を測りたい → **TOEIC® L&R**</li>
          </ul>
        </li>
      </ol>

      <h2>まとめ</h2>
      <p>
        英検®とTOEIC® L&R TESTは、それぞれ異なる目的と特徴を持つ試験です。
        どちらが良い・悪いということではなく、ご自身の学習目的やキャリアプラン、伸ばしたいスキルに合わせて最適な試験を選ぶことが重要です。
        両方の試験対策を通じて、総合的な英語力を高めていくことも有効なアプローチでしょう。
      </p>
      <p>
       （ここに、各試験の具体的な対策法や、ToreMockでの関連模試への誘導などを追加できます）
      </p>
       <p className="text-xs text-gray-500 mt-8">
          ※ 英検®は、公益財団法人 日本英語検定協会の登録商標です。このコンテンツは、公益財団法人 日本英語検定協会の承認や推奨、その他の検討を受けたものではありません。<br />
          ※ TOEIC is a registered trademark of ETS. This content is not endorsed or approved by ETS.
       </p>
    </div>);
};
exports.default = EikenToeicComparisonContent;
