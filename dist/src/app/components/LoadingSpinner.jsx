'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
// ローディングスピナーコンポーネント
const LoadingSpinner = () => {
    return (<div className="flex justify-center items-center space-x-2">
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-0"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-200"></div>
      <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse animation-delay-400"></div>
      {/* Tailwind JIT用にクラス名を記述しておく (ビルド時に必要) */}
      <span className="hidden animation-delay-0 animation-delay-200 animation-delay-400"></span>
    </div>);
};
exports.default = LoadingSpinner;
