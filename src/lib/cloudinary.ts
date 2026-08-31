export interface UploadProgressCallback {
  (percentage: number): void;
}

export interface UploadResult {
  success: boolean;
  secureUrl?: string;
  publicId?: string;
  bytes?: number;
  width?: number;
  height?: number;
  format?: string;
  error?: string;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Uploads an image to Cloudinary using direct unsigned/signed client upload with progress tracking.
 * Falls back seamlessly to simulated progress for local offline development if credentials are empty.
 */
export function uploadImageToCloudinary(
  file: File,
  onProgress?: UploadProgressCallback,
  signal?: AbortSignal
): Promise<UploadResult> {
  return new Promise((resolve) => {
    // Graceful fallback for demo/development when Cloudinary env vars are pending
    if (!isCloudinaryConfigured) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (signal?.aborted) {
          clearInterval(interval);
          resolve({ success: false, error: 'Upload cancelled by user.' });
          return;
        }

        currentProgress += 20;
        if (onProgress) onProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(interval);
          // Return local object URL for previewing
          const localUrl = URL.createObjectURL(file);
          resolve({
            success: true,
            secureUrl: localUrl,
            publicId: `local_demo_${Date.now()}`,
            bytes: file.size,
            format: file.type.split('/')[1] || 'png',
          });
        }
      }, 150);
      return;
    }

    const xhr = new XMLHttpRequest();
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'snapcut_temp_uploads');
    formData.append('tags', 'ephemeral_24h');

    // Handle AbortSignal cancellation
    if (signal) {
      signal.addEventListener('abort', () => {
        xhr.abort();
        resolve({ success: false, error: 'Upload cancelled by user.' });
      });
    }

    // Live upload progress tracking
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve({
            success: true,
            secureUrl: response.secure_url,
            publicId: response.public_id,
            bytes: response.bytes,
            width: response.width,
            height: response.height,
            format: response.format,
          });
        } catch {
          resolve({
            success: false,
            error: 'Failed to parse upload provider response.',
          });
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          resolve({
            success: false,
            error: err.error?.message || `Upload failed with status ${xhr.status}.`,
          });
        } catch {
          resolve({
            success: false,
            error: `Upload failed with HTTP ${xhr.status}.`,
          });
        }
      }
    };

    xhr.onerror = () => {
      resolve({
        success: false,
        error: 'Network connection failed during image upload.',
      });
    };

    xhr.ontimeout = () => {
      resolve({
        success: false,
        error: 'Image upload timed out after 30 seconds.',
      });
    };

    xhr.open('POST', endpoint, true);
    xhr.timeout = 30000;
    xhr.send(formData);
  });
}
