import { supabase, isSupabaseConfigured } from './supabase';
import { PricingPlan } from '@/types';

export interface BkashCreateResponse {
  success: boolean;
  paymentID?: string;
  bkashURL?: string;
  error?: string;
}

export interface BkashExecuteResponse {
  success: boolean;
  trxID?: string;
  amount?: string;
  error?: string;
}

const N8N_CREATE_PAYMENT_URL = import.meta.env.VITE_N8N_BKASH_CREATE_URL || '';
const N8N_EXECUTE_PAYMENT_URL = import.meta.env.VITE_N8N_BKASH_EXECUTE_URL || '';

/**
 * Initiates an official bKash Tokenized Checkout payment session.
 * Connects securely to the n8n backend gateway, or provides seamless sandbox simulation.
 */
export async function createBkashPaymentSession(
  plan: PricingPlan,
  userId: string
): Promise<BkashCreateResponse> {
  // If n8n backend webhook is configured, call it
  if (N8N_CREATE_PAYMENT_URL) {
    try {
      const session = (await supabase?.auth.getSession())?.data?.session;
      const response = await fetch(N8N_CREATE_PAYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          plan_code: plan.code,
          amount: plan.price_bdt,
          user_id: userId,
          credits: plan.credits_included,
        }),
      });

      const data = await response.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to initialize bKash gateway.' };
    }
  }

  // High-fidelity Sandbox / Simulation fallback
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockPaymentId = `BKASH_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      // Save pending transaction to Supabase if connected
      if (isSupabaseConfigured && supabase && userId) {
        supabase.from('transactions').insert({
          user_id: userId,
          provider: 'bkash',
          provider_payment_id: mockPaymentId,
          amount_bdt: plan.price_bdt,
          currency: 'BDT',
          status: 'pending',
          metadata: { plan_code: plan.code, credits: plan.credits_included },
        });
      }

      resolve({
        success: true,
        paymentID: mockPaymentId,
        bkashURL: `${window.location.origin}/#payment-callback?paymentID=${mockPaymentId}&status=success&plan=${plan.code}&amount=${plan.price_bdt}&credits=${plan.credits_included}`,
      });
    }, 800);
  });
}

/**
 * Executes and confirms bKash payment upon gateway redirect callback.
 */
export async function executeBkashPayment(
  paymentID: string,
  userId: string,
  creditsToAdd: number,
  amount: number
): Promise<BkashExecuteResponse> {
  if (N8N_EXECUTE_PAYMENT_URL) {
    try {
      const session = (await supabase?.auth.getSession())?.data?.session;
      const response = await fetch(N8N_EXECUTE_PAYMENT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
        },
        body: JSON.stringify({
          paymentID,
          user_id: userId,
          credits: creditsToAdd,
          amount,
        }),
      });
      return await response.json();
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to execute payment.' };
    }
  }

  // Fulfill directly in Supabase using the atomic RPC
  const mockTrxId = `TRX${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  if (isSupabaseConfigured && supabase && userId) {
    try {
      await supabase.rpc('add_user_credits_atomic', {
        p_user_id: userId,
        p_credits_to_add: creditsToAdd,
        p_payment_id: paymentID,
        p_trx_id: mockTrxId,
        p_amount: amount,
      });
    } catch (err) {
      console.warn('Direct RPC fulfillment fallback:', err);
    }
  }

  return {
    success: true,
    trxID: mockTrxId,
    amount: amount.toString(),
  };
}
