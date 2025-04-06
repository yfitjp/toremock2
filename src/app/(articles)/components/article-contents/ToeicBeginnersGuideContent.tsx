import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ToeicBeginnersGuideContent = () => {
  return (
    <div className="prose prose-lg max-w-none">
      {/* リード文 */}
      <p className="lead">
        TOEIC初心者におすすめの勉強法を紹介。自分に合った方法で効率的にスコアアップを目指しましょう。
      </p>

      <h2>TOEIC初心者がまず知るべきこと</h2>
      <p>
        「TOEICの勉強を始めたいけど、何から手をつければいいかわからない…」そんな悩みを抱える初心者の方へ。
        TOEICは、ビジネスシーンや日常生活における英語コミュニケーション能力を測るテストです。
        まずはテストの構成や特徴を理解し、自分に合った学習計画を立てることが重要です。
      </p>

      <h3>TOEIC L&R テストの構成</h3>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>リスニングセクション (約45分間・100問):</strong> 写真描写問題、応答問題、会話問題、説明文問題</li>
        <li><strong>リーディングセクション (75分間・100問):</strong> 短文穴埋め問題、長文穴埋め問題、読解問題（シングルパッセージ・マルチプルパッセージ）</li>
      </ul>
      <p>合計約2時間で200問を解く、時間との戦いでもあるテストです。</p>

      {/* 画像の例 */}
      <div className="relative aspect-video my-8 bg-slate-100 rounded-lg overflow-hidden">
        <Image
          src="/images/toeic-beginners.jpg"
          alt="TOEIC初心者向け勉強イメージ"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>

      <h2>初心者におすすめの勉強法5選</h2>
      <p>ここでは、初心者の方が取り組みやすく、効果を実感しやすい勉強法を5つ厳選してご紹介します。料金や使いやすさも考慮しています。</p>

      <div className="space-y-8 mt-6">
        {/* 勉強法1 */}
        <div>
          <h3 className="text-xl font-semibold">1. 公式問題集を徹底活用</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★★</span> (効果) / <span className="font-bold text-green-500">★★★★☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> テスト形式に慣れる、出題傾向を知る、時間配分を練習する。</p>
          <p><strong>おすすめ教材:</strong> TOEIC Listening & Reading Test 公式問題集シリーズ</p>
          <p><strong>Tips:</strong> まずは時間を計らずに解き、その後じっくり復習。間違えた問題の原因を分析することが重要です。</p>
        </div>

        {/* 勉強法2 */}
        <div>
          <h3 className="text-xl font-semibold">2. 中学・高校レベルの英文法を復習</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★☆</span> (効果) / <span className="font-bold text-green-500">★★★★★</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> リーディングの基礎固め、文構造の理解。</p>
          <p><strong>おすすめ教材:</strong> 『中学校3年間の英語が1冊でしっかりわかる本』などの基礎文法書</p>
          <p><strong>Tips:</strong> 完璧を目指さず、まずは基本的な文型や時制などを思い出しましょう。</p>
        </div>

        {/* 勉強法3 */}
        <div>
          <h3 className="text-xl font-semibold">3. TOEIC頻出単語の暗記</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★★</span> (効果) / <span className="font-bold text-green-500">★★★★☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> 語彙力アップ、リスニング・リーディング双方のスコア向上。</p>
          <p><strong>おすすめ教材:</strong> 『TOEIC L & R TEST 出る単特急 金のフレーズ』などの単語帳、単語学習アプリ</p>
          <p><strong>Tips:</strong> フレーズや例文の中で覚えるのが効果的。毎日少しずつでも継続することが大切です。</p>
        </div>

        {/* 勉強法4 */}
        <div>
          <h3 className="text-xl font-semibold">4. シャドーイングでリスニング力強化</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★☆</span> (効果) / <span className="font-bold text-green-500">★★★☆☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> 音声知覚の向上、英語のリズムやイントネーションに慣れる。</p>
          <p><strong>おすすめ教材:</strong> 公式問題集のリスニング音声、英語学習アプリのシャドーイング機能</p>
          <p><strong>Tips:</strong> スクリプトを見ながら始め、徐々にスクリプトなしで挑戦。最初は短い音声から始めましょう。</p>
        </div>

        {/* 勉強法5 */}
        <div>
          <h3 className="text-xl font-semibold">5. オンライン模試で実力試し (ToreMockなど)</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★★</span> (効果) / <span className="font-bold text-green-500">★★★★☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> 本番形式での実践練習、時間配分の練習、弱点発見。</p>
          <p><strong>おすすめサービス:</strong> <Link href="/" className="text-green-600 hover:underline">ToreMock</Link> などのオンラインTOEIC模試サイト</p>
          <p><strong>Tips:</strong> 定期的に模試を受け、学習の成果を確認し、モチベーションを維持しましょう。ToreMockなら詳細なフィードバックも得られます。</p>
        </div>
      </div>

      <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-6">
        <p>"初心者にとって大切なのは、完璧を目指すことではなく、学習を継続することです。自分に合ったペースで着実に進めましょう。"</p>
      </blockquote>

      <h2>3ヶ月学習プラン例 (初心者向け)</h2>
      <p>あくまで一例ですが、以下のようなプランで学習を進めることができます。</p>
      <ul className="list-none pl-0 space-y-4">
        <li><strong>1ヶ月目:</strong> 基礎固め (中学・高校文法復習、基礎単語暗記)</li>
        <li><strong>2ヶ月目:</strong> TOEIC形式に慣れる (公式問題集 Part 1-4 中心、頻出単語暗記継続、シャドーイング開始)</li>
        <li><strong>3ヶ月目:</strong> 実践力養成 (公式問題集 Part 5-7 中心、時間配分練習、オンライン模試受験)</li>
      </ul>

      <h2>まとめ：自分に合った勉強法でTOEIC学習をスタート！</h2>
      <p>TOEIC初心者向けの勉強法を5つご紹介しました。どれか一つに絞る必要はなく、これらを組み合わせることでより効果的な学習が可能です。
         重要なのは、自分に合った方法を見つけ、無理なく継続すること。
         ぜひ、この記事を参考に、あなたのTOEIC学習を今日からスタートさせてみてください。</p>

       {/* 内部リンクの例 */}
       <p className="mt-8">
         TOEIC模試について詳しく知りたい方は、<Link href="/articles/toeic-mocktest-comparison" className="text-green-600 hover:underline">こちらの模試比較記事</Link>もご覧ください。
       </p>
    </div>
  );
};

export default ToeicBeginnersGuideContent; 