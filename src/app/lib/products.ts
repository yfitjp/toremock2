'use client';

export interface ProductConfig {
  name: string;
  description: string;
  price: number;
  type: 'exam' | 'subscription';
}

// 商品設定
export const PRODUCTS: Record<string, ProductConfig> = {
  'premium-subscription': {
    name: 'プレミアムサブスクリプション',
    description: '全ての模擬試験にアクセス可能',
    price: 4980,
    type: 'subscription'
  },
  'toeic-basic-1': {
    name: 'TOEIC® L&R 基礎模試 Vol.1',
    description: 'TOEIC® L&Rテストの基礎模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'toeic-intermediate-1': {
    name: 'TOEIC® L&R 中級模試 Vol.1',
    description: 'TOEIC® L&Rテストの中級模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'toeic-advanced-1': {
    name: 'TOEIC® L&R 上級模試 Vol.1',
    description: 'TOEIC® L&Rテストの上級模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'toefl-basic-1': {
    name: 'TOEFL iBT® 基礎模試 Vol.1',
    description: 'TOEFL iBT®テストの基礎模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'toefl-intermediate-1': {
    name: 'TOEFL iBT® 中級模試 Vol.1',
    description: 'TOEFL iBT®テストの中級模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'toefl-advanced-1': {
    name: 'TOEFL iBT® 上級模試 Vol.1',
    description: 'TOEFL iBT®テストの上級模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'eiken-pre2-1': {
    name: '英検® 準2級 模試 Vol.1',
    description: '英検® 準2級の模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'eiken-pre1-1': {
    name: '英検® 準1級 模試 Vol.1',
    description: '英検® 準1級の模擬試験です。',
    price: 1200,
    type: 'exam'
  },
  'eiken-1-1': {
    name: '英検® 1級 模試 Vol.1',
    description: '英検® 1級の模擬試験です。',
    price: 1200,
    type: 'exam'
  }
}; 