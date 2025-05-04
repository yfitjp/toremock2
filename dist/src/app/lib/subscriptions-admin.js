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
exports.cancelSubscriptionAdmin = exports.getUserActiveSubscriptionAdmin = exports.getSubscriptionAdmin = exports.updateSubscriptionAdmin = exports.createOrUpdateSubscriptionAdmin = void 0;
// Server-side functions using Firebase Admin SDK
const admin = __importStar(require("firebase-admin"));
const firebase_admin_1 = require("@/app/lib/firebase-admin");
// サブスクリプションを作成または更新 (Admin SDK を使用)
const createOrUpdateSubscriptionAdmin = async (subscriptionId, data) => {
    try {
        const subRef = firebase_admin_1.db.collection('subscriptions').doc(subscriptionId);
        const subDoc = await subRef.get();
        const dataToSave = { ...data };
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
        }
        else {
            await subRef.set({
                ...dataToSave,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log(`[Admin] Subscription ${subscriptionId} created with Admin SDK.`);
        }
    }
    catch (error) {
        console.error(`[Admin] Error creating/updating subscription ${subscriptionId} with Admin SDK:`, error);
        throw error;
    }
};
exports.createOrUpdateSubscriptionAdmin = createOrUpdateSubscriptionAdmin;
// サブスクリプションを更新 (Admin SDK を使用)
const updateSubscriptionAdmin = async (subscriptionId, data // Exclude read-only fields
) => {
    try {
        const subRef = firebase_admin_1.db.collection('subscriptions').doc(subscriptionId);
        await subRef.update({
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`[Admin] Subscription ${subscriptionId} updated via updateSubscriptionAdmin.`);
    }
    catch (error) {
        console.error(`[Admin] Error updating subscription ${subscriptionId}:`, error);
        throw error;
    }
};
exports.updateSubscriptionAdmin = updateSubscriptionAdmin;
// 特定のサブスクリプションを取得 (Admin SDK を使用)
const getSubscriptionAdmin = async (subscriptionId) => {
    try {
        const subRef = firebase_admin_1.db.collection('subscriptions').doc(subscriptionId);
        const docSnap = await subRef.get();
        if (!docSnap.exists) {
            return null;
        }
        const data = docSnap.data();
        // Convert Timestamps to Dates for consistency if needed by callers
        if (data.createdAt?.toDate)
            data.createdAt = data.createdAt.toDate();
        if (data.updatedAt?.toDate)
            data.updatedAt = data.updatedAt.toDate();
        if (data.startDate?.toDate)
            data.startDate = data.startDate.toDate();
        if (data.endDate?.toDate)
            data.endDate = data.endDate.toDate();
        return { id: docSnap.id, ...data };
    }
    catch (error) {
        console.error(`[Admin] Error getting subscription ${subscriptionId}:`, error);
        throw error;
    }
};
exports.getSubscriptionAdmin = getSubscriptionAdmin;
// ユーザーのアクティブなサブスクリプションを取得 (Admin SDK を使用)
const getUserActiveSubscriptionAdmin = async (userId) => {
    try {
        const q = firebase_admin_1.db.collection('subscriptions')
            .where('userId', '==', userId)
            .where('status', '==', 'active')
            .orderBy('createdAt', 'desc')
            .limit(1);
        const querySnapshot = await q.get();
        if (querySnapshot.empty) {
            return null;
        }
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        // Convert Timestamps to Dates
        if (data.createdAt?.toDate)
            data.createdAt = data.createdAt.toDate();
        if (data.updatedAt?.toDate)
            data.updatedAt = data.updatedAt.toDate();
        if (data.startDate?.toDate)
            data.startDate = data.startDate.toDate();
        if (data.endDate?.toDate)
            data.endDate = data.endDate.toDate();
        return { id: docSnap.id, ...data };
    }
    catch (error) {
        console.error('[Admin] Error getting user subscription with Admin SDK:', error);
        return null; // Return null on error to avoid breaking callers
    }
};
exports.getUserActiveSubscriptionAdmin = getUserActiveSubscriptionAdmin;
// サブスクリプションをキャンセル (Admin SDK を使用)
const cancelSubscriptionAdmin = async (subscriptionId) => {
    try {
        const subRef = firebase_admin_1.db.collection('subscriptions').doc(subscriptionId);
        await subRef.update({
            status: 'canceled',
            // cancelAtPeriodEnd: true, // Optionally set this if needed based on Stripe event
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log(`[Admin] Subscription ${subscriptionId} cancelled via cancelSubscriptionAdmin.`);
    }
    catch (error) {
        console.error(`[Admin] Error canceling subscription ${subscriptionId}:`, error);
        throw error;
    }
};
exports.cancelSubscriptionAdmin = cancelSubscriptionAdmin;
