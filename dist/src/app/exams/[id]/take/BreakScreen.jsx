'use client';
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
const react_1 = __importStar(require("react"));
const BreakScreen = ({ title, duration = 300, onNext }) => {
    const [remainingTime, setRemainingTime] = (0, react_1.useState)(duration);
    (0, react_1.useEffect)(() => {
        if (remainingTime <= 0)
            return;
        const timerId = setInterval(() => {
            setRemainingTime(prevTime => prevTime - 1);
        }, 1000);
        return () => clearInterval(timerId);
    }, [remainingTime]);
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    return (<div className="bg-gray-100 p-8 rounded-lg shadow-lg max-w-2xl mx-auto my-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">{title}</h1>
      <p className="text-lg text-gray-600 mb-6">休憩時間です。</p>

      <div className="text-6xl font-mono font-bold text-indigo-600 my-8">
        {formatTime(remainingTime)}
      </div>

      {remainingTime > 0 ? (<p className="text-gray-500 mb-8">時間になるまでお待ちください。準備ができ次第、次へ進むことも可能です。</p>) : (<p className="text-green-600 font-semibold mb-8">休憩時間が終了しました。</p>)}
      
      <button onClick={onNext} className="px-8 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-md shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-150 ease-in-out" disabled={remainingTime > 0} // 時間中は無効化 (任意)
    >
        試験を再開する
      </button>
      {remainingTime > 0 && (<button onClick={onNext} className="ml-4 px-6 py-2 bg-gray-500 text-white text-sm font-semibold rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 transition duration-150 ease-in-out">
           スキップして再開
         </button>)} 
    </div>);
};
exports.default = BreakScreen;
