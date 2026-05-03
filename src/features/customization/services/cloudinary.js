/**
 * Cloudinary Upload Service
 * Handles uploading images to Cloudinary using a signed/unsigned preset.
 * Includes retry logic and timeout handling.
 */

const CLOUD_NAME = 'dmwnbtflg';
const UPLOAD_PRESET = 'Codedclothing';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
const UPLOAD_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 2;

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

  if (!file) {
    console.error('Error: No file provided');
    throw new Error('No file provided for upload');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  console.log('FormData Content:');
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value instanceof File ? `File (${value.name})` : value);
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT);

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();
    console.log('Cloudinary Response:', data);

    if (!response.ok) {
      console.error('Cloudinary Upload Failed:', {
        status: response.status,
        statusText: response.statusText,
        error: data.error
      });

      // Retry on network/server errors (5xx), not on client errors (4xx)
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        console.log(`Retrying upload (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
        return uploadImage(file, retryCount + 1);
      }

      throw new Error(data.error?.message || 'Failed to upload image to Cloudinary');
    }

    if (!data.secure_url) {
      throw new Error('Upload successful but no URL returned');
    }

    console.log('Upload Successful! Secure URL:', data.secure_url);
    console.log('--- Cloudinary Upload End ---');
    
    return data.secure_url;
  } catch (error) {
    // Handle timeout
    if (error.name === 'AbortError') {
      console.error('Upload timeout after 30 seconds');
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying upload (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadImage(file, retryCount + 1);
      }
      throw new Error('Upload timeout. Please try again.');
    }

    // Network error
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.error('Network error during upload:', error.message);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying upload (${retryCount + 1}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadImage(file, retryCount + 1);
      }
      throw new Error('Network error. Please check your connection and try again.');
    }

    console.error('Exception during Cloudinary upload:', error.message);
    throw error;
  }
};
