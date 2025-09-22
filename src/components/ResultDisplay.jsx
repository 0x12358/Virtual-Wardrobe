import React, { useState } from 'react';

/**
 * ResultDisplay 组件 - Instagram风格换装结果展示
 * 极简设计语言，更好的视觉层次，柔和的交互动效
 */
const ResultDisplay = ({ resultImage, personImage, clothesImage, isLoading }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Instagram风格加载状态 */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-0 shadow-sm p-16">
          <div className="w-full flex items-center justify-center">
            <div className="text-center space-y-8">
              {/* Instagram风格加载动画 */}
              <div className="relative">
                <div className="loading-spinner mx-auto"></div>
              </div>
              <div className="space-y-4">
                <p className="text-neutral-600 font-light text-xl">
                  正在创造魔法时刻
                </p>
                <p className="text-neutral-400 text-base font-light">
                  AI 正在为你定制完美造型
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Instagram风格处理过程展示 */}
        <div className="mt-12 flex items-center justify-center space-x-8 text-neutral-500">
          <div className="flex flex-col items-center space-y-3 transform transition-all duration-400">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/40 backdrop-blur-sm border-0 shadow-sm">
              <img src={personImage} alt="人物" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-neutral-400 font-light">你的照片</span>
          </div>
          <div className="text-xl text-neutral-300 font-light">+</div>
          <div className="flex flex-col items-center space-y-3 transform transition-all duration-400">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-white/40 backdrop-blur-sm border-0 shadow-sm">
              <img src={clothesImage} alt="衣服" className="w-full h-full object-cover" />
            </div>
            <span className="text-sm text-neutral-400 font-light">选择的衣服</span>
          </div>
          <div className="text-xl text-neutral-300 font-light">=</div>
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-0 animate-pulse flex items-center justify-center">
              <span className="text-lg animate-spin text-neutral-300">✨</span>
            </div>
            <span className="text-sm text-neutral-400 font-light">魔法进行中</span>
          </div>
        </div>
      </div>
    );
  }

  if (!resultImage) {
    return null;
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `换装结果_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Instagram风格成功提示 */}
      <div className={`mb-12 text-center transform transition-all duration-500 ${isImageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="inline-flex items-center space-x-3 bg-white/50 backdrop-blur-sm text-neutral-600 px-6 py-3 rounded-full border-0 shadow-sm">
          <span className="text-xl">✨</span>
          <span className="font-light text-lg">造型完成</span>
        </div>
      </div>

      {/* Instagram风格主要结果展示 */}
      <div className={`bg-white/60 backdrop-blur-sm rounded-3xl border-0 shadow-sm p-8 mb-16 transform transition-all duration-500 ${isImageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="relative group">
          <img
            src={resultImage}
            alt="换装结果"
            className="w-full h-auto rounded-2xl transition-all duration-400 group-hover:scale-[1.01] shadow-sm group-hover:shadow-lg"
            onLoad={() => setIsImageLoaded(true)}
          />
          
          {/* Instagram风格悬停操作按钮 */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-400 rounded-2xl flex items-center justify-center">
            <div className="flex space-x-4">
              <button 
                onClick={handleDownload}
                className="bg-white/90 backdrop-blur-sm hover:bg-white text-neutral-700 px-8 py-4 rounded-full font-light transition-all duration-300 hover:scale-102 shadow-sm hover:shadow-lg flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>保存</span>
              </button>
              <button 
                onClick={() => setShowComparison(!showComparison)}
                className="bg-neutral-700/80 backdrop-blur-sm hover:bg-neutral-700 text-white px-8 py-4 rounded-full font-light transition-all duration-300 hover:scale-102 shadow-sm hover:shadow-lg flex items-center space-x-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{showComparison ? '收起' : '对比'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram风格对比展示 */}
      <div className={`transition-all duration-500 overflow-hidden ${showComparison ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/40 backdrop-blur-sm rounded-3xl border-0 shadow-sm p-8">
          <h3 className="text-xl font-light text-neutral-600 mb-8 text-center">造型对比</h3>
          <div className="grid grid-cols-3 gap-8">
            {/* 原始照片 */}
            <div className="text-center transform transition-all duration-400 hover:scale-102">
              <p className="text-base font-light text-neutral-500 mb-4">你的照片</p>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-400">
                <img
                  src={personImage}
                  alt="原始照片"
                  className="w-full h-full object-cover transition-all duration-400"
                />
              </div>
            </div>

            {/* 选择的衣服 */}
            <div className="text-center transform transition-all duration-400 hover:scale-102">
              <p className="text-base font-light text-neutral-500 mb-4">选择的衣服</p>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-400">
                <img
                  src={clothesImage}
                  alt="衣服"
                  className="w-full h-full object-cover transition-all duration-400"
                />
              </div>
            </div>

            {/* 换装结果 */}
            <div className="text-center transform transition-all duration-400 hover:scale-102">
              <p className="text-base font-light text-neutral-500 mb-4">新造型</p>
              <div className="aspect-square rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-all duration-400 relative">
                <img
                  src={resultImage}
                  alt="换装结果"
                  className="w-full h-full object-cover transition-all duration-400"
                />
                {/* Instagram风格结果标识 */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-neutral-600 text-sm px-3 py-1 rounded-full font-light shadow-sm">
                  ✨
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;