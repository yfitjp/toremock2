import { COLLECTIONS, getCollection, getDocument, addDocument, updateDocument, queryDocuments } from './firestore';
import { where, orderBy, query, collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// 購入履歴の型定義
export interface Purchase {
  id: string;
  userId: string;
  examId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  stripePaymentIntentId: string;
  purchaseDate: Date | Timestamp;
  expiryDate?: Date | Timestamp;
}

// 購入履歴を作成
export const createPurchase = async (purchaseData: Omit<Purchase, 'id' | 'purchaseDate'>): Promise<string> => {
  try {
    const purchase = {
      ...purchaseData,
      purchaseDate: new Date(),
    };
    return await addDocument(COLLECTIONS.PURCHASES, purchase);
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

// ユーザーの購入履歴を取得
export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  try {
    const constraints = [
      where('userId', '==', userId),
      orderBy('purchaseDate', 'desc')
    ];
    return await getCollection<Purchase>(COLLECTIONS.PURCHASES, constraints);
  } catch (error) {
    console.error('Error getting user purchases:', error);
    throw error;
  }
};

// 特定の模試の購入情報を取得
export const getExamPurchases = async (examId: string): Promise<Purchase[]> => {
  try {
    const constraints = [
      where('examId', '==', examId),
      orderBy('purchaseDate', 'desc')
    ];
    return await getCollection<Purchase>(COLLECTIONS.PURCHASES, constraints);
  } catch (error) {
    console.error(`Error getting purchases for exam ${examId}:`, error);
    throw error;
  }
};

// 特定の模試の購入状態を確認
export const checkExamPurchase = async (userId: string, examId: string): Promise<boolean> => {
  try {
    const constraints = [
      where('userId', '==', userId),
      where('examId', '==', examId),
      where('status', '==', 'completed')
    ];
    const purchases = await getCollection<Purchase>(COLLECTIONS.PURCHASES, constraints);
    return purchases.length > 0;
  } catch (error) {
    console.error('Error checking exam purchase:', error);
    throw error;
  }
};

// 購入状態を更新
export const updatePurchaseStatus = async (
  purchaseId: string,
  status: Purchase['status'],
  stripePaymentIntentId?: string
): Promise<void> => {
  try {
    const updateData: Partial<Purchase> = { status };
    if (stripePaymentIntentId) {
      updateData.stripePaymentIntentId = stripePaymentIntentId;
    }
    await updateDocument(COLLECTIONS.PURCHASES, purchaseId, updateData);
  } catch (error) {
    console.error('Error updating purchase status:', error);
    throw error;
  }
};

// 支払いIDで購入情報を取得
export const getPurchaseByPaymentIntent = async (paymentIntentId: string): Promise<Purchase | null> => {
  try {
    const constraints = [
      where('stripePaymentIntentId', '==', paymentIntentId)
    ];
    const purchases = await getCollection<Purchase>(COLLECTIONS.PURCHASES, constraints);
    return purchases.length > 0 ? purchases[0] : null;
  } catch (error) {
    console.error(`Error getting purchase by payment intent ${paymentIntentId}:`, error);
    throw error;
  }
}; 