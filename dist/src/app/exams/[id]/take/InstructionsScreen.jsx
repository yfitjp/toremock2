'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const InstructionsScreen = ({ title, instructions, onNext }) => {
    return (<div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto my-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">{title}</h1>
      <div className="prose prose-lg max-w-none mb-8 text-gray-700">
        {/* instructions が HTML を含む可能性を考慮する場合は dangerouslySetInnerHTML を使うか、Markdown パーサーを使う */} 
        <p>{instructions || '指示に従って、準備ができたら次に進んでください。'}</p>
        {/* 必要であればここに詳細な指示内容を追加 */} 
      </div>
      <div className="text-center">
        <button onClick={onNext} className="px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out">
          試験を開始する / 次へ進む
        </button>
      </div>
    </div>);
};
exports.default = InstructionsScreen;
