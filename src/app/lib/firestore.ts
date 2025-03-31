import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  addDoc,
  serverTimestamp,
  Timestamp,
  enableIndexedDbPersistence,
} from 'firebase/firestore';
import { db } from './firebase';

// Firestoreのコレクション名を定義
export const COLLECTIONS = {
  USERS: 'users',
  EXAMS: 'exams',
  PURCHASES: 'purchases',
  EXAM_ATTEMPTS: 'exam_attempts',
  QUESTIONS: 'questions',
  SUBSCRIPTIONS: 'subscriptions',
} as const;

// オフライン永続化を有効化
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // 複数のタブが開いている場合
    console.warn('複数のタブが開いているため、オフライン永続化を有効化できません');
  } else if (err.code === 'unimplemented') {
    // ブラウザが対応していない場合
    console.warn('このブラウザはオフライン永続化に対応していません');
  } else {
    console.error('オフライン永続化の設定に失敗しました:', err);
  }
});

// ドキュメントを取得する
export const getDocument = async <T>(collectionName: string, docId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

// コレクション内のすべてのドキュメントを取得する
export const getCollection = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
};

// ドキュメントを作成または更新する
export const setDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge = true
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
};

// 新しいドキュメントを追加する（IDは自動生成）
export const addDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// ドキュメントを更新する
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

// ドキュメントを削除する
export const deleteDocument = async (collectionName: string, docId: string): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

// Timestampを日付文字列に変換する
export const formatTimestamp = (timestamp: Timestamp | null | undefined): string => {
  if (!timestamp) return '';
  return timestamp.toDate().toLocaleString('ja-JP');
};

// コレクションからドキュメントをクエリする
export const queryDocuments = async <T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> => {
  try {
    console.log(`クエリ実行: ${collectionName}`, constraints);
    const collectionRef = collection(db, collectionName);
    let q;
    if (constraints.length > 0) {
      q = query(collectionRef, ...constraints);
    } else {
      q = query(collectionRef);
    }
    const querySnapshot = await getDocs(q);
    
    const documents: T[] = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() } as T);
    });
    
    console.log(`クエリ結果: ${documents.length}件のドキュメントを取得`, documents);
    return documents;
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

// 模試問題のインターフェース
export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: string;
  sectionType?: 'reading' | 'listening' | 'writing' | 'speaking'; // セクションタイプ
  questionType?: 'multiple-choice' | 'text-input' | 'speaking' | 'writing'; // 問題タイプ
  imageUrl?: string; // 問題画像のURL
  audioUrl?: string; // 音声ファイルのURL
}

export interface ExamData {
  id: string;
  title: string;
  description: string;
  duration: number; // 分単位
  questions: Question[];
  type: 'TOEIC' | 'TOEFL' | 'EIKEN';
  isFree: boolean;
}

// 模試データをFirestoreに追加する関数
export const addExamData = async (examData: ExamData) => {
  try {
    // 模試の基本情報を保存
    const examRef = doc(db, 'exams', examData.id);
    await setDoc(examRef, {
      title: examData.title,
      description: examData.description,
      duration: examData.duration,
      type: examData.type,
      isFree: examData.isFree,
      createdAt: new Date(),
    });

    // 問題データを別コレクション（トップレベル）に保存
    for (const question of examData.questions) {
      await setDoc(doc(db, 'questions', question.id), {
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
  } catch (error) {
    console.error('Error adding exam data:', error);
    return false;
  }
};

// 模試データを取得する関数
export const getExamData = async (examId: string): Promise<ExamData | null> => {
  try {
    const examRef = doc(db, 'exams', examId);
    const examDoc = await getDoc(examRef);

    if (!examDoc.exists()) {
      return null;
    }

    const examData = examDoc.data();
    
    // 問題データを取得（トップレベルコレクションから）
    const questionsQuery = query(
      collection(db, 'questions'),
      where('examId', '==', examId),
      orderBy('order', 'asc')
    );
    
    const questionsSnapshot = await getDocs(questionsQuery);
    const questions = questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];

    return {
      id: examId,
      title: examData.title,
      description: examData.description,
      duration: examData.duration,
      type: examData.type,
      isFree: examData.isFree,
      questions,
    };
  } catch (error) {
    console.error('Error getting exam data:', error);
    return null;
  }
};

export interface ExamQuestion {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  category?: string;
  difficulty?: string;
  imageUrl?: string;
  audioUrl?: string;
} 