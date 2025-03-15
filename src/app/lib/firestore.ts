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
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExamData {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // 分単位
  questions: Question[];
  type: 'TOEIC' | 'TOEFL' | 'EIKEN';
  difficulty: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  isFree: boolean;
}

// 模試データをFirestoreに追加する関数
export const addExamData = async (examData: ExamData) => {
  try {
    const examRef = doc(db, 'exams', examData.id);
    await setDoc(examRef, {
      title: examData.title,
      description: examData.description,
      timeLimit: examData.timeLimit,
      type: examData.type,
      difficulty: examData.difficulty,
      isFree: examData.isFree,
      createdAt: new Date(),
    });

    // 問題データを別コレクションに保存
    const questionsRef = collection(db, 'exams', examData.id, 'questions');
    for (const question of examData.questions) {
      await setDoc(doc(questionsRef, question.id), {
        text: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        category: question.category,
        difficulty: question.difficulty,
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
    
    // 問題データを取得
    const questionsRef = collection(db, 'exams', examId, 'questions');
    const questionsSnapshot = await getDocs(questionsRef);
    const questions = questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];

    return {
      id: examId,
      title: examData.title,
      description: examData.description,
      timeLimit: examData.timeLimit,
      type: examData.type,
      difficulty: examData.difficulty,
      isFree: examData.isFree,
      questions,
    };
  } catch (error) {
    console.error('Error getting exam data:', error);
    return null;
  }
}; 