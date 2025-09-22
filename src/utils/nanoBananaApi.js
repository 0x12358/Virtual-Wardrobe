/**
 * Nano Banana Edit API Integration
 * 用于AI换装功能的fal.ai API调用
 */

import { fal } from '@fal-ai/client';

// API配置
export const NANO_BANANA_CONFIG = {
  MODEL_ID: 'fal-ai/nano-banana/edit',
  API_KEY: '90bc2a9e-d264-49f9-bf38-9f1f8c67c5e4:f0a65afd8838a8b472da3a4e07189a2c',
  TIMEOUT: 60000, // 60秒，图像生成需要更长时间
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp']
};

// 配置fal客户端
fal.config({
  credentials: NANO_BANANA_CONFIG.API_KEY
});

/**
 * 压缩图片文件
 * @param {File} file - 原始图片文件
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @param {number} quality - 压缩质量 (0-1)
 * @returns {Promise<File>} - 压缩后的图片文件
 */
export const compressImage = (file, maxWidth = 1024, maxHeight = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // 绘制压缩后的图片
      ctx.drawImage(img, 0, 0, width, height);
      
      // 转换为Blob
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          reject(new Error('图片压缩失败'));
        }
      }, 'image/jpeg', quality);
    };
    
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 将文件转换为base64格式
 * @param {File} file - 图片文件
 * @returns {Promise<string>} - Base64编码的字符串
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * 验证图片文件
 * @param {File} file - 要验证的图片文件
 * @returns {boolean} - 文件是否有效
 */
export const validateImageFile = (file) => {
  if (!file) {
    console.error('文件对象为空');
    return false;
  }
  
  // 检查是否为File或类File对象
  if (!file || typeof file !== 'object' || 
      typeof file.size !== 'number' || 
      typeof file.name !== 'string' || 
      !file.type) {
    console.error('传入的不是File或类File对象');
    return false;
  }
  
  // 检查文件大小
  if (file.size > NANO_BANANA_CONFIG.MAX_FILE_SIZE) {
    console.error(`文件大小 ${(file.size / 1024 / 1024).toFixed(1)}MB 超过最大限制 ${NANO_BANANA_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`);
    return false;
  }
  
  // 检查文件类型
  let isValidType = false;
  
  // 首先检查MIME类型
  if (file.type && NANO_BANANA_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
    isValidType = true;
  } else if (file.name) {
    // 如果MIME类型不可用，检查文件扩展名
    const extension = file.name.toLowerCase().split('.').pop();
    const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    isValidType = supportedExtensions.includes(extension);
  }
  
  if (!isValidType) {
    console.error(`不支持的文件格式。请上传 JPG、PNG 或 WebP 格式的图片`);
    return false;
  }
  
  return true;
};

/**
 * 调用Nano Banana API进行AI换装
 * @param {File|string} personImage - 人物图片（File对象或URL）
 * @param {File|string} clothesImage - 衣服图片（File对象或URL）
 * @param {Object} options - 可选参数
 * @returns {Promise<string>} - 返回生成的图片URL
 */
export const nanoBananaTransform = async (personImage, clothesImage, options = {}) => {
  try {
    console.log('=== Nano Banana变装处理开始 ===');
    console.log('personImage:', personImage);
    console.log('personImage类型:', typeof personImage);
    console.log('personImage instanceof File:', personImage instanceof File);
    console.log('clothesImage:', clothesImage);
    console.log('clothesImage类型:', typeof clothesImage);
    console.log('clothesImage instanceof File:', clothesImage instanceof File);
    
    // 验证输入文件
    if (!personImage) {
      console.error('ValidationError: 人物图片不能为空');
      const error = new Error('人物图片不能为空');
      error.name = 'ValidationError';
      throw error;
    }
    
    if (!(personImage instanceof File)) {
      console.error('ValidationError: 人物图片必须是File对象，当前类型:', typeof personImage);
      const error = new Error('人物图片必须是File对象');
      error.name = 'ValidationError';
      throw error;
    }
    
    if (!validateImageFile(personImage)) {
      console.error('ValidationError: 人物图片文件格式或大小不符合要求');
      const error = new Error('人物图片文件格式或大小不符合要求');
      error.name = 'ValidationError';
      throw error;
    }
    
    // 处理衣服图片：可能是File对象或包含file属性的对象
    if (!clothesImage) {
      console.error('ValidationError: 衣服图片不能为空');
      const error = new Error('衣服图片不能为空');
      error.name = 'ValidationError';
      throw error;
    }
    
    const clothesFile = clothesImage instanceof File ? clothesImage : clothesImage.file;
    console.log('clothesFile:', clothesFile);
    console.log('clothesFile类型:', typeof clothesFile);
    
    if (!clothesFile) {
      console.error('ValidationError: 衣服图片文件不能为空');
      const error = new Error('衣服图片文件不能为空');
      error.name = 'ValidationError';
      throw error;
    }
    
    if (!(clothesFile instanceof File)) {
      console.error('ValidationError: 衣服图片必须是File对象，当前类型:', typeof clothesFile);
      const error = new Error('衣服图片必须是File对象');
      error.name = 'ValidationError';
      throw error;
    }
    
    if (!validateImageFile(clothesFile)) {
      console.error('ValidationError: 衣服图片文件格式或大小不符合要求');
      const error = new Error('衣服图片文件格式或大小不符合要求');
      error.name = 'ValidationError';
      throw error;
    }

    // 压缩图片以减小请求体大小，但保持较高质量
    console.log('压缩图片中...');
    const compressedPersonImage = await compressImage(personImage, 1024, 1024, 0.85);
    const compressedClothesImage = await compressImage(clothesFile, 1024, 1024, 0.85);
    
    console.log(`人物图片压缩: ${(personImage.size / 1024).toFixed(1)}KB -> ${(compressedPersonImage.size / 1024).toFixed(1)}KB`);
    console.log(`衣服图片压缩: ${(clothesFile.size / 1024).toFixed(1)}KB -> ${(compressedClothesImage.size / 1024).toFixed(1)}KB`);

    // 将压缩后的图片转换为base64 data URI
    const personImageDataUri = await fileToBase64(compressedPersonImage);
    const clothesImageDataUri = await fileToBase64(compressedClothesImage);
    
    console.log('图片转换完成，开始调用Nano Banana API...');

    // 调用fal API进行变装
    // 根据官方文档：第一张图片是主要编辑对象，第二张图片是参考图片
    // 对于换装：衣服图片作为主要编辑对象，人物图片作为参考
    const enhancedPrompt = "Make the clothing from the first image fit on the person from the second image. Keep the person's face, body pose, and background from the second image unchanged. Only change the clothing to match the style, color, and design from the first image.";
    
    console.log('调用Nano Banana API，参数:', {
      prompt: enhancedPrompt,
      image_urls: [clothesImageDataUri, personImageDataUri]
    });
    
    const result = await fal.subscribe(NANO_BANANA_CONFIG.MODEL_ID, {
      input: {
        prompt: enhancedPrompt,
        image_urls: [clothesImageDataUri, personImageDataUri],
        num_images: 1,
        output_format: "jpeg",
        seed: Math.floor(Math.random() * 1000000),
        enable_safety_checker: false
      },
      logs: true,
      onQueueUpdate: (update) => {
        console.log('Queue update:', update);
      }
    });

    console.log('API返回的完整结果:', JSON.stringify(result, null, 2));
    console.log('result类型:', typeof result);
    console.log('result.data:', result.data);
    console.log('result.images:', result.images);
    
    // 检查不同可能的结果格式
    if (result && result.data && result.data.images && result.data.images.length > 0) {
      console.log('使用result.data.images格式');
      return result.data.images[0].url;
    } else if (result && result.images && result.images.length > 0) {
      console.log('使用result.images格式');
      return result.images[0].url;
    } else if (result && result.data && result.data.image) {
      console.log('使用result.data.image格式');
      return result.data.image;
    } else if (result && result.image) {
      console.log('使用result.image格式');
      return result.image;
    } else {
      console.error('无法识别的API返回格式:', result);
      throw new Error('API返回的结果格式不正确');
    }

  } catch (error) {
    console.error('Nano Banana AI换装失败:', error);
    throw error;
  }
};

/**
 * 检查Nano Banana API可用性
 * @returns {Promise<boolean>} - API是否可用
 */
export const checkNanoBananaApiAvailability = async () => {
  try {
    console.log('检查Nano Banana API可用性...');
    
    if (!NANO_BANANA_CONFIG.API_KEY) {
      console.error('未配置API密钥');
      return false;
    }
    
    // 简单测试：尝试提交一个测试请求到队列
    const testResult = await fal.queue.submit(NANO_BANANA_CONFIG.MODEL_ID, {
      input: {
        image_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        mask_url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
        prompt: 'test'
      }
    });
    
    console.log('API连接测试成功，请求ID:', testResult.request_id);
    return true;
  } catch (error) {
    console.error('Nano Banana API不可用:', error);
    return false;
  }
};

/**
 * 检查Nano Banana API状态
 * @param {string} requestId - 请求ID
 * @returns {Promise<Object>} - API状态信息
 */
export const checkNanoBananaApiStatus = async (requestId) => {
  try {
    console.log('检查Nano Banana API状态:', requestId);
    
    const status = await fal.queue.status(NANO_BANANA_CONFIG.MODEL_ID, {
      requestId: requestId
    });
    
    console.log('API状态:', status);
    return status;
  } catch (error) {
    console.error('检查Nano Banana API状态失败:', error);
    throw error;
  }
};

// 为了保持兼容性，导出别名
export const geminiTransform = nanoBananaTransform;
export const checkGeminiApiStatus = checkNanoBananaApiStatus;