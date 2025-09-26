/**
 * Nano Banana Edit API Integration
 * 用于AI换装功能的fal.ai API调用
 */

import { fal } from '@fal-ai/client';
import { apiRateLimiter } from './rateLimiter.js';

// API配置
export const NANO_BANANA_CONFIG = {
  MODEL_ID: 'fal-ai/nano-banana/edit',
  API_KEY: import.meta.env.VITE_FAL_AI_API_KEY || '',
  TIMEOUT: 60000, // 60秒，图像生成需要更长时间
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp']
};

// 配置fal客户端
if (!NANO_BANANA_CONFIG.API_KEY) {
  console.warn('⚠️ FAL AI API密钥未配置，请检查环境变量 VITE_FAL_AI_API_KEY');
}

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
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * 将文件转换为base64 data URI
 * @param {File} file - 文件对象
 * @returns {Promise<string>} - base64 data URI
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 验证图片文件
 * @param {File} file - 文件对象
 * @returns {boolean} - 是否有效
 */
export const validateImageFile = (file) => {
  if (!file) {
    console.error('文件不能为空');
    return false;
  }
  
  if (!(file instanceof File)) {
    console.error('必须是File对象');
    return false;
  }
  
  if (!NANO_BANANA_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
    console.error('不支持的文件格式:', file.type);
    console.error('支持的格式:', NANO_BANANA_CONFIG.SUPPORTED_FORMATS);
    return false;
  }
  
  if (file.size > NANO_BANANA_CONFIG.MAX_FILE_SIZE) {
    console.error('文件大小超出限制:', file.size, '最大允许:', NANO_BANANA_CONFIG.MAX_FILE_SIZE);
    return false;
  }
  
  return true;
};

/**
 * 将base64字符串转换为File对象
 * @param {string} base64String - base64字符串
 * @param {string} fileName - 文件名
 * @returns {File} - File对象
 */
export const base64ToFile = (base64String, fileName = 'image.jpg') => {
  // 移除data:image/jpeg;base64,前缀
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // 转换为二进制数据
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  
  return new File([blob], fileName, { type: 'image/jpeg' });
};

/**
 * 使用Nano Banana API进行AI换装
 * @param {string|File} personImage - 人物图片（base64字符串或File对象）
 * @param {string|File} clothesImage - 衣服图片（base64字符串或File对象）
 * @param {Object} options - 可选参数
 * @returns {Promise<string>} - 换装后的图片URL
 */
export const nanoBananaTransform = async (personImage, clothesImage, options = {}) => {
  try {
    console.log('=== Nano Banana变装处理开始 ===');
    
    // 检查API密钥是否配置
    if (!NANO_BANANA_CONFIG.API_KEY) {
      throw new Error('API密钥未配置，请联系管理员或检查环境变量配置');
    }
    
    // 检查请求频率限制
    const rateLimitCheck = apiRateLimiter.canMakeRequest();
    if (!rateLimitCheck.allowed) {
      throw new Error(rateLimitCheck.message);
    }
    
    // 记录本次请求
    apiRateLimiter.recordRequest();
    
    // 处理人物图片
    let personFile;
    if (typeof personImage === 'string') {
      // 如果是base64字符串，转换为File对象
      personFile = base64ToFile(personImage, 'person.jpg');
    } else if (personImage instanceof File) {
      personFile = personImage;
    } else {
      throw new Error('人物图片格式不正确');
    }
    
    // 处理衣服图片
    let clothesFile;
    if (typeof clothesImage === 'string') {
      // 如果是base64字符串，转换为File对象
      clothesFile = base64ToFile(clothesImage, 'clothes.jpg');
    } else if (clothesImage instanceof File) {
      clothesFile = clothesImage;
    } else {
      throw new Error('衣服图片格式不正确');
    }
    
    // 验证输入文件
    if (!validateImageFile(personFile)) {
      throw new Error('人物图片文件格式或大小不符合要求');
    }
    
    if (!validateImageFile(clothesFile)) {
      throw new Error('衣服图片文件格式或大小不符合要求');
    }

    // 压缩图片以减小请求体大小，但保持较高质量
    console.log('压缩图片中...');
    const compressedPersonImage = await compressImage(personFile, 1024, 1024, 0.85);
    const compressedClothesImage = await compressImage(clothesFile, 1024, 1024, 0.85);
    
    console.log(`人物图片压缩: ${(personFile.size / 1024).toFixed(1)}KB -> ${(compressedPersonImage.size / 1024).toFixed(1)}KB`);
    console.log(`衣服图片压缩: ${(clothesFile.size / 1024).toFixed(1)}KB -> ${(compressedClothesImage.size / 1024).toFixed(1)}KB`);

    // 将压缩后的图片转换为base64 data URI
    const personImageDataUri = await fileToBase64(compressedPersonImage);
    const clothesImageDataUri = await fileToBase64(compressedClothesImage);
    
    console.log('图片转换完成，开始调用Nano Banana API...');

    // 调用fal API进行变装
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
    
    // 检查不同可能的结果格式
    if (result && result.data && result.data.images && result.data.images.length > 0) {
      console.log('使用result.data.images格式');
      return {
        success: true,
        resultImage: result.data.images[0].url,
        message: 'AI换装完成！这是真实的AI生成结果。'
      };
    } else if (result && result.images && result.images.length > 0) {
      console.log('使用result.images格式');
      return {
        success: true,
        resultImage: result.images[0].url,
        message: 'AI换装完成！这是真实的AI生成结果。'
      };
    } else if (result && result.data && result.data.image) {
      console.log('使用result.data.image格式');
      return {
        success: true,
        resultImage: result.data.image,
        message: 'AI换装完成！这是真实的AI生成结果。'
      };
    } else if (result && result.image) {
      console.log('使用result.image格式');
      return {
        success: true,
        resultImage: result.image,
        message: 'AI换装完成！这是真实的AI生成结果。'
      };
    } else {
      console.error('无法识别的API返回格式:', result);
      throw new Error('API返回的结果格式不正确');
    }

  } catch (error) {
    console.error('=== Nano Banana变装处理失败 ===');
    console.error('错误详情:', error);
    
    // 详细的错误分类和降级处理
    let errorMessage = '变装处理失败';
    let shouldRetry = false;
    
    if (error.message?.includes('API密钥未配置')) {
      errorMessage = '服务暂时不可用，请联系管理员';
    } else if (error.message?.includes('请求过于频繁')) {
      errorMessage = error.message; // 保持原始频率限制消息
    } else if (error.message?.includes('timeout') || error.message?.includes('超时')) {
      errorMessage = '处理超时，请稍后重试';
      shouldRetry = true;
    } else if (error.message?.includes('network') || error.message?.includes('网络')) {
      errorMessage = '网络连接失败，请检查网络后重试';
      shouldRetry = true;
    } else if (error.message?.includes('file') || error.message?.includes('图片')) {
      errorMessage = '图片处理失败，请检查图片格式和大小';
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      errorMessage = '服务使用量已达上限，请稍后重试';
    } else if (error.message?.includes('unauthorized') || error.message?.includes('401')) {
      errorMessage = '服务认证失败，请联系管理员';
    } else if (error.message?.includes('500') || error.message?.includes('服务器')) {
      errorMessage = '服务器暂时不可用，请稍后重试';
      shouldRetry = true;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // 添加重试建议
    if (shouldRetry) {
      errorMessage += '\n\n💡 建议：等待几分钟后重试，或尝试使用较小的图片';
    }
    
    throw new Error(errorMessage);
  }
};

/**
 * 检查Nano Banana API可用性
 * @returns {Promise<boolean>} - API是否可用
 */
export const checkNanoBananaApiAvailability = async () => {
  try {
    // 这里可以添加一个简单的API健康检查
    // 由于fal.ai没有专门的健康检查端点，我们假设配置正确就是可用的
    return true;
  } catch (error) {
    console.error('Nano Banana API不可用:', error);
    return false;
  }
};

/**
 * 检查Nano Banana API状态
 * @param {string} requestId - 请求ID
 * @returns {Promise<Object>} - API状态
 */
export const checkNanoBananaApiStatus = async (requestId) => {
  try {
    // 这里可以添加状态检查逻辑
    return { status: 'completed' };
  } catch (error) {
    console.error('检查API状态失败:', error);
    throw error;
  }
};

// 兼容性导出
export const geminiTransform = nanoBananaTransform;
export const checkGeminiApiStatus = checkNanoBananaApiStatus;