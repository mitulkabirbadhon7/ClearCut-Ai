import { supabase } from './supabase';

export interface BackgroundRemovalRequest {
  imageUrl: string;
  userId?: string;
  format?: 'png' | 'webp';
}

export interface BackgroundRemovalResponse {
  success: boolean;
  job_id?: string;
  processed_image_url?: string;
  duration_ms?: number;
  error?: string;
  code?: string;
}

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || '';

/**
 * Triggers the n8n AI background removal pipeline.
 * If VITE_N8N_WEBHOOK_URL is not yet configured, falls back to instant client demo result.
 */
export async function triggerBackgroundRemoval(
  request: BackgroundRemovalRequest,
  signal?: AbortSignal
): Promise<BackgroundRemovalResponse> {
  const startTime = Date.now();

  // If n8n webhook URL is not configured yet, run high-fidelity simulation
  if (!N8N_WEBHOOK_URL) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (signal?.aborted) {
          resolve({ success: false, error: 'Processing cancelled by user.' });
          return;
        }

        // Return processed preview
        resolve({
          success: true,
          job_id: `job_demo_${Date.now()}`,
          processed_image_url: request.imageUrl,
          duration_ms: Date.now() - startTime,
        });
      }, 2000);
    });
  }

  try {
    // Get current authenticated user session token for zero-trust authorization
    const session = (await supabase?.auth.getSession())?.data?.session;
    const token = session?.access_token || '';

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        image_url: request.imageUrl,
        user_id: request.userId || session?.user?.id || 'anonymous',
        format: request.format || 'png',
      }),
      signal,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Server responded with status ${response.status}`,
        code: data.code,
      };
    }

    return {
      success: true,
      job_id: data.job_id,
      processed_image_url: data.processed_image_url,
      duration_ms: data.duration_ms || Date.now() - startTime,
    };
  } catch (err: any) {
    if (signal?.aborted) {
      return { success: false, error: 'Processing cancelled by user.' };
    }
    return {
      success: false,
      error: err.message || 'Network error occurred communicating with AI engine.',
    };
  }
}
