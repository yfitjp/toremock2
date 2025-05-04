import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, CollectionReference, WriteBatch } from 'firebase-admin/firestore';
import * as fs from 'fs/promises';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { ExamData, Question } from '../src/app/lib/firestoreTypes';

// サービスアカウントキーのパス (環境変数から取得、または直接指定)
// TODO: 環境変数 SERVICE_ACCOUNT_KEY_PATH を設定してください
const serviceAccountKeyPath = process.env.SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json';
// examDefinitions ディレクトリのパス
// __dirname は ES Modules では使えないため、プロジェクトルートからの相対パスを使用
const definitionsDir = path.resolve('src/app/lib/examDefinitions');

// Firebase Admin SDK の初期化
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized.');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
    if (error.code === 'ENOENT') {
      console.error(`Service account key file not found at ${serviceAccountKeyPath}. Please ensure the file exists or the environment variable SERVICE_ACCOUNT_KEY_PATH is set correctly.`);
    } else {
       console.error('Make sure the service account key file content is valid JSON.');
    }
    process.exit(1); // SDK初期化に失敗したら終了
  }
} else {
  console.log('Firebase Admin SDK already initialized.');
}

const db = getFirestore();
const examsCollection = db.collection('exams') as CollectionReference<Omit<ExamData, 'id'>>;
const questionsCollection = db.collection('questions') as CollectionReference<Omit<Question, 'id'>>;

/**
 * 指定されたディレクトリから模試定義ファイルを読み込み、Firestoreに登録する
 */
async function seedDatabase() {
  console.log(`Reading exam definitions from: ${definitionsDir}`);

  try {
    const files = await fs.readdir(definitionsDir);
    // .js ファイルを探すように変更
    const definitionFiles = files.filter((file: string) => file.endsWith('.js'));

    if (definitionFiles.length === 0) {
      // エラーメッセージも .js に合わせる
      console.warn(`No definition files (.js) found in ${definitionsDir}. Make sure to compile .ts files first.`);
      return;
    }

    console.log(`Found definition files: ${definitionFiles.join(', ')}`);

    // 各定義ファイルを処理
    for (const file of definitionFiles) {
      const filePath = path.join(definitionsDir, file);
      // examId は .js 拡張子を除去して取得
      const examId = path.basename(file, '.js'); 
      console.log(`\nProcessing ${file} (Exam ID: ${examId})...`);

      try {
        // .js ファイルをインポート
        const fileUrl = pathToFileURL(filePath).href;
        const definitionModule = await import(fileUrl);
        // examData, questions の取得は変わらず
        const examData = definitionModule.examData as Omit<ExamData, 'id' | 'createdAt' | 'updatedAt'>;
        const questions = definitionModule.questions as Omit<Question, 'id' | 'examId'>[];

        if (!examData || !questions) {
          console.warn(`Skipping ${file}: Missing examData or questions export.`);
          continue;
        }

        // Firestore バッチ書き込みの準備
        const batch = db.batch();

        // 1. 模試ドキュメントを exams コレクションに登録 (IDはファイル名を使用)
        const examDocRef = examsCollection.doc(examId); // examsCollection を使用
        batch.set(examDocRef, {
          ...examData,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        });
        console.log(`  - Added exam data for ${examId} to batch.`);

        // 2. 問題ドキュメントを questions コレクションに登録
        for (const questionData of questions) {
          // 各問題に一意のIDを生成 (例: examId-sectionTitle-order)
          // 注意: より堅牢なID生成方法が必要な場合がある
          const questionId = `${examId}-${questionData.sectionTitle.replace(/\s+/g, '-')}-${String(questionData.order).padStart(2, '0')}`.toLowerCase();
          const questionDocRef = questionsCollection.doc(questionId); // questionsCollection を使用
          batch.set(questionDocRef, {
            ...questionData,
            examId: examId, // 模試IDを紐付け
          });
        }
        console.log(`  - Added ${questions.length} questions for ${examId} to batch.`);

        // バッチ書き込みを実行
        await batch.commit();
        console.log(`Successfully committed batch for ${examId}.`);

      } catch (importError: any) {
        console.error(`Error processing file ${file}:`, importError);
        if (importError.code === 'MODULE_NOT_FOUND') {
          console.error(`  Please check if the file path and exports are correct.`);
        }
      }
    }

  } catch (readDirError: any) {
    console.error(`Error reading directory ${definitionsDir}:`, readDirError);
    if (readDirError.code === 'ENOENT') {
      console.error('  The specified directory does not exist.');
    }
  }
}

// スクリプト実行
(async () => {
  try {
    console.log('Seeding Firestore data...');
    await seedDatabase();
    console.log('Successfully seeded Firestore data!');
  } catch (error) {
    console.error('Error seeding Firestore data:', error);
    process.exit(1);
  }
})(); 