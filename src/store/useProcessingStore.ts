import { create } from 'zustand';
import { validateImageDimensions } from '@/lib/imageValidator';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { executeAiBackgroundRemoval } from '@/lib/aiRemovalEngine';
import { useAuthStore } from './useAuthStore';

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
  processingStep: string;
  error: string | null;
  dimensions: { width: number; height: number; aspectRatio: number } | null;
  jobId: string | null;
  abortController: AbortController | null;

  // Actions
  setFile: (file: File) => Promise<boolean>;
  setSampleImage: (url: string, name: string) => Promise<void>;
  startUploadAndProcess: () => Promise<void>;
  cancelOperation: () => void;
  dismissError: () => void;
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
  processingStep: 'Initializing...',
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
    const currentProcessed = get().processedUrl;
    if (currentProcessed && currentProcessed.startsWith('blob:')) {
      URL.revokeObjectURL(currentProcessed);
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
      const file = new File([blob], 'sample-image.jpg', { type: blob.type || 'image/jpeg' });
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
      uploadProgress: 10,
      processingStep: 'Uploading photo...',
      error: null,
      abortController: controller,
    });

    // 1. Upload to Cloudinary (ephemeral storage)
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
      processingProgress: 20,
      processingStep: 'Running neural AI segmentation...',
    });

    // 2. Run Real Neural AI Background Removal Engine
    const userId = useAuthStore.getState().user?.id;

    const aiRes = await executeAiBackgroundRemoval(file, {
      signal: controller.signal,
      userId,
      onProgress: (pct, step) => {
        set({ processingProgress: pct, processingStep: step });
      },
    });

    if (!aiRes.success || !aiRes.processedImageUrl) {
      set({
        status: 'error',
        error: aiRes.error || 'AI background removal failed. Please try again.',
        abortController: null,
      });
      return;
    }

    set({
      processedUrl: aiRes.processedImageUrl,
      jobId: `job_${Date.now()}`,
      status: 'completed',
      processingProgress: 100,
      processingStep: 'Done!',
      abortController: null,
    });
  },

  cancelOperation: () => {
    const { abortController, previewUrl, processedUrl } = get();
    if (abortController) {
      abortController.abort();
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    if (processedUrl && processedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(processedUrl);
    }
    set({
      file: null,
      previewUrl: null,
      uploadedUrl: null,
      processedUrl: null,
      status: 'idle',
      error: null,
      uploadProgress: 0,
      processingProgress: 0,
      abortController: null,
    });
  },

  dismissError: () => {
    set({ error: null });
  },

  resetStudio: () => {
    const { previewUrl, processedUrl, abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    if (processedUrl && processedUrl.startsWith('blob:')) {
      URL.revokeObjectURL(processedUrl);
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
