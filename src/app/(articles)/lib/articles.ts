import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// articlesディレクトリへのパス
const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

// すべての記事のソート済みメタデータを取得する関数
export function getSortedArticlesData() {
  // /src/content/articles以下のファイル名を取得
  const fileNames = fs.readdirSync(articlesDirectory);
  const allArticlesData = fileNames.map((fileName) => {
    // ファイル名から ".md" を削除してidを取得
    const id = fileName.replace(/\.md$/, '');

    // Markdownファイルを文字列として読み込む
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matterで記事のメタデータセクションをパース
    const matterResult = matter(fileContents);

    // データをidと組み合わせる
    return {
      id,
      ...(matterResult.data as { 
        title: string; 
        date: string; 
        category: string; 
        tags: string[]; 
        description: string;
        imageSrc: string;
        readTime: string;
       }), // 型アサーションを追加
    };
  });

  // 記事を日付でソート
  return allArticlesData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 指定されたidの記事データを取得する非同期関数
export async function getArticleData(id: string) {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  let fileContents;
  try {
     fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    // ファイルが存在しない場合は null を返すか、エラーを投げる
    console.error(`Error reading article file for id: ${id}`, err);
    return null; 
  }

  // gray-matterで記事のメタデータセクションをパース
  const matterResult = matter(fileContents);

  // remarkを使ってMarkdownをHTML文字列に変換
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // データをid、HTMLコンテンツ、メタデータと組み合わせる
  return {
    id,
    contentHtml,
    ...(matterResult.data as { 
        title: string; 
        date: string; 
        category: string; 
        tags: string[]; 
        description: string;
        imageSrc: string;
        readTime: string;
      }), // 型アサーションを追加
  };
} 