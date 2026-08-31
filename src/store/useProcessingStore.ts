import { create } from 'zustand';
import { validateImageDimensions } from '@/lib/imageValidator';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { triggerBackgroundRemoval } from '@/lib/api';

export type ProcessingStatus =
  | 'idle'
  | 'validating'
  | 'uploading'
  | 'processing'
  | 'completed'
  | 'error';

interface ProcessingState {
  file: File | null;
  previewUrl: string | null;
  uploadedUrl: string | null;
  processedUrl: string | null;
  status: ProcessingStatus;
  uploadProgress: number;
  processingProgress: number;
  error: string | null;
  dimensions: { width: number; height: number; aspectRatio: number } | null;
  jobId: string | null;
  abortController: AbortController | null;

  // Actions
  setFile: (file: File) => Promise<boolean>;
  setSampleImage: (url: string, name: string) => Promise<void>;
  startUploadAndProcess: () => Promise<void>;
  cancelOperation: () => void;
  resetStudio: () => void;
  setProcessedUrl: (url: string) => void;
}

export const useProcessingStore = create<ProcessingState>((set, get) => ({
  file: null,
  previewUrl: null,
  uploadedUrl: null,
  processedUrl: null,
  status: 'idle',
  uploadProgress: 0,
  processingProgress: 0,
  error: null,
  dimensions: null,
  jobId: null,
  abortController: null,

  setFile: async (file: File) => {
    // Revoke existing object URL to prevent memory leaks
    const currentPreview = get().previewUrl;
    if (currentPreview && currentPreview.startsWith('blob:')) {
      URL.revokeObjectURL(currentPreview);
    }

    set({
      file,
      status: 'validating',
      error: null,
      uploadProgress: 0,
      processingProgress: 0,
      processedUrl: null,
      uploadedUrl: null,
    });

    const validation = await validateImageDimensions(file);
    if (!validation.isValid) {
      set({
        status: 'error',
        error: validation.error || 'Invalid image file.',
        file: null,
        previewUrl: null,
      });
      return false;
    }

    const objectUrl = URL.createObjectURL(file);
    set({
      file,
      previewUrl: objectUrl,
      dimensions: validation.dimensions || null,
      status: 'idle',
      error: null,
    });

    return true;
  },

  setSampleImage: async (url: string, _name: string) => {
    try {
      set({ status: 'validating', error: null });
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], 'sample-image.png', { type: blob.type || 'image/png' });
      await get().setFile(file);
    } catch {
      set({
        status: 'error',
        error: 'Failed to load sample image. Please try uploading your own photo.',
      });
    }
  },

  startUploadAndProcess: async () => {
    const { file, status } = get();
    if (!file || status === 'uploading' || status === 'processing') return;

    const controller = new AbortController();
    set({
      status: 'uploading',
      uploadProgress: 5,
      error: null,
      abortController: controller,
    });

    const uploadRes = await uploadImageToCloudinary(
      file,
      (progress) => set({ uploadProgress: progress }),
      controller.signal
    );

    if (!uploadRes.success || !uploadRes.secureUrl) {
      set({
        status: 'error',
        error: uploadRes.error || 'Failed to upload image.',
        abortController: null,
      });
      return;
    }

    set({
      uploadedUrl: uploadRes.secureUrl,
      status: 'processing',
      uploadProgress: 100,
      processingProgress: 30,
    });

    const aiRes = await triggerBackgroundRemoval(
      {
        imageUrl: uploadRes.secureUrl,
      },
      controller.signal
    );

    if (!aiRes.success || !aiRes.processed_image_url) {
      set({
        status: 'error',
        error: aiRes.error || 'AI background removal failed. Please try again.',
        abortController: null,
      });
      return;
    }

    set({
      processedUrl: aiRes.processed_image_url,
      jobId: aiRes.job_id || null,
      status: 'completed',
      processingProgress: 100,
      abortController: null,
    });
  },

  cancelOperation: () => {
    const { abortController, previewUrl } = get();
    if (abortController) {
      abortController.abort();
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    set({
      status: 'idle',
      error: 'Operation cancelled.',
      uploadProgress: 0,
      processingProgress: 0,
      abortController: null,
    });
  },

  resetStudio: () => {
    const { previewUrl, abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    set({
      file: null,
      previewUrl: null,
      uploadedUrl: null,
      processedUrl: null,
      status: 'idle',
      uploadProgress: 0,
      processingProgress: 0,
      error: null,
      dimensions: null,
      jobId: null,
      abortController: null,
    });
  },

  setProcessedUrl: (url: string) => {
    set({
      processedUrl: url,
      status: 'completed',
      processingProgress: 100,
    });
  },
}));
