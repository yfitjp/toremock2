'use client';

import React from 'react';

// ローディングスピナーコンポーネント
const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-0"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-200"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
      {/* Tailwind JIT用にクラス名を記述しておく (ビルド時に必要) */}
      <span className="hidden animation-delay-0 animation-delay-200 animation-delay-400"></span>
    </div>
  );
};

export default LoadingSpinner;

// animation-delay を tailwind.config.js で定義するか、
// または以下のように style 属性を使うことも可能です。
// (Tailwind PurgeCSSがカスタムアニメーション遅延を削除しないように注意)
/*
const LoadingSpinnerAlt: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};
*/ 