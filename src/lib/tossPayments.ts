import { supabase } from './supabaseClient';

export interface TossPaymentRecord {
  id?: string;
  order_id: string;
  user_id?: string;
  pg: string;
  payment_key?: string;
  transaction_id?: string;
  amount: number;
  vat: number;
  status: 'READY' | 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
  method: string;
  approved_at?: string;
  cancelled_at?: string;
  refunded_amount?: number;
  created_at?: string;
}

export interface TossPaymentsConfig {
  isEnabled: boolean;
  clientKey: string;
  secretKey: string;
  mid: string;
  defaultMethod: string;
  isTestMode: boolean;
}

export const defaultTossConfig: TossPaymentsConfig = {
  isEnabled: true,
  clientKey: 'test_ck_D5b3Mad8W6wNHad49zVQg2bRib5E', // Official TossPayments Test Client Key
  secretKey: 'test_sk_zXLk5nqw3064W22XM983neDM1awcd',
  mid: '조선미녀 공식 가맹점',
  defaultMethod: '카드',
  isTestMode: true,
};

export function getTossPaymentsConfig(): TossPaymentsConfig {
  const saved = localStorage.getItem('toss_payments_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultTossConfig;
    }
  }
  return defaultTossConfig;
}

export function saveTossPaymentsConfig(config: TossPaymentsConfig): void {
  localStorage.setItem('toss_payments_config', JSON.stringify(config));
}

/**
 * Save Payment Record to Supabase 'payments' table (13 fields) with localStorage fallback
 */
export async function savePaymentRecord(record: TossPaymentRecord): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // 1. Save to Supabase DB if available
    const { data, error } = await supabase
      .from('payments')
      .insert([record])
      .select();

    if (error) {
      console.warn('Supabase payments insert warning (using local fallback):', error.message);
    }

    // 2. Save to localStorage fallback array
    const savedPaymentsStr = localStorage.getItem('payment_transactions') || '[]';
    const localPayments = JSON.parse(savedPaymentsStr);
    const newRecord = {
      ...record,
      id: record.id || `PAY-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      created_at: record.created_at || new Date().toISOString(),
    };
    localPayments.unshift(newRecord);
    localStorage.setItem('payment_transactions', JSON.stringify(localPayments));

    return { success: true, data: data?.[0] || newRecord };
  } catch (e: any) {
    console.error('Failed to save payment record:', e);
    return { success: false, error: e.message || 'Unknown payment save error' };
  }
}

/**
 * Cancel Payment Record & PG Refund in Supabase 'payments' table and localStorage
 */
export async function cancelPaymentRecord(orderId: string, cancelReason: string = '고객 요청 주문취소'): Promise<{ success: boolean; data?: any; error?: string }> {
  const cancelledAt = new Date().toISOString();

  try {
    // 1. Update Supabase payments table
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'CANCELED',
        cancelled_at: cancelledAt,
      })
      .eq('order_id', orderId)
      .select();

    if (error) {
      console.warn('Supabase payments update warning (using local fallback):', error.message);
    }

    // 2. Update localStorage payment_transactions
    const savedPaymentsStr = localStorage.getItem('payment_transactions') || '[]';
    const localPayments: TossPaymentRecord[] = JSON.parse(savedPaymentsStr);
    const updatedPayments = localPayments.map((p) => {
      if (p.order_id === orderId) {
        return {
          ...p,
          status: 'CANCELED' as const,
          cancelled_at: cancelledAt,
          refunded_amount: p.amount,
        };
      }
      return p;
    });
    localStorage.setItem('payment_transactions', JSON.stringify(updatedPayments));

    return { success: true, data: data?.[0] || { orderId, status: 'CANCELED', cancelReason } };
  } catch (e: any) {
    console.error('Failed to cancel payment record:', e);
    return { success: false, error: e.message || 'Unknown payment cancellation error' };
  }
}

/**
 * Dynamic Toss Payments JS V1 Script Loader
 */
export function loadTossPaymentsSDK(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).TossPayments) {
      resolve((window as any).TossPayments);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.onload = () => {
      if ((window as any).TossPayments) {
        resolve((window as any).TossPayments);
      } else {
        reject(new Error('TossPayments SDK failed to load.'));
      }
    };
    script.onerror = () => reject(new Error('TossPayments SDK network error.'));
    document.body.appendChild(script);
  });
}
