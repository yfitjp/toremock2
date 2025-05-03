// Server-side functions using Firebase Admin SDK
import * as admin from 'firebase-admin';
import { db } from '@/app/lib/firebase-admin';
import { Subscription } from './subscriptions'; // Import type from the original file

// サブスクリプションを作成または更新 (Admin SDK を使用)
export const createOrUpdateSubscriptionAdmin = async (
  subscriptionId: string,
  data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt' | 'endDate'> & { endDate?: Date | admin.firestore.Timestamp }
): Promise<void> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    const subDoc = await subRef.get();

    const dataToSave: any = { ...data };
    if (data.startDate instanceof Date) {
        dataToSave.startDate = admin.firestore.Timestamp.fromDate(data.startDate);
    }
    if (data.endDate instanceof Date) {
        dataToSave.endDate = admin.firestore.Timestamp.fromDate(data.endDate);
    }

    if (subDoc.exists) {
      await subRef.update({
        ...dataToSave,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`[Admin] Subscription ${subscriptionId} updated with Admin SDK.`);
    } else {
      await subRef.set({
        ...dataToSave,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      console.log(`[Admin] Subscription ${subscriptionId} created with Admin SDK.`);
    }
  } catch (error) {
    console.error(`[Admin] Error creating/updating subscription ${subscriptionId} with Admin SDK:`, error);
    throw error;
  }
};

// サブスクリプションを更新 (Admin SDK を使用)
export const updateSubscriptionAdmin = async (
  subscriptionId: string,
  data: Partial<Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>> // Exclude read-only fields
): Promise<void> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    await subRef.update({
      ...data,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`[Admin] Subscription ${subscriptionId} updated via updateSubscriptionAdmin.`);
  } catch (error) {
    console.error(`[Admin] Error updating subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// 特定のサブスクリプションを取得 (Admin SDK を使用)
export const getSubscriptionAdmin = async (subscriptionId: string): Promise<Subscription | null> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    const docSnap = await subRef.get();
    if (!docSnap.exists) {
      return null;
    }
    const data = docSnap.data() as any;
    // Convert Timestamps to Dates for consistency if needed by callers
    if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
    if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
    if (data.startDate?.toDate) data.startDate = data.startDate.toDate();
    if (data.endDate?.toDate) data.endDate = data.endDate.toDate();
    return { id: docSnap.id, ...data } as Subscription;
  } catch (error) {
    console.error(`[Admin] Error getting subscription ${subscriptionId}:`, error);
    throw error;
  }
};

// ユーザーのアクティブなサブスクリプションを取得 (Admin SDK を使用)
export const getUserActiveSubscriptionAdmin = async (userId: string): Promise<Subscription | null> => {
  try {
    const q = db.collection('subscriptions')
      .where('userId', '==', userId)
      .where('status', '==', 'active')
      .orderBy('createdAt', 'desc')
      .limit(1);

    const querySnapshot = await q.get();

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data() as any;
    // Convert Timestamps to Dates
    if (data.createdAt?.toDate) data.createdAt = data.createdAt.toDate();
    if (data.updatedAt?.toDate) data.updatedAt = data.updatedAt.toDate();
    if (data.startDate?.toDate) data.startDate = data.startDate.toDate();
    if (data.endDate?.toDate) data.endDate = data.endDate.toDate();
    return { id: docSnap.id, ...data } as Subscription;
  } catch (error) {
    console.error('[Admin] Error getting user subscription with Admin SDK:', error);
    return null; // Return null on error to avoid breaking callers
  }
};

// サブスクリプションをキャンセル (Admin SDK を使用)
export const cancelSubscriptionAdmin = async (subscriptionId: string): Promise<void> => {
  try {
    const subRef = db.collection('subscriptions').doc(subscriptionId);
    await subRef.update({
      status: 'canceled',
      // cancelAtPeriodEnd: true, // Optionally set this if needed based on Stripe event
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
     console.log(`[Admin] Subscription ${subscriptionId} cancelled via cancelSubscriptionAdmin.`);
  } catch (error) {
    console.error(`[Admin] Error canceling subscription ${subscriptionId}:`, error);
    throw error;
  }
}; 