'use client';

import React, { useEffect, useState } from 'react';

interface Heading { 
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  // 将来的に、本文のHTMLやマークダウンを受け取って見出しを抽出する想定
  // content: string;
}

export default function TableOfContents({ /* content */ }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // TODO: contentからh2, h3要素を抽出し、headingsステートを更新するロジック
    // 例:
    const extractedHeadings: Heading[] = [
      { id: 'section1', text: '見出しレベル2', level: 2 },
      { id: 'subsection1', text: '見出しレベル3', level: 3 },
      { id: 'section2', text: '別の見出しレベル2', level: 2 },
    ];
    setHeadings(extractedHeadings);

    // スクロールイベントリスナーで現在アクティブな見出しを判定
    const handleScroll = () => {
      let currentId: string | null = null;
      // TODO: スクロール位置に基づいてactiveIdを更新するロジック
      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);

  }, [/* content */]); // contentが変更されたら再実行

  if (headings.length === 0) {
    return null; // 目次がない場合は何も表示しない
  }

  return (
    <div className="prose prose-sm">
      <h3 className="text-base font-semibold mb-3">目次</h3>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 1}rem` }}>
            <a 
              href={`#${heading.id}`}
              className={`block hover:text-green-600 transition-colors ${activeId === heading.id ? 'text-green-600 font-medium' : 'text-slate-600'}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
} 