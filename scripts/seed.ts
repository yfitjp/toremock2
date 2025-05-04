import * as admin from 'firebase-admin';
import { getFirestore, Timestamp, WriteBatch } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// --- 設定 --- 
// examDefinitionsディレクトリの絶対パスを取得 (このスクリプトからの相対パスで解決)
const definitionsDir = path.resolve(__dirname, '../app/lib/examDefinitions'); 
const examsCollectionName = 'exams';
const questionsCollectionName = 'questions';

// Firebase Admin SDK の初期化
// サービスアカウントキーのパスを環境変数から取得
// process.env.GOOGLE_APPLICATION_CREDENTIALS が設定されている必要がある
try {
    if (admin.apps.length === 0) { // 二重初期化を防ぐ
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // 必要であれば databaseURL を指定
            // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com"
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } else {
        console.log('Firebase Admin SDK already initialized.');
    }
} catch (error: any) {
    console.error('Error initializing Firebase Admin SDK:', error);
    console.error('Please ensure the GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly.');
    process.exit(1); // エラーで終了
}

const db = getFirestore();

/**
 * 模試データと質問データを Firestore に登録する関数
 */
async function seedDatabase() {
    console.log(`Loading exam definitions from: ${definitionsDir}`);

    try {
        const files = fs.readdirSync(definitionsDir).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        console.log(`Found definition files: ${files.join(', ')}`);

        for (const file of files) {
            const filePath = path.join(definitionsDir, file);
            console.log(`\nProcessing file: ${file}...`);

            try {
                // TypeScriptファイルの場合、そのままimportできるか、
                // もしくは ts-node で実行するか、事前に JavaScript にコンパイルする必要がある
                // ここでは dynamic import を試みる (Node.js v13.2.0+)
                // もし ts-node などがなければ、事前に tsc で js に変換しておくのが確実
                const module = await import(filePath);
                const { examData, questions } = module;

                if (!examData || !examData.id || !questions) {
                    console.warn(`Skipping ${file}: examData or questions not found or examData.id is missing.`);
                    continue;
                }

                // 1. Exam データ登録
                console.log(`  Registering exam: ${examData.title} (ID: ${examData.id})`);
                const examRef = db.collection(examsCollectionName).doc(examData.id);
                await examRef.set({
                    ...examData,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                }, { merge: true }); // merge: true で既存フィールドを保持しつつ更新/作成
                console.log(`    Exam ${examData.id} registered/updated.`);

                // 2. Questions データ登録 (バッチ処理)
                console.log(`  Registering ${questions.length} questions for exam ${examData.id}...`);
                const batchSize = 400; // Firestore バッチ書き込みの上限は500だが、余裕を持たせる
                for (let i = 0; i < questions.length; i += batchSize) {
                    const batch: WriteBatch = db.batch();
                    const chunk = questions.slice(i, i + batchSize);
                    console.log(`    Processing batch ${Math.floor(i / batchSize) + 1} (size: ${chunk.length})...`);

                    for (const question of chunk) {
                        if (!question || !question.id) {
                           console.warn(`    Skipping invalid question data in ${file}:`, question);
                           continue;
                        }
                        const questionRef = db.collection(questionsCollectionName).doc(question.id);
                        batch.set(questionRef, {
                            ...question,
                            // 必要であれば createdAt/updatedAt を追加
                        }, { merge: true });
                    }
                    await batch.commit();
                    console.log(`    Batch ${Math.floor(i / batchSize) + 1} committed.`);
                }
                console.log(`  All questions for exam ${examData.id} registered/updated.`);

            } catch (importError: any) {
                console.error(`Error processing file ${file}:`, importError);
            }
        }

        console.log('\nDatabase seeding completed successfully!');

    } catch (error: any) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    }
}

// スクリプト実行
seedDatabase(); 