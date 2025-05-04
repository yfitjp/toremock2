"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
}
// Stripeの設定
const config = {
    apiVersion: '2025-02-24.acacia',
    typescript: true,
};
// Stripeインスタンスの作成
// @ts-ignore - APIバージョンの型定義の制約を一時的に無視
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, config);
