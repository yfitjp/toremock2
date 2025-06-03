import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ToeicBeginnersGuide = () => {
  return (
    <div className="prose prose-lg max-w-none">
      {/* リード文 */}
      <p className="lead">
        「TOEICの勉強を始めたいけど、何から手をつければいいの？」「初心者でもスコアを伸ばせる効果的な方法が知りたい！」
        この記事では、そんなTOEIC初心者の方々に向けて、テストの基本情報から具体的な学習法、継続のコツまでを網羅的に解説します。
        自分に合った方法で効率的にスコアアップを目指しましょう。
      </p>

      {/* --- Section: 初心者がまず知るべきこと --- */}
      <h2>TOEIC初心者がまず知るべきこと</h2>
      <p>
        TOEIC L&R (Listening & Reading) Testは、日常生活やビジネスシーンにおける英語でのコミュニケーション能力を測定するための世界共通のテストです。
        特定の文化に基づいた知識や専門用語は問われず、幅広い場面での実践的な英語力が評価されます。
        まずはテストの全体像を把握しましょう。
      </p>

      <h3>TOEIC L&R テストの全体像</h3>
      <p>テストはリスニングとリーディングの2つのセクションで構成され、合計約2時間で200問に解答します。すべてマークシート方式です。</p>
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">セクション</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">パート</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">問題数</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">時間</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td rowSpan={4} className="px-6 py-4 align-top font-medium text-gray-900 border-r">リスニング<br/>(計100問)</td>
              <td className="px-6 py-4">Part 1</td>
              <td className="px-6 py-4">写真描写問題</td>
              <td className="px-6 py-4 text-center">6問</td>
              <td rowSpan={4} className="px-6 py-4 text-center align-middle border-l">約45分</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Part 2</td>
              <td className="px-6 py-4">応答問題</td>
              <td className="px-6 py-4 text-center">25問</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Part 3</td>
              <td className="px-6 py-4">会話問題</td>
              <td className="px-6 py-4 text-center">39問 (13会話×3問)</td>
            </tr>
            <tr>
              <td className="px-6 py-4 border-b">Part 4</td>
              <td className="px-6 py-4 border-b">説明文問題 (トーク)</td>
              <td className="px-6 py-4 text-center border-b">30問 (10トーク×3問)</td>
            </tr>
            <tr>
              <td rowSpan={3} className="px-6 py-4 align-top font-medium text-gray-900 border-r">リーディング<br/>(計100問)</td>
              <td className="px-6 py-4">Part 5</td>
              <td className="px-6 py-4">短文穴埋め問題 (文法・語彙)</td>
              <td className="px-6 py-4 text-center">30問</td>
              <td rowSpan={3} className="px-6 py-4 text-center align-middle border-l">75分</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Part 6</td>
              <td className="px-6 py-4">長文穴埋め問題 (文法・語彙・文脈)</td>
              <td className="px-6 py-4 text-center">16問 (4文書×4問)</td>
            </tr>
            <tr>
              <td className="px-6 py-4">Part 7</td>
              <td className="px-6 py-4">読解問題 (シングル/マルチプルパッセージ)</td>
              <td className="px-6 py-4 text-center">54問 (15文書: SP10, MP2, TP3)</td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50">
             <tr>
               <td colSpan={3} className="px-6 py-3 text-right font-medium text-gray-900">合計</td>
               <td className="px-6 py-3 text-center font-medium text-gray-900">200問</td>
               <td className="px-6 py-3 text-center font-medium text-gray-900">約2時間</td>
             </tr>
          </tfoot>
        </table>
      </div>

      <h3>スコアの仕組み</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>リスニング、リーディング各セクションが5点～495点の範囲で採点されます。</li>
        <li>合計スコアは10点～990点満点です。</li>
        <li>1問5点といった単純な配点ではなく、統計処理によってスコアが算出されます（正答数とスコアは完全には比例しません）。</li>
        <li>間違った解答は減点されません。分からない問題も必ず何かマークしましょう。</li>
      </ul>

      {/* --- Section: 学習を始める前に：目標スコアの設定 --- */}
      <h2>学習を始める前に：目標スコアの設定</h2>
      <p>
        具体的な目標スコアを設定することは、学習計画を立て、モチベーションを維持する上で非常に重要です。
        まずは現実的な目標を設定し、達成したら次の目標へステップアップしていくのが良いでしょう。
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li><strong>初心者 (～495点):</strong> まずは基礎固め。中学・高校レベルの文法や基本的な単語を確実に身につけることを目指しましょう。まずは500点突破が目標。</li>
        <li><strong>中級者へのステップ (500点～600点):</strong> 履歴書に書けるレベル。基本的なコミュニケーションが可能と見なされることが多いスコア帯です。語彙力を増やし、TOEICの形式に慣れることが重要になります。</li>
        <li><strong>中級者 (600点～730点):</strong> 多くの企業で英語を使う部署への応募基準となることもあるレベル。より多くの語彙や表現を習得し、時間内に問題を解く練習が必要です。</li>
        <li><strong>上級者への道 (730点～):</strong> より高度な英語力が求められるレベル。ビジネスで英語を不自由なく使えるレベルを目指します。</li>
      </ul>
      <p>現在の自分のレベルを把握するため、一度<Link href="/" className="text-green-600 hover:underline">ToreMock</Link>などの模試を受けてみることをお勧めします。</p>

      {/* 画像の例 (既存) */}
      <div className="relative aspect-video my-8 bg-slate-100 rounded-lg overflow-hidden">
        <Image
          src="/images/toeic-beginners.jpg"
          alt="TOEIC初心者向け勉強イメージ"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>

      {/* --- Section: 初心者向け学習ロードマップ --- */}
      <h2>初心者向け学習ロードマップ</h2>

      <h3>1. おすすめの基本教材とその選び方</h3>
      <p>初心者がまず揃えたい基本教材は以下の3つです。</p>
      <ul className="list-decimal pl-6 space-y-2">
        <li><strong>公式問題集:</strong> 最新版を最低1冊は用意しましょう。テスト形式や難易度を知る上で必須です。解説が詳しいものを選びましょう。</li>
        <li><strong>単語帳:</strong> TOEIC頻出単語が収録されているものを選びます。『金のフレーズ』などが定番ですが、レイアウトや音声ダウンロードの有無など、自分が続けやすいものを選びましょう。</li>
        <li><strong>基礎文法書:</strong> 中学・高校レベルの文法を分かりやすく解説しているものがおすすめです。TOEICに特化した文法書も良いですが、まずは基礎を固めることが大切です。</li>
      </ul>
      <p>教材はたくさん買う必要はありません。まずは基本の3冊を繰り返し学習することが重要です。</p>

      <h3>2. 3ヶ月学習プラン例 (より具体的に)</h3>
      <p>以下は、500点～600点を目指す初心者を想定した3ヶ月の学習プラン例です。ご自身の生活スタイルに合わせて調整してください。</p>
      <ul className="list-none pl-0 space-y-4">
        <li>
          <strong>【1ヶ月目】基礎固めフェーズ (目標: TOEICの基本を理解し、学習習慣を確立)</strong>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>文法:</strong> 基礎文法書を通読し、基本的な文型、時制、品詞などを復習。(毎日30分～1時間)</li>
            <li><strong>単語:</strong> TOEIC頻出単語帳を開始。まずは見出し語を中心に、毎日少しずつ覚える。(毎日15分～30分)</li>
            <li><strong>TOEIC形式理解:</strong> 公式問題集のPart 1, 2, 5あたりを少しずつ解いてみる。時間を計らず、解説を読んで理解することを優先。</li>
          </ul>
        </li>
        <li>
          <strong>【2ヶ月目】インプット強化＆形式慣れフェーズ (目標: 語彙・文法知識を増やし、リスニング・リーディングに慣れる)</strong>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>文法:</strong> 文法書2周目、またはTOEIC向け文法問題集を開始。(毎日30分)</li>
            <li><strong>単語:</strong> 単語帳の学習を継続。派生語や例文にも目を通す。(毎日15分～30分)</li>
            <li><strong>リスニング:</strong> 公式問題集 Part 1-4 の問題を解き、復習。短い音声でシャドーイングを開始。(毎日30分)</li>
            <li><strong>リーディング:</strong> 公式問題集 Part 5, 6 を中心に解き、文法・語彙知識を確認。Part 7の短い文書にも挑戦。(毎日30分)</li>
          </ul>
        </li>
        <li>
          <strong>【3ヶ月目】アウトプット＆実践力養成フェーズ (目標: 時間内に解く練習をし、本番に近い形式で実力を試す)</strong>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>単語・文法:</strong> これまで学習した内容の復習。(毎日15分)</li>
            <li><strong>実践演習 (模試):</strong> 公式問題集や<Link href="/" className="text-green-600 hover:underline">ToreMock</Link>などで、時間を計って模試を解く。(週末などに2時間)</li>
            <li><strong>弱点克服:</strong> 模試の結果を分析し、苦手なパートや問題タイプを重点的に復習。(毎日1時間)</li>
            <li><strong>時間配分練習:</strong> 各パートの目標解答時間を意識して問題を解く練習。</li>
          </ul>
        </li>
      </ul>
      <p><strong>学習時間の目安:</strong> 平日は1～1.5時間、休日は2～3時間程度が理想ですが、無理なく続けられる範囲で計画しましょう。</p>


      {/* --- Section: 【重要】初心者におすすめの学習法5選 (既存の内容を活かす) --- */}
      <h2>【重要】初心者におすすめの学習法5選</h2>
      <p>上記のロードマップを進める上で、特に効果的な学習法を5つご紹介します。評価や教材例は参考にしてください。</p>
      <div className="space-y-8 mt-6">
        {/* 勉強法1 */}
        <div>
          <h3 className="text-xl font-semibold">1. 公式問題集を徹底活用 (ロードマップ全体で重要)</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★★</span> (効果) / <span className="font-bold text-green-500">★★★★☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> テスト形式に慣れる、出題傾向を知る、時間配分を練習する。</p>
          <p><strong>おすすめ教材:</strong> TOEIC Listening & Reading Test 公式問題集シリーズ</p>
          <p><strong>Tips:</strong> まずは時間を計らずに解き、その後じっくり復習。間違えた問題の原因を分析することが重要です。</p>
        </div>

        {/* 勉強法2 */}
        <div>
          <h3 className="text-xl font-semibold">2. 中学・高校レベルの英文法を復習 (ロードマップ1ヶ月目)</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★☆</span> (効果) / <span className="font-bold text-green-500">★★★★★</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> リーディングの基礎固め、文構造の理解。</p>
          <p><strong>おすすめ教材:</strong> 『中学校3年間の英語が1冊でしっかりわかる本』などの基礎文法書</p>
          <p><strong>Tips:</strong> 完璧を目指さず、まずは基本的な文型や時制などを思い出しましょう。</p>
        </div>

        {/* 勉強法3 */}
        <div>
          <h3 className="text-xl font-semibold">3. TOEIC頻出単語の暗記 (ロードマップ全体で継続)</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★★</span> (効果) / <span className="font-bold text-green-500">★★★★☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> 語彙力アップ、リスニング・リーディング双方のスコア向上。</p>
          <p><strong>おすすめ教材:</strong> 『TOEIC L & R TEST 出る単特急 金のフレーズ』などの単語帳、単語学習アプリ</p>
          <p><strong>Tips:</strong> フレーズや例文の中で覚えるのが効果的。毎日少しずつでも継続することが大切です。</p>
        </div>

        {/* 勉強法4 */}
        <div>
          <h3 className="text-xl font-semibold">4. シャドーイングでリスニング力強化 (ロードマップ2ヶ月目～)</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★☆</span> (効果) / <span className="font-bold text-green-500">★★★☆☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> 音声知覚の向上、英語のリズムやイントネーションに慣れる。</p>
          <p><strong>おすすめ教材:</strong> 公式問題集のリスニング音声、英語学習アプリのシャドーイング機能</p>
          <p><strong>Tips:</strong> スクリプトを見ながら始め、徐々にスクリプトなしで挑戦。最初は短い音声から始めましょう。</p>
        </div>

        {/* 勉強法5 */}
        <div>
          <h3 className="text-xl font-semibold">5. オンライン模試で実力試し (ロードマップ3ヶ月目)</h3>
          <p><strong>評価:</strong> <span className="font-bold text-yellow-500">★★★★★</span> (効果) / <span className="font-bold text-green-500">★★★★☆</span> (手軽さ)</p>
          <p><strong>学習ポイント:</strong> 本番形式での実践練習、時間配分の練習、弱点発見。</p>
          <p><strong>おすすめサービス:</strong> <Link href="/" className="text-green-600 hover:underline">ToreMock</Link> などのオンラインTOEIC模試サイト</p>
          <p><strong>Tips:</strong> 定期的に模試を受け、学習の成果を確認し、モチベーションを維持しましょう。ToreMockなら詳細なフィードバックも得られます。</p>
        </div>
      </div>


      {/* --- Section: 各パートの簡単な取り組み方 --- */}
      <h2>各パートの簡単な取り組み方 (初心者向けアドバイス)</h2>
      <p>全パートを完璧にするのは大変です。まずは各パートで意識すべき簡単なポイントを押さえましょう。</p>
      <ul className="list-disc pl-6 space-y-3">
          <li><strong>Part 1 (写真描写):</strong> 写真に写っていないものは選ばない。人物の動作や物の状態を表す基本的な動詞・名詞に注意する。</li>
          <li><strong>Part 2 (応答問題):</strong> 最初の疑問詞 (Who, What, When, Where, Why, How) を聞き取るのが最重要。Yes/Noで答えられない質問に注意。</li>
          <li><strong>Part 3 (会話問題):</strong> 設問を先に読み、何を聞かれているかを把握してから会話を聞く。会話の流れ（場面、登場人物の関係、話題）を追う。</li>
          <li><strong>Part 4 (説明文問題):</strong> Part 3と同様に設問先読みが有効。アナウンス、ナレーションなど、話の種類を意識する。</li>
          <li><strong>Part 5 (短文穴埋め):</strong> まず選択肢を見て問題タイプ（文法か語彙か）を判断。空所の前後を見て解ける問題が多い。時間をかけすぎない。</li>
          <li><strong>Part 6 (長文穴埋め):</strong> 空所の前後だけでなく、文脈全体を理解する必要がある問題も。文挿入問題は最後に解くのも手。</li>
          <li><strong>Part 7 (読解問題):</strong> ここも設問先読みが基本。文書の種類（メール、記事、広告など）を把握し、どこに情報がありそうか推測する。時間を意識し、解ける問題から取り組む。</li>
      </ul>

      {/* --- Section: モチベーション維持のヒント --- */}
      <h2>モチベーション維持のヒント</h2>
      <p>TOEIC学習は継続が力となります。モチベーションを保つためのヒントをいくつかご紹介します。</p>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>小さな成功体験を積み重ねる:</strong> 「今日は単語を10個覚えた」「模試の点数が少し上がった」など、小さな進歩を喜び、自分を褒めましょう。</li>
        <li><strong>学習仲間を見つける:</strong> SNSや勉強会などで同じ目標を持つ仲間を見つけ、励まし合う。</li>
        <li><strong>学習記録をつける:</strong> 勉強時間や進捗を記録し、可視化することで達成感を得やすくなります。</li>
        <li><strong>目標を定期的に見直す:</strong> 学習の進捗に合わせて目標スコアや学習計画を調整しましょう。</li>
        <li><strong>英語に触れる機会を増やす:</strong> 勉強だけでなく、好きな洋楽を聴いたり、海外ドラマを見たりして、楽しみながら英語に触れる時間を作りましょう。</li>
        <li><strong>休息も大切:</strong> 疲れているときは無理せず休み、リフレッシュすることも継続のためには重要です。</li>
      </ul>

      {/* --- Section: よくある質問 (Q&A) --- */}
      <h2>よくある質問 (Q&A)</h2>
      <div className="space-y-6">
        <div>
          <p className="font-semibold">Q1: 本当に何から始めればいいか分かりません。</p>
          <p><strong>A1:</strong> まずは公式問題集を1冊購入し、時間を計らずに解いてみてください。そして、この記事で紹介した基礎的な単語帳と文法書から始めて、毎日少しずつ学習する習慣をつけることを目指しましょう。</p>
        </div>
        <div>
          <p className="font-semibold">Q2: 単語がどうしても覚えられません。</p>
          <p><strong>A2:</strong> 忘れるのは自然なことです。一度で完璧に覚えようとせず、何度も繰り返し触れることが重要です。単語帳だけでなく、例文の中で覚えたり、<Link href="/articles/effective-vocabulary-learning" className="text-green-600 hover:underline">効果的な覚え方</Link>（この記事でも紹介しています）を試したりしてみてください。</p>
        </div>
        <div>
          <p className="font-semibold">Q3: リスニングが全く聞き取れません。</p>
          <p><strong>A3:</strong> 最初は誰でも聞き取れません。まずはスクリプトを見ながら音声を聞き、意味と音を結びつける練習から始めましょう。その後、シャドーイングを取り入れると効果的です。短い簡単な音声から始めるのがおすすめです。</p>
        </div>
         <div>
          <p className="font-semibold">Q4: 勉強時間がなかなか取れません。</p>
          <p><strong>A4:</strong> まとまった時間が取れなくても大丈夫です。通勤・通学中や休憩時間などのスキマ時間を活用しましょう。単語アプリを使ったり、短いリスニング音声を聞いたりするだけでも積み重ねになります。</p>
        </div>
         <div>
          <p className="font-semibold">Q5: スコアが伸び悩んでいます。</p>
          <p><strong>A5:</strong> スコアが停滞する時期は誰にでもあります。焦らず、これまでの学習方法を見直してみましょう。模試の結果を分析して弱点を把握し、その対策を集中的に行うのが効果的です。新しい教材に手を出すより、今ある教材を完璧にすることを意識してみてください。</p>
        </div>
      </div>

      {/* 既存の引用 (少し変更) */}
      <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-6">
        <p>"The journey of a thousand miles begins with a single step." (千里の道も一歩から)</p>
        <p>初心者にとって大切なのは、完璧を目指すことではなく、学習を継続することです。自分に合ったペースで着実に進めましょう。</p>
      </blockquote>


      {/* まとめ (修正) */}
      <h2>まとめ：今日から始めるTOEIC学習！</h2>
      <p>TOEIC初心者向けの学習ガイドとして、テストの基本情報から具体的なロードマップ、学習法、モチベーション維持のコツ、Q&Aまで幅広く解説しました。
        重要なのは、<strong>①目標を設定し、②自分に合った教材を選び、③学習計画を立て、④そして何より継続すること</strong>です。
        この記事で紹介した内容が、あなたのTOEIC学習の第一歩となり、目標スコア達成への助けとなれば幸いです。
        ぜひ、<Link href="/" className="text-green-600 hover:underline">ToreMock</Link>などのツールも活用しながら、今日から学習をスタートさせてみてください！</p>

       {/* 内部リンクの例 (修正・追加) */}
       <p className="mt-8">
         TOEIC模試について詳しく知りたい方は、<Link href="/articles/toeic-mocktest-comparison" className="text-green-600 hover:underline">こちらの模試比較記事</Link>もご覧ください。<br/>
         Part 5の具体的な攻略法は<Link href="/articles/toeic-part5-strategy" className="text-green-600 hover:underline">こちらの記事</Link>で詳しく解説しています。
       </p>
    </div>
  );
};

export default ToeicBeginnersGuideContent; 