import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getCustomerSavedAddress, CustomerAddress } from '../lib/customerAddresses';
import {
  MembershipPolicy,
  getMembershipPolicy,
  saveMembershipPolicy,
  calculateTierForOrders,
} from '../services/membershipService';

export interface CustomerMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipTier: 'GOLD VIP' | 'SILVER' | 'BRONZE';
  points: number;
  coupons: number;
  provider: 'email' | 'google' | 'naver';
  avatarUrl?: string;
  createdAt: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BLACK';
  completedOrderCount?: number;
}

export const initialCustomerMembers: CustomerMember[] = [
  {
    id: 'cust-1001',
    name: '김조선 님',
    email: 'joseon_vip@beauty.com',
    phone: '010-1234-5678',
    membershipTier: 'GOLD VIP',
    points: 12500,
    coupons: 3,
    provider: 'email',
    createdAt: '2025.11.10',
    status: 'ACTIVE',
    completedOrderCount: 5,
  },
  {
    id: 'cust-1002',
    name: '이구글 (Google)',
    email: 'google_user_789@gmail.com',
    phone: '010-9876-5432',
    membershipTier: 'SILVER',
    points: 3000,
    coupons: 1,
    provider: 'google',
    avatarUrl: 'https://lh3.googleusercontent.com/a/default-user',
    createdAt: '2026.03.14',
    status: 'ACTIVE',
    completedOrderCount: 1,
  },
  {
    id: 'cust-1003',
    name: '박네이버 (Naver)',
    email: 'naver_user_456@naver.com',
    phone: '010-4321-8765',
    membershipTier: 'SILVER',
    points: 3500,
    coupons: 2,
    provider: 'naver',
    avatarUrl: 'https://ssl.pstatic.net/static/pwe/address/img_profile.png',
    createdAt: '2026.05.02',
    status: 'ACTIVE',
    completedOrderCount: 2,
  },
  {
    id: 'cust-1004',
    name: '최브론즈 님',
    email: 'bronze_customer@test.com',
    phone: '010-5555-7777',
    membershipTier: 'BRONZE',
    points: 500,
    coupons: 0,
    provider: 'email',
    createdAt: '2026.06.20',
    status: 'ACTIVE',
    completedOrderCount: 0,
  },
];

export function CustomerManagement() {
  const [customers, setCustomers] = useState<CustomerMember[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'GOLD VIP' | 'SILVER' | 'BRONZE'>('ALL');
  const [providerFilter, setProviderFilter] = useState<'ALL' | 'email' | 'google' | 'naver'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'ORDERS_DESC' | 'POINTS_DESC'>('NEWEST');

  // Policy Settings State
  const [policy, setPolicy] = useState<MembershipPolicy>(defaultPolicyLoader);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // Selected Customer Modal State (Address & Order History)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerMember | null>(null);
  const [customerAddress, setCustomerAddress] = useState<CustomerAddress | null>(null);

  // Points & Coupon Adjustment Modal State (Individual)
  const [pointAdjustModalCustomer, setPointAdjustModalCustomer] = useState<CustomerMember | null>(null);
  const [adjustPointsInput, setAdjustPointsInput] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState<string>('관리자 우수회원 적립금 특별 부여');

  // Tier-Based Bulk Points Modal State
  const [showBulkTierModal, setShowBulkTierModal] = useState(false);
  const [targetTier, setTargetTier] = useState<'ALL' | 'GOLD VIP' | 'SILVER' | 'BRONZE'>('GOLD VIP');
  const [bulkPointsAmount, setBulkPointsAmount] = useState<number>(5000);
  const [bulkReason, setBulkReason] = useState<string>('시즌 감사 회원 등급별 적립금 일괄 지급');

  // Add New Customer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newTier, setNewTier] = useState<'GOLD VIP' | 'SILVER' | 'BRONZE'>('SILVER');
  const [newPoints, setNewPoints] = useState<number>(3000);

  function defaultPolicyLoader(): MembershipPolicy {
    return getMembershipPolicy();
  }

  // Load Customer Members on Mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      // Fetch Completed Order Counts per Customer from shop_orders
      const savedOrdersStr = localStorage.getItem('shop_orders') || '[]';
      const allOrders = JSON.parse(savedOrdersStr);

      const orderCountMap: Record<string, number> = {};
      allOrders.forEach((o: any) => {
        if (o.customerEmail && o.status !== '주문취소') {
          const emailKey = o.customerEmail.toLowerCase();
          orderCountMap[emailKey] = (orderCountMap[emailKey] || 0) + 1;
        }
      });

      // 1. Try fetching from Supabase DB
      const { data, error } = await supabase
        .from('customer_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to local storage or initial seed
        const saved = localStorage.getItem('customer_members_db');
        let currentList: CustomerMember[] = saved ? JSON.parse(saved) : initialCustomerMembers;

        // Attach calculated order count
        currentList = currentList.map((c) => ({
          ...c,
          completedOrderCount: orderCountMap[c.email.toLowerCase()] ?? c.completedOrderCount ?? 0,
        }));

        setCustomers(currentList);
        localStorage.setItem('customer_members_db', JSON.stringify(currentList));
      } else {
        // Map Supabase fields
        const mapped: CustomerMember[] = data.map((u: any) => {
          const emailKey = u.email.toLowerCase();
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || '미등록',
            membershipTier: u.membership_tier || 'SILVER',
            points: u.points ?? 3000,
            coupons: u.coupons ?? 1,
            provider: u.provider || 'email',
            avatarUrl: u.avatar_url,
            createdAt: u.created_at ? new Date(u.created_at).toISOString().split('T')[0].replace(/-/g, '.') : '2026.01.01',
            status: 'ACTIVE',
            completedOrderCount: orderCountMap[emailKey] ?? 0,
          };
        });
        setCustomers(mapped);
        localStorage.setItem('customer_members_db', JSON.stringify(mapped));
      }
    } catch (e) {
      console.warn('Customer load error, using local state:', e);
      const saved = localStorage.getItem('customer_members_db');
      setCustomers(saved ? JSON.parse(saved) : initialCustomerMembers);
    }
  };

  const saveCustomersState = (updatedList: CustomerMember[]) => {
    setCustomers(updatedList);
    localStorage.setItem('customer_members_db', JSON.stringify(updatedList));
  };

  // Save Policy Settings & Recalculate Tiers
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    saveMembershipPolicy(policy);

    // Recalculate all customer tiers based on new policy
    let updatedCount = 0;
    const updatedCustomers = customers.map((c) => {
      const orderCount = c.completedOrderCount || 0;
      const newCalculatedTier = calculateTierForOrders(orderCount, policy);
      if (newCalculatedTier !== c.membershipTier) {
        updatedCount++;
        return { ...c, membershipTier: newCalculatedTier };
      }
      return c;
    });

    saveCustomersState(updatedCustomers);
    setShowPolicyModal(false);

    alert(`✅ [회원등급 산정 정책 저장 완료]\n새 설정이 저장되었습니다. 총 ${updatedCount}명 회원 등급이 새 결제 횟수 기준에 맞춰 자동 업데이트되었습니다.`);
  };

  // Bulk Points Grant by Tier
  const handleBulkTierPointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkPointsAmount <= 0) {
      alert('지급할 포인트를 1P 이상 입력해주세요.');
      return;
    }

    let affectedCount = 0;
    const updated = customers.map((c) => {
      if (targetTier === 'ALL' || c.membershipTier === targetTier) {
        affectedCount++;
        return {
          ...c,
          points: (c.points || 0) + Number(bulkPointsAmount),
        };
      }
      return c;
    });

    saveCustomersState(updated);

    // Sync to Supabase DB
    try {
      if (targetTier === 'ALL') {
        // Bulk update all
        for (const cust of updated) {
          await supabase.from('customer_users').update({ points: cust.points }).eq('email', cust.email);
        }
      } else {
        for (const cust of updated.filter((c) => c.membershipTier === targetTier)) {
          await supabase.from('customer_users').update({ points: cust.points }).eq('email', cust.email);
        }
      }
    } catch (dbErr) {
      console.warn('Supabase bulk points update warning:', dbErr);
    }

    alert(`🎉 [회원등급별 포인트 일괄 지급 완료]\n${targetTier === 'ALL' ? '전체 회원' : `${targetTier} 등급 회원`} 총 ${affectedCount}명에게 +${bulkPointsAmount.toLocaleString()}P가 성공적으로 일괄 지급되었습니다.\n사유: ${bulkReason}`);
    setShowBulkTierModal(false);
  };

  // Open Customer Detail Modal & Fetch Address
  const handleOpenDetailModal = (cust: CustomerMember) => {
    setSelectedCustomer(cust);
    const addr = getCustomerSavedAddress(cust.email);
    setCustomerAddress(addr);
  };

  // Handle Individual Points Adjustment
  const handleAdjustPointsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointAdjustModalCustomer) return;

    const newPointsTotal = Math.max(0, pointAdjustModalCustomer.points + Number(adjustPointsInput));
    
    const updated = customers.map((c) => {
      if (c.id === pointAdjustModalCustomer.id) {
        return { ...c, points: newPointsTotal };
      }
      return c;
    });

    saveCustomersState(updated);

    // Update Supabase DB if available
    try {
      await supabase
        .from('customer_users')
        .update({ points: newPointsTotal })
        .eq('email', pointAdjustModalCustomer.email);
    } catch (dbErr) {
      console.warn('Supabase points update warning:', dbErr);
    }

    alert(`✅ [${pointAdjustModalCustomer.name}] 회원님에게 적립금 ${adjustPointsInput >= 0 ? '+' : ''}${adjustPointsInput.toLocaleString()}P 변경 처리가 완료되었습니다.\n(현재 잔여 적립금: ${newPointsTotal.toLocaleString()}P)\n사유: ${adjustReason}`);
    setPointAdjustModalCustomer(null);
    setAdjustPointsInput(0);
  };

  // Handle Direct Tier Override
  const handleChangeMemberTierDirect = async (cust: CustomerMember, newTierChoice: 'GOLD VIP' | 'SILVER' | 'BRONZE') => {
    if (!confirm(`[${cust.name}] 회원님의 등급을 '${cust.membershipTier}'에서 '${newTierChoice}'(으)로 수동 변경하시겠습니까?`)) {
      return;
    }

    const updated = customers.map((c) => (c.id === cust.id ? { ...c, membershipTier: newTierChoice } : c));
    saveCustomersState(updated);

    try {
      await supabase
        .from('customer_users')
        .update({ membership_tier: newTierChoice })
        .eq('email', cust.email);
    } catch (dbErr) {
      console.warn('Supabase tier override error:', dbErr);
    }
  };

  // Handle Add New Customer
  const handleCreateCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      alert('성명과 이메일 주소는 필수 입력사항입니다.');
      return;
    }

    const newCust: CustomerMember = {
      id: `cust-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      phone: newPhone.trim() || '010-0000-0000',
      membershipTier: newTier,
      points: Number(newPoints) || 3000,
      coupons: 1,
      provider: 'email',
      createdAt: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
      status: 'ACTIVE',
      completedOrderCount: 0,
    };

    const updated = [newCust, ...customers];
    saveCustomersState(updated);

    try {
      await supabase.from('customer_users').insert([
        {
          email: newCust.email,
          name: newCust.name,
          phone: newCust.phone,
          membership_tier: newCust.membershipTier,
          points: newCust.points,
          coupons: newCust.coupons,
          provider: 'email',
        },
      ]);
    } catch (err) {
      console.warn('Supabase customer insert warning:', err);
    }

    alert(`🎉 신규 고객 (${newCust.name}) 등록이 완료되었습니다.`);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewPoints(3000);
  };

  // Toggle Customer Status
  const handleToggleStatus = (cust: CustomerMember) => {
    const nextStatus: CustomerMember['status'] = cust.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    if (!confirm(`[${cust.name}] 회원 상태를 ${nextStatus === 'ACTIVE' ? '정상(ACTIVE)' : '정지/휴면(INACTIVE)'} 상태로 변경하시겠습니까?`)) {
      return;
    }
    const updated = customers.map((c) => (c.id === cust.id ? { ...c, status: nextStatus } : c));
    saveCustomersState(updated);
  };

  // Filtering & Sorting Logic
  const filteredCustomers = customers
    .filter((c) => {
      const matchesKeyword =
        c.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        c.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        c.phone.includes(searchKeyword);

      const matchesTier = tierFilter === 'ALL' || c.membershipTier === tierFilter;
      const matchesProvider = providerFilter === 'ALL' || c.provider === providerFilter;

      return matchesKeyword && matchesTier && matchesProvider;
    })
    .sort((a, b) => {
      if (sortBy === 'ORDERS_DESC') {
        return (b.completedOrderCount || 0) - (a.completedOrderCount || 0);
      }
      if (sortBy === 'POINTS_DESC') {
        return (b.points || 0) - (a.points || 0);
      }
      return 0; // Default NEWEST
    });

  // Analytics
  const totalCount = customers.length;
  const vipCount = customers.filter((c) => c.membershipTier === 'GOLD VIP').length;
  const silverCount = customers.filter((c) => c.membershipTier === 'SILVER').length;
  const bronzeCount = customers.filter((c) => c.membershipTier === 'BRONZE').length;
  const totalPointsSum = customers.reduce((sum, c) => sum + (c.points || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">고객 관리 & 회원등급 산정 (Customer & Membership Tier Management)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            결제 횟수 기반 **자동 등급 승급(Silver/Gold) 산정 기준**을 설정하고 등급별 적립금 일괄 부여 및 회원 조회를 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowPolicyModal(true)}
            className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">settings_accessibility</span>
            ⚙️ 회원등급 승급기준 설정
          </button>

          <button
            onClick={() => setShowBulkTierModal(true)}
            className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">card_giftcard</span>
            🎁 등급별 포인트 일괄 지급
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            신규 회원 직권 등록
          </button>
        </div>
      </div>

      {/* Policy Info Notification Bar */}
      <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-amber-900 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-amber-700">stars</span>
          <div>
            <span className="font-bold">현재 적용 중인 자동 등급 산정 기준: </span>
            <span>
              결제 <strong className="text-amber-800 font-mono underline">{policy.silverOrderThreshold}회 이상</strong> 시 <strong>SILVER</strong> 승급,
              Silver 등급에서 추가 결제로 총 <strong className="text-amber-800 font-mono underline">{policy.goldOrderThreshold}회 이상</strong> 시 <strong>GOLD VIP</strong> 승급
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowPolicyModal(true)}
          className="text-amber-800 underline font-bold hover:text-amber-950 shrink-0 text-xs"
        >
          기준 변경하기
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">전체 가입 회원수</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalCount.toLocaleString()} <span className="text-sm font-normal text-slate-500">명</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">group</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">GOLD VIP 회원</p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1 font-mono">{vipCount.toLocaleString()} <span className="text-sm font-normal text-slate-500">명</span></h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Silver: {silverCount}명 | Bronze: {bronzeCount}명</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">workspace_premium</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">소셜가입 회원 (Google/Naver)</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
              {customers.filter((c) => c.provider !== 'email').length.toLocaleString()} <span className="text-sm font-normal text-slate-500">명</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">hub</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">총 보유 적립금 잔액</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1 font-mono">{totalPointsSum.toLocaleString()} <span className="text-sm font-normal text-slate-500">P</span></h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">database</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="고객 성명, 이메일 주소, 휴대폰 번호 검색..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-900"
          />
        </div>

        {/* Filter Selection */}
        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">전체 회원등급</option>
            <option value="GOLD VIP">GOLD VIP 등급만</option>
            <option value="SILVER">SILVER 등급만</option>
            <option value="BRONZE">BRONZE 등급만</option>
          </select>

          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">전체 가입방식</option>
            <option value="email">일반 이메일 가입</option>
            <option value="google">Google 소셜 인증</option>
            <option value="naver">Naver 소셜 인증</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="NEWEST">최신 가입순 정렬</option>
            <option value="ORDERS_DESC">결제/주문 횟수많은순</option>
            <option value="POINTS_DESC">적립금 보유많은순</option>
          </select>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">고객 성명 & 계정 ID</th>
                <th className="py-3.5 px-4">가입 방식 (Social)</th>
                <th className="py-3.5 px-4">완료 결제 횟수</th>
                <th className="py-3.5 px-4">회원 등급 (수동/자동)</th>
                <th className="py-3.5 px-4">적립금 / 쿠폰</th>
                <th className="py-3.5 px-4 text-center">계정 상태</th>
                <th className="py-3.5 px-4 text-right">상세 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold">
                    검색 및 필터 조건과 일치하는 고객 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Customer Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 shrink-0 overflow-hidden">
                          {c.avatarUrl ? (
                            <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{c.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-3.5 px-4">
                      {c.provider === 'google' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-200">
                          <svg className="w-3 h-3" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          </svg>
                          Google
                        </span>
                      )}
                      {c.provider === 'naver' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200">
                          <span className="font-mono font-extrabold text-[10px]">N</span>
                          네이버
                        </span>
                      )}
                      {c.provider === 'email' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200">
                          <span className="material-symbols-outlined text-[12px]">mail</span>
                          일반이메일
                        </span>
                      )}
                    </td>

                    {/* Order Count */}
                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg font-bold text-xs">
                        💳 {c.completedOrderCount ?? 0}회 결제
                      </span>
                    </td>

                    {/* Tier Selector */}
                    <td className="py-3.5 px-4">
                      <select
                        value={c.membershipTier}
                        onChange={(e) => handleChangeMemberTierDirect(c, e.target.value as any)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded-xl cursor-pointer ${
                          c.membershipTier === 'GOLD VIP'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : c.membershipTier === 'SILVER'
                            ? 'bg-slate-100 text-slate-800 border border-slate-300'
                            : 'bg-orange-50 text-orange-800 border border-orange-200'
                        }`}
                      >
                        <option value="GOLD VIP">👑 GOLD VIP</option>
                        <option value="SILVER">🥈 SILVER</option>
                        <option value="BRONZE">🥉 BRONZE</option>
                      </select>
                    </td>

                    {/* Points & Coupons */}
                    <td className="py-3.5 px-4 font-mono">
                      <p className="font-bold text-slate-900">{c.points.toLocaleString()} P</p>
                      <p className="text-[11px] text-slate-400">쿠폰 {c.coupons}장 보유</p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(c)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-colors ${
                          c.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {c.status === 'ACTIVE' ? '정상 (ACTIVE)' : '정지 (INACTIVE)'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setPointAdjustModalCustomer(c)}
                          className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[11px] rounded-lg border border-purple-200 transition-colors"
                        >
                          💰 포인트 부여
                        </button>
                        <button
                          onClick={() => handleOpenDetailModal(c)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                        >
                          🔍 상세/배송지
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Membership Tier Policy Configuration */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">⚙️ 회원등급 자동 승급 기준 설정</h3>
                <p className="text-xs text-slate-400">결제 완료 횟수에 따른 회원 등급 산정 기준을 지정합니다.</p>
              </div>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSavePolicy} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <p className="font-bold">💡 등급 승급 안내</p>
                <p>신규 가입 회원: <strong>BRONZE</strong> 등급 시작</p>
                <p>기준 결제 횟수를 달성할 때마다 백엔드에서 자동으로 해당 회원 등급이 승급 업데이트됩니다.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    SILVER 승급 기준 결제 횟수
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      value={policy.silverOrderThreshold}
                      onChange={(e) => setPolicy({ ...policy, silverOrderThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono text-center"
                      required
                    />
                    <span className="font-bold text-slate-600">회 이상</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    GOLD VIP 승급 기준 총 결제 횟수
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={policy.silverOrderThreshold + 1}
                      value={policy.goldOrderThreshold}
                      onChange={(e) => setPolicy({ ...policy, goldOrderThreshold: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono text-center"
                      required
                    />
                    <span className="font-bold text-slate-600">회 이상</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Silver 승급 축하 적립금</label>
                  <input
                    type="number"
                    value={policy.silverBonusPoints}
                    onChange={(e) => setPolicy({ ...policy, silverBonusPoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gold VIP 승급 축하 적립금</label>
                  <input
                    type="number"
                    value={policy.goldBonusPoints}
                    onChange={(e) => setPolicy({ ...policy, goldBonusPoints: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 shadow-md"
                >
                  기준 저장 & 전체 회원 일괄 재산정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Tier-Based Bulk Points Grant */}
      {showBulkTierModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">🎁 회원 등급별 적립금 일괄 지급</h3>
                <p className="text-xs text-slate-400">특정 회원 등급 그룹 전체에 적립금을 일괄 지급합니다.</p>
              </div>
              <button
                onClick={() => setShowBulkTierModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleBulkTierPointsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">지급 대상 회원 등급 그룹</label>
                <select
                  value={targetTier}
                  onChange={(e) => setTargetTier(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-sm"
                >
                  <option value="GOLD VIP">👑 GOLD VIP 등급 전체 회원만</option>
                  <option value="SILVER">🥈 SILVER 등급 전체 회원만</option>
                  <option value="BRONZE">🥉 BRONZE 등급 전체 회원만</option>
                  <option value="ALL">🌐 전체 가입 회원 대상 (전체 일괄)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">일괄 지급 적립금 포인트 (P)</label>
                <input
                  type="number"
                  value={bulkPointsAmount}
                  onChange={(e) => setBulkPointsAmount(Number(e.target.value))}
                  placeholder="예: 5000"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">적립금 지급 사유 (메모)</label>
                <input
                  type="text"
                  value={bulkReason}
                  onChange={(e) => setBulkReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowBulkTierModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md"
                >
                  일괄 포인트 지급 실행
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Individual Customer Points Grant / Adjust */}
      {pointAdjustModalCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">특정 회원 포인트 부여 / 차감</h3>
                <p className="text-xs text-slate-400">{pointAdjustModalCustomer.name} ({pointAdjustModalCustomer.email})</p>
              </div>
              <button
                onClick={() => setPointAdjustModalCustomer(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAdjustPointsSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">현재 보유 적립금</label>
                <input
                  type="text"
                  value={`${pointAdjustModalCustomer.points.toLocaleString()} P`}
                  disabled
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">부여/변경 포인트 금액 (+ 지급, - 차감)</label>
                <input
                  type="number"
                  value={adjustPointsInput}
                  onChange={(e) => setAdjustPointsInput(Number(e.target.value))}
                  placeholder="예: 5000 또는 -1000"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold font-mono focus:outline-none focus:border-slate-900"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">양수(+) 입력 시 포인트 지급, 음수(-) 입력 시 차감됩니다.</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">포인트 부여/차감 사유</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPointAdjustModalCustomer(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md"
                >
                  포인트 변경 적용
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Customer Detail & Saved Address */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCustomer.name} 회원 상세 정보</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedCustomer.email}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Basic Info */}
            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <p><span className="font-bold text-slate-500 w-24 inline-block">연락처:</span> {selectedCustomer.phone}</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">가입방식:</span> {selectedCustomer.provider.toUpperCase()} 소셜 인증</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">회원등급:</span> <span className="font-bold text-amber-700">{selectedCustomer.membershipTier}</span> (총 {selectedCustomer.completedOrderCount || 0}회 결제 완료)</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">보유 적립금:</span> {selectedCustomer.points.toLocaleString()} P</p>
              <p><span className="font-bold text-slate-500 w-24 inline-block">가입일시:</span> {selectedCustomer.createdAt}</p>
            </div>

            {/* Saved Address Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-blue-600">location_on</span>
                고객 맵핑 저장 배송지 정보
              </h4>
              {customerAddress ? (
                <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-slate-900">수령인: {customerAddress.recipientName} ({customerAddress.phone})</p>
                  <p className="text-slate-600">주소: ({customerAddress.postcode}) {customerAddress.address} {customerAddress.addressDetail}</p>
                  <p className="text-[11px] text-slate-400">최근 업데이트: {new Date(customerAddress.updatedAt).toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  아직 수집 등록된 저장 배송지가 없습니다. (주문 시 자동 맵핑됩니다)
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Add New Customer */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-900">신규 회원 직권 등록</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateCustomerSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">고객 성명 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">이메일 주소 <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">휴대폰 번호</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">초기 회원등급</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="SILVER">SILVER</option>
                    <option value="GOLD VIP">GOLD VIP</option>
                    <option value="BRONZE">BRONZE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">초기 적립금 (P)</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-md"
                >
                  회원 등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
