import { removeBackground } from '@imgly/background-removal';
import { supabase, isSupabaseConfigured } from './supabase';
import { uploadImageToCloudinary, isCloudinaryConfigured } from './cloudinary';

export interface AiRemovalOptions {
  onProgress?: (percent: number, step: string) => void;
  signal?: AbortSignal;
  userId?: string;
}

export interface AiRemovalResult {
  success: boolean;
  processedImageUrl?: string;
  blob?: Blob;
  durationMs?: number;
  error?: string;
}

/**
 * Converts a Blob to a persistent base64 data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

/**
 * Executes real AI neural background removal.
 * Uses in-browser deep-learning segmentation (@imgly/background-removal)
 * with high-speed CDN model weights and monotonic progress telemetry.
 */
export async function executeAiBackgroundRemoval(
  imageSource: File | Blob | string,
  options?: AiRemovalOptions
): Promise<AiRemovalResult> {
  const startTime = Date.now();
  let maxReportedPct = 10;

  try {
    if (options?.onProgress) {
      options.onProgress(10, 'Initializing neural network...');
    }

    const progressHandler = (key: string, current: number, total: number) => {
      if (options?.signal?.aborted) return;
      if (total > 0 && options?.onProgress) {
        const ratio = Math.min(Math.max(current / total, 0), 1);
        let calculatedPct = 15;
        let stepName = 'Extracting foreground subject...';

        if (key.includes('fetch') || key.includes('download')) {
          // Model downloading phase: 15% -> 50%
          calculatedPct = Math.round(15 + ratio * 35);
          stepName = 'Loading neural model weights...';
        } else if (key.includes('compute') || key.includes('inference')) {
          // Neural inference execution phase: 50% -> 92%
          calculatedPct = Math.round(50 + ratio * 42);
          stepName = 'Extracting foreground subject...';
        } else {
          calculatedPct = Math.round(20 + ratio * 70);
          stepName = 'Removing background artifacts...';
        }

        // Monotonic progress guarantee: never jump backward
        if (calculatedPct > maxReportedPct) {
          maxReportedPct = Math.min(calculatedPct, 95);
          options.onProgress(maxReportedPct, stepName);
        }
      }
    };

    let blob: Blob;

    try {
      // Primary fast model loader with high-availability CDN
      blob = await removeBackground(imageSource, {
        publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
        model: 'isnet_fp16',
        progress: progressHandler,
      });
    } catch (primaryErr) {
      console.warn('Primary model loader notice, trying fallback CDN:', primaryErr);
      // Secondary fallback CDN (jsdelivr)
      blob = await removeBackground(imageSource, {
        publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/',
        model: 'isnet_fp16',
        progress: progressHandler,
      });
    }

    if (options?.signal?.aborted) {
      return { success: false, error: 'Processing cancelled by user.' };
    }

    if (options?.onProgress) {
      options.onProgress(98, 'Finalizing transparent PNG cutout...');
    }

    const durationMs = Date.now() - startTime;
    let processedImageUrl = URL.createObjectURL(blob);

    // Upload to Cloudinary for permanent 24h HTTPS storage if configured
    if (isCloudinaryConfigured) {
      try {
        const cutoutFile = new File([blob], `cutout_${Date.now()}.png`, { type: 'image/png' });
        const uploadRes = await uploadImageToCloudinary(cutoutFile);
        if (uploadRes.success && uploadRes.secureUrl && !uploadRes.isFallback) {
          processedImageUrl = uploadRes.secureUrl;
        }
      } catch (uploadErr) {
        console.warn('Cloudinary cutout sync fallback:', uploadErr);
      }
    } else {
      // Base64 data URL for offline reload persistence
      try {
        const dataUrl = await blobToDataUrl(blob);
        if (dataUrl.length < 3000000) {
          processedImageUrl = dataUrl;
        }
      } catch {
        // use blob url
      }
    }

    if (options?.onProgress) {
      options.onProgress(100, 'Rendering transparent PNG...');
    }

    // If Supabase is connected and user is logged in, record job in database & deduct credit
    if (isSupabaseConfigured && supabase && options?.userId && options.userId !== 'anonymous') {
      try {
        await supabase.rpc('deduct_user_credit', { p_user_id: options.userId });
        await supabase.from('processing_jobs').insert({
          user_id: options.userId,
          status: 'completed',
          duration_ms: durationMs,
          processed_image_url: processedImageUrl,
        });
      } catch (dbErr) {
        console.warn('Database record update non-fatal:', dbErr);
      }
    }

    return {
      success: true,
      processedImageUrl,
      blob,
      durationMs,
    };
  } catch (err: any) {
    console.error('AI background removal failed:', err);
    return {
      success: false,
      error: err?.message || 'Failed to remove background from image.',
    };
  }
}
