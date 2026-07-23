import { supabase } from './supabaseClient';

export interface CustomerAddressRecord {
  id?: string;
  user_id: string;
  recipient_name: string;
  phone: string;
  address: string;
  is_default?: boolean;
  created_at?: string;
}

/**
 * Save or update customer shipping address mapped to customer ID (email)
 */
export async function saveCustomerAddress(record: CustomerAddressRecord): Promise<{ success: boolean; data?: any }> {
  if (!record.user_id || !record.address) {
    return { success: false };
  }

  const cleanUserId = record.user_id.toLowerCase().trim();

  // 1. Save to Supabase customer_addresses table
  try {
    const { data, error } = await supabase
      .from('customer_addresses')
      .insert([{
        user_id: cleanUserId,
        recipient_name: record.recipient_name,
        phone: record.phone,
        address: record.address,
        is_default: record.is_default ?? true,
      }])
      .select();

    if (error) {
      console.warn('Supabase customer address save warning:', error.message);
    }
  } catch (e) {
    console.error('Error inserting customer address to Supabase:', e);
  }

  // 2. Save to localStorage with Customer ID Key
  const storageKey = `customer_saved_address_${cleanUserId}`;
  const addressData = {
    ...record,
    user_id: cleanUserId,
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(storageKey, JSON.stringify(addressData));

  return { success: true, data: addressData };
}

/**
 * Retrieve saved shipping address mapped to Customer ID (email)
 */
export function getCustomerSavedAddress(userIdOrEmail: string): CustomerAddressRecord | null {
  if (!userIdOrEmail) return null;
  const cleanKey = userIdOrEmail.toLowerCase().trim();
  const saved = localStorage.getItem(`customer_saved_address_${cleanKey}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
}
