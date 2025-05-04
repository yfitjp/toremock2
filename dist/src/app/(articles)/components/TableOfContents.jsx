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
exports.default = TableOfContents;
const react_1 = __importStar(require("react"));
function TableOfContents({}) {
    const [headings, setHeadings] = (0, react_1.useState)([]);
    const [activeId, setActiveId] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // TODO: contentからh2, h3要素を抽出し、headingsステートを更新するロジック
        // 例:
        const extractedHeadings = [
            { id: 'section1', text: '見出しレベル2', level: 2 },
            { id: 'subsection1', text: '見出しレベル3', level: 3 },
            { id: 'section2', text: '別の見出しレベル2', level: 2 },
        ];
        setHeadings(extractedHeadings);
        // スクロールイベントリスナーで現在アクティブな見出しを判定
        const handleScroll = () => {
            let currentId = null;
            // TODO: スクロール位置に基づいてactiveIdを更新するロジック
            setActiveId(currentId);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [ /* content */]); // contentが変更されたら再実行
    if (headings.length === 0) {
        return null; // 目次がない場合は何も表示しない
    }
    return (<div className="prose prose-sm">
      <h3 className="text-base font-semibold mb-3">目次</h3>
      <ul className="space-y-1">
        {headings.map((heading) => (<li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
            <a href={`#${heading.id}`} className={`block hover:text-green-600 transition-colors ${activeId === heading.id ? 'text-green-600 font-medium' : 'text-slate-600'}`}>
              {heading.text}
            </a>
          </li>))}
      </ul>
    </div>);
}
