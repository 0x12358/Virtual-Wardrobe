import React, { useState, useRef } from 'react';
import { nanoBananaTransform } from './utils/nanoBananaApi.js';

// 图片上传组件
const ImageUploader = ({ onPersonImageUpload, onClothingImageUpload, personImage, clothingImages }) => {
  const personInputRef = useRef(null);
  const clothingInputRef = useRef(null);

  const handlePersonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPersonImageUpload({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClothingImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onClothingImageUpload({
          file: file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      {/* 人物照片上传 */}
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
          上传人物照片
        </h3>
        
        <div className="flex flex-col items-center space-y-6">
          {personImage ? (
            <div className="relative group">
              <img 
                src={personImage.preview} 
                alt="人物照片" 
                className="w-48 h-64 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-2xl transition-all duration-300 flex items-center justify-center">
                <button 
                  onClick={() => personInputRef.current?.click()}
                  className="opacity-0 group-hover:opacity-100 bg-white text-dark-gray px-4 py-2 rounded-lg font-medium transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                >
                  更换照片
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => personInputRef.current?.click()}
              className="w-48 h-64 border-2 border-dashed border-soft-gray rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-medium-gray hover:bg-warm-gray/50 group"
            >
              <div className="text-6xl text-soft-gray mb-4 group-hover:text-medium-gray transition-colors duration-300">📷</div>
              <p className="text-medium-gray font-medium group-hover:text-dark-gray transition-colors duration-300">点击上传人物照片</p>
            </div>
          )}
          
          <input
            ref={personInputRef}
            type="file"
            accept="image/*"
            onChange={handlePersonImageChange}
            className="hidden"
          />
        </div>
      </div>

      {/* 衣物照片上传 */}
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
          上传衣物照片
        </h3>
        
        <div className="flex flex-col items-center space-y-6">
          <div 
            onClick={() => clothingInputRef.current?.click()}
            className="w-48 h-48 border-2 border-dashed border-soft-gray rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-medium-gray hover:bg-warm-gray/50 group"
          >
            <div className="text-6xl text-soft-gray mb-4 group-hover:text-medium-gray transition-colors duration-300">👕</div>
            <p className="text-medium-gray font-medium group-hover:text-dark-gray transition-colors duration-300">点击上传衣物照片</p>
          </div>
          
          <input
            ref={clothingInputRef}
            type="file"
            accept="image/*"
            onChange={handleClothingImageChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

// 衣物画廊组件
const ClothesGallery = ({ clothingImages, selectedClothing, onClothingSelect }) => {
  if (clothingImages.length === 0) {
    return (
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
          衣物收藏
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl text-soft-gray mb-4">👗</div>
          <p className="text-medium-gray">还没有上传任何衣物照片</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8">
      <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
        衣物收藏 ({clothingImages.length})
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {clothingImages.map((image, index) => (
          <div 
            key={index}
            onClick={() => onClothingSelect(image)}
            className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
              selectedClothing === image 
                ? 'ring-4 ring-dark-gray shadow-lg' 
                : 'hover:shadow-md'
            }`}
          >
            <img 
              src={image.preview} 
              alt={`衣物 ${index + 1}`} 
              className="w-full h-32 object-cover"
            />
            {selectedClothing === image && (
              <div className="absolute inset-0 bg-dark-gray bg-opacity-20 flex items-center justify-center">
                <div className="bg-white text-dark-gray px-3 py-1 rounded-full text-sm font-medium">
                  已选择
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 结果展示组件
const ResultDisplay = ({ result, isLoading, onTryAgain }) => {
  if (isLoading) {
    return (
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
          AI 换装中...
        </h3>
        <div className="flex flex-col items-center space-y-6">
          <div className="w-48 h-64 bg-warm-gray rounded-2xl flex items-center justify-center">
            <div className="animate-pulse-soft text-4xl">✨</div>
          </div>
          <div className="text-center">
            <div className="animate-pulse text-medium-gray mb-2">AI 正在为您生成换装效果</div>
            <div className="text-sm text-medium-gray">请稍候，这通常需要几秒钟...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card p-8">
        <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
          换装效果
        </h3>
        <div className="text-center py-12">
          <div className="text-6xl text-soft-gray mb-4">🎭</div>
          <p className="text-medium-gray">上传照片并点击"开始换装"查看效果</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-8 animate-fade-in">
      <h3 className="text-xl font-semibold text-dark-gray mb-6 text-center">
        换装效果
      </h3>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <img 
            src={result.resultImage} 
            alt="换装效果" 
            className="w-48 h-64 object-cover rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full text-sm">
            ✓
          </div>
        </div>
        
        <div className="text-center max-w-md">
          <p className="text-dark-gray font-medium mb-4">{result.message}</p>
          <button 
            onClick={onTryAgain}
            className="btn-secondary"
          >
            重新换装
          </button>
        </div>
      </div>
    </div>
  );
};

// 主应用组件
const App = () => {
  const [personImage, setPersonImage] = useState(null);
  const [clothingImages, setClothingImages] = useState([]);
  const [selectedClothing, setSelectedClothing] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePersonImageUpload = (image) => {
    setPersonImage(image);
    setResult(null); // 清除之前的结果
  };

  const handleClothingImageUpload = (image) => {
    setClothingImages(prev => [...prev, image]);
    setSelectedClothing(image); // 自动选择新上传的衣物
  };

  const handleClothingSelect = (image) => {
    setSelectedClothing(image);
  };

  const handleTransform = async () => {
    if (!personImage || !selectedClothing) {
      alert('请先上传人物照片和选择衣物！');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const transformResult = await nanoBananaTransform(personImage.file, selectedClothing.file);
      setResult(transformResult);
    } catch (error) {
      console.error('AI换装失败:', error);
      alert(`AI换装失败: ${error.message}，请重试！`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
  };

  const canTransform = personImage && selectedClothing && !isLoading;

  return (
    <div className="min-h-screen bg-cream font-inter">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-soft-gray/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-dark-gray mb-2">
              无限虚拟衣柜
            </h1>
            <p className="text-medium-gray font-medium">
              AI Wardrobe - 让每一次换装都充满惊喜
            </p>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：图片上传 */}
          <div className="lg:col-span-1">
            <ImageUploader 
              onPersonImageUpload={handlePersonImageUpload}
              onClothingImageUpload={handleClothingImageUpload}
              personImage={personImage}
              clothingImages={clothingImages}
            />
          </div>

          {/* 中间：衣物画廊 */}
          <div className="lg:col-span-1">
            <ClothesGallery 
              clothingImages={clothingImages}
              selectedClothing={selectedClothing}
              onClothingSelect={handleClothingSelect}
            />
            
            {/* 换装按钮 */}
            <div className="mt-8 text-center">
              <button 
                onClick={handleTransform}
                disabled={!canTransform}
                className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                  canTransform
                    ? 'btn-primary hover:scale-105 active:scale-95'
                    : 'bg-soft-gray text-medium-gray cursor-not-allowed'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>换装中...</span>
                  </span>
                ) : (
                  '✨ 开始换装'
                )}
              </button>
            </div>
          </div>

          {/* 右侧：结果展示 */}
          <div className="lg:col-span-1">
            <ResultDisplay 
              result={result}
              isLoading={isLoading}
              onTryAgain={handleTryAgain}
            />
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white/50 border-t border-soft-gray/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-medium-gray">
            <p className="mb-2">© 2024 无限虚拟衣柜 | AI Wardrobe</p>
            <p className="text-sm">基于 Vite + React + Tailwind CSS 构建</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

/*
=== GitHub Pages 部署指南 (Vite 项目) ===

1. 安装依赖：
   npm install

2. 安装 gh-pages：
   npm install --save-dev gh-pages

3. 确保 package.json 中包含以下脚本：
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }

4. 确保 vite.config.js 中设置了正确的 base 路径：
   base: '/ai-wardrobe-vite/',

5. 部署到 GitHub Pages：
   npm run deploy

6. 在 GitHub 仓库设置中启用 GitHub Pages，选择 gh-pages 分支

7. 访问地址：https://你的用户名.github.io/ai-wardrobe-vite/

注意：Vite 项目的构建输出目录是 'dist'，而不是 'build'
*/