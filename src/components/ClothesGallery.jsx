import React from 'react';
import ImageUploader from './ImageUploader';

/**
 * ClothesGallery 组件 - Instagram风格衣服展示网格
 * 极简卡片设计，柔和色调，支持上传多件衣服并以网格形式展示
 */
const ClothesGallery = ({ 
  clothesImages, 
  selectedClothes, 
  onClothesSelect, 
  onClothesUpload,
  isLoading 
}) => {
  return (
    <div className="max-w-5xl mx-auto">
      {/* Instagram风格上传区域 */}
      <div className="mb-16">
        <ImageUploader
          onImageUpload={onClothesUpload}
          placeholder="添加衣服到你的衣柜"
          accept="image/*"
          multiple={true}
          variant="compact"
        />
      </div>

      {/* Instagram风格衣服网格 */}
      {clothesImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {clothesImages.map((clothesItem) => (
            <div
              key={clothesItem.id}
              className={`relative group cursor-pointer transition-all duration-400 ${
                selectedClothes?.id === clothesItem.id ? 'scale-95' : 'hover:scale-102'
              } ${
                isLoading ? 'pointer-events-none opacity-60' : ''
              }`}
              onClick={() => !isLoading && onClothesSelect(clothesItem)}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden border-0 shadow-sm transition-all duration-400 hover:shadow-lg">
                <img
                  src={clothesItem.url}
                  alt="衣服"
                  className="w-full aspect-square object-cover transition-all duration-500"
                  loading="lazy"
                />
              </div>
              
              {/* Instagram风格选中状态指示器 */}
              {selectedClothes?.id === clothesItem.id && (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded-3xl transition-all duration-300">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
              
              {/* Instagram风格加载状态 */}
              {isLoading && selectedClothes?.id === clothesItem.id && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                  <div className="loading-spinner"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Instagram风格空状态提示 */}
      {clothesImages.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-neutral-400 text-base font-light">
            你的衣柜还是空的
          </p>
          <p className="text-neutral-300 text-sm font-light mt-2">
            添加一些衣服开始搭配吧
          </p>
        </div>
      )}
    </div>
  );
};

export default ClothesGallery;