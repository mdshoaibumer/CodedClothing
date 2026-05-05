/**
 * Cloudinary Upload Service
 * Handles uploading images to Cloudinary using a signed/unsigned preset.
 * Includes retry logic, timeout handling, and comprehensive error management.
 */

// Environment variables with fallbacks for development
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dmwnbtflg';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Codedclothing';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const UPLOAD_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

/**
 * Validates file before upload
 * @param {File} file - The image file to validate
 * @throws {Error} If validation fails
 */
const validateFile = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  // Check file size
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error(`File too large. Maximum size is 5MB (your file: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: PNG, JPG, WebP, GIF (your file: ${file.type || 'unknown'})`);
  }

  // Check if it's actually an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File is not a valid image');
  }
};

/**
 * Compresses image if too large
 * @param {File} file - The image file
 * @returns {Promise<File>} Compressed file or original if small enough
 */
const compressImage = async (file) => {
  // If file is under 2MB, don't compress
  if (file.size < 2 * 1024 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions (max 1920px on longest side)
      const maxDimension = 1920;
      let { width, height } = img;

      if (width > height) {
        if (width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        },
        file.type,
        0.85 // 85% quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Uploads an image file to Cloudinary with retry logic.
 * 
 * @param {File} file - The image file to upload.
 * @param {number} retryCount - Current retry count (internal use).
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 * @throws {Error} - If the upload fails after retries or times out.
 */
export const uploadImage = async (file, retryCount = 0) => {
  console.log(`--- Cloudinary Upload Start (Attempt ${retryCount + 1}/${MAX_RETRIES + 1}) ---`);
  console.log('File Name:', file.name);
  console.log('File Size:', (file.size / 1024).toFixed(2), 'KB');

  try {
    // Validate file
    validateFile(file);

    // Compress if necessary
    const processedFile = await compressImage(file);
    console.log('Processed File Size:', (processedFile.size / 1024).toFixed(2), 'KB');

    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('upload_preset', UPLOAD_PRESET);

    console.log('FormData Content:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File (${value.name})` : value);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Upload failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    console.log('Upload successful:', data.secure_url);

    return data.secure_url;

  } catch (error) {
    console.error('Upload error:', error);

    // Handle specific error types
    if (error.name === 'AbortError') {
      throw new Error('Upload timed out. Please check your connection and try again.');
    }

    if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    // Retry logic for transient errors
    if (retryCount < MAX_RETRIES && (
      error.message.includes('timeout') ||
      error.message.includes('network') ||
      error.message.includes('500') ||
      error.message.includes('502') ||
      error.message.includes('503')
    )) {
      console.log(`Retrying upload in ${2 ** retryCount} seconds...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** retryCount)));
      return uploadImage(file, retryCount + 1);
    }

    // Re-throw with user-friendly message
    throw new Error(error.message || 'Upload failed. Please try again.');
  }
};
