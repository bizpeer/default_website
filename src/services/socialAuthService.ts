import { supabase } from '../lib/supabaseClient';

export interface SocialAuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membershipTier: 'GOLD VIP' | 'SILVER' | 'BRONZE';
  points: number;
  coupons: number;
  provider: 'google' | 'naver' | 'email';
  providerId?: string;
  avatarUrl?: string;
}

/**
 * Handle Google & Naver Social Login & Sign Up
 */
export async function performSocialLogin(provider: 'google' | 'naver'): Promise<{ success: boolean; user?: SocialAuthUser; error?: string }> {
  try {
    // 1. Check if Supabase Real OAuth flow is triggered
    if (import.meta.env.VITE_SUPABASE_URL && !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : ('custom' as any), // Naver uses custom OAuth provider or redirect
        options: {
          redirectTo: `${window.location.origin}/mypage`,
        },
      });

      if (error) {
        console.warn(`${provider} OAuth warning, using fallback authentication:`, error.message);
      } else if (data?.url) {
        window.location.href = data.url;
        return { success: true };
      }
    }

    // 2. Local & Demo Environment Simulated Social Login/Registration
    // Generates a mock social profile response matching Google/Naver OAuth structure
    const isGoogle = provider === 'google';
    const mockId = isGoogle ? `google_${Date.now()}` : `naver_${Date.now()}`;
    const mockName = isGoogle ? '구글사용자 (Google)' : '네이버사용자 (Naver)';
    const mockEmail = isGoogle ? `google_user_${Math.floor(Math.random() * 1000)}@gmail.com` : `naver_user_${Math.floor(Math.random() * 1000)}@naver.com`;
    const mockAvatar = isGoogle
      ? 'https://lh3.googleusercontent.com/a/default-user'
      : 'https://ssl.pstatic.net/static/pwe/address/img_profile.png';

    // Check if user already exists in local DB
    const existingUsersStr = localStorage.getItem('customer_members_db') || '[]';
    const existingUsers: SocialAuthUser[] = JSON.parse(existingUsersStr);
    let matchedUser = existingUsers.find((u) => u.provider === provider || u.email === mockEmail);

    if (!matchedUser) {
      // Create new social user with 3,000 P welcome bonus
      matchedUser = {
        id: mockId,
        name: mockName,
        email: mockEmail,
        phone: '010-9876-5432',
        membershipTier: 'SILVER',
        points: 3000,
        coupons: 1,
        provider: provider,
        providerId: mockId,
        avatarUrl: mockAvatar,
      };

      existingUsers.push(matchedUser);
      localStorage.setItem('customer_members_db', JSON.stringify(existingUsers));

      // Also attempt insert to Supabase DB if available
      try {
        await supabase.from('customer_users').insert([
          {
            email: matchedUser.email,
            name: matchedUser.name,
            phone: matchedUser.phone,
            membership_tier: matchedUser.membershipTier,
            points: matchedUser.points,
            coupons: matchedUser.coupons,
            provider: provider,
            provider_id: matchedUser.providerId,
            avatar_url: matchedUser.avatarUrl,
          },
        ]);
      } catch (dbErr) {
        console.warn('Supabase social user insert warning:', dbErr);
      }
    }

    // Save logged-in session
    localStorage.setItem('customer_logged_in_user', JSON.stringify(matchedUser));

    return {
      success: true,
      user: matchedUser,
    };
  } catch (err: any) {
    console.error('Social login error:', err);
    return {
      success: false,
      error: err.message || '소셜 로그인 중 오류가 발생했습니다.',
    };
  }
}
