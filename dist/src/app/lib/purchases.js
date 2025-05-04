"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseByPaymentIntent = exports.updatePurchaseStatus = exports.checkExamPurchase = exports.getExamPurchases = exports.getUserPurchases = exports.getPurchase = exports.updatePurchase = exports.createPurchase = void 0;
const firestore_1 = require("./firestore");
const firestore_2 = require("firebase/firestore");
// 購入履歴を作成
const createPurchase = async (purchaseData) => {
    try {
        const purchase = {
            ...purchaseData,
            purchaseDate: new Date(),
        };
        return await (0, firestore_1.addDocument)(firestore_1.COLLECTIONS.PURCHASES, purchase);
    }
    catch (error) {
        console.error('Error creating purchase:', error);
        throw error;
    }
};
exports.createPurchase = createPurchase;
// 購入情報を更新
const updatePurchase = async (purchaseId, data) => {
    try {
        await (0, firestore_1.updateDocument)(firestore_1.COLLECTIONS.PURCHASES, purchaseId, data);
    }
    catch (error) {
        console.error(`Error updating purchase ${purchaseId}:`, error);
        throw error;
    }
};
exports.updatePurchase = updatePurchase;
// 特定の購入情報を取得
const getPurchase = async (purchaseId) => {
    try {
        return await (0, firestore_1.getDocument)(firestore_1.COLLECTIONS.PURCHASES, purchaseId);
    }
    catch (error) {
        console.error(`Error getting purchase ${purchaseId}:`, error);
        throw error;
    }
};
exports.getPurchase = getPurchase;
// ユーザーの購入履歴を取得
const getUserPurchases = async (userId) => {
    try {
        const constraints = [
            (0, firestore_2.where)('userId', '==', userId),
            (0, firestore_2.orderBy)('purchaseDate', 'desc')
        ];
        return await (0, firestore_1.getCollection)(firestore_1.COLLECTIONS.PURCHASES, constraints);
    }
    catch (error) {
        console.error('Error getting user purchases:', error);
        throw error;
    }
};
exports.getUserPurchases = getUserPurchases;
// 特定の模試の購入情報を取得
const getExamPurchases = async (examId) => {
    try {
        const constraints = [
            (0, firestore_2.where)('examId', '==', examId),
            (0, firestore_2.orderBy)('purchaseDate', 'desc')
        ];
        return await (0, firestore_1.getCollection)(firestore_1.COLLECTIONS.PURCHASES, constraints);
    }
    catch (error) {
        console.error(`Error getting purchases for exam ${examId}:`, error);
        throw error;
    }
};
exports.getExamPurchases = getExamPurchases;
// 特定の模試の購入状態を確認
const checkExamPurchase = async (userId, examId) => {
    try {
        const constraints = [
            (0, firestore_2.where)('userId', '==', userId),
            (0, firestore_2.where)('examId', '==', examId),
            (0, firestore_2.where)('status', '==', 'completed')
        ];
        const purchases = await (0, firestore_1.getCollection)(firestore_1.COLLECTIONS.PURCHASES, constraints);
        return purchases.length > 0;
    }
    catch (error) {
        console.error('Error checking exam purchase:', error);
        throw error;
    }
};
exports.checkExamPurchase = checkExamPurchase;
// 購入状態を更新
const updatePurchaseStatus = async (purchaseId, status, stripePaymentIntentId) => {
    try {
        const updateData = { status };
        if (stripePaymentIntentId) {
            updateData.stripePaymentIntentId = stripePaymentIntentId;
        }
        await (0, firestore_1.updateDocument)(firestore_1.COLLECTIONS.PURCHASES, purchaseId, updateData);
    }
    catch (error) {
        console.error('Error updating purchase status:', error);
        throw error;
    }
};
exports.updatePurchaseStatus = updatePurchaseStatus;
// 支払いIDで購入情報を取得
const getPurchaseByPaymentIntent = async (paymentIntentId) => {
    try {
        const constraints = [
            (0, firestore_2.where)('stripePaymentIntentId', '==', paymentIntentId)
        ];
        const purchases = await (0, firestore_1.getCollection)(firestore_1.COLLECTIONS.PURCHASES, constraints);
        return purchases.length > 0 ? purchases[0] : null;
    }
    catch (error) {
        console.error(`Error getting purchase by payment intent ${paymentIntentId}:`, error);
        throw error;
    }
};
exports.getPurchaseByPaymentIntent = getPurchaseByPaymentIntent;
