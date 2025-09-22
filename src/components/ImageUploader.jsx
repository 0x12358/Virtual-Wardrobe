import React, { useRef, useState } from 'react';

/**
 * ImageUploader 组件 - 支持拖拽上传的图片上传器
 * 支持单选/多选，预览功能，极简设计
 */
const ImageUploader = ({ 
  onImageUpload, 
  currentImage, 
  placeholder = "拖拽或点击上传图片", 
  accept = "image/*", 
  multiple = false,
  variant = "default", // default | compact
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) {
        onImageUpload(Array.from(files));
      } else {
        onImageUpload(files[0]);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (multiple) {
        onImageUpload(Array.from(files));
      } else {
        onImageUpload(files[0]);
      }
    }
  };

  const isCompact = variant === 'compact';
  
  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {currentImage && !multiple ? (
        // Instagram风格单图预览模式
        <div className="relative group">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl overflow-hidden border-0 shadow-sm">
            <img
              src={currentImage}
              alt="预览"
              className="w-full h-80 object-cover transition-all duration-500 group-hover:scale-102"
            />
          </div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-400 rounded-3xl flex items-center justify-center">
            <button
              onClick={handleClick}
              className="btn-secondary backdrop-blur-sm"
            >
              更换图片
            </button>
          </div>
        </div>
      ) : (
        // Instagram风格上传区域
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`upload-zone ${
            isDragOver ? 'drag-over' : ''
          } ${
            isCompact ? 'py-12' : 'py-20'
          }`}
        >
          <div className="text-center space-y-6">
            {/* Instagram风格上传图标 */}
            <div className="mx-auto w-16 h-16 text-neutral-300 transition-all duration-300">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            {/* Instagram风格上传文字 */}
            <div className="space-y-2">
              <p className={`font-light text-neutral-600 ${
                isCompact ? 'text-base' : 'text-lg'
              }`}>
                {placeholder}
              </p>
              <p className="text-sm text-neutral-400 font-light">
                {multiple ? 'PNG, JPG, GIF' : 'PNG, JPG, GIF · 最大 10MB'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;