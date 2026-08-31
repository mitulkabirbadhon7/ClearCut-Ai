export interface ValidationResult {
  isValid: boolean;
  error?: string;
  dimensions?: {
    width: number;
    height: number;
    aspectRatio: number;
  };
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_DIMENSION_PX = 6000; // 6000x6000px

/**
 * Validates file MIME type and size limit
 */
export function validateFileBasics(file: File): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'No file selected.' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file format (${file.type || 'unknown'}). Please upload JPG, PNG, or WEBP.`,
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size (${sizeMb} MB) exceeds the maximum limit of 10 MB.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The selected file is empty (0 bytes).',
    };
  }

  return { isValid: true };
}

/**
 * Validates image dimensions and loads aspect ratio metadata
 */
export async function validateImageDimensions(file: File): Promise<ValidationResult> {
  const basic = validateFileBasics(file);
  if (!basic.isValid) {
    return basic;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      if (width < 32 || height < 32) {
        resolve({
          isValid: false,
          error: 'Image is too small. Minimum resolution is 32×32 pixels.',
        });
        return;
      }

      if (width > MAX_DIMENSION_PX || height > MAX_DIMENSION_PX) {
        resolve({
          isValid: false,
          error: `Image resolution (${width}×${height}) exceeds maximum supported resolution of ${MAX_DIMENSION_PX}×${MAX_DIMENSION_PX}px.`,
        });
        return;
      }

      resolve({
        isValid: true,
        dimensions: {
          width,
          height,
          aspectRatio: Number((width / height).toFixed(2)),
        },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({
        isValid: false,
        error: 'Unable to decode image. File may be corrupted.',
      });
    };

    img.src = objectUrl;
  });
}
