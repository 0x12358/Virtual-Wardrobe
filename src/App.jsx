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
    <>
      {/* 人物照片上传 */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-100 hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl text-white">📷</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            拍一张自拍
          </h3>
          <p className="text-gray-600 text-sm">
            正面全身照最佳，一次上传永久使用
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          {personImage ? (
            <div className="relative group">
              <img 
                src={personImage.preview} 
                alt="人物照片" 
                className="w-56 h-72 object-cover rounded-3xl shadow-2xl transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
                <button 
                  onClick={() => personInputRef.current?.click()}
                  className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-2 rounded-full font-medium transition-all duration-300 hover:bg-white hover:scale-105"
                >
                  更换照片
                </button>
              </div>
            </div>
          ) : (
            <div 
              onClick={() => personInputRef.current?.click()}
              className="w-56 h-72 border-2 border-dashed border-purple-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-purple-500 hover:bg-purple-50 group bg-gradient-to-br from-purple-50/50 to-pink-50/50"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl text-white">📷</span>
              </div>
              <p className="text-gray-700 font-medium text-center px-4">
                点击上传人物照片
              </p>
              <p className="text-gray-500 text-sm mt-2 text-center px-4">
                支持 JPG、PNG 格式
              </p>
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
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-4">
            <span className="text-2xl text-white">👕</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            选喜欢的衣服
          </h3>
          <p className="text-gray-600 text-sm">
            数码、网图都可以，建立你的唯美衣柜
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-6">
          <div 
            onClick={() => clothingInputRef.current?.click()}
            className="w-56 h-56 border-2 border-dashed border-green-300 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:border-green-500 hover:bg-green-50 group bg-gradient-to-br from-green-50/50 to-teal-50/50"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <span className="text-3xl text-white">👕</span>
            </div>
            <p className="text-gray-700 font-medium text-center px-4">
              点击上传衣物照片
            </p>
            <p className="text-gray-500 text-sm mt-2 text-center px-4">
              支持各种服装图片
            </p>
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
    </>
  );
};

// 衣物画廊组件
const ClothesGallery = ({ clothingImages, selectedClothing, onClothingSelect }) => {
  if (clothingImages.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
          <span className="text-2xl text-white">👗</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          我的衣柜 ({clothingImages.length})
        </h3>
        <p className="text-gray-600 text-sm">
          选择一件心仪的衣服开始换装
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clothingImages.map((image, index) => (
          <div 
            key={index}
            onClick={() => onClothingSelect(image)}
            className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
              selectedClothing === image 
                ? 'ring-4 ring-gradient-to-r from-purple-500 to-pink-500 shadow-2xl scale-105' 
                : 'hover:shadow-lg'
            }`}
          >
            <img 
              src={image.preview} 
              alt={`衣物 ${index + 1}`} 
              className="w-full h-40 object-cover"
            />
            {selectedClothing === image && (
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 via-transparent to-transparent flex items-end justify-center pb-3">
                <div className="bg-white/90 backdrop-blur-sm text-purple-600 px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ✓ 已选择
                </div>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-600">
              {index + 1}
            </div>
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
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-yellow-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4">
            <div className="animate-spin text-2xl text-white">✨</div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            AI 换装中...
          </h3>
          <p className="text-gray-600 text-sm">
            AI正在为您生成专属换装效果
          </p>
        </div>
        <div className="flex flex-col items-center space-y-6">
          <div className="w-56 h-72 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="animate-bounce text-4xl mb-2">🎨</div>
              <p className="text-gray-600 font-medium">生成中...</p>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
            <p className="text-gray-600 text-sm">请稍候，通常需要10-30秒...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl mb-6">
            <span className="text-3xl text-white">🎭</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            换装效果预览
          </h3>
          <p className="text-gray-600">
            上传照片并选择衣服后，点击"开始AI换装"查看效果
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-green-100 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4">
          <span className="text-2xl text-white">🎉</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          换装成功！
        </h3>
        <p className="text-gray-600 text-sm">
          AI为您生成的专属换装效果
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-6">
        <div className="relative group">
          <img 
            src={result.resultImage} 
            alt="换装效果" 
            className="w-56 h-72 object-cover rounded-3xl shadow-2xl transition-all duration-300 group-hover:scale-105"
          />
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-full shadow-lg">
            <span className="text-lg">✓</span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-3 text-center">
              <p className="text-gray-800 font-medium text-sm">{result.message}</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={onTryAgain}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            🔄 重新换装
          </button>
          <button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = result.resultImage;
              link.download = 'ai-wardrobe-result.jpg';
              link.click();
            }}
            className="px-6 py-3 bg-white border-2 border-purple-300 text-purple-600 font-semibold rounded-full hover:bg-purple-50 hover:scale-105 transition-all duration-300"
          >
            💾 保存图片
          </button>
        </div>
      </div>
    </div>
  );
};

// 步骤指示器组件
const StepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, title: '拍一张自拍', desc: '正面全身照最佳\n一次上传，永久使用', icon: '📷', color: 'from-pink-500 to-purple-600' },
    { id: 2, title: '选喜欢的衣服', desc: '数码、网图都可以\n建立你的唯美衣柜', icon: '👕', color: 'from-green-500 to-teal-600' },
    { id: 3, title: '瞬间换装成功', desc: 'AI智能贴合身材\n效果真实自然', icon: '✨', color: 'from-blue-500 to-indigo-600' }
  ];

  return (
    <div className="flex justify-center items-center space-x-8 mb-16">
      {steps.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center text-center max-w-xs">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl text-white mb-4 shadow-lg transform transition-all duration-300 hover:scale-110`}>
            {step.icon}
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{step.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{step.desc}</p>
          {currentStep === step.id && (
            <div className="mt-3 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs rounded-full font-medium">
              进行中
            </div>
          )}
        </div>
      ))}
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
  const [currentStep, setCurrentStep] = useState(1);

  const handlePersonImageUpload = (image) => {
    setPersonImage(image);
    setResult(null);
    setCurrentStep(2);
  };

  const handleClothingImageUpload = (image) => {
    setClothingImages(prev => [...prev, image]);
    setSelectedClothing(image);
    setCurrentStep(3);
  };

  const handleClothingSelect = (image) => {
    setSelectedClothing(image);
    setCurrentStep(3);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 font-inter">
      {/* 头部 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm text-purple-600 font-medium mb-6">
            ✨ 衣柜里的AI换装新体验
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            从此穿衣自由
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text mb-6">
            不买也能拥有
          </h2>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            看见喜欢的衣服，先在自己身上试试
          </p>
          <p className="text-gray-500 mb-12">
            满足你装扮，不用花动消费，你的衣柜想想就衣服
          </p>
          
          <button 
            onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="mr-2">+</span>
            立即体验
            <span className="ml-2">→</span>
          </button>
        </div>
      </header>

      {/* 特色功能展示 */}
      <section className="py-16 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-12 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-3 mx-auto">
                🔄
              </div>
              <p className="text-sm font-medium text-gray-700">无限换装</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-3 mx-auto">
                💰
              </div>
              <p className="text-sm font-medium text-gray-700">0元拥有</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl text-white mb-3 mx-auto">
                ⚡
              </div>
              <p className="text-sm font-medium text-gray-700">秒级生成</p>
            </div>
          </div>
        </div>
      </section>

      {/* 使用步骤 */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-purple-600 font-medium mb-4">比去商场试衣还简单</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              30秒拥有新衣服
            </h2>
            <p className="text-xl text-gray-600">
              看到喜欢的衣服，立即看到上身效果
            </p>
          </div>
          
          <StepIndicator currentStep={currentStep} />
        </div>
      </section>

      {/* 主要功能区域 */}
      <section id="upload-section" className="py-16 bg-white/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* 图片上传区域 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ImageUploader 
                onPersonImageUpload={handlePersonImageUpload}
                onClothingImageUpload={handleClothingImageUpload}
                personImage={personImage}
                clothingImages={clothingImages}
              />
            </div>

            {/* 衣物画廊 */}
            {clothingImages.length > 0 && (
              <ClothesGallery 
                clothingImages={clothingImages}
                selectedClothing={selectedClothing}
                onClothingSelect={handleClothingSelect}
              />
            )}
            
            {/* 换装按钮 */}
            <div className="text-center">
              <button 
                onClick={handleTransform}
                disabled={!canTransform}
                className={`group relative px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-2xl overflow-hidden ${
                  canTransform
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:shadow-purple-500/25 hover:scale-105 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {canTransform && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                  </>
                )}
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {isLoading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>AI换装中...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">🎨</span>
                      <span>开始 AI 换装</span>
                      <span className="text-xl animate-pulse">✨</span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* 结果展示 */}
            <ResultDisplay 
              result={result}
              isLoading={isLoading}
              onTryAgain={handleTryAgain}
            />
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-2 text-lg">© 2024 从此穿衣自由 | AI Wardrobe</p>
          <p className="text-purple-200">基于先进AI技术，让每一次换装都充满惊喜</p>
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