import React, { useState, useRef, useEffect, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ClothesGallery from './components/ClothesGallery';
import ResultDisplay from './components/ResultDisplay';
import { nanoBananaTransform, checkNanoBananaApiAvailability, validateImageFile } from './utils/nanoBananaApi';
import { mockTransform } from './utils/mockApi';

function App() {
  const [personImage, setPersonImage] = useState(null);
  const [clothesImages, setClothesImages] = useState([]);
  const [selectedClothes, setSelectedClothes] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'available', 'unavailable'
  const [useGeminiApi, setUseGeminiApi] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  
  // 用于存储 URL 引用，便于清理
  const personImageUrlRef = useRef(null);
  const resultUrlRef = useRef(null);

  // 检查API状态
  useEffect(() => {
    const checkApiAvailability = async () => {
      try {
        setApiStatus('checking');
        console.log('开始检查Nano Banana API状态...');
        const isAvailable = await checkNanoBananaApiAvailability();
        console.log('API状态检查结果:', isAvailable);
        setApiStatus(isAvailable ? 'available' : 'unavailable');
        setUseGeminiApi(isAvailable);
        
        if (!isAvailable) {
          console.warn('Nano Banana API不可用，将使用模拟API');
        }
      } catch (error) {
        console.error('API状态检查失败:', error);
        console.error('错误详情:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setApiStatus('unavailable');
        setUseGeminiApi(false);
      } finally {
        // 延迟触发页面加载动画
        setTimeout(() => setPageLoaded(true), 300);
      }
    };

    checkApiAvailability();
  }, []);

  // Handle person image upload with validation
  const handlePersonUpload = useCallback((file) => {
    console.log('=== handlePersonUpload 被调用 ===');
    console.log('上传的文件:', file);
    console.log('文件名:', file?.name);
    console.log('文件大小:', file?.size);
    console.log('文件类型:', file?.type);
    
    setError(null);
    
    if (!validateImageFile(file)) {
      console.error('文件验证失败');
      setError('Invalid image file. Please check file size and format.');
      return;
    }
    
    console.log('文件验证通过，开始处理...');
    
    // Clean up previous URL
    if (personImageUrlRef.current) {
      console.log('清理之前的URL:', personImageUrlRef.current);
      URL.revokeObjectURL(personImageUrlRef.current);
    }

    const imageUrl = URL.createObjectURL(file);
    console.log('创建新的图片URL:', imageUrl);
    personImageUrlRef.current = imageUrl;
    setPersonImage(file);
    console.log('人物图片状态已更新');
    
    // Reset result when person changes
    if (resultUrlRef.current && typeof resultUrlRef.current === 'string' && resultUrlRef.current.startsWith('blob:')) {
      console.log('清理之前的结果图片');
      URL.revokeObjectURL(resultUrlRef.current);
      resultUrlRef.current = null;
    }
    setResultImage(null);
    console.log('=== handlePersonUpload 完成 ===');
  }, []);

  // Handle clothes upload with validation
  const handleClothesUpload = useCallback((files) => {
    setError(null);
    
    // Handle both single file and array of files
    const fileArray = Array.isArray(files) ? files : [files];
    
    const validFiles = [];
    
    for (const file of fileArray) {
      if (!validateImageFile(file)) {
        setError(`Invalid image file: ${file.name}. Please check file size and format.`);
        continue;
      }
      validFiles.push(file);
    }
    
    if (validFiles.length === 0) {
      return;
    }

    const newClothesItems = validFiles.map(file => {
      const imageUrl = URL.createObjectURL(file);
      return {
        id: Date.now() + Math.random(), // Ensure unique IDs
        url: imageUrl,
        file: file,
        name: file.name
      };
    });
    
    setClothesImages(prev => [...prev, ...newClothesItems]);
  }, []);

  // Handle clothes selection (只选择，不触发变装)
  const handleClothesSelect = (clothesItem) => {
    console.log('=== handleClothesSelect 被调用 ===');
    console.log('选中的衣服:', clothesItem);
    setSelectedClothes(clothesItem);
    setError(null);
  };

  // Handle magic wand transformation
  const handleMagicTransform = async () => {
    console.log('=== handleMagicTransform 被调用 ===');
    console.log('选中的衣服:', selectedClothes);
    console.log('当前人物图片:', personImage);
    
    if (!personImage) {
      console.error('错误：没有人物照片');
      setError('请先上传人物照片');
      return;
    }

    if (!selectedClothes) {
      console.error('错误：没有选择衣服');
      setError('请先选择一件衣服');
      return;
    }

    console.log('开始设置状态...');
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setProgressText('准备开始换装...');
    console.log('状态设置完成，开始换装流程...');
    
    try {
      console.log('开始换装处理...');
      console.log('人物图片:', personImage);
      console.log('衣服图片:', selectedClothes);
      
      // 模拟进度更新
      setProgress(10);
      setProgressText('正在分析人物图片...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(30);
      setProgressText('正在处理衣服图片...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProgress(50);
      setProgressText('正在进行AI换装处理...');
      
      let transformedImageUrl;
      
      if (useGeminiApi && apiStatus === 'available') {
        try {
          // 使用 Nano Banana API 进行真实换装
          console.log('使用Nano Banana API进行换装...');
          setProgress(70);
          setProgressText('正在调用Nano Banana AI...');
          transformedImageUrl = await nanoBananaTransform(
            personImage,
            selectedClothes,
            {
              quality: 'high',
              preserveFace: true,
              blendMode: 'natural'
            }
          );
        } catch (nanoBananaError) {
          console.warn('Nano Banana API调用失败，切换到模拟API:', nanoBananaError.message);
          // 如果是429错误或其他API错误，自动切换到mock API
          if (nanoBananaError.message.includes('429') || nanoBananaError.message.includes('API请求失败')) {
            console.log('检测到API配额限制，使用模拟API作为备选方案...');
            setProgress(70);
            setProgressText('正在生成演示效果...');
            transformedImageUrl = await mockTransform(
              personImage,
              selectedClothes,
              {
                quality: 'high',
                preserveFace: true,
                blendMode: 'natural'
              }
            );
          } else {
            throw nanoBananaError; // 重新抛出非API配额相关的错误
          }
        }
      } else {
        // 使用模拟API作为备选方案
        console.log('Nano Banana API不可用，使用模拟API...');
        setProgress(70);
        setProgressText('正在生成演示效果...');
        transformedImageUrl = await mockTransform(
          personImage,
          selectedClothes,
          {
            quality: 'high',
            preserveFace: true,
            blendMode: 'natural'
          }
        );
      }
      
      setProgress(90);
      setProgressText('正在生成最终结果...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('换装完成，结果URL:', transformedImageUrl);
      
      // 清理之前的结果
      if (resultUrlRef.current) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
      
      resultUrlRef.current = transformedImageUrl;
      setResultImage(transformedImageUrl);
      
      setProgress(100);
      setProgressText('换装完成！');
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error('换装失败:', err);
      setError(err.message || '换装处理失败，请重试');
    } finally {
      setIsLoading(false);
      setProgress(0);
      setProgressText('');
    }
  };

  // Cleanup URLs on component unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (personImageUrlRef.current) {
        URL.revokeObjectURL(personImageUrlRef.current);
      }
      if (resultUrlRef.current && typeof resultUrlRef.current === 'string' && resultUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
    };
  }, []); // Only cleanup on unmount

  // Check if both images are uploaded (for future use)
  // const canStartTransform = personImage && selectedClothes && !isLoading;

  return (
    <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'}}>
      <div className={`minimal-container transition-all duration-1000 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* 现代化标题区域 */}
        <div className="text-center mb-32 relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0 -top-20 -bottom-20">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-indigo-200/20 rounded-full blur-2xl"></div>
          </div>
          
          {/* 主标题 */}
          <div className="relative z-10">
            <div className={`mb-6 transition-all duration-1000 delay-200 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-full mb-8">
                ✨ 衣柜里的内容都可以试穿
              </span>
            </div>
            
            <h1 className={`text-6xl md:text-7xl font-light text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 mb-8 transition-all duration-1000 delay-300 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              从此穿衣自由
            </h1>
            
            <h2 className={`text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 transition-all duration-1000 delay-400 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              不买也能拥有
            </h2>
            
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-500 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              看见喜欢的衣服，先在自己身上试试
            </p>
            
            <p className={`text-sm text-gray-500 max-w-xl mx-auto transition-all duration-1000 delay-600 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              满足你装扮欲望，不用动钱包·你的衣服想象是衣柜
            </p>
          </div>
          
          {/* Instagram风格API状态指示器 */}
          <div className={`mt-8 flex items-center justify-center space-x-3 transition-all duration-1000 delay-600 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              apiStatus === 'checking' ? 'bg-amber-400 animate-pulse' :
              apiStatus === 'available' ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'
            }`}></div>
            <span className="text-sm text-neutral-400 font-light transition-colors duration-500">
              {apiStatus === 'checking' ? '连接中...' :
               apiStatus === 'available' ? 'AI 已就绪' : '演示模式'}
            </span>
          </div>
          
          {/* Instagram风格状态提示 */}
          {apiStatus === 'unavailable' && (
            <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-3xl max-w-lg mx-auto border-0 shadow-sm">
              <p className="text-neutral-600 text-sm font-light text-center">
                当前使用演示模式
                <button 
                  onClick={async () => {
                    console.log('手动测试API连接...');
                    try {
                      const result = await checkNanoBananaApiAvailability();
                      console.log('手动测试结果:', result);
                    } catch (error) {
                      console.error('手动测试失败:', error);
                    }
                  }}
                  className="ml-3 px-3 py-1 text-xs bg-neutral-200 text-neutral-600 rounded-full hover:bg-neutral-300 transition-all duration-300 font-light"
                >
                  重新连接
                </button>
              </p>
            </div>
          )}
          {apiStatus === 'available' && (
            <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-3xl max-w-lg mx-auto border-0 shadow-sm">
              <p className="text-neutral-600 text-sm font-light text-center">
                AI 换装功能已启用
              </p>
            </div>
          )}
        </div>

        {/* 现代化照片上传区域 */}
        <div className={`mb-32 transition-all duration-800 delay-800 ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 text-sm font-medium rounded-full mb-6">
              第一步
            </span>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">你的模特照片</h2>
            <p className="text-gray-600 max-w-md mx-auto">正面全身照最佳，一次上传，永久使用</p>
          </div>
          <div className="max-w-lg mx-auto">
            <ImageUploader
              onImageUpload={handlePersonUpload}
              currentImage={personImageUrlRef.current}
              placeholder="拖拽或点击上传照片"
              accept="image/*"
            />
          </div>
        </div>

        {/* Instagram风格衣服选择区域 */}
        {(() => {
          console.log('渲染时personImage状态:', personImage);
          console.log('personImage类型:', typeof personImage);
          console.log('personImage是否为真值:', !!personImage);
          return personImage;
        })() && (
          <div className="mb-32 animate-fadeInUp">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 text-sm font-medium rounded-full mb-6">
                第二步
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">选择心仪的衣服</h2>
              <p className="text-gray-600 max-w-md mx-auto">数码、网购都可以，建立你的虚拟衣柜</p>
            </div>
            <ClothesGallery
              clothesImages={clothesImages}
              selectedClothes={selectedClothes}
              onClothesSelect={handleClothesSelect}
              onClothesUpload={handleClothesUpload}
              isLoading={isLoading}
            />
            
            {/* 魔法变装按钮 */}
            {selectedClothes && !isLoading && (
              <div className="mt-16 text-center animate-fade-in">
                <div className="mb-6">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-sm font-medium rounded-full">
                    第三步
                  </span>
                </div>
                <button
                  onClick={handleMagicTransform}
                  className="group relative inline-flex items-center px-12 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white rounded-full font-medium text-lg transition-all duration-500 border-0 shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transform overflow-hidden"
                >
                  {/* 按钮光效 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  
                  {/* 魔法棒图标 */}
                  <div className="relative flex items-center">
                    <div className="w-8 h-8 mr-3 relative">
                      <svg className="w-full h-full animate-bounce-gentle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {/* 魔法星星 */}
                      <div className="absolute -top-1 -right-1 w-3 h-3">
                        <svg className="w-full h-full text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <span className="relative z-10">开始魔法变装</span>
                  </div>
                </button>
                
                <p className="text-sm text-gray-500 mt-4 max-w-xs mx-auto">
                  AI智能合成身材，效果真实自然
                </p>
              </div>
            )}
          </div>
        )}

        {/* 现代化进度指示器 */}
        {isLoading && (
          <div className="mb-32 animate-fadeInUp">
            <div className="max-w-lg mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-3xl p-10 border-0 shadow-2xl transform transition-all duration-500 hover:shadow-purple-500/10">
                <div className="text-center mb-8">
                  {/* 魔法图标动画 */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center animate-pulse shadow-lg">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                        <svg className="w-8 h-8 text-purple-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                    {/* 环绕粒子效果 */}
                    <div className="absolute inset-0 animate-spin" style={{animationDuration: '3s'}}>
                      <div className="absolute top-2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                      <div className="absolute bottom-2 right-6 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 left-6 w-1 h-1 bg-green-400 rounded-full transform -translate-y-1/2 animate-pulse"></div>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-light text-gray-800 mb-3">
                    {progress < 30 ? '🔍 正在分析照片' :
                     progress < 60 ? '✨ 正在生成效果' :
                     progress < 90 ? '🎨 正在优化细节' : '🎉 即将完成'}
                  </h3>
                  <p className="text-base text-gray-600 font-light">{progressText}</p>
                </div>
                
                {/* 现代化进度条 */}
                <div className="relative mb-6">
                  <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                    <div 
                      className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                      style={{ width: `${progress}%` }}
                    >
                      {/* 进度条光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse rounded-full"></div>
                      {/* 流动光效 */}
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 animate-pulse rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* 进度信息 */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm text-gray-500 font-light">魔法进行中</span>
                  <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{progress}%</span>
                </div>
                
                {/* 优雅的加载动画 */}
                <div className="flex justify-center">
                  <div className="flex space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '0ms'}}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '200ms'}}></div>
                    <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-bounce shadow-sm" style={{animationDelay: '400ms'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instagram风格错误提示 */}
        {error && (
          <div className="bg-white/70 backdrop-blur-sm text-neutral-600 px-8 py-6 rounded-3xl mb-16 text-center max-w-lg mx-auto animate-fadeInUp transform transition-all duration-500 border-0 shadow-sm">
            <p className="font-light">{error}</p>
          </div>
        )}

        {/* 现代化结果展示 */}
        {resultImage && (
          <div className="mb-32 animate-fadeInUp">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full mb-6">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">换装完成</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">✨ 魔法效果</h2>
              <p className="text-gray-600 max-w-md mx-auto">AI为你量身定制的完美搭配</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-gray-100/50 overflow-hidden">
                {/* 装饰性背景 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
                
                <div className="relative z-10">
                  <ResultDisplay
                    resultImage={resultImage}
                    personImage={personImageUrlRef.current}
                    clothesImage={selectedClothes?.url}
                    isLoading={isLoading}
                  />
                  
                  {/* 操作按钮区域 */}
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = resultImage;
                        link.download = 'magic-outfit-result.jpg';
                        link.click();
                      }}
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium transition-all duration-300 shadow-xl hover:shadow-purple-500/25 hover:scale-105 transform"
                    >
                      <svg className="w-5 h-5 mr-3 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      保存到相册
                    </button>
                    
                    <button
                      onClick={() => {
                        if (resultUrlRef.current && typeof resultUrlRef.current === 'string' && resultUrlRef.current.startsWith('blob:')) {
                          URL.revokeObjectURL(resultUrlRef.current);
                          resultUrlRef.current = null;
                        }
                        setResultImage(null);
                        setSelectedClothes(null);
                        setProgress(0);
                      }}
                      className="group inline-flex items-center px-8 py-4 bg-white/90 text-gray-700 rounded-full font-medium transition-all duration-300 border-2 border-gray-200 hover:bg-white hover:shadow-lg hover:scale-105 transform hover:border-purple-300"
                    >
                      <svg className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      再试一套
                    </button>
                  </div>
                  
                  {/* 分享提示 */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500 mb-3">喜欢这个效果吗？</p>
                    <div className="flex justify-center space-x-6">
                      <span className="text-xs text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                        AI智能合成
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                        真实效果
                      </span>
                      <span className="text-xs text-gray-400 flex items-center">
                        <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                        即时生成
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 功能介绍区域 */}
        <div className="mb-32 relative">
          {/* 背景装饰 */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 right-1/4 transform -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm font-medium rounded-full mb-6">
                比去商场试衣间更简单
              </span>
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
                30秒拥有新衣服
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                看到喜欢的衣服，立即看到上身效果
              </p>
            </div>
            
            {/* 三步骤流程 */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* 步骤1 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    拍照
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">拍一张自拍</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  正面全身照最佳<br/>
                  一次上传，永久使用
                </p>
              </div>
              
              {/* 步骤2 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    试穿
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">选择喜欢的衣服</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  数码、网购都可以<br/>
                  建立你的虚拟衣柜
                </p>
              </div>
              
              {/* 步骤3 */}
              <div className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    5秒
                  </span>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">瞬间换装成功</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  AI智能合成身材<br/>
                  效果真实自然
                </p>
              </div>
            </div>
            
            {/* 立即体验按钮 */}
            <div className="text-center mt-16">
              <button 
                onClick={() => {
                  document.querySelector('.upload-zone')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl transform"
              >
                <span className="mr-2">✨</span>
                立即体验
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            
            {/* 特性标签 */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-gray-200/50">
                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                无限换装
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-gray-200/50">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                0元消费
              </span>
              <span className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-gray-200/50">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                环保时尚
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;