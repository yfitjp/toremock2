import React from 'react';
import Image from 'next/image'; // Next.js の Image コンポーネントを使用する場合

interface ImageDisplayScreenProps {
  imageUrl: string;
  onNext: () => void;
  title?: string;
  instructions?: string; // オプションで指示文も表示できるようにする
}

const ImageDisplayScreen: React.FC<ImageDisplayScreenProps> = ({ imageUrl, onNext, title, instructions }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 md:p-10 max-w-3xl w-full text-center">
        {title && <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">{title}</h1>}
        {instructions && (
          <div 
            className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto mb-6 text-left" 
            dangerouslySetInnerHTML={{ __html: instructions }} 
          />
        )}
        <div className="mb-8 max-h-[60vh] overflow-auto rounded border">
          {imageUrl ? (
            <img src={imageUrl} alt={title || 'Display Image'} className="w-full h-auto object-contain" />
          ) : (
            <p className="text-gray-500">画像が指定されていません。</p>
          )}
        </div>
        <button
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          次へ進む
        </button>
      </div>
    </div>
  );
};

export default ImageDisplayScreen; 