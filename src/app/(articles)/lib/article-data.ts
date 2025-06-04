export type CategoryKey = 'TOEIC' | 'TOEFL' | '英語試験' | '学習法';

export type ArticleData = {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  date: string; // YYYY-MM-DD 形式
  readTime: string;
  imageSrc: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  comingSoon?: boolean;
};

// ハードコードされた記事データ (日付順に並び替え)
export const articleData: Record<string, ArticleData> = {
  "english-study-beginner-tips": {
    "id": "english-study-beginner-tips",
    "title": "英語初心者の勉強法！まず何から始めるべき？",
    "description": "英語学習を始めたばかりの高校生・大学生へ。何から手をつければ良いか分からないあなたに、英単語・文法の基礎固めから、リスニング・リーディングの習慣化、アウトプット練習、そして学習を継続するコツまで、具体的な方法とおすすめ教材・ツールを分かりやすく解説します。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/english-study-beginner-tips.jpg",
    "tags": [
      "英語学習",
      "初心者",
      "勉強法",
      "高校生",
      "大学生",
      "基礎固め",
      "継続のコツ",
      "英単語",
      "英文法",
      "リスニング",
      "スピーキング",
      "英語教材"
    ],
    "featured": true,
  },
  "english-learning-motivation-keep": {
    "id": "english-learning-motivation-keep",
    "title": "英語学習のやる気が出ない？モチベ維持法5選",
    "description": "英語学習のやる気が出ない…そんな悩みを解決！この記事では、目標設定、習慣化、楽しみ方、仲間との学習、完璧主義を手放すという5つの具体的なモチベーション維持法を、アプリやサイトの例を交えて解説。楽しく英語学習を続ける秘訣が満載です。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "7分",
    "imageSrc": "/images/english-learning-motivation-keep.jpg",
    "tags": [
      "英語学習",
      "モチベーション",
      "継続",
      "学習方法",
      "初心者",
      "英語勉強法",
      "やる気",
      "挫折しない",
      "習慣化",
      "英語の勉強"
    ],
    "featured": true,
  },
  "english-study-habit-making": {
    "id": "english-study-habit-making",
    "title": "英語学習を習慣化！無理なく続ける3つの秘訣",
    "description": "英語学習を毎日の習慣にしたいけど続かないあなたへ。この記事では、忙しい学生や社会人でも無理なく英語学習を生活の一部にするための、具体的で効果的な3つの秘訣（スモールステップ、学習のエンタメ化、記録と振り返り）を分かりやすく解説。今日から実践できるヒントが満載です。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/english-study-habit-making.jpg",
    "tags": [
      "英語学習",
      "習慣化",
      "継続のコツ",
      "勉強法",
      "モチベーション",
      "初心者",
      "英語独学",
      "スモールステップ"
    ],
    "featured": true,
  },
  "fun-english-learning-methods": {
    "id": "fun-english-learning-methods",
    "title": "英語学習が楽しくなる！ユニークな勉強法7選",
    "description": "英語学習、もっと楽しく続けたいと思いませんか？この記事では、ゲームや趣味と組み合わせるユニークな勉強法を7つ厳選してご紹介。学校の勉強とは一味違う、あなたにぴったりの学習法がきっと見つかります。今日から英語をもっと身近に感じましょう！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/fun-english-learning-methods.jpg",
    "tags": [
      "英語学習",
      "勉強法",
      "初心者",
      "楽しい",
      "モチベーション",
      "趣味",
      "ユニーク",
      "継続"
    ]
  },
  "toeic-part5-time-management": {
    "id": "toeic-part5-time-management",
    "title": "TOEIC Part5 時間配分！75点UPの時短術",
    "description": "TOEIC Part5で時間が足りずお悩みの方へ。この記事では、効果的な時間配分テクニックと、文法・語彙問題を素早く解くための具体的な時短術を徹底解説します。Part5を得点源に変え、75点アップを目指しましょう！",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/toeic-part5-time-management.jpg",
    "tags": [
      "TOEIC",
      "Part5",
      "時間配分",
      "時短術",
      "スコアアップ",
      "英語学習",
      "文法問題",
      "リーディング対策"
    ]
  },
  "toeic-listening-dictation-practice": {
    "id": "toeic-listening-dictation-practice",
    "title": "TOEICリスニング満点者が教えるディクテーション",
    "description": "TOEICリスニングでスコアアップを目指すあなたへ。満点獲得者が実践するディクテーションの具体的なやり方、効果、注意点を徹底解説。聞き取れない原因を特定し、効果的な学習法でリスニング力を飛躍的に向上させましょう。",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "6分",
    "imageSrc": "/images/toeic-listening-dictation-practice.jpg",
    "tags": [
      "TOEICリスニング",
      "ディクテーション",
      "英語学習法",
      "リスニング力向上",
      "満点対策",
      "聞き取り練習",
      "英語独学"
    ]
  },
  "toeic-beginner-score-up-600": {
    "id": "toeic-beginner-score-up-600",
    "title": "初めてのTOEICで600点突破！勉強法と対策",
    "description": "TOEIC初受験の高校生・大学生が600点を目指すための効果的な勉強法、パート別対策、おすすめ参考書・アプリ、試験当日の心得を網羅。この記事を読めば、目標達成への具体的な道筋が見えます！",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/toeic-beginner-score-up-600.jpg",
    "tags": [
      "TOEIC",
      "英語学習",
      "初心者",
      "600点",
      "勉強法",
      "高校生",
      "大学生",
      "参考書",
      "TOEIC対策"
    ]
  },
  "eiken-grade2-interview-tips": {
    "id": "eiken-grade2-interview-tips",
    "title": "英検2級面接対策！頻出質問と合格ポイント",
    "description": "英検2級の面接、緊張しますよね？この記事では、面接の流れから頻出質問とその模範解答例、さらには合格を確実にするための重要なポイントや効果的な練習方法まで、具体的かつ分かりやすく解説します。これであなたも自信を持って面接に臨めます！",
    "category": "英語試験",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/eiken-grade2-interview-tips.jpg",
    "tags": [
      "英検2級",
      "面接対策",
      "二次試験",
      "英語学習",
      "合格戦略",
      "スピーキング",
      "面接質問例",
      "英語試験対策"
    ]
  },
  "toefl-ibt-speaking-independent-task": {
    "id": "toefl-ibt-speaking-independent-task",
    "title": "TOEFLスピーキング Independent Task攻略法",
    "description": "TOEFL iBTスピーキング Independent Taskで高得点を狙うための鉄板テンプレート、効果的な練習ステップ、役立つ学習リソース（書籍、サイト、アプリ）を具体的に紹介。論理的な意見表明スキルを磨き、自信を持って試験に臨むためのコツが満載です。",
    "category": "TOEFL",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/toefl-ibt-speaking-independent-task.jpg",
    "tags": [
      "TOEFL",
      "スピーキング",
      "Independent Task",
      "英語学習",
      "試験対策",
      "テンプレート",
      "高得点",
      "勉強法",
      "論理的思考"
    ]
  },
  "english-conversation-self-study": {
    "id": "english-conversation-self-study",
    "title": "英会話独学でもペラペラに？効果的な練習法5選",
    "description": "英会話を独学で習得したいあなたへ。この記事では、シャドーイング、オンライン英会話、独り言など、自宅でできる効果的な練習法を5つ厳選して紹介します。具体的なやり方やおすすめ教材も解説し、スピーキング力アップをサポート。今日から実践できるヒントが満載です！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/english-conversation-self-study.jpg",
    "tags": [
      "英会話",
      "独学",
      "スピーキング",
      "英語学習",
      "練習法",
      "自宅学習",
      "初心者",
      "英語脳",
      "シャドーイング",
      "オンライン英会話"
    ]
  },
  "shadowing-effective-method": {
    "id": "shadowing-effective-method",
    "title": "効果的なシャドーイングのやり方【初心者向け】",
    "description": "英語のリスニングとスピーキングを同時に鍛えるシャドーイング。この記事では、初心者でも無理なく効果的にシャドーイングを始めるための正しいやり方を7つのステップで徹底解説。教材選びのコツから効果を最大化する秘訣、よくある疑問まで網羅し、あなたの英語力向上をサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/shadowing-effective-method.jpg",
    "tags": [
      "シャドーイング",
      "英語学習",
      "初心者",
      "リスニング",
      "スピーキング",
      "発音矯正",
      "独学",
      "英語勉強法"
    ]
  },
  "english-pronunciation-correction-apps": {
    "id": "english-pronunciation-correction-apps",
    "title": "英語発音矯正アプリ比較！ネイティブ発音へ導く",
    "description": "日本人特有の英語発音にお悩みですか？この記事では、ELSA Speakやスピークバディなど、おすすめの発音矯正アプリを徹底比較。AIによるフィードバックや豊富な練習機能で、ネイティブのような綺麗な発音を目指すための選び方と活用法を解説します。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/english-pronunciation-correction-apps.jpg",
    "tags": [
      "英語発音矯正アプリ",
      "発音練習",
      "ネイティブ発音",
      "スピーキング",
      "英語学習アプリ",
      "シャドーイング",
      "AI採点",
      "英語学習",
      "発音矯正"
    ]
  },
  "english-vocabulary-anki-usage": {
    "id": "english-vocabulary-anki-usage",
    "title": "Ankiで英単語暗記！効果的な設定と使い方",
    "description": "英単語暗記の定番アプリAnkiの効果的な使い方を徹底解説。初心者向けの基本操作から、学習効率を上げるおすすめ設定、便利なデッキやリソースまで網羅。Ankiをフル活用して、あなたの英語語彙力を飛躍的に向上させましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/english-vocabulary-anki-usage.jpg",
    "tags": [
      "Anki",
      "英単語",
      "暗記",
      "英語学習",
      "効率化",
      "アプリ",
      "SRS",
      "フラッシュカード",
      "学習法",
      "単語帳",
      "ボキャブラリー",
      "無料ツール"
    ]
  },
  "english-grammar-weakness-study": {
    "id": "english-grammar-weakness-study",
    "title": "英語文法苦手克服！中学レベルからやり直す法",
    "description": "英語の文法が苦手で学習が進まないあなたへ。この記事では、中学レベルの基礎から楽しく、そして確実に文法をやり直すための具体的な勉強法、おすすめの教材やアプリ、モチベーション維持のコツを紹介します。英語学習の壁を突破し、自信をつけましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "7分",
    "imageSrc": "/images/english-grammar-weakness-study.jpg",
    "tags": [
      "英文法",
      "中学英語",
      "英語学習",
      "やり直し英語",
      "英語初心者",
      "基礎英語",
      "英語勉強法"
    ]
  },
  "english-reading-speed-increase": {
    "id": "english-reading-speed-increase",
    "title": "英語長文を読む速度を上げる！速読トレーニング法",
    "description": "英語長文読解に時間がかかり悩んでいませんか？この記事では、試験対策や多読に効果的な英語速読トレーニング法を具体的に解説。語彙力強化からチャンクリーディング、スキミングまで、実践的なテクニックで読解スピードと内容理解を同時に向上させる秘訣を紹介します。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/english-reading-speed-increase.jpg",
    "tags": [
      "英語速読",
      "長文読解",
      "リーディング対策",
      "英語学習法",
      "多読",
      "試験対策",
      "TOEIC対策",
      "TOEFL対策",
      "読解力向上",
      "英語脳"
    ]
  },
  "learn-english-with-songs-lyrics": {
    "id": "learn-english-with-songs-lyrics",
    "title": "洋楽で英語学習！歌詞を使った楽しい勉強法",
    "description": "好きな洋楽を聴きながら英語が学べたら最高ですよね？この記事では、洋楽の歌詞を活用して楽しくボキャブラリーを増やし、リスニング力を鍛える具体的なステップや、学習効果を高める応用テクニック、おすすめツールを紹介します。初心者でも無理なく続けられるコツも解説！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/learn-english-with-songs-lyrics.jpg",
    "tags": [
      "洋楽で英語学習",
      "英語学習法",
      "歌詞で英語",
      "リスニング学習",
      "英語の歌",
      "ボキャブラリー増強",
      "英語 初心者",
      "楽しく学ぶ英語",
      "英語独学"
    ]
  },
  "english-movie-drama-study-tips": {
    "id": "english-movie-drama-study-tips",
    "title": "映画・海外ドラマで英語学習！初心者向け選び方",
    "description": "映画や海外ドラマで生きた英語を学びたい初心者へ！この記事では、無理なく楽しめる作品の選び方から、字幕活用法、シャドーイング、便利ツールまで、効果的な学習ステップを具体的に解説。楽しみながら英語力をアップさせる秘訣が満載です。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/english-movie-drama-study-tips.jpg",
    "tags": [
      "英語学習",
      "映画で英語",
      "海外ドラマで英語",
      "初心者",
      "リスニング学習",
      "スピーキング練習",
      "英会話フレーズ",
      "英語勉強法",
      "動画学習"
    ]
  },
  "online-english-conversation-comparison": {
    "id": "online-english-conversation-comparison",
    "title": "オンライン英会話比較！初心者向けおすすめ5選",
    "description": "オンライン英会話を始めたい初心者必見！料金、講師、教材などを徹底比較し、おすすめのスクールを5つ厳選して紹介。自分にぴったりのサービスを見つけて、英語学習をスタートしましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/online-english-conversation-comparison.jpg",
    "tags": [
      "オンライン英会話",
      "初心者",
      "比較",
      "おすすめ",
      "英語学習",
      "英会話スクール",
      "選び方",
      "DMM英会話",
      "レアジョブ英会話",
      "ネイティブキャンプ",
      "QQ English",
      "Kimini英会話"
    ]
  },
  "study-abroad-preparation-english": {
    "id": "study-abroad-preparation-english",
    "title": "留学前にやるべき英語学習！目標設定と準備",
    "description": "留学を控えたあなたが、現地で困らないための英語力を日本で効率的に身につける方法を解説！具体的な目標設定から、語彙、文法、4技能別の実践的学習法、おすすめ教材まで、今日から始められる準備の全てを網羅します。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "11分",
    "imageSrc": "/images/study-abroad-preparation-english.jpg",
    "tags": [
      "英語学習",
      "留学準備",
      "目標設定",
      "英語勉強法",
      "日本でできる英語学習",
      "海外留学",
      "語学学習"
    ]
  },
  "business-email-english-closing": {
    "id": "business-email-english-closing",
    "title": "ビジネスメール英語の結び方【失礼なく締める】",
    "description": "英語のビジネスメール、結びで迷いますか？この記事では、相手に失礼なく、好印象を与えるための英語の結びの言葉を状況別に詳しく解説。フォーマルからカジュアルまで、今すぐ使える実践的なフレーズ集で、あなたのメールコミュニケーションを格段に向上させます。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/business-email-english-closing.jpg",
    "tags": [
      "ビジネス英語",
      "英語メール",
      "結び方",
      "英語表現",
      "英文メール",
      "マナー",
      "コミュニケーション"
    ],
    "popular": true,
  },
  "english-presentation-slide-design": {
    "id": "english-presentation-slide-design",
    "title": "英語プレゼン資料作成のコツ【伝わるデザイン】",
    "description": "英語プレゼンで聴衆を引き込む、伝わる資料作成のコツを徹底解説！デザインの基本原則から、効果的な英語表現、役立つツールまで網羅。この記事を読めば、あなたのプレゼンが見違えるほど分かりやすくなります。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "6分",
    "imageSrc": "/images/english-presentation-slide-design.jpg",
    "tags": [
      "英語プレゼン",
      "スライドデザイン",
      "プレゼン資料",
      "英語学習",
      "ビジネス英語",
      "資料作成",
      "デザインコツ",
      "国際コミュニケーション"
    ]
  },
  "english-job-interview-part-time": {
    "id": "english-job-interview-part-time",
    "title": "英語を使うバイト面接対策！頻出質問＆回答例",
    "description": "英語を使うアルバイトの面接突破を応援！よく聞かれる質問と好印象を与える英語回答例、事前の準備や心構え、さらには効果的な英語学習法まで具体的に解説します。これであなたも自信を持って面接に臨めます。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/english-job-interview-part-time.jpg",
    "tags": [
      "英語 面接",
      "アルバイト 面接",
      "英語 バイト",
      "面接対策",
      "英語学習",
      "頻出質問",
      "英会話"
    ]
  },
  "english-news-reading-beginners": {
    "id": "english-news-reading-beginners",
    "title": "英語ニュースを読むコツ【初心者向けサイトも】",
    "description": "英語で世界のニュースを読みたい初心者の方向けに、無理なく読めるおすすめニュースサイトと効果的な読解ステップを具体的に解説。語彙力アップのコツや、Anki、VOA Learning Englishなどの活用法も紹介し、英語ニュース読解を習慣化するお手伝いをします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "13分",
    "imageSrc": "/images/english-news-reading-beginners.jpg",
    "tags": [
      "英語ニュース",
      "初心者",
      "英語学習",
      "リーディング",
      "読解力",
      "おすすめサイト",
      "勉強法",
      "多読",
      "VOA",
      "BBC"
    ]
  },
  "english-diary-writing-benefits": {
    "id": "english-diary-writing-benefits",
    "title": "英語で日記を書くメリットと始め方【例文付】",
    "description": "英語で日記を書くと本当にライティング力が上がるの？この記事では、英語日記がもたらす驚きの効果と、初心者でも無理なく楽しく始められる具体的なステップや書き方のコツを、豊富な例文と共に解説します。英語学習の習慣化にも最適！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/english-diary-writing-benefits.jpg",
    "tags": [
      "英語日記",
      "英語学習",
      "ライティング",
      "初心者",
      "英語勉強法",
      "習慣化",
      "英語力アップ"
    ]
  },
  "academic-english-essay-writing": {
    "id": "academic-english-essay-writing",
    "title": "大学レポートに役立つアカデミック英語入門",
    "description": "大学での英語レポートや論文作成に必須となるアカデミックライティングの基礎を徹底解説。効果的な構成（序論・本論・結論）、適切な語彙・表現の選び方から、参考文献の正しい引用方法、剽窃を防ぐコツまで、実践的な学習ツールや情報源も紹介し、初心者でも自信を持って取り組めるようサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/academic-english-essay-writing.jpg",
    "tags": [
      "アカデミックライティング",
      "英語論文",
      "レポート作成",
      "英語学習",
      "大学生向け",
      "英文法",
      "ライティングスキル"
    ]
  },
  "english-discussion-active-participation": {
    "id": "english-discussion-active-participation",
    "title": "英語ディスカッションで積極的に発言するコツ",
    "description": "英語のディスカッションで発言できず悩んでいませんか？この記事では、自信を持って積極的に意見を述べるための具体的な準備方法、役立つ英語フレーズ、効果的な練習法を徹底解説。今日から使えるコツ満載で、あなたの英語コミュニケーション能力向上をサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/english-discussion-active-participation.jpg",
    "tags": [
      "英語ディスカッション",
      "英会話 発言",
      "スピーキング練習",
      "英語学習 コツ",
      "コミュニケーション能力",
      "英語フレーズ"
    ]
  },
  "native-speaker-conversation-tips": {
    "id": "native-speaker-conversation-tips",
    "title": "ネイティブとの英会話で緊張しない！実践テク",
    "description": "ネイティブスピーカーとの英会話で緊張して言葉に詰まる経験はありませんか？この記事では、リラックスして会話を楽しむための心構え、準備、実践的なテクニック、そして日常でできる会話力向上トレーニングを具体的に紹介します。自信を持って英語を話せるようになりましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "7分",
    "imageSrc": "/images/native-speaker-conversation-tips.jpg",
    "tags": [
      "英会話 緊張しない",
      "ネイティブスピーカー",
      "英会話 コツ",
      "英語学習",
      "スピーキング上達",
      "コミュニケーション能力",
      "英語 フレーズ",
      "リスニング力向上"
    ]
  },
  "english-slang-understanding-use": {
    "id": "english-slang-understanding-use",
    "title": "英語スラング入門！映画やSNSで役立つ表現",
    "description": "ネイティブが使うリアルな英語スラングをマスターして、映画やSNSをもっと楽しもう！初心者にも分かりやすく、よく使われるスラングの意味、自然な使い方、学習のコツを徹底解説。コミュニケーションの幅が広がる表現が満載です。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/english-slang-understanding-use.jpg",
    "tags": [
      "英語スラング",
      "ネイティブ表現",
      "英会話",
      "映画で英語",
      "SNS英語",
      "英語学習",
      "初心者",
      "口語表現",
      "コミュニケーション"
    ]
  },
  "english-learning-apps-free-comparison": {
    "id": "english-learning-apps-free-comparison",
    "title": "無料英語学習アプリ比較！本当に使えるのはコレ",
    "description": "無料で英語力を伸ばしたいあなたへ！この記事では、Duolingo、Memrise、Ankiなど人気の無料英語学習アプリを単語、リスニング、総合学習といった機能別に徹底比較。あなたにぴったりのアプリを見つけて、今日から効率的な英語学習を始めましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/english-learning-apps-free-comparison.jpg",
    "tags": [
      "無料英語学習アプリ",
      "英語学習",
      "アプリ比較",
      "おすすめアプリ",
      "初心者向け英語",
      "英単語アプリ",
      "リスニングアプリ",
      "英会話学習",
      "独学英語",
      "英語勉強法"
    ]
  },
  "ielts-writing-task1-graph-description": {
    "id": "ielts-writing-task1-graph-description",
    "title": "IELTSライティングTask1 グラフ問題の書き方",
    "description": "IELTSライティングTask1のグラフ問題で高得点を取るための秘訣を徹底解説。データの読み取り方から効果的なパラグラフ構成、使える英語表現、実践的な練習方法まで網羅し、スコアアップをサポートします。初心者にも分かりやすく、自信を持って試験に臨めるよう導きます。",
    "category": "英語試験",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/ielts-writing-task1-graph-description.jpg",
    "tags": [
      "IELTS",
      "ライティング対策",
      "Task1",
      "グラフ問題",
      "英語試験",
      "アカデミックモジュール",
      "英語学習",
      "高得点戦略",
      "試験対策"
    ]
  },
  "english-academic-paper-reading-tips-beginners": {
    "id": "english-academic-paper-reading-tips-beginners",
    "title": "英語論文スラスラ読解術！初心者向け徹底ガイド",
    "description": "英語の学術論文を読むのが難しいと感じる初心者の方へ。この記事では、論文の基本構成、頻出表現、効率的な3ステップ読解術、役立つツールや学習法を徹底解説。挫折せずにスラスラ読めるようになるコツが満載です！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/english-academic-paper-reading-tips-beginners.jpg",
    "tags": [
      "英語論文",
      "アカデミックリーディング",
      "英語学習",
      "初心者",
      "読解術",
      "研究",
      "論文構成",
      "効率化",
      "IMRAD",
      "学術英語"
    ]
  },
  "english-recommendation-letter-request-guide-students": {
    "id": "english-recommendation-letter-request-guide-students",
    "title": "英語推薦状の依頼完璧ガイド！先生への例文と注意点",
    "description": "海外大学進学を目指す学生向けに、英語の推薦状を先生に効果的に依頼する方法を解説。依頼メールの例文、準備物リスト、注意点まで網羅し、スムーズな推薦状取得をサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/english-recommendation-letter-request-guide-students.jpg",
    "tags": [
      "推薦状",
      "英語",
      "海外大学",
      "留学準備",
      "依頼メール",
      "高校生",
      "大学生",
      "進学",
      "出願書類"
    ]
  },
  "english-debate-rebuttal-phrases-strategies": {
    "id": "english-debate-rebuttal-phrases-strategies",
    "title": "英語ディベートで勝つ！反論・主張に使える実践フレーズ集",
    "description": "英語ディベートで相手に効果的に反論し、自分の主張を説得力を持って伝えるための実践的なフレーズや戦略を具体例と共に解説。この記事を読めば、自信を持って議論に臨めるようになります。反論の基本から応用テクニックまで網羅。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/english-debate-rebuttal-phrases-strategies.jpg",
    "tags": [
      "英語ディベート",
      "反論フレーズ",
      "英語表現",
      "ディスカッション",
      "英語学習",
      "スピーキング",
      "論理的思考",
      "説得力",
      "ビジネス英語"
    ]
  },
  "toeic-part5-advanced-grammar-strategy": {
    "id": "toeic-part5-advanced-grammar-strategy",
    "title": "TOEIC Part5特定文法問題の秒殺テク！仮定法・倒置攻略",
    "description": "TOEIC Part5で多くの受験者が苦手とする仮定法や倒置。この記事では、これらの難解文法項目を「秒殺」するための具体的な見分け方、解答テクニックを豊富な例文と共に徹底解説します。頻出パターンから効果的な練習法、おすすめ教材まで網羅し、あなたのPart5攻略とスコアアップを力強くサポートします！",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/toeic-part5-advanced-grammar-strategy.jpg",
    "tags": [
      "TOEIC",
      "Part5",
      "文法",
      "仮定法",
      "倒置",
      "英語学習",
      "スコアアップ",
      "試験対策",
      "秒殺テクニック"
    ]
  },
  "business-english-email-nuance-phrases-request-refusal": {
    "id": "business-english-email-nuance-phrases-request-refusal",
    "title": "英語ビジネスメールで誤解されない！催促・断りの絶妙表現",
    "description": "英語でのビジネスメール、催促や断りの伝え方に困っていませんか？この記事では、相手に失礼なく意図を正確に伝えるための具体的な催促・断り英語フレーズと、微妙なニュアンスの出し方を例文豊富に解説。円滑な国際ビジネスコミュニケーションを目指しましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/business-english-email-nuance-phrases-request-refusal.jpg",
    "tags": [
      "ビジネス英語",
      "英語メール",
      "コミュニケーション",
      "英語フレーズ",
      "催促メール",
      "断りメール",
      "ビジネスマナー",
      "英語学習",
      "異文化コミュニケーション",
      "ニュアンス"
    ]
  },
  "english-conference-call-listening-difficulty-phrases": {
    "id": "english-conference-call-listening-difficulty-phrases",
    "title": "英語電話会議で聞き取れない時の神フレーズ！焦らず対応",
    "description": "英語の電話会議で「聞き取れない…」と困った経験はありませんか？この記事では、失礼なく聞き返すための具体的な英語フレーズ集や、聞き取り精度を上げるための事前準備、会議中の心構えまで、実践的な対策を分かりやすく解説します。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/english-conference-call-listening-difficulty-phrases.jpg",
    "tags": [
      "英語会議",
      "電話会議",
      "リスニング",
      "聞き取れない",
      "ビジネス英語",
      "英語フレーズ",
      "英語学習",
      "コミュニケーション",
      "オンライン会議"
    ]
  },
  "english-learning-app-pronunciation-vocabulary-comparison": {
    "id": "english-learning-app-pronunciation-vocabulary-comparison",
    "title": "英語学習アプリ特定機能比較！発音矯正/単語暗記特化型",
    "description": "英語学習アプリ選びに迷う方必見！本記事では「発音矯正」と「単語暗記」という特定機能に特化したおすすめアプリを徹底比較。ELSA SpeakやAnkiなどの人気アプリの特徴、選び方のポイントを解説し、あなたの英語力向上に最適なアプリ探しをサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "6分",
    "imageSrc": "/images/english-learning-app-pronunciation-vocabulary-comparison.jpg",
    "tags": [
      "英語学習アプリ",
      "発音矯正",
      "単語暗記",
      "スキマ時間学習",
      "英語学習 初心者",
      "アプリ比較",
      "おすすめアプリ"
    ]
  },
  "netflix-shadowing-beginners-guide-drama-selection": {
    "id": "netflix-shadowing-beginners-guide-drama-selection",
    "title": "初心者向けNetflixシャドーイング！挫折しないドラマと方法",
    "description": "Netflixでの英語シャドーイングに挑戦したい初心者必見！挫折しないための具体的なステップ、効果的な学習法、おすすめドラマ5選を徹底解説。楽しく英語力を向上させるコツが満載です。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/netflix-shadowing-beginners-guide-drama-selection.jpg",
    "tags": [
      "Netflix",
      "シャドーイング",
      "英語学習",
      "初心者",
      "海外ドラマ",
      "リスニング",
      "スピーキング",
      "独学"
    ]
  },
  "english-presentation-opening-hooks-audience-engagement": {
    "id": "english-presentation-opening-hooks-audience-engagement",
    "title": "英語プレゼン冒頭で掴む！聴衆を惹きつける導入テクニック",
    "description": "英語プレゼン、最初の数分が勝負！この記事では、聴衆を惹きつけ、プレゼンを成功に導くための効果的な導入テクニック7選を徹底解説。すぐに使える英語フレーズや、準備・練習方法、役立つ学習ツールも具体例満載でご紹介します。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/english-presentation-opening-hooks-audience-engagement.jpg",
    "tags": [
      "英語プレゼン",
      "プレゼン導入",
      "スピーチ冒頭",
      "アイスブレイク",
      "聴衆の心をつかむ",
      "ビジネス英語",
      "英語学習法",
      "プレゼンテクニック",
      "英語フレーズ"
    ]
  },
  "english-small-talk-questions-avoid-awkward-silence": {
    "id": "english-small-talk-questions-avoid-awkward-silence",
    "title": "英語雑談で話題が途切れない！ネイティブ流質問テクニック",
    "description": "英語でのスモールトーク、話題が尽きて気まずい沈黙に困っていませんか？この記事では、会話が自然に弾むネイティブ流の質問テクニック5選や、どんな相手にも使える鉄板話題集10選を具体例と共に徹底解説。今日から実践できるコツを掴んで、雑談への苦手意識を克服し、英会話をもっと楽しみましょう！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/english-small-talk-questions-avoid-awkward-silence.jpg",
    "tags": [
      "英語学習",
      "スモールトーク",
      "英会話",
      "コミュニケーション",
      "質問力",
      "雑談ネタ",
      "ネイティブフレーズ",
      "会話術",
      "気まずい沈黙対策"
    ]
  },
  "toeic-listening-part2-indirect-answers-strategy": {
    "id": "toeic-listening-part2-indirect-answers-strategy",
    "title": "TOEIC Part2変化球応答も怖くない！間接的回答攻略法",
    "description": "TOEICリスニングPart2でスコアアップを阻む間接的な応答。この記事では、頻出する変化球の回答パターンを徹底分析し、具体的な攻略テクニックと実践的な練習問題を解説します。これであなたもPart2マスターに！",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "6分",
    "imageSrc": "/images/toeic-listening-part2-indirect-answers-strategy.jpg",
    "tags": [
      "TOEIC",
      "リスニング",
      "Part2",
      "間接応答",
      "英語学習",
      "スコアアップ",
      "試験対策",
      "英語耳",
      "攻略法"
    ]
  },
  "english-diary-writing-tips-consistency-topic-ideas": {
    "id": "english-diary-writing-tips-consistency-topic-ideas",
    "title": "英語日記が続く！初心者向けネタ出しと書き方3ステップ",
    "description": "英語日記を始めたいけど何を書けばいいかわからない、三日坊主になってしまう、という初心者の方へ。この記事では、英語日記を楽しく続けるための具体的な3ステップ、豊富なネタ出しアイデア、役立つ英語フレーズを分かりやすく解説します。今日から英語力アップを目指しましょう！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "12分",
    "imageSrc": "/images/english-diary-writing-tips-consistency-topic-ideas.jpg",
    "tags": [
      "英語日記",
      "英語学習",
      "初心者",
      "継続のコツ",
      "ネタ",
      "書き方",
      "英語フレーズ",
      "英語力アップ",
      "ライティング練習"
    ]
  },
  "factory-visit-technical-english-phrases-manufacturing-quality-control": {
    "id": "factory-visit-technical-english-phrases-manufacturing-quality-control",
    "title": "工場視察で使う専門英語！製造・品質管理の質問フレーズ集",
    "description": "海外出張での工場視察時、製造プロセスや品質管理について専門用語で質問するのに役立つ英語フレーズ集。具体的な質問例と応答のポイント、コミュニケーションのコツを解説し、技術的な会話をスムーズに進めるお手伝いをします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/factory-visit-technical-english-phrases-manufacturing-quality-control.jpg",
    "tags": [
      "工場視察",
      "ビジネス英語",
      "専門英語",
      "製造業",
      "品質管理",
      "英語フレーズ",
      "海外出張",
      "技術英語",
      "コミュニケーション"
    ]
  },
  "academic-english-writing-discussion-section-phrases-logical-flow": {
    "id": "academic-english-writing-discussion-section-phrases-logical-flow",
    "title": "英語論文『考察』執筆術！論理展開を強化する接続表現集",
    "description": "英語論文の『考察』で論理的な文章を書くための秘訣を解説。結果の解釈から主張の明確化まで、アカデミックな接続詞・フレーズを厳選して紹介。査読者を納得させる説得力ある考察作成をサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "5分",
    "imageSrc": "/images/academic-english-writing-discussion-section-phrases-logical-flow.jpg",
    "tags": [
      "英語論文",
      "考察",
      "アカデミックライティング",
      "接続詞",
      "論理展開",
      "論文執筆",
      "英語学習",
      "研究"
    ]
  },
  "business-trip-english-dining-etiquette-phrases": {
    "id": "business-trip-english-dining-etiquette-phrases",
    "title": "海外出張で困らない！英語での食事マナーと注文・会計フレーズ集",
    "description": "海外出張時の英語での食事、もう困りません！レストラン予約からスマートな注文方法、知っておくべきテーブルマナー、会計時の英語フレーズ、チップの習慣まで網羅的に解説。ビジネスディナーもこれで安心です。実践的な例文満載で、すぐに役立ちます。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "9分",
    "imageSrc": "/images/business-trip-english-dining-etiquette-phrases.jpg",
    "tags": [
      "海外出張",
      "英語",
      "食事マナー",
      "ビジネス英語",
      "英会話フレーズ",
      "レストラン英語",
      "チップ",
      "注文",
      "会計"
    ]
  },
  "toeic-part7-triple-passage-time-management-strategies": {
    "id": "toeic-part7-triple-passage-time-management-strategies",
    "title": "TOEIC Part7トリプルパッセージ時間配分と設問別攻略法",
    "description": "TOEIC Part7の最難関、トリプルパッセージで時間が足りず悩んでいませんか？この記事では、効果的な時間配分テクニック、設問タイプごとの具体的な攻略法、そしてスコアアップに繋がる実践的な学習戦略を徹底解説します。目標点突破を目指しましょう。",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/toeic-part7-triple-passage-time-management-strategies.jpg",
    "tags": [
      "TOEIC",
      "Part7",
      "トリプルパッセージ",
      "時間配分",
      "英語学習",
      "読解",
      "スコアアップ",
      "試験対策",
      "リーディング",
      "英語勉強法"
    ]
  },
  "business-english-small-talk-first-impression-tips": {
    "id": "business-english-small-talk-first-impression-tips",
    "title": "出張直前！英語スモールトークで好印象を残す秘訣3選",
    "description": "海外出張や赴任前に必須のビジネス英語スモールトーク術を解説。初対面でも好印象を与える鉄板ネタ、避けるべきNG話題、文化的配慮を含めた実践フレーズを紹介し、円滑な人間関係構築をサポートします。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "6分",
    "imageSrc": "/images/business-english-small-talk-first-impression-tips.jpg",
    "tags": [
      "ビジネス英語",
      "スモールトーク",
      "英会話",
      "海外出張",
      "第一印象",
      "コミュニケーション",
      "異文化理解",
      "英語学習"
    ]
  },
  "academic-english-paper-introduction-writing-guide-for-researchers": {
    "id": "academic-english-paper-introduction-writing-guide-for-researchers",
    "title": "英語論文Introduction完全攻略！採択率UP構成術",
    "description": "英語論文のIntroduction執筆は研究者にとって最初の関門。本記事では、読者を引きつけ研究の価値を伝えるためのCARSモデルに基づいた構成術、実践的なテクニック、そしてそのまま使えるアカデミック英語表現を網羅的に解説。これであなたの論文採択率アップを目指しましょう。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "約12分",
    "imageSrc": "/images/academic-english-paper-introduction-writing-guide-for-researchers.jpg",
    "tags": [
      "英語論文",
      "Introduction",
      "書き方",
      "研究論文",
      "アカデミックライティング",
      "CARSモデル",
      "論文構成",
      "採択率アップ",
      "大学院生",
      "研究者",
      "英語学習",
      "論文作法"
    ]
  },
  "toeic-part2-indirect-answer-strategy": {
    "id": "toeic-part2-indirect-answer-strategy",
    "title": "TOEIC Part2変化球応答の攻略法！間接的な答えを見抜く聞き取り術",
    "description": "TOEIC Part2の難関、間接的な応答（変化球）に悩んでいませんか？この記事では、典型的な変化球パターンとその見抜き方、効果的な聞き取りトレーニング法、本番で役立つ実践テクニックを徹底解説。スコアアップを目指すあなたの強力な味方です！",
    "category": "TOEIC",
    "date": "2025-06-04",
    "readTime": "10分",
    "imageSrc": "/images/toeic-part2-indirect-answer-strategy.jpg",
    "tags": [
      "TOEIC",
      "Part2",
      "リスニング",
      "間接応答",
      "英語学習",
      "スコアアップ",
      "聞き取り",
      "対策",
      "勉強法",
      "攻略法"
    ]
  },
  "overseas-pharmacy-english-symptoms-cold-medicine": {
    "id": "overseas-pharmacy-english-symptoms-cold-medicine",
    "title": "海外薬局で風邪の症状を伝える英語フレーズ集！薬剤師との会話例で安心",
    "description": "留学や海外旅行中に風邪をひいたら？海外の薬局で咳・鼻水・喉の痛みなどの症状を英語で正確に伝え、適切な市販薬を選ぶための実践的フレーズを薬剤師との会話例付きで解説。アレルギーや副作用の質問方法も網羅し、急な体調不良も安心です。",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "7分",
    "imageSrc": "/images/overseas-pharmacy-english-symptoms-cold-medicine.jpg",
    "tags": [
      "海外旅行 英語",
      "薬局 英語",
      "風邪 症状 英語",
      "薬剤師 会話",
      "留学 英語",
      "市販薬 英語",
      "体調不良 英語",
      "英会話フレーズ",
      "海外生活",
      "英語学習"
    ]
  },
  "overseas-supermarket-shopping-guide-product-labels-checkout-tips": {
    "id": "overseas-supermarket-shopping-guide-product-labels-checkout-tips",
    "title": "海外スーパー攻略！商品表示の見方からレジでの実践テクまで",
    "description": "海外スーパーでの買い物に不安を感じていませんか？この記事では、商品ラベル（単位、アレルギー）の読み解き方、量り売り商品の購入テクニック、スムーズなレジでのやり取り、エコバッグの活用法まで、実践的な情報を網羅。これであなたも海外でのショッピングが楽しくなる！",
    "category": "学習法",
    "date": "2025-06-04",
    "readTime": "8分",
    "imageSrc": "/images/overseas-supermarket-shopping-guide-product-labels-checkout-tips.jpg",
    "tags": [
      "海外スーパー",
      "買い物ガイド",
      "商品ラベル",
      "単位換算",
      "アレルギー表示",
      "量り売り",
      "海外レジ",
      "英会話フレーズ",
      "エコバッグ",
      "海外生活術",
      "旅行準備"
    ]
  },
  "phd-dissertation-literature-review-strategy": {
    "id": "phd-dissertation-literature-review-strategy",
    "title": "博士課程の難関！英語論文リサーチレビュー攻略法",
    "description": "海外大学院博士課程における最難関の一つ、リサーチレビュー（文献調査）を効率的に進めるための戦略を徹底解説。テーマ設定から文献検索、情報整理、構成、さらには英語特有の表現まで、質の高い論文作成の第一歩を具体的にサポートします。ZoteroやGrammarlyといった便利ツールも紹介。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/phd-dissertation-literature-review-strategy.jpg",
    "tags": [
      "博士論文",
      "リサーチレビュー",
      "文献調査",
      "大学院",
      "英語論文",
      "アカデミックライティング",
      "研究計画",
      "論文執筆",
      "海外留学",
      "学習法",
      "文献管理ツール"
    ]
  },
  "us-college-seminar-participation-tips-introverts": {
    "id": "us-college-seminar-participation-tips-introverts",
    "title": "内向型でも安心！米大学セミナーで発言するコツ",
    "description": "アメリカの大学のセミナーで発言するのが苦手な内向型の留学生必見！自信を持って意見を述べるための具体的な準備方法から、授業中の実践的な発言テクニック、さらには発言後の振り返り方まで詳しく解説。この記事を読めば、あなたも積極的に授業に参加できるようになります。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/us-college-seminar-participation-tips-introverts.jpg",
    "tags": [
      "アメリカ大学",
      "セミナー",
      "発言",
      "内向型",
      "留学",
      "英語学習",
      "コミュニケーション",
      "授業参加",
      "アカデミック英語"
    ]
  },
  "gre-verbal-advanced-vocabulary-mnemonics": {
    "id": "gre-verbal-advanced-vocabulary-mnemonics",
    "title": "GRE Verbal難関単語を記憶術で攻略！具体例付",
    "description": "GRE Verbalの超難関単語に苦戦していませんか？この記事では、記憶術（ニーモニクス）を使ったユニークで効果的な暗記法を、具体的な単語例を交えながら徹底解説します。スコアアップを目指すあなたの強力な味方となる学習戦略を手に入れましょう！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "7分",
    "imageSrc": "/images/gre-verbal-advanced-vocabulary-mnemonics.jpg",
    "tags": [
      "GRE",
      "英単語",
      "記憶術",
      "ニーモニクス",
      "Verbal対策",
      "英語学習法",
      "試験対策",
      "ボキャブラリー"
    ]
  },
  "finding-lab-supervisor-cold-email-template-grad-school": {
    "id": "finding-lab-supervisor-cold-email-template-grad-school",
    "title": "大学院留学：研究室の指導教官を見つけるコールドメール術",
    "description": "海外大学院進学を目指す方へ。希望の研究室の指導教官にアポイントを取るためのコールドメールの書き方を徹底解説。返信率を上げる秘訣、件名の具体例、そのまま使える英語テンプレート、送信後のフォローアップ方法まで、実践的な情報が満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/finding-lab-supervisor-cold-email-template-grad-school.jpg",
    "tags": [
      "大学院留学",
      "海外大学院",
      "コールドメール",
      "指導教官",
      "研究室探し",
      "英語メール",
      "出願準備",
      "留学準備",
      "アカデミックライティング",
      "メールテンプレート"
    ]
  },
  "uk-university-dorm-self-catering-budget-recipes": {
    "id": "uk-university-dorm-self-catering-budget-recipes",
    "title": "英大学寮での自炊節約レシピ集【簡単・時短】",
    "description": "イギリスの大学寮生活を送る留学生向けに、食費を賢く節約できる簡単・時短レシピを厳選紹介。自炊初心者でも安心な栄養満点メニューで、健康的かつ経済的な留学生活をサポートします。スーパーでの買い物術や食材保存のコツも解説。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "16分",
    "imageSrc": "/images/uk-university-dorm-self-catering-budget-recipes.jpg",
    "tags": [
      "イギリス留学",
      "大学寮",
      "自炊",
      "節約レシピ",
      "簡単レシピ",
      "時短レシピ",
      "留学生",
      "食費節約",
      "健康"
    ]
  },
  "us-f1-visa-interview-unexpected-questions-answers": {
    "id": "us-f1-visa-interview-unexpected-questions-answers",
    "title": "米F1ビザ面接：想定外の質問と模範回答集",
    "description": "アメリカF1ビザ面接で聞かれがちな想定外の質問や意地悪な質問への対策は万全ですか？この記事では、具体的な質問例と効果的な模範回答、面接官の意図、準備のポイントを徹底解説。これであなたも自信を持って面接に臨めます！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "7分",
    "imageSrc": "/images/us-f1-visa-interview-unexpected-questions-answers.jpg",
    "tags": [
      "F1ビザ",
      "アメリカ学生ビザ",
      "ビザ面接",
      "想定外の質問",
      "面接対策",
      "留学準備",
      "アメリカ留学",
      "模範回答",
      "合格対策"
    ]
  },
  "opening-bank-account-abroad-common-pitfalls-students": {
    "id": "opening-bank-account-abroad-common-pitfalls-students",
    "title": "留学生が陥る銀行口座開設の罠と回避策【海外】",
    "description": "海外留学中の銀行口座開設は必須ですが、多くの罠が潜んでいます。この記事では、留学生が陥りがちなトラブル事例と、書類準備から手数料、言語の壁、口座管理までの具体的な回避策を徹底解説。安心して新生活をスタートさせましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "5分",
    "imageSrc": "/images/opening-bank-account-abroad-common-pitfalls-students.jpg",
    "tags": [
      "海外留学",
      "銀行口座",
      "口座開設",
      "留学生",
      "生活情報",
      "海外送金",
      "トラブル回避",
      "必要書類",
      "手数料",
      "国際キャッシュカード"
    ]
  },
  "study-abroad-mental-health-support-coping-strategies": {
    "id": "study-abroad-mental-health-support-coping-strategies",
    "title": "留学中のメンタル不調…SOSの出し方と対処法",
    "description": "留学中の孤独感やストレスからくるメンタル不調。この記事では、具体的なSOSの出し方から、大学や専門機関のサポート情報、生活習慣の改善やリフレッシュ法といったセルフケアまで詳しく解説。つらい気持ちを一人で抱え込まず、適切な対処法を見つけ、充実した留学生活を送りましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "9分",
    "imageSrc": "/images/study-abroad-mental-health-support-coping-strategies.jpg",
    "tags": [
      "留学",
      "メンタルヘルス",
      "ストレス対処",
      "海外生活",
      "心のケア",
      "相談窓口",
      "セルフケア",
      "孤独感",
      "適応障害",
      "カウンセリング"
    ]
  },
  "multicultural-dorm-roommate-conflict-resolution": {
    "id": "multicultural-dorm-roommate-conflict-resolution",
    "title": "多文化寮ルームメイトとの衝突回避＆円満解決法",
    "description": "多文化寮でのルームメイトとの生活は刺激的ですが、文化摩擦は避けられません。この記事では、異文化理解を深め、効果的なコミュニケーション術を駆使して衝突を未然に防ぎ、もし問題が起きても円満に解決するための具体的なステップや役立つリソースを紹介します。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/multicultural-dorm-roommate-conflict-resolution.jpg",
    "tags": [
      "多文化共生",
      "寮生活",
      "ルームメイト",
      "異文化コミュニケーション",
      "衝突解決",
      "人間関係",
      "留学生活",
      "コミュニケーション術"
    ]
  },
  "non-repayable-graduate-scholarships-lesser-known-foundations": {
    "id": "non-repayable-graduate-scholarships-lesser-known-foundations",
    "title": "返済不要！海外大学院の穴場奨学金の見つけ方",
    "description": "海外大学院留学の夢を叶えたいけれど学費が心配？この記事では、競争率が比較的低い、あまり知られていない財団や団体が提供する返済不要の給付型奨学金（穴場奨学金）の見つけ方と、効果的な応募書類作成のコツを具体的に解説します。情報収集のステップから自己PRのポイントまで、あなたの留学準備をサポートします。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/non-repayable-graduate-scholarships-lesser-known-foundations.jpg",
    "tags": [
      "海外大学院",
      "奨学金",
      "返済不要",
      "給付型奨学金",
      "留学費用",
      "穴場情報",
      "資金調達",
      "大学院留学",
      "海外留学",
      "学費"
    ]
  },
  "recommendation-letter-request-email-professor-template-effectiveness": {
    "id": "recommendation-letter-request-email-professor-template-effectiveness",
    "title": "教授への推薦状依頼メール【効果的な英語例文付】",
    "description": "留学や大学院進学に不可欠な教授からの推薦状。多忙な教授に快く、力強い推薦状を書いてもらうための、丁寧で効果的な英語依頼メールのテンプレートを例文付きで解説。依頼前の準備リストや注意点、マナーも網羅し、あなたの海外挑戦をサポートします。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/recommendation-letter-request-email-professor-template-effectiveness.jpg",
    "tags": [
      "留学",
      "推薦状",
      "依頼メール",
      "英語メール",
      "教授",
      "大学",
      "大学院",
      "英語例文",
      "書き方",
      "注意点",
      "アカデミック",
      "出願準備"
    ]
  },
  "ielts-writing-task2-high-score-paragraph-structure": {
    "id": "ielts-writing-task2-high-score-paragraph-structure",
    "title": "IELTSライティングTask2で高得点を狙う段落構成術",
    "description": "IELTSライティングTask2でスコアアップを目指す方へ。論理的な段落構成の基本から、高評価を得やすいPEEL構造、効果的な接続詞の使い方まで、具体例を豊富に交えて徹底解説。この記事を読めば、あなたのエッセイが劇的に改善し、目標スコア達成に近づけます。",
    "category": "英語試験",
    "date": "2025-06-05",
    "readTime": "4分",
    "imageSrc": "/images/ielts-writing-task2-high-score-paragraph-structure.jpg",
    "tags": [
      "IELTS",
      "ライティングTask2",
      "段落構成",
      "高得点",
      "英語試験対策",
      "接続詞",
      "PEEL構造",
      "エッセイライティング"
    ]
  },
  "paid-internship-opportunities-while-studying-abroad-usa": {
    "id": "paid-internship-opportunities-while-studying-abroad-usa",
    "title": "米国留学中に挑戦！有給インターンシップ獲得法",
    "description": "アメリカ留学中に有給インターンシップを経験したい学生必見！CPT制度の賢い活用法、効果的な求人の探し方、魅力的な応募書類の書き方、面接対策まで、成功へのステップを具体的に解説します。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "11分",
    "imageSrc": "/images/paid-internship-opportunities-while-studying-abroad-usa.jpg",
    "tags": [
      "アメリカ留学",
      "有給インターンシップ",
      "CPT",
      "海外インターン",
      "キャリア形成",
      "就職活動",
      "大学生",
      "F1ビザ",
      "留学生活",
      "アメリカ就職"
    ]
  },
  "opt-job-search-strategy-stem-non-stem-usa": {
    "id": "opt-job-search-strategy-stem-non-stem-usa",
    "title": "OPT期間の就活戦略：STEM/非STEM専攻別対策",
    "description": "アメリカでのOPT期間中の就職活動を成功させるための実践ガイド。STEM専攻と非STEM専攻、それぞれの強みを活かした履歴書作成、面接対策、効果的なネットワーキング術を具体例と共に解説します。H-1Bビザへの展望も網羅。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/opt-job-search-strategy-stem-non-stem-usa.jpg",
    "tags": [
      "OPT",
      "アメリカ就職",
      "就活戦略",
      "STEM",
      "非STEM",
      "履歴書作成",
      "面接対策",
      "ネットワーキング",
      "海外就職",
      "キャリアプランニング",
      "H-1Bビザ"
    ]
  },
  "what-to-pack-study-abroad-unexpected-useful-items-japan": {
    "id": "what-to-pack-study-abroad-unexpected-useful-items-japan",
    "title": "留学パッキング：日本から持参すべき意外な神アイテム",
    "description": "海外留学の荷造りで悩むあなたへ。現地では手に入りにくい、または高価な、日本から持っていくと本当に役立つ意外な神アイテムを厳選紹介。文房具、常備薬から食品、便利グッズまで、留学生活を快適にするためのパッキングリストです。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/what-to-pack-study-abroad-unexpected-useful-items-japan.jpg",
    "tags": [
      "留学準備",
      "パッキング",
      "持ち物リスト",
      "海外生活",
      "日本製品",
      "便利グッズ",
      "留学",
      "海外留学"
    ]
  },
  "overcoming-loneliness-making-friends-abroad-introverts": {
    "id": "overcoming-loneliness-making-friends-abroad-introverts",
    "title": "内向型留学生の友達作り：孤独感を乗り越える方法",
    "description": "海外留学中の内向的な学生が直面する孤独感。この記事では、無理なく自然に友達を作るための具体的なステップ、趣味を通じた出会いの見つけ方（Meetupなど）、オンラインツールの活用法（Tandemなど）、心のケア方法を紹介します。あなたの留学生活がより豊かになるヒントが満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/overcoming-loneliness-making-friends-abroad-introverts.jpg",
    "tags": [
      "留学",
      "友達作り",
      "内向型",
      "孤独感",
      "海外生活",
      "コミュニケーション",
      "メンタルヘルス",
      "国際交流"
    ]
  },
  "academic-english-writing-avoiding-plagiarism-paraphrasing-techniques": {
    "id": "academic-english-writing-avoiding-plagiarism-paraphrasing-techniques",
    "title": "盗用回避！アカデミック英語でのパラフレーズ術",
    "description": "海外大学のレポートや論文で必須のスキル、パラフレーズ。意図しない盗用を防ぎ、学術的な文章力を高めるための具体的なテクニック7選、注意点、練習方法を徹底解説。引用ルールや便利なツールも紹介し、アカデミックライティングをサポートします。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "9分",
    "imageSrc": "/images/academic-english-writing-avoiding-plagiarism-paraphrasing-techniques.jpg",
    "tags": [
      "アカデミックライティング",
      "盗用防止",
      "Plagiarism",
      "パラフレーズ",
      "言い換え",
      "英語論文",
      "レポート作成術",
      "引用ルール",
      "参考文献リスト",
      "英語学習法"
    ]
  },
  "negotiating-university-admission-offer-scholarship-increase": {
    "id": "negotiating-university-admission-offer-scholarship-increase",
    "title": "大学合格後！学費・奨学金交渉で有利に進める方法",
    "description": "海外大学から合格通知！でも学費や奨学金に不満が…？この記事では、入学条件や奨学金の増額を大学と交渉するための具体的な準備、メール例文、効果的なアプローチ方法を分かりやすく解説。諦める前に、有利に交渉を進めるコツを掴んで、経済的負担を軽減しましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/negotiating-university-admission-offer-scholarship-increase.jpg",
    "tags": [
      "海外大学",
      "学費交渉",
      "奨学金交渉",
      "留学準備",
      "大学合格",
      "ファイナンシャルエイド",
      "交渉術",
      "メール例文",
      "アメリカ大学"
    ]
  },
  "choosing-health-insurance-international-students-usa-coverage-comparison": {
    "id": "choosing-health-insurance-international-students-usa-coverage-comparison",
    "title": "米国留学生向け健康保険の選び方【補償内容比較】",
    "description": "アメリカ留学中の万が一の病気やケガに備える健康保険。本記事では、留学生が知っておくべき保険の種類、必要な補償内容、費用相場、そして賢い選び方のポイントを徹底解説。学校指定保険と個人保険の比較や、費用を抑えるコツも紹介します。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/choosing-health-insurance-international-students-usa-coverage-comparison.jpg",
    "tags": [
      "アメリカ留学",
      "健康保険",
      "留学生保険",
      "医療保険",
      "海外留学",
      "保険比較",
      "補償内容",
      "留学準備",
      "アメリカ医療制度",
      "費用節約"
    ]
  },
  "handling-cultural-differences-group-projects-international-team": {
    "id": "handling-cultural-differences-group-projects-international-team",
    "title": "国際チームでのグループワーク：文化摩擦を乗り越える",
    "description": "海外大学の国際チームでのグループプロジェクトでは文化摩擦が課題です。本記事では、その原因を解説し、乗り越えて成果を出すためのコミュニケーション術や異文化理解を深める実践的アドバイス、役立つ書籍・サイト等のリソースを紹介。グローバル環境で成功するヒントを提供します。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "5分",
    "imageSrc": "/images/handling-cultural-differences-group-projects-international-team.jpg",
    "tags": [
      "国際チーム",
      "グループワーク",
      "異文化コミュニケーション",
      "海外大学",
      "留学",
      "協調性",
      "異文化理解",
      "コミュニケーション能力",
      "グローバル人材"
    ]
  },
  "europe-sim-esim-long-stay-comparison": {
    "id": "europe-sim-esim-long-stay-comparison",
    "title": "欧州周遊SIMとeSIM徹底比較！長期滞在者向け最適解は？",
    "description": "ヨーロッパ長期滞在を計画中ですか？この記事では、物理SIMとeSIMのメリット・デメリットを徹底比較し、あなたに最適な通信手段の選び方を解説します。通信費を賢く抑え、ストレスフリーなネット環境を手に入れるためのヒントが満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/europe-sim-esim-long-stay-comparison.jpg",
    "tags": [
      "ヨーロッパ周遊",
      "SIMカード",
      "eSIM",
      "長期滞在",
      "海外旅行",
      "データ通信",
      "ヨーロッパ SIM",
      "ヨーロッパ eSIM",
      "海外SIM",
      "節約術",
      "ネット環境",
      "海外留学"
    ]
  },
  "kids-long-flight-entertainment-toddler-ideas": {
    "id": "kids-long-flight-entertainment-toddler-ideas",
    "title": "子連れ長距離フライト対策！幼児が飽きない神グッズ＆遊び方",
    "description": "幼児連れの海外旅行や長距離フライト、心配ですよね？この記事では、機内で幼児を飽きさせないためのおすすめおもちゃ、具体的な遊び方、持ち物リスト、快適に過ごすコツを徹底解説。事前準備を万全にして、親子で笑顔の空の旅を実現しましょう！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/kids-long-flight-entertainment-toddler-ideas.jpg",
    "tags": [
      "子連れフライト",
      "幼児連れ旅行",
      "機内持ち込み",
      "長時間フライト対策",
      "子供 暇つぶし",
      "海外旅行 準備",
      "赤ちゃん連れ飛行機",
      "機内 グッズ",
      "子連れ海外",
      "フライト対策"
    ]
  },
  "lost-credit-card-abroad-emergency-procedure-reissue": {
    "id": "lost-credit-card-abroad-emergency-procedure-reissue",
    "title": "海外でカード紛失！緊急時の連絡先と再発行手続き完全ガイド",
    "description": "海外旅行中にクレジットカードを紛失・盗難された際の具体的な対処法をステップごとに徹底解説。緊急連絡先、利用停止、警察への届け出、カード再発行や現地での資金調達方法まで、この記事を読めばパニックにならず冷静に対応できます。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/lost-credit-card-abroad-emergency-procedure-reissue.jpg",
    "tags": [
      "海外旅行",
      "クレジットカード",
      "紛失",
      "盗難",
      "緊急時対応",
      "再発行",
      "不正利用対策",
      "海外トラブル",
      "旅行準備",
      "セキュリティ"
    ]
  },
  "europe-train-booking-multi-country-discount-tips": {
    "id": "europe-train-booking-multi-country-discount-tips",
    "title": "欧州鉄道格安チケット術！複数国周遊の予約タイミングと裏技",
    "description": "ヨーロッパ鉄道旅行のチケット代を節約したい方必見！複数国周遊をお得に楽しむための早期予約割引、鉄道パスの賢い使い方、オフシーズンのメリット、予約サイトの活用術や裏技を具体的に解説。賢く計画して、夢のヨーロッパ列車旅を実現しましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/europe-train-booking-multi-country-discount-tips.jpg",
    "tags": [
      "ヨーロッパ鉄道",
      "鉄道旅行",
      "格安チケット",
      "周遊旅行",
      "ユーレイルパス",
      "早期予約",
      "海外旅行",
      "節約術",
      "列車予約",
      "ヨーロッパ旅行"
    ]
  },
  "solo-female-travel-night-safety-gear-regional-warnings": {
    "id": "solo-female-travel-night-safety-gear-regional-warnings",
    "title": "女性一人旅の夜道対策！必須防犯グッズとエリア別注意点",
    "description": "女性の一人旅、特に夜間の安全は最優先事項です。この記事では、危険を避けるための具体的な行動指針、本当に役立つ防犯グッズ、渡航先の地域ごとの注意点を徹底解説。事前の準備と正しい知識で、安心して素晴らしい旅の思い出を作りましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/solo-female-travel-night-safety-gear-regional-warnings.jpg",
    "tags": [
      "女性一人旅",
      "海外旅行",
      "安全対策",
      "防犯グッズ",
      "夜道",
      "危機管理",
      "旅行準備",
      "海外治安"
    ]
  },
  "severe-allergy-dining-abroad-negotiation-phrases": {
    "id": "severe-allergy-dining-abroad-negotiation-phrases",
    "title": "重度アレルギーでも安心！海外レストラン交渉術＆多言語フレーズ",
    "description": "重度の食物アレルギーを持つ方が海外のレストランで安全かつ楽しく食事するための具体的な交渉術、多言語での伝え方、アレルギーカードの活用法を徹底解説。緊急時の対応フレーズも網羅し、安心して海外の味を堪能できるノウハウを提供します。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/severe-allergy-dining-abroad-negotiation-phrases.jpg",
    "tags": [
      "食物アレルギー",
      "海外旅行",
      "レストラン",
      "食事制限",
      "アレルギー対応",
      "多言語フレーズ",
      "交渉術",
      "アナフィラキシー",
      "安全な食事",
      "旅行準備",
      "アレルギーカード"
    ]
  },
  "lcc-international-liquid-cosmetics-packing-hacks-carry-on": {
    "id": "lcc-international-liquid-cosmetics-packing-hacks-carry-on",
    "title": "LCC国際線液体パッキング術！化粧品もOKな裏技と注意点",
    "description": "LCC国際線の厳しい液体物制限をクリアするパッキング術を徹底解説。化粧品や洗面用具を機内に持ち込むための裏技、100mlルールの賢い対処法、固形アイテムの活用法など、追加料金なしでスマートに旅立つための情報が満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "5分",
    "imageSrc": "/images/lcc-international-liquid-cosmetics-packing-hacks-carry-on.jpg",
    "tags": [
      "LCC",
      "国際線",
      "液体物制限",
      "機内持ち込み",
      "化粧品 パッキング",
      "パッキング術",
      "旅行準備",
      "海外旅行",
      "手荷物",
      "コスメ"
    ]
  },
  "global-tipping-guide-app-calculation-etiquette-by-scene": {
    "id": "global-tipping-guide-app-calculation-etiquette-by-scene",
    "title": "海外チップ文化完全攻略！国別相場とアプリ計算＆渡し方マナー",
    "description": "海外旅行でのチップの悩みを解消！アメリカ、ヨーロッパ、アジアなど国別のチップ相場、レストランやホテルでのスマートな渡し方マナー、計算に便利なアプリを徹底解説。もうチップで困りません！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/global-tipping-guide-app-calculation-etiquette-by-scene.jpg",
    "tags": [
      "海外旅行",
      "チップ",
      "マナー",
      "国別相場",
      "計算アプリ",
      "レストラン",
      "ホテル",
      "アメリカ",
      "ヨーロッパ",
      "アジア",
      "旅行準備",
      "チップ計算",
      "支払い"
    ]
  },
  "credit-card-travel-insurance-pitfalls-claim-documents-procedure": {
    "id": "credit-card-travel-insurance-pitfalls-claim-documents-procedure",
    "title": "クレカ付帯保険の盲点！請求に必要な書類と手続き徹底ガイド",
    "description": "クレジットカード付帯の海外旅行保険は本当に安心？自動付帯・利用付帯の違い、補償期間や金額の落とし穴を徹底解説。事故発生時の保険金請求に必要な書類リストや手続きの流れ、事前の備えまで具体的にガイドします。海外旅行前の最終チェックに！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/credit-card-travel-insurance-pitfalls-claim-documents-procedure.jpg",
    "tags": [
      "クレジットカード付帯保険",
      "海外旅行保険",
      "保険金請求",
      "必要書類",
      "旅行準備",
      "自動付帯",
      "利用付帯",
      "補償内容",
      "海外旅行 トラブル"
    ]
  },
  "overseas-atm-withdrawal-fee-saving-cards-operation-tips": {
    "id": "overseas-atm-withdrawal-fee-saving-cards-operation-tips",
    "title": "海外ATM手数料最小化！お得なカードと現地操作のコツ【主要通貨】",
    "description": "海外旅行や出張で必須の現地通貨引き出し。ATM手数料を最小限に抑えるお得なカードの選び方から、主要通貨（米ドル、ユーロ等）ごとの具体的なATM操作手順、スキミング対策やDCC回避などの注意点まで詳しく解説。これで安心して海外ATMが利用できます。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/overseas-atm-withdrawal-fee-saving-cards-operation-tips.jpg",
    "tags": [
      "海外ATM",
      "手数料節約",
      "クレジットカード",
      "デビットカード",
      "プリペイドカード",
      "海外キャッシング",
      "現地通貨",
      "ATM操作",
      "海外旅行",
      "留学",
      "DCC",
      "スキミング対策"
    ]
  },
  "toeic-part5-grammar-trap-questions": {
    "id": "toeic-part5-grammar-trap-questions",
    "title": "TOEIC Part5文法ひっかけ問題の見抜き方！上級者も間違う罠",
    "description": "TOEIC Part5の文法ひっかけ問題に特化した攻略法を徹底解説。頻出パターン、具体的な見抜き方、効果的な学習戦略まで、この記事を読めば上級者でも間違える罠を回避し、スコアアップに繋がります。時間を有効活用し、確実に正解するための思考プロセスを身につけましょう。",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/toeic-part5-grammar-trap-questions.jpg",
    "tags": [
      "TOEIC",
      "Part5",
      "文法問題",
      "ひっかけ問題",
      "英語学習",
      "スコアアップ",
      "試験対策",
      "英語勉強法"
    ]
  },
  "toeic-listening-part3-part4-inference-questions": {
    "id": "toeic-listening-part3-part4-inference-questions",
    "title": "TOEIC L Part3,4 推測問題攻略！会話・トークの意図を掴む",
    "description": "TOEICリスニングPart3・4の推測問題で伸び悩んでいませんか？この記事では、会話やトークの隠された意図を正確に読み解くための3つの着眼点、具体的な問題解決ステップ、そしてスコアアップに繋がる日常学習法を、実践的な例を交えて徹底解説します。あなたのリスニング力向上をサポートします。",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/toeic-listening-part3-part4-inference-questions.jpg",
    "tags": [
      "TOEIC",
      "リスニング",
      "Part3",
      "Part4",
      "推測問題",
      "英語学習",
      "スコアアップ",
      "勉強法",
      "英語試験対策",
      "意図理解"
    ]
  },
  "toeic-reading-part7-not-true-questions-strategy": {
    "id": "toeic-reading-part7-not-true-questions-strategy",
    "title": "TOEIC Part7 NOT問題の時短攻略法！消去法を極めるコツ",
    "description": "TOEIC Part7のNOT問題は時間との戦い。この記事では、効率的に正解を見つけるための消去法の使い方、具体的なステップ、注意点、そしておすすめの学習教材を徹底解説。NOT問題を克服し、スコアアップを目指しましょう！",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/toeic-reading-part7-not-true-questions-strategy.jpg",
    "tags": [
      "TOEIC",
      "リーディング",
      "Part7",
      "NOT問題",
      "消去法",
      "英語学習",
      "スコアアップ",
      "試験対策",
      "時短テクニック"
    ]
  },
  "toeic-score-report-analysis-next-action": {
    "id": "toeic-score-report-analysis-next-action",
    "title": "TOEICスコアシート徹底分析法！次回の目標設定と弱点克服",
    "description": "TOEICスコアシートの「アビメ」を徹底分析し、あなたの弱点を明確化。具体的な弱点克服トレーニング法や、次回の目標スコア達成に向けた学習計画の立て方を詳細に解説します。スコアアップを目指す全受験者必見！",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "7分",
    "imageSrc": "/images/toeic-score-report-analysis-next-action.jpg",
    "tags": [
      "TOEIC",
      "スコア分析",
      "アビメ",
      "弱点克服",
      "目標設定",
      "英語学習法",
      "リスニング対策",
      "リーディング対策",
      "TOEIC対策",
      "Abilities Measured"
    ]
  },
  "toeic-ip-test-vs-public-test-differences-merits": {
    "id": "toeic-ip-test-vs-public-test-differences-merits",
    "title": "TOEIC IPテストと公開テストの違いは？企業受験のメリット解説",
    "description": "TOEIC IPテストと公開テスト、どちらを選ぶべきか迷っていませんか？本記事では、受験料、難易度、スコアの有効性、企業での活用事例などを徹底比較。あなたに最適なテスト選びをサポートし、目標達成を後押しします。",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/toeic-ip-test-vs-public-test-differences-merits.jpg",
    "tags": [
      "TOEIC",
      "IPテスト",
      "公開テスト",
      "企業受験",
      "英語試験",
      "スコアアップ",
      "英語学習",
      "キャリアアップ",
      "IIBC",
      "ETS"
    ]
  },
  "toeic-900-over-study-habits-advanced-learners": {
    "id": "toeic-900-over-study-habits-advanced-learners",
    "title": "TOEIC900点超え達成者の共通学習習慣とは？上級者の壁突破",
    "description": "TOEIC900点の壁に悩む上級者必見！本記事では、実際に900点以上を取得した人々の共通学習習慣、効果的な思考法、厳選教材、そしてモチベーション維持術を徹底解説。あなたもこの記事を参考に、スコアアップの壁を打ち破りましょう。",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/toeic-900-over-study-habits-advanced-learners.jpg",
    "tags": [
      "TOEIC",
      "900点",
      "英語学習",
      "上級者",
      "学習法",
      "勉強法",
      "スコアアップ",
      "英語試験",
      "教材"
    ]
  },
  "toeic-official-workbook-effective-usage-multiple-times": {
    "id": "toeic-official-workbook-effective-usage-multiple-times",
    "title": "TOEIC公式問題集を使い倒す！2周目以降の超効果的活用法",
    "description": "TOEIC公式問題集を1周解いただけではもったいない！この記事では、2周目、3周目と繰り返し学習する際の具体的な方法、復習のポイント、そしてスコアアップに直結する超効果的な使い方を徹底解説します。弱点を克服し、目標スコアを達成しましょう。",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/toeic-official-workbook-effective-usage-multiple-times.jpg",
    "tags": [
      "TOEIC",
      "公式問題集",
      "英語学習",
      "スコアアップ",
      "復習方法",
      "TOEIC対策",
      "英語勉強法",
      "2周目",
      "3周目"
    ]
  },
  "toeic-study-group-online-benefits-how-to-find": {
    "id": "toeic-study-group-online-benefits-how-to-find",
    "title": "TOEICオンライン勉強仲間を見つける方法とメリット・注意点",
    "description": "TOEIC学習のモチベーション維持に悩むあなたへ。オンラインで勉強仲間を見つける具体的な方法、メリット、効果的な活用法、そして注意点を網羅的に解説します。仲間と一緒に目標スコアを達成しましょう！",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "7分",
    "imageSrc": "/images/toeic-study-group-online-benefits-how-to-find.jpg",
    "tags": [
      "TOEIC",
      "オンライン学習",
      "勉強仲間",
      "モチベーション",
      "英語学習",
      "学習法",
      "英語試験",
      "仲間作り"
    ]
  },
  "toeic-part1-difficult-photo-description-patterns": {
    "id": "toeic-part1-difficult-photo-description-patterns",
    "title": "TOEIC Part1対策！難解な写真描写問題の攻略パターン5選",
    "description": "TOEIC Part1で高得点を狙うあなたへ！紛らわしい写真描写問題の難解パターン5選と、正解を見抜くための具体的な思考プロセスを徹底解説。この記事でPart1の失点を減らし、スコアアップを目指しましょう。",
    "category": "TOEIC",
    "date": "2025-06-05",
    "readTime": "8分",
    "imageSrc": "/images/toeic-part1-difficult-photo-description-patterns.jpg",
    "tags": [
      "TOEIC Part1",
      "TOEIC対策",
      "写真描写問題",
      "リスニング対策",
      "英語学習",
      "スコアアップ",
      "難問対策",
      "TOEIC勉強法"
    ]
  },
  "toefl-ibt-speaking-section-filler-words-natural-use": {
    "id": "toefl-ibt-speaking-section-filler-words-natural-use",
    "title": "TOEFLスピーキングで使える自然な「つなぎ言葉」フィラー集",
    "description": "TOEFLスピーキングで言葉に詰まる時、不自然な間を避けたいですか？この記事では、ネイティブが使う自然な「つなぎ言葉」フィラーを厳選して紹介します。効果的な使い方や練習方法も解説し、あなたのスピーキングの流暢さをアップさせ、高得点獲得をサポートします。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "5分",
    "imageSrc": "/images/toefl-ibt-speaking-section-filler-words-natural-use.jpg",
    "tags": [
      "TOEFL",
      "スピーキング",
      "フィラー",
      "つなぎ言葉",
      "英語学習",
      "発音",
      "流暢さ",
      "試験対策"
    ]
  },
  "toefl-ibt-writing-integrated-task-note-taking-template": {
    "id": "toefl-ibt-writing-integrated-task-note-taking-template",
    "title": "TOEFL統合ライティング: メモ取りテンプレートで高得点構成",
    "description": "TOEFLライティング統合タスクで高得点を取るための秘訣は、効率的なメモ取りと論理的な答案構成です。この記事では、リーディングとリスニングの要点を効果的に整理できる実践的なメモ取りテンプレートの活用法を具体例と共に解説し、あなたのスコアアップをサポートします。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/toefl-ibt-writing-integrated-task-note-taking-template.jpg",
    "tags": [
      "TOEFL",
      "ライティング",
      "統合タスク",
      "メモ取り",
      "テンプレート",
      "英語試験",
      "高得点",
      "学習法",
      "TOEFL対策"
    ]
  },
  "toefl-ibt-reading-vocabulary-context-guessing-skill": {
    "id": "toefl-ibt-reading-vocabulary-context-guessing-skill",
    "title": "TOEFLリーディング:文脈で未知の単語を推測する技術5選",
    "description": "TOEFLリーディングで未知の単語に遭遇しても大丈夫！文脈から意味を正確に推測する5つのテクニックを具体例と共に解説。語彙問題対策だけでなく、読解速度と総合的な英語力向上を目指しましょう。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/toefl-ibt-reading-vocabulary-context-guessing-skill.jpg",
    "tags": [
      "TOEFL",
      "リーディング",
      "単語推測",
      "語彙力",
      "英語学習",
      "読解力向上",
      "試験対策",
      "文脈推測"
    ]
  },
  "toefl-mybest-scores-how-to-use-which-universities-accept": {
    "id": "toefl-mybest-scores-how-to-use-which-universities-accept",
    "title": "TOEFL MyBest Scores活用法！大学への提出メリットと注意点",
    "description": "TOEFL MyBest Scores（Superscore）の仕組み、大学出願時のメリット・デメリット、受け入れ大学の情報を詳しく解説。スコア提出時の注意点や効果的な活用戦略も紹介し、あなたの海外大学進学準備をサポートします。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/toefl-mybest-scores-how-to-use-which-universities-accept.jpg",
    "tags": [
      "TOEFL",
      "MyBest Scores",
      "Superscore",
      "大学出願",
      "留学準備",
      "英語試験",
      "スコアアップ",
      "ETS",
      "海外大学"
    ]
  },
  "toefl-ibt-practice-test-score-accuracy-official-guide": {
    "id": "toefl-ibt-practice-test-score-accuracy-official-guide",
    "title": "TOEFL公式模試のスコアは本番とどれくらい違う？精度と活用法",
    "description": "TOEFL公式模試(TPO等)のスコアは本番とどれくらい違う？その精度や、本番とのギャップを埋める分析方法、効果的な活用法を徹底解説。模試を最大限に活かし目標スコア達成へ！",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/toefl-ibt-practice-test-score-accuracy-official-guide.jpg",
    "tags": [
      "TOEFL",
      "公式模試",
      "TPO",
      "スコア精度",
      "英語学習",
      "試験対策",
      "留学準備",
      "ETS"
    ]
  },
  "toefl-vs-ielts-for-us-uk-canadian-universities-comparison": {
    "id": "toefl-vs-ielts-for-us-uk-canadian-universities-comparison",
    "title": "TOEFLかIELTSか？米英加の大学留学に適した試験はどっち？",
    "description": "アメリカ、イギリス、カナダの大学留学に必要な英語試験、TOEFLとIELTS。どちらを選ぶべきか迷っていませんか？この記事では、各国の大学の傾向、試験内容、難易度、メリット・デメリットを徹底比較し、あなたに最適な試験選びをサポートします。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "7分",
    "imageSrc": "/images/toefl-vs-ielts-for-us-uk-canadian-universities-comparison.jpg",
    "tags": [
      "TOEFL",
      "IELTS",
      "海外留学",
      "アメリカ大学",
      "イギリス大学",
      "カナダ大学",
      "英語試験",
      "試験対策",
      "留学準備",
      "大学留学"
    ]
  },
  "toefl-junior-vs-toefl-primary-differences-target-age": {
    "id": "toefl-junior-vs-toefl-primary-differences-target-age",
    "title": "TOEFL JuniorとPrimaryの違いは？対象年齢と試験内容を解説",
    "description": "TOEFL JuniorとTOEFL Primary、どちらがお子様に合っている？本記事では、これらの試験の対象年齢、測定スキル、試験構成、スコア活用法を徹底比較。最適な試験選びをサポートし、英語学習の次のステップへ導きます。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/toefl-junior-vs-toefl-primary-differences-target-age.jpg",
    "tags": [
      "TOEFL Junior",
      "TOEFL Primary",
      "英語試験",
      "子供英語",
      "英語力測定",
      "小学生英語",
      "中学生英語",
      "高校生英語",
      "CEFR",
      "Lexile指数",
      "留学準備",
      "英語学習法"
    ]
  },
  "toefl-essay-writing-counter-argument-effective-inclusion": {
    "id": "toefl-essay-writing-counter-argument-effective-inclusion",
    "title": "TOEFLエッセイで高評価！効果的な反対意見の取り入れ方",
    "description": "TOEFLライティングで高得点を目指す方へ。説得力のあるエッセイに不可欠な反対意見（カウンターアーギュメント）の効果的な取り入れ方を、具体的なステップと例文を交えて徹底解説。論理構成を強化し、評価者の心を掴むテクニックを身につけましょう。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/toefl-essay-writing-counter-argument-effective-inclusion.jpg",
    "tags": [
      "TOEFLライティング",
      "TOEFLエッセイ",
      "カウンターアーギュメント",
      "反対意見",
      "英語ライティング",
      "論理構成",
      "高得点戦略",
      "学習法",
      "英語試験対策"
    ]
  },
  "toefl-speaking-intonation-stress-practice-methods": {
    "id": "toefl-speaking-intonation-stress-practice-methods",
    "title": "TOEFLスピーキング:自然なイントネーションと強勢の練習法",
    "description": "TOEFLスピーキングで高得点を目指す方へ。ネイティブのような自然なイントネーションと単語の強勢を身につけるための具体的な練習法とコツを徹底解説。シャドーイングや録音比較、辞書活用法など、今日から実践できる効果的な学習ステップを紹介します。",
    "category": "TOEFL",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/toefl-speaking-intonation-stress-practice-methods.jpg",
    "tags": [
      "TOEFL",
      "スピーキング",
      "イントネーション",
      "強勢",
      "発音矯正",
      "英語学習法",
      "試験対策",
      "シャドーイング",
      "英語の発音"
    ]
  },
  "english-extensive-reading-beginner-graded-readers-selection": {
    "id": "english-extensive-reading-beginner-graded-readers-selection",
    "title": "英語多読初心者向け！GR（段階別読本）の選び方と進め方",
    "description": "英語多読を始めたい初心者必見！Graded Readers（段階別読本）の魅力、レベル別選び方の3ステップ、効果的な読み進め方、そして多読のメリットを具体例と共に徹底解説。あなたにぴったりの一冊を見つけて、楽しく英語力をアップしましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/english-extensive-reading-beginner-graded-readers-selection.jpg",
    "tags": [
      "英語多読",
      "Graded Readers",
      "GR",
      "英語学習",
      "初心者",
      "リーディング教材",
      "教材選び",
      "多読 効果",
      "多読 進め方",
      "英語 本"
    ]
  },
  "improve-english-listening-comprehension-news-apps": {
    "id": "improve-english-listening-comprehension-news-apps",
    "title": "英語リスニング力UP！ニュースアプリ活用法とおすすめ5選",
    "description": "ニュースアプリで英語リスニング力を効果的に伸ばす方法を解説。アプリの選び方、具体的な学習ステップ、そして初心者から上級者まで対応したおすすめアプリ5選を紹介。スキマ時間を活用して、生きた英語に触れよう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "9分",
    "imageSrc": "/images/improve-english-listening-comprehension-news-apps.jpg",
    "tags": [
      "英語学習",
      "リスニング",
      "ニュースアプリ",
      "英語アプリ",
      "初心者",
      "中級者",
      "上級者",
      "英語勉強法",
      "スキルアップ",
      "多聴"
    ]
  },
  "online-english-conversation-lessons-for-introverts": {
    "id": "online-english-conversation-lessons-for-introverts",
    "title": "内向的な人向けオンライン英会話活用術！緊張しないコツ3選",
    "description": "オンライン英会話に挑戦したいけど、初対面の人との会話が苦手な内向的なあなたへ。この記事では、緊張せずにレッスンを楽しむための準備、講師の選び方、効果的なコミュニケーションのコツを具体的に解説。自信を持って英会話を始めるための3つの秘訣を伝授します。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "10分",
    "imageSrc": "/images/online-english-conversation-lessons-for-introverts.jpg",
    "tags": [
      "オンライン英会話",
      "内向的",
      "英語学習",
      "初心者",
      "コミュニケーション",
      "緊張対策",
      "英会話上達法",
      "英語の話し方"
    ]
  },
  "english-pronunciation-practice-with-ai-apps-review": {
    "id": "english-pronunciation-practice-with-ai-apps-review",
    "title": "AI英語発音矯正アプリ徹底比較！本当に効果があるのは？",
    "description": "英語の発音を独学で改善したいけれど、どのAIアプリを選べばいいか迷っていませんか？この記事では、人気のAI発音矯正アプリの機能、精度、料金を徹底比較し、あなたの学習目標に最適なアプリ選びをサポートします。効果的な練習法も合わせて解説！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/english-pronunciation-practice-with-ai-apps-review.jpg",
    "tags": [
      "英語発音",
      "AIアプリ",
      "発音矯正",
      "英語学習",
      "独学",
      "スピーキング",
      "アプリ比較",
      "おすすめアプリ",
      "ELSA Speak"
    ]
  },
  "english-slang-learning-movies-tvshows-caution": {
    "id": "english-slang-learning-movies-tvshows-caution",
    "title": "映画や海外ドラマで英語スラング学習！使う際の注意点とは？",
    "description": "映画や海外ドラマはリアルな英語スラングの宝庫ですが、TPOを間違えると誤解を招くことも。この記事では、効果的な学習方法、適切なスラングの選び方、そして使う際の重要注意点を具体的に解説し、あなたの英語表現を豊かにするお手伝いをします。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/english-slang-learning-movies-tvshows-caution.jpg",
    "tags": [
      "英語スラング",
      "映画で英語学習",
      "海外ドラマ英語",
      "英語学習法",
      "実践英会話",
      "ネイティブ表現",
      "英語の注意点",
      "リアルな英語",
      "英会話フレーズ"
    ]
  },
  "business-english-negotiation-phrases-win-win": {
    "id": "business-english-negotiation-phrases-win-win",
    "title": "英語での価格交渉を有利に進める！Win-Winに導くフレーズ集",
    "description": "海外ビジネスで必須の英語価格交渉。本記事では、初心者でも自信を持って臨めるよう、Win-Winな結果を引き出すための重要フレーズ、効果的な戦略、異文化理解のポイントを具体例と共に徹底解説。交渉力を磨き、ビジネスを成功に導くヒントが満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "12分",
    "imageSrc": "/images/business-english-negotiation-phrases-win-win.jpg",
    "tags": [
      "ビジネス英語",
      "価格交渉",
      "英語フレーズ",
      "交渉術",
      "グローバルビジネス",
      "異文化コミュニケーション",
      "Win-Win",
      "英語学習"
    ]
  },
  "english-presentation-opener-hook-audience-examples": {
    "id": "english-presentation-opener-hook-audience-examples",
    "title": "英語プレゼンの掴みはOK？聴衆を惹きつける冒頭テクニック",
    "description": "英語プレゼンの冒頭で聴衆の心を掴むためのテクニックを具体例満載で解説。印象的な自己紹介、効果的な質問、驚きのデータ提示など、あなたのプレゼンを成功に導く「掴み」の秘訣を紹介します。自信を持って聴衆を惹きつけましょう。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "7分",
    "imageSrc": "/images/english-presentation-opener-hook-audience-examples.jpg",
    "tags": [
      "英語プレゼン",
      "冒頭",
      "掴み",
      "スピーチ",
      "コミュニケーション",
      "聴衆",
      "プレゼンテーションスキル",
      "英語学習",
      "ビジネス英語"
    ]
  },
  "how-to-overcome-english-study-burnout-motivation-tips": {
    "id": "how-to-overcome-english-study-burnout-motivation-tips",
    "title": "英語学習の燃え尽き症候群を克服！モチベーション維持の秘訣",
    "description": "英語学習のやる気が出ない「燃え尽き」状態に悩んでいませんか？この記事では、学習のマンネリ化を防ぎ、モチベーションを維持するための具体的な方法や考え方、役立つツールやリソースを紹介します。スランプを克服し、楽しく学習を続ける秘訣が満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "9分",
    "imageSrc": "/images/how-to-overcome-english-study-burnout-motivation-tips.jpg",
    "tags": [
      "英語学習",
      "燃え尽き症候群",
      "モチベーション",
      "学習継続",
      "英語勉強法",
      "スランプ脱出",
      "英語独学",
      "英語初心者"
    ]
  },
  "choosing-english-dictionary-app-offline-learners": {
    "id": "choosing-english-dictionary-app-offline-learners",
    "title": "オフラインでも使える英語辞書アプリの選び方！学習者必携",
    "description": "インターネットがない場所でも英語学習を続けたいあなたへ。オフラインで使えるおすすめ英語辞書アプリの機能比較、選び方のポイント、学習効果を高める活用法を徹底解説。自分に合ったアプリを見つけて、英語力アップを目指しましょう！",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/choosing-english-dictionary-app-offline-learners.jpg",
    "tags": [
      "英語学習",
      "辞書アプリ",
      "オフライン",
      "英語独学",
      "アプリ選び",
      "おすすめアプリ",
      "英単語",
      "英語勉強法"
    ]
  },
  "second-language-acquisition-theory-for-adult-learners": {
    "id": "second-language-acquisition-theory-for-adult-learners",
    "title": "大人の英語学習者が知るべき第二言語習得理論の基礎知識",
    "description": "大人の英語学習者がなぜ英語習得に時間がかかると感じるのか、その疑問に第二言語習得理論の観点から答えます。クラッシェンのインプット仮説など主要な理論を分かりやすく解説し、科学的根拠に基づいた効率的な学習戦略や、BBC Learning English、Camblyなどの具体的なツール・リソースを紹介。今日から実践できるヒントが満載です。",
    "category": "学習法",
    "date": "2025-06-05",
    "readTime": "6分",
    "imageSrc": "/images/second-language-acquisition-theory-for-adult-learners.jpg",
    "tags": [
      "第二言語習得",
      "英語学習",
      "大人向け",
      "学習理論",
      "英語脳",
      "効率化",
      "クラッシェン",
      "インプット仮説",
      "アウトプット仮説",
      "英語勉強法",
      "モチベーション"
    ]
  }
};

// すべての記事データを日付順（降順）で取得するヘルパー関数
export const getSortedArticlesData = (): ArticleData[] => {
  // オブジェクトの値を取得し、日付でソート (降順)
  return Object.values(articleData).sort((a, b) => {
    // 日付文字列を比較
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    } else {
      return 0;
    }
  });
}; 