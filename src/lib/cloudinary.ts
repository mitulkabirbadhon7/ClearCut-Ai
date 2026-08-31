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
  isFallback?: boolean;
}

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

/**
 * Uploads an image to Cloudinary using direct unsigned client upload with progress tracking.
 * Automatically falls back to local in-memory URL if upload preset is not yet created in Cloudinary,
 * ensuring AI background removal NEVER fails or blocks the user.
 */
export function uploadImageToCloudinary(
  file: File,
  onProgress?: UploadProgressCallback,
  signal?: AbortSignal
): Promise<UploadResult> {
  return new Promise((resolve) => {
    // Fast path: if Cloudinary is not configured or in local demo
    if (!isCloudinaryConfigured) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (signal?.aborted) {
          clearInterval(interval);
          resolve({ success: false, error: 'Upload cancelled by user.' });
          return;
        }

        currentProgress += 25;
        if (onProgress) onProgress(Math.min(currentProgress, 100));

        if (currentProgress >= 100) {
          clearInterval(interval);
          const localUrl = URL.createObjectURL(file);
          resolve({
            success: true,
            secureUrl: localUrl,
            publicId: `local_demo_${Date.now()}`,
            bytes: file.size,
            format: file.type.split('/')[1] || 'png',
            isFallback: true,
          });
        }
      }, 100);
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
          // Graceful fallback to local URL
          const localUrl = URL.createObjectURL(file);
          resolve({
            success: true,
            secureUrl: localUrl,
            isFallback: true,
          });
        }
      } else {
        // Preset not found or cloud config error: Fall back seamlessly to local object URL
        console.warn(`Cloudinary upload notice (Status ${xhr.status}): Falling back to in-browser AI processing.`);
        if (onProgress) onProgress(100);
        const localUrl = URL.createObjectURL(file);
        resolve({
          success: true,
          secureUrl: localUrl,
          isFallback: true,
        });
      }
    };

    xhr.onerror = () => {
      // Offline / Network fallback
      if (onProgress) onProgress(100);
      const localUrl = URL.createObjectURL(file);
      resolve({
        success: true,
        secureUrl: localUrl,
        isFallback: true,
      });
    };

    xhr.ontimeout = () => {
      if (onProgress) onProgress(100);
      const localUrl = URL.createObjectURL(file);
      resolve({
        success: true,
        secureUrl: localUrl,
        isFallback: true,
      });
    };

    xhr.open('POST', endpoint, true);
    xhr.timeout = 15000;
    xhr.send(formData);
  });
}
