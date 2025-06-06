"use strict";
// 'use client'; // サーバーコンポーネントにするため削除
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMetadata = generateMetadata;
exports.default = ArticleDetail;
const react_1 = __importDefault(require("react"));
const link_1 = __importDefault(require("next/link"));
const navigation_1 = require("next/navigation");
const image_1 = __importDefault(require("next/image"));
// import { getArticleData, getSortedArticlesData } from '../../lib/articles'; // Markdownヘルパーを削除
const article_data_1 = require("../../lib/article-data"); // ハードコードされたデータをインポート
// 目次コンポーネントのインポートを削除
// import TableOfContents from '../../components/TableOfContents';
const ShareButtons_1 = __importDefault(require("../../components/ShareButtons")); // ShareButtonsのインポートを復活させる
// 記事本文コンポーネントをインポート
const ToeicMocktestComparisonContent_1 = __importDefault(require("../../components/article-contents/ToeicMocktestComparisonContent"));
const ToeflSpeakingServicesContent_1 = __importDefault(require("../../components/article-contents/ToeflSpeakingServicesContent"));
const ToeicBeginnersGuideContent_1 = __importDefault(require("../../components/article-contents/ToeicBeginnersGuideContent"));
const EikenToeicComparisonContent_1 = __importDefault(require("../../components/article-contents/EikenToeicComparisonContent"));
const ReadingSkillsGuideContent_1 = __importDefault(require("../../components/article-contents/ReadingSkillsGuideContent"));
const ToeflWritingGuideContent_1 = __importDefault(require("@/app/(articles)/components/article-contents/ToeflWritingGuideContent"));
const ToeicPart5StrategyContent_1 = __importDefault(require("@/app/(articles)/components/article-contents/ToeicPart5StrategyContent"));
const EffectiveVocabularyLearningContent_1 = __importDefault(require("@/app/(articles)/components/article-contents/EffectiveVocabularyLearningContent"));
// 記事IDと本文コンポーネントのマッピング
const articleContentComponents = {
    'toeic-mocktest-comparison': ToeicMocktestComparisonContent_1.default,
    'toefl-speaking-services': ToeflSpeakingServicesContent_1.default,
    'toeic-beginners-guide': ToeicBeginnersGuideContent_1.default,
    'eiken-toeic-comparison': EikenToeicComparisonContent_1.default,
    'reading-skills-guide': ReadingSkillsGuideContent_1.default,
    'toefl-writing-guide': ToeflWritingGuideContent_1.default,
    'toeic-part5-strategy': ToeicPart5StrategyContent_1.default,
    'effective-vocabulary-learning': EffectiveVocabularyLearningContent_1.default,
};
// カテゴリ情報 (変更なし)
const categoryInfo = {
    'TOEIC': {
        description: 'TOEIC試験対策や学習方法、効率的なスコアアップ戦略などを紹介します。',
        icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>)
    },
    'TOEFL': {
        description: 'TOEFL iBTの各セクション対策や、効果的な学習アプローチを解説します。',
        icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>)
    },
    '英語試験': {
        description: '英検やIELTSなど、様々な英語資格試験の特徴や対策法を紹介します。',
        icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
      </svg>)
    },
    '学習法': {
        description: '効率的な英語学習方法や、モチベーション維持のコツなどを解説します。',
        icon: (<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>)
    }
};
// 関連記事生成関数 (ハードコードデータを使用)
function getRelatedArticles(currentId, currentCategory, currentTags) {
    const allArticles = (0, article_data_1.getSortedArticlesData)(); // すべての記事メタデータを取得
    return allArticles
        .filter(article => article.id !== currentId) // 自分自身を除外
        .filter(article => article.category === currentCategory || // 同じカテゴリ
        (article.tags && currentTags && article.tags.some(tag => currentTags.includes(tag))) // タグが一部一致
    )
        .slice(0, 3); // 関連記事を3つまで表示
}
// 動的メタデータ生成 (ハードコードデータを使用)
async function generateMetadata({ params }) {
    // const article = await getArticleData(params.id); // Markdownヘルパーを削除
    const article = article_data_1.articleData[params.id]; // ハードコードデータから取得
    if (!article) {
        return { title: '記事が見つかりません' };
    }
    return {
        title: `${article.title} | トレモック情報局`,
        description: article.description,
    };
}
// ページコンポーネント (サーバーコンポーネント)
async function ArticleDetail({ params }) {
    // const article = await getArticleData(params.id); // Markdownヘルパーを削除
    const article = article_data_1.articleData[params.id]; // ハードコードデータから取得
    const ArticleContent = articleContentComponents[params.id]; // 対応する本文コンポーネントを取得
    if (!article || !ArticleContent) { // データまたはコンポーネントがなければ404
        (0, navigation_1.notFound)();
    }
    const relatedArticles = getRelatedArticles(article.id, article.category, article.tags);
    return (<div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8 gap-y-12">

        {/* サイドバーエリア (記事本文の後に移動) */}
        <aside className="lg:col-span-4 order-last">
          <div className="sticky top-24 space-y-8">
            {/* 目次セクションを削除 */}

            {/* 著者情報 */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">この記事を書いた人</h3>
              <div className="flex items-center space-x-4">
                <div className="relative h-12 w-12 bg-slate-300 rounded-full overflow-hidden">
                  <svg className="absolute inset-0 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">英語テスト情報局 編集部</h4>
                  <p className="text-sm text-slate-500">最新の英語テスト情報をお届けします。</p>
                </div>
              </div>
            </div>

            {/* 関連記事 */}
            {relatedArticles.length > 0 && (<div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">関連記事</h3>
                <ul className="space-y-4">
                  {relatedArticles.map(relArticle => (<li key={relArticle.id}>
                      <link_1.default href={`/articles/${relArticle.id}`} className="group block">
                        <div className="flex items-start space-x-3">
                          <div className="relative h-16 w-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                            {relArticle.imageSrc ? (<image_1.default src={relArticle.imageSrc} alt={relArticle.title} fill className="object-cover" sizes="64px"/>) : (<div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                {categoryInfo[relArticle.category]?.icon || <span className="text-2xl">📄</span>}
                              </div>)}
                          </div>
                          <div>
                            <span className="text-xs text-slate-500 group-hover:text-slate-700">{relArticle.category}</span>
                            <h4 className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                              {relArticle.title}
                            </h4>
                          </div>
                        </div>
                      </link_1.default>
                    </li>))}
                </ul>
              </div>)}

            {/* 関連模試へのリンク */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">ToreMockで実力試し！</h3>
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-blue-600 scale-150">
                  {categoryInfo[article.category]?.icon || <span className="mr-1">📄</span>}
                </div>
                <p className="text-sm text-slate-700">
                  この記事のカテゴリ「{article.category}」に関連する模試に挑戦しませんか？
                </p>
              </div>
              <link_1.default href={`/?category=${article.category}`} className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {article.category} の模試を見る
              </link_1.default>
            </div>

            {/* シェアボタン */}
            <ShareButtons_1.default title={article.title}/>

          </div>
        </aside>

        {/* メインコンテンツエリア (サイドバーの前に移動) */}
        <div className="lg:col-span-8 order-first">
          {/* 記事ヘッダー */}
          <div className="mb-8">
            {/* カテゴリ、日付、時間 */}
            <div className="flex items-center text-sm text-slate-500 mb-4">
              <link_1.default href={`/articles?category=${article.category}`} className="flex items-center text-slate-700 hover:text-slate-900">
                {categoryInfo[article.category]?.icon || <span className="mr-1">📄</span>}
                <span className="font-medium ml-1">{article.category}</span>
              </link_1.default>
              <span className="mx-2">•</span>
              <time dateTime={article.date}>{new Date(article.date).toLocaleDateString('ja-JP')}</time>
              <span className="mx-2">•</span>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                <span>{article.readTime}</span>
              </div>
            </div>
            
            {/* タイトル */}
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{article.title}</h1>
            
            {/* タグ */}
            {article.tags && article.tags.length > 0 && (<div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map(tag => (<span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">
                    #{tag}
                  </span>))}
              </div>)}
            
            {/* メイン画像 */}
            <div className="relative aspect-video bg-slate-200 rounded-xl mb-8 overflow-hidden">
              <image_1.default src={article.imageSrc || '/images/placeholder.jpg'} alt={article.title} fill sizes="(max-width: 1024px) 100vw, 800px" className="object-cover" priority/>
            </div>
          </div>
          
          {/* 記事本文エリア (コンポーネントをレンダリング) */}
          {/* <div
          className="prose prose-lg max-w-none mb-12"
          id="article-content"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }} // HTMLレンダリングを削除
        /> */}
          <div id="article-content" className="mb-12">
            <ArticleContent /> {/* ハードコードされた本文コンポーネントをレンダリング */}
          </div>
          
          {/* CTA セクション */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-xl p-6 md:p-8 shadow-lg text-white mb-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-2xl font-bold mb-4">この記事は参考になりましたか？</h2>
              <p className="mb-6 text-slate-300">
                トレモック情報局が提携する「ToreMock」では、{article.category}の本番さながらの模試を提供しています。
                リアルな形式で実力を測り、効率的に学習を進めましょう。
              </p>
              <link_1.default href={`/?category=${article.category}`} className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                <span>{article.category}の模試を受ける</span>
                <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </link_1.default>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
