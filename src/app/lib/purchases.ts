import { COLLECTIONS, getCollection, getDocument, addDocument, updateDocument, queryDocuments } from './firestore';
import { where, orderBy } from 'firebase/firestore';

// 購入情報の型定義
export interface Purchase {
  id: string;
  userId: string;
  examId: string;
  paymentIntentId?: string;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: any;
  updatedAt?: any;
}

// 購入情報を作成
export const createPurchase = async (
  purchaseData: Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    return await addDocument<Omit<Purchase, 'id' | 'createdAt' | 'updatedAt'>>(
      COLLECTIONS.PURCHASES,
      purchaseData
    );
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

// 購入情報を更新
export const updatePurchase = async (
  purchaseId: string,
  data: Partial<Purchase>
): Promise<void> => {
  try {
    await updateDocument<Purchase>(COLLECTIONS.PURCHASES, purchaseId, data);
  } catch (error) {
    console.error(`Error updating purchase ${purchaseId}:`, error);
    throw error;
  }
};

// 特定の購入情報を取得
export const getPurchase = async (purchaseId: string): Promise<Purchase | null> => {
  try {
    return await getDocument<Purchase>(COLLECTIONS.PURCHASES, purchaseId);
  } catch (error) {
    console.error(`Error getting purchase ${purchaseId}:`, error);
    throw error;
  }
};

// ユーザーの購入情報を取得
export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  try {
    return await queryDocuments<Purchase>(
      COLLECTIONS.PURCHASES,
      'userId',
      '==',
      userId,
      'createdAt',
      'desc'
    );
  } catch (error) {
    console.error(`Error getting purchases for user ${userId}:`, error);
    throw error;
  }
};

// 特定の模試の購入情報を取得
export const getExamPurchases = async (examId: string): Promise<Purchase[]> => {
  try {
    return await queryDocuments<Purchase>(
      COLLECTIONS.PURCHASES,
      'examId',
      '==',
      examId,
      'createdAt',
      'desc'
    );
  } catch (error) {
    console.error(`Error getting purchases for exam ${examId}:`, error);
    throw error;
  }
};

// ユーザーが特定の模試を購入しているか確認
export const hasUserPurchasedExam = async (userId: string, examId: string): Promise<boolean> => {
  try {
    const constraints = [
      where('userId', '==', userId),
      where('examId', '==', examId),
      where('status', '==', 'completed')
    ];
    
    const purchases = await getCollection<Purchase>(COLLECTIONS.PURCHASES, constraints);
    return purchases.length > 0;
  } catch (error) {
    console.error(`Error checking if user ${userId} has purchased exam ${examId}:`, error);
    throw error;
  }
};

// 支払いIDで購入情報を取得
export const getPurchaseByPaymentIntent = async (paymentIntentId: string): Promise<Purchase | null> => {
  try {
    const purchases = await queryDocuments<Purchase>(
      COLLECTIONS.PURCHASES,
      'paymentIntentId',
      '==',
      paymentIntentId
    );
    
    return purchases.length > 0 ? purchases[0] : null;
  } catch (error) {
    console.error(`Error getting purchase by payment intent ${paymentIntentId}:`, error);
    throw error;
  }
}; 