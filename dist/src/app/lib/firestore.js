"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExamData = exports.addExamData = exports.queryDocuments = exports.formatTimestamp = exports.deleteDocument = exports.updateDocument = exports.addDocument = exports.setDocument = exports.getCollection = exports.getDocument = exports.COLLECTIONS = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("./firebase");
// Firestoreのコレクション名を定義
exports.COLLECTIONS = {
    USERS: 'users',
    EXAMS: 'exams',
    PURCHASES: 'purchases',
    EXAM_ATTEMPTS: 'exam_attempts',
    QUESTIONS: 'questions',
    SUBSCRIPTIONS: 'subscriptions',
};
// オフライン永続化を有効化
(0, firestore_1.enableIndexedDbPersistence)(firebase_1.db).catch((err) => {
    if (err.code === 'failed-precondition') {
        // 複数のタブが開いている場合
        console.warn('複数のタブが開いているため、オフライン永続化を有効化できません');
    }
    else if (err.code === 'unimplemented') {
        // ブラウザが対応していない場合
        console.warn('このブラウザはオフライン永続化に対応していません');
    }
    else {
        console.error('オフライン永続化の設定に失敗しました:', err);
    }
});
// ドキュメントを取得する
const getDocument = async (collectionName, docId) => {
    try {
        const docRef = (0, firestore_1.doc)(firebase_1.db, collectionName, docId);
        const docSnap = await (0, firestore_1.getDoc)(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.error(`Error getting document from ${collectionName}:`, error);
        throw error;
    }
};
exports.getDocument = getDocument;
// コレクション内のすべてのドキュメントを取得する
const getCollection = async (collectionName, constraints = []) => {
    try {
        const collectionRef = (0, firestore_1.collection)(firebase_1.db, collectionName);
        const q = (0, firestore_1.query)(collectionRef, ...constraints);
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
    catch (error) {
        console.error(`Error getting collection ${collectionName}:`, error);
        throw error;
    }
};
exports.getCollection = getCollection;
// ドキュメントを作成または更新する
const setDocument = async (collectionName, docId, data, merge = true) => {
    try {
        const docRef = (0, firestore_1.doc)(firebase_1.db, collectionName, docId);
        await (0, firestore_1.setDoc)(docRef, { ...data, updatedAt: (0, firestore_1.serverTimestamp)() }, { merge });
    }
    catch (error) {
        console.error(`Error setting document in ${collectionName}:`, error);
        throw error;
    }
};
exports.setDocument = setDocument;
// 新しいドキュメントを追加する（IDは自動生成）
const addDocument = async (collectionName, data) => {
    try {
        const collectionRef = (0, firestore_1.collection)(firebase_1.db, collectionName);
        const docRef = await (0, firestore_1.addDoc)(collectionRef, {
            ...data,
            createdAt: (0, firestore_1.serverTimestamp)(),
            updatedAt: (0, firestore_1.serverTimestamp)(),
        });
        return docRef.id;
    }
    catch (error) {
        console.error(`Error adding document to ${collectionName}:`, error);
        throw error;
    }
};
exports.addDocument = addDocument;
// ドキュメントを更新する
const updateDocument = async (collectionName, docId, data) => {
    try {
        const docRef = (0, firestore_1.doc)(firebase_1.db, collectionName, docId);
        await (0, firestore_1.updateDoc)(docRef, { ...data, updatedAt: (0, firestore_1.serverTimestamp)() });
    }
    catch (error) {
        console.error(`Error updating document in ${collectionName}:`, error);
        throw error;
    }
};
exports.updateDocument = updateDocument;
// ドキュメントを削除する
const deleteDocument = async (collectionName, docId) => {
    try {
        const docRef = (0, firestore_1.doc)(firebase_1.db, collectionName, docId);
        await (0, firestore_1.deleteDoc)(docRef);
    }
    catch (error) {
        console.error(`Error deleting document from ${collectionName}:`, error);
        throw error;
    }
};
exports.deleteDocument = deleteDocument;
// Timestampを日付文字列に変換する
const formatTimestamp = (timestamp) => {
    if (!timestamp)
        return '';
    return timestamp.toDate().toLocaleString('ja-JP');
};
exports.formatTimestamp = formatTimestamp;
// コレクションからドキュメントをクエリする
const queryDocuments = async (collectionName, constraints = []) => {
    try {
        console.log(`クエリ実行: ${collectionName}`, constraints);
        const collectionRef = (0, firestore_1.collection)(firebase_1.db, collectionName);
        let q;
        if (constraints.length > 0) {
            q = (0, firestore_1.query)(collectionRef, ...constraints);
        }
        else {
            q = (0, firestore_1.query)(collectionRef);
        }
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
        });
        console.log(`クエリ結果: ${documents.length}件のドキュメントを取得`, documents);
        return documents;
    }
    catch (error) {
        console.error(`Error querying documents from ${collectionName}:`, error);
        throw error;
    }
};
exports.queryDocuments = queryDocuments;
// 模試データをFirestoreに追加する関数
const addExamData = async (examData) => {
    try {
        // 模試の基本情報を保存
        const examRef = (0, firestore_1.doc)(firebase_1.db, 'exams', examData.id);
        await (0, firestore_1.setDoc)(examRef, {
            title: examData.title,
            description: examData.description,
            duration: examData.duration,
            type: examData.type,
            isFree: examData.isFree,
            createdAt: new Date(),
        });
        // 問題データを別コレクション（トップレベル）に保存
        for (const question of examData.questions) {
            await (0, firestore_1.setDoc)((0, firestore_1.doc)(firebase_1.db, 'questions', question.id), {
                examId: examData.id, // 問題が属する模試のIDを保存
                content: question.content,
                options: question.options,
                correctAnswer: question.correctAnswer,
                category: question.category,
                difficulty: question.difficulty,
                sectionType: question.sectionType || 'reading', // デフォルト値の設定
                questionType: question.questionType || 'multiple-choice', // デフォルト値の設定
                order: examData.questions.indexOf(question) + 1, // 問題の順序を保存
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        console.log('Exam data added successfully');
        return true;
    }
    catch (error) {
        console.error('Error adding exam data:', error);
        return false;
    }
};
exports.addExamData = addExamData;
// 模試データを取得する関数
const getExamData = async (examId) => {
    try {
        const examRef = (0, firestore_1.doc)(firebase_1.db, 'exams', examId);
        const examDoc = await (0, firestore_1.getDoc)(examRef);
        if (!examDoc.exists()) {
            return null;
        }
        const examData = examDoc.data();
        // 問題データを取得（トップレベルコレクションから）
        const questionsQuery = (0, firestore_1.query)((0, firestore_1.collection)(firebase_1.db, 'questions'), (0, firestore_1.where)('examId', '==', examId), (0, firestore_1.orderBy)('order', 'asc'));
        const questionsSnapshot = await (0, firestore_1.getDocs)(questionsQuery);
        const questions = questionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return {
            id: examId,
            title: examData.title,
            description: examData.description,
            duration: examData.duration,
            type: examData.type,
            isFree: examData.isFree,
            questions,
        };
    }
    catch (error) {
        console.error('Error getting exam data:', error);
        return null;
    }
};
exports.getExamData = getExamData;
