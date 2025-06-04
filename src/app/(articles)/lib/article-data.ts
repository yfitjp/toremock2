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
    ]
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
    ]
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
    ]
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
    ]
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