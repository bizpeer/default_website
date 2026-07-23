import { supabase } from '../lib/supabaseClient';

export interface MembershipPolicy {
  silverOrderThreshold: number; // e.g. 1 order to become Silver
  goldOrderThreshold: number;   // e.g. 2 additional orders (total 3) to become Gold VIP
  silverBonusPoints: number;    // Points rewarded when upgraded to Silver
  goldBonusPoints: number;      // Points rewarded when upgraded to Gold VIP
}

export const defaultMembershipPolicy: MembershipPolicy = {
  silverOrderThreshold: 1,
  goldOrderThreshold: 3,
  silverBonusPoints: 3000,
  goldBonusPoints: 10000,
};

/**
 * Load Membership Policy from localStorage / DB
 */
export function getMembershipPolicy(): MembershipPolicy {
  const saved = localStorage.getItem('membership_policy_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return defaultMembershipPolicy;
    }
  }
  return defaultMembershipPolicy;
}

/**
 * Save Membership Policy
 */
export function saveMembershipPolicy(policy: MembershipPolicy): void {
  localStorage.setItem('membership_policy_config', JSON.stringify(policy));
}

/**
 * Calculate appropriate tier based on completed orders count
 */
export function calculateTierForOrders(completedOrderCount: number, policy: MembershipPolicy = getMembershipPolicy()): 'GOLD VIP' | 'SILVER' | 'BRONZE' {
  if (completedOrderCount >= policy.goldOrderThreshold) {
    return 'GOLD VIP';
  }
  if (completedOrderCount >= policy.silverOrderThreshold) {
    return 'SILVER';
  }
  return 'BRONZE';
}

/**
 * Automatically update customer membership tier and process backend sync when an order completes
 */
export async function updateCustomerTierOnOrder(customerEmail: string): Promise<{ upgraded: boolean; newTier?: string; bonusPoints?: number }> {
  try {
    const policy = getMembershipPolicy();

    // 1. Get completed orders count for customer
    const savedOrdersStr = localStorage.getItem('shop_orders') || '[]';
    const allOrders = JSON.parse(savedOrdersStr);
    const completedOrders = allOrders.filter(
      (o: any) => o.customerEmail.toLowerCase() === customerEmail.toLowerCase() && o.status !== '주문취소'
    );
    const orderCount = completedOrders.length;

    const calculatedTier = calculateTierForOrders(orderCount, policy);

    // 2. Fetch current user state
    const savedMembersStr = localStorage.getItem('customer_members_db') || '[]';
    const members = JSON.parse(savedMembersStr);
    const memberIndex = members.findIndex((m: any) => m.email.toLowerCase() === customerEmail.toLowerCase());

    if (memberIndex !== -1) {
      const currentTier = members[memberIndex].membershipTier || 'BRONZE';

      if (currentTier !== calculatedTier) {
        // Upgraded!
        let bonus = 0;
        if (calculatedTier === 'GOLD VIP') bonus = policy.goldBonusPoints;
        else if (calculatedTier === 'SILVER') bonus = policy.silverBonusPoints;

        members[memberIndex].membershipTier = calculatedTier;
        members[memberIndex].points = (members[memberIndex].points || 0) + bonus;

        localStorage.setItem('customer_members_db', JSON.stringify(members));

        // Update active session if logged in
        const currentSessionStr = localStorage.getItem('customer_logged_in_user');
        if (currentSessionStr) {
          const session = JSON.parse(currentSessionStr);
          if (session.email.toLowerCase() === customerEmail.toLowerCase()) {
            session.membershipTier = calculatedTier;
            session.points = (session.points || 0) + bonus;
            localStorage.setItem('customer_logged_in_user', JSON.stringify(session));
          }
        }

        // Update Supabase DB
        try {
          await supabase
            .from('customer_users')
            .update({
              membership_tier: calculatedTier,
              points: members[memberIndex].points,
            })
            .eq('email', customerEmail);
        } catch (dbErr) {
          console.warn('Supabase tier sync warning:', dbErr);
        }

        return { upgraded: true, newTier: calculatedTier, bonusPoints: bonus };
      }
    }
    return { upgraded: false };
  } catch (err) {
    console.error('Failed to update customer tier:', err);
    return { upgraded: false };
  }
}
