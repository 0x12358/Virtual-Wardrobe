/**
 * Mock API for AI wardrobe transformation
 * TODO: 替换为Gemini 2.5 Flash Image Preview API调用
 */

/**
 * Mock AI-powered clothing transformation
 * @param {string|File} personImage - Person's image (URL or File object)
 * @param {string|File} clothesImage - Clothes image (URL or File object)
 * @param {Object} options - Transformation options
 * @returns {Promise<string>} - Promise that resolves to the transformed image URL
 */
export const mockTransform = async (personImage, clothesImage, options = {}) => {
  console.log('Starting mock AI transformation...');
  console.log('Person image:', personImage instanceof File ? `File: ${personImage.name} (${personImage.size} bytes)` : 'URL:', personImage);
  console.log('Clothes image:', clothesImage instanceof File ? `File: ${clothesImage.name} (${clothesImage.size} bytes)` : 'URL:', clothesImage);
  console.log('Options:', options);
  
  // Convert File objects to URLs if needed
  const personImageUrl = personImage instanceof File ? URL.createObjectURL(personImage) : personImage;
  const clothesImageUrl = clothesImage instanceof File ? URL.createObjectURL(clothesImage) : clothesImage;
  
  console.log('Generated URLs - Person:', personImageUrl, 'Clothes:', clothesImageUrl);
  
  // Simulate processing time (2-5 seconds)
  const processingTime = Math.random() * 3000 + 2000;
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // TODO: 替换为Gemini 2.5 Flash Image Preview API调用
        /*
        const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: "Transform the person in the first image to wear the clothing from the second image. Keep the person's face, pose, and background unchanged. Make the clothing fit naturally on the person's body."
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: personImageBase64
                  }
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg", 
                    data: clothesImageBase64
                  }
                }
              ]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 32,
              topP: 1,
              maxOutputTokens: 4096,
            }
          })
        });
        
        const result = await geminiResponse.json();
        return result.candidates[0].content.parts[0].text;
        */
        
        // Mock: Create a composite image to simulate transformation result
        console.log('Mock transformation completed');
        
        // Create a canvas to simulate image transformation
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Load both images
        const personImg = new Image();
        const clothesImg = new Image();
        
        personImg.crossOrigin = 'anonymous';
        clothesImg.crossOrigin = 'anonymous';
        
        let imagesLoaded = 0;
        const checkImagesLoaded = () => {
          imagesLoaded++;
          if (imagesLoaded === 2) {
            // Set canvas size based on person image
            canvas.width = personImg.width;
            canvas.height = personImg.height;
            
            // Draw person image as base
            ctx.drawImage(personImg, 0, 0);
            
            // Add a semi-transparent overlay to simulate clothing change
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#FF6B6B'; // Red tint to simulate clothing change
            ctx.fillRect(canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.6, canvas.height * 0.4);
            
            // Add some visual elements to make it look different
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = '#4ECDC4'; // Teal accent
            ctx.fillRect(canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.4, canvas.height * 0.2);
            
            // Add text overlay to show it's transformed
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `${Math.max(12, canvas.width / 20)}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText('AI Transformed', canvas.width / 2, canvas.height * 0.9);
            
            // Convert canvas to blob and create URL
            canvas.toBlob((blob) => {
              const resultUrl = URL.createObjectURL(blob);
              console.log('Mock transformation result created:', resultUrl);
              resolve(resultUrl);
            }, 'image/png', 0.9);
          }
        };
        
        personImg.onload = checkImagesLoaded;
        clothesImg.onload = checkImagesLoaded;
        
        personImg.onerror = () => {
          console.warn('Failed to load person image, using fallback');
          // Fallback: create a simple colored canvas
          canvas.width = 400;
          canvas.height = 600;
          ctx.fillStyle = '#FF6B6B';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('AI Transformed Result', canvas.width / 2, canvas.height / 2);
          
          canvas.toBlob((blob) => {
            const resultUrl = URL.createObjectURL(blob);
            resolve(resultUrl);
          }, 'image/png', 0.9);
        };
        
        clothesImg.onerror = () => {
          console.warn('Failed to load clothes image, proceeding with person image only');
          checkImagesLoaded();
        };
        
        // Set image sources
        personImg.src = personImageUrl;
        clothesImg.src = clothesImageUrl;
        
      } catch (error) {
        console.error('Mock transformation failed:', error);
        // Fallback: create a simple transformed result
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 400;
        canvas.height = 600;
        
        // Create a gradient background to simulate transformation
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#FF6B6B');
        gradient.addColorStop(1, '#4ECDC4');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI Transformation', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('(Fallback Result)', canvas.width / 2, canvas.height / 2 + 20);
        
        canvas.toBlob((blob) => {
          const fallbackUrl = URL.createObjectURL(blob);
          console.log('Fallback transformation result created:', fallbackUrl);
          resolve(fallbackUrl);
        }, 'image/png', 0.9);
      }
    }, processingTime);
  });
};

/**
 * Mock function to check API status
 * TODO: 替换为实际的API状态检查
 */
export const checkApiStatus = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // TODO: Replace with actual API status check
  // const response = await fetch('https://api.google-nano-banana.com/status');
  // return response.ok;
  
  return true; // Mock: API is always available
};

/**
 * Mock function to get available transformation styles
 * TODO: 替换为实际的API样式获取
 */
export const getAvailableStyles = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // TODO: Replace with actual API call
  // const response = await fetch('https://api.google-nano-banana.com/styles');
  // const data = await response.json();
  // return data.styles;
  
  return [
    { id: 'realistic', name: 'Realistic', description: 'Natural looking transformation' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and stylized result' },
    { id: 'fashion', name: 'Fashion', description: 'High-fashion magazine style' }
  ];
};

/**
 * Configuration for the API
 * TODO: 替换为Gemini 2.5 Flash Image Preview API配置
 */
export const API_CONFIG = {
  // Gemini API Configuration
  GEMINI_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
  MODEL: 'gemini-2.5-flash',
  VERSION: 'v1beta',
  TIMEOUT: 30000, // 30 seconds
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  
  // Mock settings
  MOCK_PROCESSING_TIME: {
    MIN: 2000, // 2 seconds
    MAX: 5000  // 5 seconds
  }
};

/**
 * Convert File to base64 string for API calls
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove data:image/jpeg;base64, prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {boolean} - Whether the file is valid
 */
export const validateImageFile = (file) => {
  if (!file) return false;
  
  // Check file size
  if (file.size > API_CONFIG.MAX_FILE_SIZE) {
    console.error(`File size ${file.size} exceeds maximum ${API_CONFIG.MAX_FILE_SIZE}`);
    return false;
  }
  
  // Check file type
  if (!API_CONFIG.SUPPORTED_FORMATS.includes(file.type)) {
    console.error(`File type ${file.type} not supported`);
    return false;
  }
  
  return true;
};