import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/Input';
import { StaffUser, initialStaffUsers } from './UserManagement';

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function LoginPage() {
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Configurable Company / Brand Info loaded from Admin Site Management
  const [brandNameKo, setBrandNameKo] = useState('조선미녀');
  const [brandNameEn, setBrandNameEn] = useState('BEAUTY OF JOSEON');
  const [faviconUrl, setFaviconUrl] = useState('');

  useEffect(() => {
    const savedKo = localStorage.getItem('site_brand_name_ko');
    if (savedKo) setBrandNameKo(savedKo);

    const savedEn = localStorage.getItem('site_brand_name_en');
    if (savedEn) setBrandNameEn(savedEn);

    const savedFav = localStorage.getItem('site_favicon_url');
    if (savedFav) setFaviconUrl(savedFav);
  }, []);

  // Password reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const validatePasswordStrength = (pwd: string) => {
    // 6자리 이상, 영문, 숫자, 특수문자 조합
    const hasMinLength = pwd.length >= 6;
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
    return hasMinLength && hasLetter && hasNumber && hasSpecial;
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedId = userId.trim();
    if (!trimmedId) {
      setErrorMessage('아이디를 입력해주세요.');
      return;
    }

    // Load staff accounts from localStorage
    let staffList: StaffUser[] = initialStaffUsers;
    const savedStaff = localStorage.getItem('admin_staff_users');
    if (savedStaff) {
      try {
        staffList = JSON.parse(savedStaff);
      } catch (err) {
        staffList = initialStaffUsers;
      }
    }

    const foundUser = staffList.find((u) => u.id === trimmedId);
    if (!foundUser) {
      setErrorMessage('존재하지 않는 직원 또는 관리자 아이디입니다.');
      return;
    }

    const isPasswordChanged = localStorage.getItem(`isPasswordChanged_${foundUser.id}`) === 'true' || foundUser.isPasswordChanged;
    const storedHash = localStorage.getItem(`admin_password_hash_${foundUser.id}`) || foundUser.passwordHash;

    if (!isPasswordChanged) {
      // 최초 또는 임시 비밀번호 상태
      if (password === '!admin1004' || password === 'admin1004') {
        // 임시 비밀번호 로그인 성공 -> 강제 비밀번호 변경 모달 팝업
        setShowResetModal(true);
      } else {
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } else {
      // 비밀번호가 변경된 정식 상태 -> SHA-256 해시 검증
      const inputHash = await hashPassword(password);
      if (storedHash && inputHash === storedHash) {
        localStorage.setItem('admin_logged_in', 'true');
        localStorage.setItem('admin_logged_user_id', foundUser.id);
        localStorage.setItem('admin_logged_user_name', foundUser.name);
        localStorage.setItem('admin_logged_user_role', foundUser.role);
        localStorage.setItem('admin_logged_user_permissions', JSON.stringify(foundUser.permissions));
        navigate('/admin/dashboard');
      } else {
        setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    }
  };

  const handleForceResetSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!validatePasswordStrength(newPassword)) {
      setModalError('비밀번호는 6자리 이상의 영문, 숫자, 특수기호 조합이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setModalError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setIsSubmittingModal(true);
    try {
      const trimmedId = userId.trim() || 'siteadmin';
      const hashedPassword = await hashPassword(newPassword);

      // LocalStorage에 사용자별 해시값 및 변경 플래그 저장
      localStorage.setItem(`admin_password_hash_${trimmedId}`, hashedPassword);
      localStorage.setItem(`isPasswordChanged_${trimmedId}`, 'true');

      // Also update in admin_staff_users list if present
      const savedStaff = localStorage.getItem('admin_staff_users');
      let staffList: StaffUser[] = savedStaff ? JSON.parse(savedStaff) : initialStaffUsers;
      const foundUser = staffList.find((u) => u.id === trimmedId);

      const userPermissions = foundUser ? foundUser.permissions : {
        dashboard: true, site: true, content: true, products: true, shop: true, orders: true, customers: true, system: true
      };

      localStorage.setItem('admin_logged_in', 'true');
      localStorage.setItem('admin_logged_user_id', trimmedId);
      localStorage.setItem('admin_logged_user_name', foundUser ? foundUser.name : '최고 관리자');
      localStorage.setItem('admin_logged_user_role', foundUser ? foundUser.role : 'superadmin');
      localStorage.setItem('admin_logged_user_permissions', JSON.stringify(userPermissions));

      setShowResetModal(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setModalError('비밀번호 암호화 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmittingModal(false);
    }
  };

  return (
    <main className="w-full min-h-screen relative flex items-center justify-center overflow-hidden bg-background">
      {/* Decorative Background Layer */}
      <div className="absolute inset-0 ambient-grid z-0"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-multiply z-0" 
        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDgwj4YPsfqs9iMwiN5qSnRxdbtAIPlqpA4bFv-SLLUJOSW_Nrp_cBMPYwrY3HanwDRBGe4BxpoIXDUUuvdMK5UVCQchhDiT9mK6qhV6LNdrJiM4evYIi2VfXcX67xltoys17CV7265GsjRVIvVcFIpgE4QLfjfrS6FM30IEAkL1-hN94_YZonEIdmJ8VkO66kYuc8brBSfX1NN7hEhDzvR9RfPtTtP_6176yDMX8wvQNDiSuLk4Z2dzg')" }}
      ></div>

      {/* Login Card Canvas */}
      <div className="w-full max-w-md mx-4 md:mx-auto relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden flex flex-col">
          
          {/* Card Header / Brand */}
          <div className="p-6 pb-4 flex flex-col items-center justify-center border-b border-surface-container border-opacity-50 text-center">
            <div className="w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center mb-3 shadow-sm ring-1 ring-outline-variant/30 overflow-hidden p-1">
              <img 
                className="w-full h-full object-contain" 
                alt={brandNameKo} 
                src={faviconUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCzdKFsdPnKcTZgizNUKNAQm4C7c0rxBrNMlB3K5hpuP-ZtI39somkJYvZ44418CAGbL_oNOOYdt8XvN0xntUda3uvRiJ7ClsESuUvSTvxQunbLKo_chpYgvscwiltagl-nk3eNRXa02lkJl6B4_pZWgWYXcljNDFz49O07dhycfXCfTqEtc38vlmTd0bJKETS9M_mviIM6bAh3DgLQkcfOqeoWpGwIjzFuMVamK28DEASUmEFHTskKTA"} 
              />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-wider text-slate-900 uppercase">
              {brandNameEn}
            </h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{brandNameKo} 통합 관리자 콘솔 (Console CMS)</p>
          </div>

          {/* Form Body */}
          <form className="p-6 flex flex-col gap-5" onSubmit={handleLoginSubmit}>
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                {errorMessage}
              </div>
            )}

            {/* ID Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="userId" className="text-sm font-semibold text-on-surface">ID</label>
              <Input 
                id="userId"
                name="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="관리자 아이디 입력"
                icon="badge"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-on-surface">Password</label>
              <Input 
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
                icon="lock"
              />
            </div>

            {/* Actions / Options Row */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="w-4 h-4 border border-outline-variant rounded-sm bg-surface-bright peer-checked:bg-secondary peer-checked:border-secondary transition-colors group-hover:border-secondary"></div>
                  <span 
                    className="material-symbols-outlined absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-on-secondary text-[14px] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" 
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
                <span className="text-sm font-normal text-on-surface-variant group-hover:text-on-surface transition-colors">Keep me logged in</span>
              </label>
              <a href="#" className="text-sm font-normal text-secondary hover:text-on-secondary-fixed-variant hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/20 rounded-sm px-1">
                Forgot Password?
              </a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="mt-2 w-full py-3 px-6 bg-secondary text-on-secondary text-sm font-bold tracking-wide rounded-xl shadow-lg shadow-secondary/20 hover:bg-on-secondary-fixed-variant hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-surface-container-lowest active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              Login
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Footer subtle text */}
          <div className="bg-surface px-6 py-3 border-t border-outline-variant/30 flex justify-center">
            <span className="text-[11px] font-medium text-outline flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">security</span>
              SHA-256 Web Crypto Encrypted Session
            </span>
          </div>
        </div>
      </div>

      {/* Force Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h2 className="text-xl font-bold text-slate-900">비밀번호 변경 강제 (Force Reset)</h2>
            </div>
            
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              최초 임시 비밀번호로 로그인하셨습니다. 보안 강화를 위해 **안전한 새 비밀번호**를 설정해야 콘솔 대시보드 접근이 가능합니다.
            </p>

            <form onSubmit={handleForceResetSubmit} className="space-y-4">
              {modalError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                  {modalError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="6자리 이상 영문/숫자/특수기호 조합"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">새 비밀번호 확인</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800 transition-colors"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingModal}
                  className="w-full py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmittingModal ? 'SHA-256 암호화 저장 중...' : '비밀번호 변경 및 콘솔 입장'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
