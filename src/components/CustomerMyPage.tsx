import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Order, CourierCompany, initialOrders } from '../types/OrderTypes';
import { getCustomerSavedAddress } from '../lib/customerAddresses';
import { cancelPaymentRecord } from '../lib/tossPayments';
import { performSocialLogin } from '../services/socialAuthService';
import { CourierTrackingModal } from './CourierTrackingModal';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  membership: 'GOLD VIP' | 'SILVER' | 'BRONZE';
  points: number;
  coupons: number;
  joinedDate: string;
}

const defaultCustomer: CustomerUser = {
  id: 'cust-1001',
  name: '김조선 님',
  email: 'joseon_vip@beauty.com',
  phone: '010-1234-5678',
  membership: 'GOLD VIP',
  points: 12500,
  coupons: 3,
  joinedDate: '2025.11.10',
};

export function CustomerMyPage() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'guestTracking'>('login');
  const [myPageSection, setMyPageSection] = useState<'orders' | 'settings'>('orders');

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Configurable Company / Brand Info loaded from Admin Site Management
  const [brandNameKo, setBrandNameKo] = useState('조선미녀');
  const [brandNameEn, setBrandNameEn] = useState('BEAUTY OF JOSEON');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up Form
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  // Guest Order Tracking Form
  const [guestSearchEmail, setGuestSearchEmail] = useState('');
  const [guestSearchOrderId, setGuestSearchOrderId] = useState('');
  const [guestFoundOrder, setGuestFoundOrder] = useState<Order | null>(null);
  const [guestSearchError, setGuestSearchError] = useState('');

  useEffect(() => {
    // Load Orders from localStorage
    const savedOrders = localStorage.getItem('shop_orders');
    if (savedOrders) {
      try {
        setAllOrders(JSON.parse(savedOrders));
      } catch (e) {
        setAllOrders(initialOrders);
      }
    } else {
      setAllOrders(initialOrders);
    }

    const loggedCustomer = localStorage.getItem('customer_logged_in_user');
    if (loggedCustomer) {
      try {
        setCurrentUser(JSON.parse(loggedCustomer));
        setIsLoggedIn(true);
      } catch (e) {
        // default
      }
    }

    const savedKo = localStorage.getItem('site_brand_name_ko');
    if (savedKo) setBrandNameKo(savedKo);

    const savedEn = localStorage.getItem('site_brand_name_en');
    if (savedEn) setBrandNameEn(savedEn);

    const savedFav = localStorage.getItem('site_favicon_url');
    if (savedFav) setFaviconUrl(savedFav);
  }, []);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    const userToLogin: CustomerUser = {
      ...defaultCustomer,
      email: loginEmail.trim(),
      name: loginEmail.split('@')[0] + ' 님',
    };

    localStorage.setItem('customer_logged_in_user', JSON.stringify(userToLogin));
    setCurrentUser(userToLogin);
    setIsLoggedIn(true);
  };

  const handleQuickDemoLogin = () => {
    localStorage.setItem('customer_logged_in_user', JSON.stringify(defaultCustomer));
    setCurrentUser(defaultCustomer);
    setIsLoggedIn(true);
  };

  const handleSignupSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    const newUser: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: signupName.trim() + ' 님',
      email: signupEmail.trim(),
      phone: signupPhone.trim() || '010-0000-0000',
      membership: 'SILVER',
      points: 3000,
      coupons: 1,
      joinedDate: new Date().toLocaleDateString('ko-KR'),
    };

    localStorage.setItem('customer_logged_in_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    alert('회원가입이 완료되었습니다! 가입 축하 3,000P 적립금이 지급되었습니다.');
  };

  const handleGuestTrackingSubmit = (e: FormEvent) => {
    e.preventDefault();
    setGuestSearchError('');
    setGuestFoundOrder(null);

    const emailInput = guestSearchEmail.trim().toLowerCase();
    const orderIdInput = guestSearchOrderId.trim().toUpperCase();

    if (!emailInput || !orderIdInput) {
      setGuestSearchError('이메일 주소와 주문번호를 모두 입력해주세요.');
      return;
    }

    const match = allOrders.find(
      (o) => o.customerEmail.toLowerCase() === emailInput && o.id.toUpperCase() === orderIdInput
    );

    if (match) {
      setGuestFoundOrder(match);
    } else {
      setGuestSearchError('일치하는 비회원 주문 내역을 찾을 수 없습니다. 주문번호와 이메일을 다시 확인해 주세요.');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(`주문 (${orderId})을 취소하시겠습니까?\n취소 시 토스페이먼츠 결제건이 자동으로 환불 처리됩니다.`)) {
      return;
    }

    const updated = allOrders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: '주문취소' as const,
        };
      }
      return o;
    });

    setAllOrders(updated);
    localStorage.setItem('shop_orders', JSON.stringify(updated));

    if (guestFoundOrder && guestFoundOrder.id === orderId) {
      setGuestFoundOrder({ ...guestFoundOrder, status: '주문취소' });
    }

    // Process PG Payment Cancellation in Supabase & Local DB
    await cancelPaymentRecord(orderId, '고객 마이페이지에서 주문 취소');
    alert(`✅ 주문 (${orderId}) 및 결제 환불 처리가 정상 완료되었습니다.`);
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_logged_in_user');
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleSocialAuth = async (provider: 'google' | 'naver') => {
    const res = await performSocialLogin(provider);
    if (res.success && res.user) {
      setIsLoggedIn(true);
      setCurrentUser({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: res.user.phone || '010-0000-0000',
        membership: res.user.membershipTier,
        points: res.user.points,
        coupons: res.user.coupons,
        joinedDate: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      });
      alert(`🎉 [${provider === 'google' ? '구글(Google)' : '네이버(Naver)'} 소셜인증 성공]\n반갑습니다, ${res.user.name}님! (3,000P 웰컴 적립금이 지급되었습니다)`);
    } else if (res.error) {
      alert(`❌ 소셜 인증 실패: ${res.error}`);
    }
  };

  const renderSocialAuthButtons = (modeText: string) => (
    <div className="space-y-2.5 pt-4 border-t border-slate-200 mt-5">
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="shrink mx-3 text-[11px] font-bold text-slate-400">간편 소셜 {modeText}</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => handleSocialAuth('google')}
          className="w-full py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Google
        </button>

        {/* Naver Login Button */}
        <button
          type="button"
          onClick={() => handleSocialAuth('naver')}
          className="w-full py-2.5 px-3 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-2"
        >
          <span className="font-extrabold text-sm tracking-tighter font-mono">N</span>
          네이버
        </button>
      </div>
    </div>
  );

  // Helper for courier tracking link
  const getCourierTrackingUrl = (courier?: CourierCompany, trackingNo?: string) => {
    if (!trackingNo) return '#';
    const cleanNo = trackingNo.replace(/[^0-9]/g, '');
    if (courier === 'CJ대한통운') {
      return `https://www.cjlogistics.com/ko/tool/parcel/tracking?gnbInvcNo=${cleanNo}`;
    }
    if (courier === '로젠택배') {
      return `https://www.ilogen.com/web/personal/trace/${cleanNo}`;
    }
    if (courier === '한진택배') {
      return `https://www.hanjin.co.kr/kor/CMS/DeliveryMgr/WaybillResult.do?mCode=MN038&wblnum=${cleanNo}`;
    }
    return '#';
  };

  // Filter logged-in customer's orders
  const memberOrders = allOrders.filter(
    (o) => currentUser && o.customerEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      {/* 1. Unauthenticated State (Customer Login / Sign Up / Guest Tracking) */}
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-200">
          {/* Logo Header */}
          <div className="text-center mb-8 flex flex-col items-center">
            {faviconUrl && (
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 p-1 mb-3 overflow-hidden shadow-xs flex items-center justify-center">
                <img src={faviconUrl} alt={brandNameKo} className="w-full h-full object-contain" />
              </div>
            )}
            <h1 className="text-2xl font-serif font-bold tracking-widest text-slate-900 mb-1 uppercase">
              {brandNameEn}
            </h1>
            <p className="text-xs font-bold text-slate-500 mb-1">{brandNameKo}</p>
            <p className="text-xs text-slate-400">고객 전용 쇼핑몰 회원 & 비회원 배송조회 서비스</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'login'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              회원 로그인
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'signup'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              신규 회원가입
            </button>
            <button
              onClick={() => setActiveTab('guestTracking')}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'guestTracking'
                  ? 'border-amber-600 text-amber-900 bg-amber-50 rounded-t-xl'
                  : 'border-transparent text-amber-700 hover:text-amber-900'
              }`}
            >
              🔍 비회원 배송조회
            </button>
          </div>

          {/* TAB 1: Member Login */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 주소 또는 아이디</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="joseon_vip@beauty.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md mt-2"
              >
                로그인하기
              </button>

              <div className="pt-4 border-t border-slate-100 text-center">
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  className="w-full py-2.5 bg-amber-50 text-amber-900 font-bold border border-amber-200 rounded-xl text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">stars</span>
                  VIP 데모 회원으로 바로 체험하기
                </button>
              </div>

              {renderSocialAuthButtons('로그인')}
            </form>
          )}

          {/* TAB 2: Sign Up */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">성명 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 주소 <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">휴대폰 번호</label>
                <input
                  type="tel"
                  value={signupPhone}
                  onChange={(e) => setSignupPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호 <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="6자리 이상"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">비밀번호 확인 <span className="text-rose-500">*</span></label>
                  <input
                    type="password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    placeholder="재입력"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md mt-2"
              >
                회원가입 및 3,000P 받기
              </button>

              {renderSocialAuthButtons('회원가입')}
            </form>
          )}

          {/* TAB 3: Guest Order Tracking */}
          {activeTab === 'guestTracking' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <p className="font-bold mb-1">📦 비회원 주문 배송조회 안내</p>
                <p>주문 시 제출하신 **이메일 주소**와 발급받으신 **주문번호(예: ORD-2026...)**를 입력하시면 실시간 배송상태 및 택배사(CJ대한통운, 로젠, 한진) 송장을 조회하실 수 있습니다.</p>
              </div>

              <form onSubmit={handleGuestTrackingSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">주문자 이메일 주소 <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    value={guestSearchEmail}
                    onChange={(e) => setGuestSearchEmail(e.target.value)}
                    placeholder="예: guest_test@gmail.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">주문번호 (Order ID) <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={guestSearchOrderId}
                    onChange={(e) => setGuestSearchOrderId(e.target.value)}
                    placeholder="예: ORD-20260722-4019"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900 font-mono"
                    required
                  />
                </div>

                {guestSearchError && (
                  <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                    {guestSearchError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-600 text-white font-bold rounded-xl text-sm hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  비회원 주문/배송 조회하기
                </button>
              </form>

              {/* Found Guest Order View */}
              {guestFoundOrder && (
                <div className="mt-6 p-5 bg-slate-50 border border-slate-300 rounded-2xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-amber-800">{guestFoundOrder.id}</span>
                      <p className="text-[11px] text-slate-400">{guestFoundOrder.createdAt}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                      guestFoundOrder.status === '배송중'
                        ? 'bg-blue-100 text-blue-800'
                        : guestFoundOrder.status === '배송완료'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {guestFoundOrder.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-900">주문자: {guestFoundOrder.customerName} ({guestFoundOrder.customerEmail})</p>
                    <p className="text-slate-600">배송지: {guestFoundOrder.shippingAddress}</p>
                    <p className="font-bold text-slate-900">총 결제금액: {guestFoundOrder.totalAmount.toLocaleString()}원</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-2">
                    <p className="text-xs font-bold text-slate-800">택배 배송 정보</p>
                    {guestFoundOrder.trackingNumber ? (
                      <div className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                          <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-700 rounded mr-2">
                            {guestFoundOrder.courier || 'CJ대한통운'}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">{guestFoundOrder.trackingNumber}</span>
                        </div>
                        <button
                          onClick={() => setActiveTrackingOrder(guestFoundOrder)}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          🔍 API 실시간 배송추적
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                        현재 물류팀에서 택배 송장 발급을 진행 중입니다. 잠시만 기다려주세요!
                      </p>
                    )}
                  </div>

                  {guestFoundOrder.status !== '주문취소' && guestFoundOrder.status !== '배송완료' && (
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center flex-wrap gap-2">
                      <button
                        onClick={() => handleCancelOrder(guestFoundOrder.id)}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">cancel</span>
                        주문취소 / 결제환불 요청
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* 2. Authenticated State: Member My Page Dashboard */
        <div className="space-y-8">
          {/* Welcome User Banner */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center text-2xl font-bold font-serif shadow-md">
                {currentUser?.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{currentUser?.name}</h1>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
                    {currentUser?.membership}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{currentUser?.email} | 가입일 {currentUser?.joinedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 w-full md:w-auto bg-slate-50 p-4 rounded-2xl border border-slate-100 justify-around">
              <div className="text-center px-3 border-r border-slate-200">
                <span className="text-xs font-bold text-slate-400 block">보유 적립금</span>
                <span className="text-lg font-bold text-slate-900">{currentUser?.points.toLocaleString()} P</span>
              </div>
              <div className="text-center px-3">
                <span className="text-xs font-bold text-slate-400 block">할인 쿠폰</span>
                <span className="text-lg font-bold text-amber-800">{currentUser?.coupons} 장</span>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setMyPageSection('orders')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                myPageSection === 'orders'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              나의 주문 / 배송 조회 ({memberOrders.length})
            </button>
            <button
              onClick={() => setMyPageSection('settings')}
              className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                myPageSection === 'settings'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
              내 정보 관리
            </button>
          </div>

          {/* My Page Content - Orders */}
          {myPageSection === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 mb-2">최근 주문 및 배송 현황</h3>

              {memberOrders.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
                  <span className="material-symbols-outlined text-[40px] mb-2">package_2</span>
                  <p className="text-sm font-bold">주문 내역이 없습니다.</p>
                </div>
              ) : (
                memberOrders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="flex items-center gap-4">
                      {ord.items[0]?.imageUrl && (
                        <img src={ord.items[0].imageUrl} alt={ord.items[0].productName} className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono font-bold text-slate-400">{ord.id}</span>
                          <span className="text-xs text-slate-400">({ord.createdAt})</span>
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                            ord.status === '배송중'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === '배송완료'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {ord.items[0]?.productName} {ord.items.length > 1 ? `외 ${ord.items.length - 1}건` : ''}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {ord.courier || 'CJ대한통운'} {ord.trackingNumber || '송장 준비중'} | 결제금액 {ord.totalAmount.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                      {ord.trackingNumber && (
                        <button
                          onClick={() => setActiveTrackingOrder(ord)}
                          className="flex-1 md:flex-none px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          🔍 {ord.courier || '택배'} API 추적
                        </button>
                      )}
                      {ord.status !== '주문취소' && ord.status !== '배송완료' && (
                        <button
                          onClick={() => handleCancelOrder(ord.id)}
                          className="flex-1 md:flex-none px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          주문취소 요청
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* My Page Content - Settings & Saved Address */}
          {myPageSection === 'settings' && (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-700">manage_accounts</span>
                회원 정보 및 기본 배송지 관리
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">성명</label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800">{currentUser?.name}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">이메일 주소 (고객 ID)</label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 font-mono">{currentUser?.email}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">연락처</label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800">{currentUser?.phone}</div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">회원 등급</label>
                  <div className="p-3 bg-slate-50 rounded-xl font-bold text-amber-800">{currentUser?.membership}</div>
                </div>
              </div>

              {/* Saved Mapped Shipping Address */}
              <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-amber-700">location_on</span>
                    주문 후 자동 저장 및 맵핑된 기본 배송지
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded">
                    자동 연동 완료
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 text-xs space-y-1.5">
                  <p className="font-bold text-slate-900">
                    수령인: {getCustomerSavedAddress(currentUser?.email || '')?.recipient_name || currentUser?.name} ({getCustomerSavedAddress(currentUser?.email || '')?.phone || currentUser?.phone})
                  </p>
                  <p className="text-slate-700 leading-relaxed font-semibold">
                    {getCustomerSavedAddress(currentUser?.email || '')?.address || '아직 저장된 배송지가 없습니다. 첫 주문 시 배송지가 고객 ID와 자동 맵핑되어 저장됩니다.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  로그아웃 (Sign Out)
                </button>
                <Link to="/" className="text-xs text-slate-500 hover:text-slate-900 font-bold">
                  쇼핑하러 돌아가기 ➡️
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Live Courier API Tracking Modal */}
      {activeTrackingOrder && (
        <CourierTrackingModal
          isOpen={!!activeTrackingOrder}
          courier={activeTrackingOrder.courier || 'CJ대한통운'}
          trackingNumber={activeTrackingOrder.trackingNumber || ''}
          orderId={activeTrackingOrder.id}
          onClose={() => setActiveTrackingOrder(null)}
        />
      )}
    </div>
  );
}
