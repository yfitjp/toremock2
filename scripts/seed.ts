import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, CollectionReference, WriteBatch } from 'firebase-admin/firestore';
import * as fs from 'fs/promises';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { ExamData, Question } from '@/app/lib/firestoreTypes.js';

// サービスアカウントキーのパス (環境変数から取得、または直接指定)
// TODO: 環境変数 SERVICE_ACCOUNT_KEY_PATH を設定してください
const serviceAccountKeyPath = process.env.SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json';
// examDefinitions ディレクトリのパス
// __dirname は ES Modules では使えないため、プロジェクトルートからの相対パスを使用
const definitionsDir = path.resolve('src/app/lib/examDefinitions');

// --- メイン処理を async 関数で囲む ---
async function main() {
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
  // Cast to expected types, ensure imports are correct
  const examsCollection = db.collection('exams') as CollectionReference<Omit<ExamData, 'id'>>;
  const questionsCollection = db.collection('questions') as CollectionReference<Omit<Question, 'id'>>;

  // seedDatabase 関数を呼び出し、db とコレクションを渡す
  await seedDatabase(db, examsCollection, questionsCollection);
}

// --- seedDatabase 関数を修正し、db とコレクションを引数で受け取る ---
async function seedDatabase(
  db: ReturnType<typeof getFirestore>,
  examsCollection: CollectionReference<Omit<ExamData, 'id'>>,
  questionsCollection: CollectionReference<Omit<Question, 'id'>>
) {
  console.log(`Reading exam definitions from: ${definitionsDir}`);

  try {
    const files = await fs.readdir(definitionsDir);
    const definitionFiles = files.filter((file: string) => file.endsWith('.js')); // Assuming compiled JS

    if (definitionFiles.length === 0) {
      console.warn(`No definition files (.js) found in ${definitionsDir}. Make sure to compile .ts files or adjust filtering.`);
      return;
    }

    console.log(`Found definition files: ${definitionFiles.join(', ')}`);

    for (const file of definitionFiles) {
      const filePath = path.join(definitionsDir, file);
      const examId = path.basename(file, '.js');
      console.log(`\nProcessing ${file} (Exam ID: ${examId})...`);

      try {
        const fileUrl = pathToFileURL(filePath).href;
        const definitionModule = await import(fileUrl);
        // Ensure the imported types match expected structure
        const examData = definitionModule.examData as Omit<ExamData, 'id' | 'createdAt' | 'updatedAt'>;
        const questions = definitionModule.questions as Omit<Question, 'id' | 'examId'>[];

        if (!examData || !questions) {
          console.warn(`Skipping ${file}: Missing examData or questions export.`);
          continue;
        }

        const batch = db.batch();

        const examDocRef = examsCollection.doc(examId);
        batch.set(examDocRef, {
          ...examData,
          createdAt: FieldValue.serverTimestamp() as Timestamp,
          updatedAt: FieldValue.serverTimestamp() as Timestamp,
        });
        console.log(`  - Added exam data for ${examId} to batch.`);

        for (const questionData of questions) {
          const questionId = `${examId}-${questionData.sectionTitle.replace(/\s+/g, '-')}-${String(questionData.order).padStart(2, '0')}`.toLowerCase();
          const questionDocRef = questionsCollection.doc(questionId);
          batch.set(questionDocRef, {
            ...questionData,
            examId: examId,
          });
        }
        console.log(`  - Added ${questions.length} questions for ${examId} to batch.`);

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

// --- main 関数を実行 ---
(async () => {
  try {
    console.log('Seeding Firestore data...');
    await main(); // Call the main async function
    console.log('Successfully seeded Firestore data!');
  } catch (error) {
    console.error('Error seeding Firestore data:', error);
    process.exit(1);
  }
})(); 