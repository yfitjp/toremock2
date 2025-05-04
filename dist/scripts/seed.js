"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const url_1 = require("url");
// サービスアカウントキーのパス (環境変数から取得、または直接指定)
// TODO: 環境変数 SERVICE_ACCOUNT_KEY_PATH を設定してください
const serviceAccountKeyPath = process.env.SERVICE_ACCOUNT_KEY_PATH || './serviceAccountKey.json';
// 環境変数から定義ディレクトリのパスを取得、なければデフォルト (dist 構造を想定)
// process.cwd() は node プロセスが開始された場所 (通常はプロジェクトルート) を返す
const defaultDefinitionsDir = path.resolve(process.cwd(), 'dist/app/lib/examDefinitions');
const definitionsDir = process.env.EXAM_DEFS_DIR || defaultDefinitionsDir;
// --- メイン処理を async 関数で囲む ---
async function main() {
    // Firebase Admin SDK の初期化
    if (!(0, app_1.getApps)().length) {
        try {
            const serviceAccount = JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf8'));
            (0, app_1.initializeApp)({
                credential: (0, app_1.cert)(serviceAccount)
            });
            console.log('Firebase Admin SDK initialized.');
        }
        catch (error) {
            console.error('Error initializing Firebase Admin SDK:', error.message);
            if (error.code === 'ENOENT') {
                console.error(`Service account key file not found at ${serviceAccountKeyPath}. Please ensure the file exists or the environment variable SERVICE_ACCOUNT_KEY_PATH is set correctly.`);
            }
            else {
                console.error('Make sure the service account key file content is valid JSON.');
            }
            process.exit(1); // SDK初期化に失敗したら終了
        }
    }
    else {
        console.log('Firebase Admin SDK already initialized.');
    }
    const db = (0, firestore_1.getFirestore)();
    // Cast to expected types, ensure imports are correct
    const examsCollection = db.collection('exams');
    const questionsCollection = db.collection('questions');
    // seedDatabase 関数を呼び出し、db とコレクションを渡す
    await seedDatabase(db, examsCollection, questionsCollection);
}
// --- seedDatabase 関数を修正し、db とコレクションを引数で受け取る ---
async function seedDatabase(db, examsCollection, questionsCollection) {
    console.log(`Reading exam definitions from: ${definitionsDir}`);
    try {
        const files = await fs.readdir(definitionsDir);
        const definitionFiles = files.filter((file) => file.endsWith('.js')); // Assuming compiled JS
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
                const fileUrl = (0, url_1.pathToFileURL)(filePath).href;
                const definitionModule = await import(fileUrl);
                // Ensure the imported types match expected structure
                const examData = definitionModule.examData;
                const questions = definitionModule.questions;
                if (!examData || !questions) {
                    console.warn(`Skipping ${file}: Missing examData or questions export.`);
                    continue;
                }
                const batch = db.batch();
                const examDocRef = examsCollection.doc(examId);
                batch.set(examDocRef, {
                    ...examData,
                    createdAt: firestore_1.FieldValue.serverTimestamp(),
                    updatedAt: firestore_1.FieldValue.serverTimestamp(),
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
            }
            catch (importError) {
                console.error(`Error processing file ${file}:`, importError);
                if (importError.code === 'MODULE_NOT_FOUND') {
                    console.error(`  Please check if the file path and exports are correct.`);
                }
            }
        }
    }
    catch (readDirError) {
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
    }
    catch (error) {
        console.error('Error seeding Firestore data:', error);
        process.exit(1);
    }
})();
