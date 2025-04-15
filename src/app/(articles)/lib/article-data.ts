export type CategoryKey = 'TOEIC' | 'TOEFL' | '英語試験' | '学習法';

export type ArticleData = {
  id: string;
  title: string;
  description: string;
  category: CategoryKey;
  date: string; // YYYY-MM-DD 形式を推奨
  readTime: string;
  imageSrc: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
  comingSoon?: boolean;
};

// ハードコードされた記事データ
export const articleData: Record<string, ArticleData> = {
  'toeic-mocktest-comparison': {
    id: 'toeic-mocktest-comparison',
    title: 'TOEIC模試を安く受けたい！人気サイトの料金と特徴を徹底比較',
    description: 'コスパ最強のTOEIC模試サービスを比較。高品質で低価格の模試はどれ？料金、特徴、メリットを詳しく解説します。',
    category: 'TOEIC',
    date: '2023-04-01',
    readTime: '8分',
    imageSrc: '/images/toeic-comparison.jpg',
    tags: ['TOEIC', '模試', '比較'],
    featured: true
  },
  'toefl-speaking-services': {
    id: 'toefl-speaking-services',
    title: 'TOEFLスピーキング対策どこでする？安くて質の高いサービスはコレ',
    description: 'TOEFLスピーキングを効率的に対策するためのサービスを比較。コストパフォーマンスに優れたサービスを見つけましょう。',
    category: 'TOEFL',
    date: '2023-04-05',
    readTime: '10分',
    imageSrc: '/images/toefl-speaking.jpg',
    tags: ['TOEFL', 'スピーキング', 'オンライン学習'],
    popular: true
  },
  'toeic-beginners-guide': {
    id: 'toeic-beginners-guide',
    title: 'TOEIC初心者向け完全ガイド：スコアアップへの最短ルート',
    description: 'TOEIC初心者必見！テスト概要、目標設定、学習ロードマップ、パート別対策、継続のコツまで、スコアアップに必要な情報を凝縮。',
    category: 'TOEIC',
    date: '2023-04-10',
    readTime: '18分',
    imageSrc: '/images/toeic-beginners.jpg',
    tags: ['TOEIC', '初心者', '勉強法', 'ロードマップ', '完全ガイド'],
    popular: true
  },
  'eiken-toeic-comparison': {
    id: 'eiken-toeic-comparison',
    title: '英検とTOEIC、どっちを受けるべき？違いと選び方を徹底比較',
    description: '英検とTOEIC L&Rの違いを目的、難易度、試験形式、評価方法などから徹底比較。あなたに最適な試験はどっち？',
    category: '英語試験',
    date: new Date('2024-07-25').toLocaleDateString('ja-JP'),
    readTime: '10分',
    imageSrc: '/images/eiken-toeic.jpg',
    tags: ['英検', 'TOEIC', '比較', '英語試験', '資格'],
    popular: false,
  },
  'reading-skills-guide': {
    id: 'reading-skills-guide',
    title: '英語リーディング力UP！速読と精読の効果的なトレーニング法',
    description: '英語の長文読解が苦手な方へ。速読力と精読力をバランス良く鍛える具体的なトレーニング方法と学習のコツを解説。',
    category: '学習法',
    date: new Date('2024-07-26').toLocaleDateString('ja-JP'),
    readTime: '12分',
    imageSrc: '/images/reading-skills.jpg',
    tags: ['リーディング', '速読', '精読', '英語学習', 'スキルアップ'],
    popular: false,
  },
  'toefl-writing-guide': {
    id: 'toefl-writing-guide',
    title: 'TOEFL iBT® Writing完全攻略: Integrated & Independent Task対策',
    description: 'TOEFL Writingセクションで高得点を狙うための具体的な戦略、テンプレート活用法、採点基準に基づいた対策を徹底解説。',
    category: 'TOEFL',
    date: new Date().toLocaleDateString('ja-JP'),
    readTime: '15分',
    imageSrc: '/images/toefl-writing.jpg',
    tags: ['TOEFL', 'Writing', 'ライティング対策', 'テンプレート'],
    popular: true,
  },
  'toeic-part5-strategy': {
    id: 'toeic-part5-strategy',
    title: 'TOEIC L&R Part 5 完全攻略: 時間短縮と正答率UPのコツ',
    description: 'TOEIC Part 5の文法・語彙問題を効率的に解くための戦略を徹底解説。問題タイプ別の攻略法や時間配分の秘訣を紹介します。',
    category: 'TOEIC',
    date: new Date().toLocaleDateString('ja-JP'),
    readTime: '12分',
    imageSrc: '/images/toeic-part5.jpg',
    tags: ['TOEIC', 'Part 5', '文法', '語彙', '時間短縮'],
    popular: false,
  },
  'effective-vocabulary-learning': {
    id: 'effective-vocabulary-learning',
    title: 'もう忘れない！科学的根拠に基づく効果的な英単語の覚え方',
    description: '単語学習に挫折していませんか？記憶の仕組みに基づいた、効率的で忘れにくい英単語の暗記法を具体的に解説します。',
    category: '学習法',
    date: new Date().toLocaleDateString('ja-JP'),
    readTime: '10分',
    imageSrc: '/images/vocabulary-learning.jpg',
    tags: ['英単語', '暗記法', '記憶術', '学習効率', 'ボキャブラリー'],
    popular: false,
  }
};

// すべての記事データを日付順（降順）で取得するヘルパー関数
export const getSortedArticlesData = (): ArticleData[] => {
  return Object.values(articleData).sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}; 