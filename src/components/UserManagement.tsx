import { useState, useEffect, FormEvent } from 'react';

export interface StaffPermissions {
  dashboard: boolean;
  site: boolean;
  content: boolean;
  products: boolean;
  shop: boolean;
  orders: boolean;
  customers: boolean;
  system: boolean;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'staff';
  department: string;
  createdAt: string;
  passwordHash?: string;
  isPasswordChanged?: boolean;
  permissions: StaffPermissions;
}

export const initialStaffUsers: StaffUser[] = [
  {
    id: 'siteadmin',
    name: '최고 관리자',
    email: 'admin@company.com',
    role: 'superadmin',
    department: '최고경영팀',
    createdAt: '2026.01.01',
    isPasswordChanged: false,
    permissions: {
      dashboard: true,
      site: true,
      content: true,
      products: true,
      shop: true,
      orders: true,
      customers: true,
      system: true,
    },
  },
  {
    id: 'staff_shop',
    name: '김쇼핑 (쇼핑몰/주문팀)',
    email: 'shop@company.com',
    role: 'staff',
    department: '커머스운영팀',
    createdAt: '2026.03.15',
    isPasswordChanged: true,
    permissions: {
      dashboard: true,
      site: false,
      content: false,
      products: true,
      shop: true,
      orders: true,
      customers: true,
      system: false,
    },
  },
  {
    id: 'staff_content',
    name: '이콘텐츠 (미디어/홍보팀)',
    email: 'content@company.com',
    role: 'staff',
    department: '브랜드마케팅팀',
    createdAt: '2026.04.10',
    isPasswordChanged: true,
    permissions: {
      dashboard: true,
      site: true,
      content: true,
      products: false,
      shop: false,
      orders: false,
      customers: false,
      system: false,
    },
  },
];

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function UserManagement() {
  const [staffUsers, setStaffUsers] = useState<StaffUser[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffUser | null>(null);

  // Global Shopping Mall ON/OFF (Moved to siteadmin only)
  const [showShoppingMall, setShowShoppingMall] = useState(true);

  // Form State
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('!admin1004');
  const [newDepartment, setNewDepartment] = useState('운영팀');

  const [permShop, setPermShop] = useState(true);
  const [permOrders, setPermOrders] = useState(true);
  const [permContent, setPermContent] = useState(true);
  const [permSite, setPermSite] = useState(false);
  const [permProducts, setPermProducts] = useState(true);

  useEffect(() => {
    // Show Shopping Mall
    const savedMall = localStorage.getItem('show_shopping_mall');
    if (savedMall !== null) {
      setShowShoppingMall(JSON.parse(savedMall));
    }

    const saved = localStorage.getItem('admin_staff_users');
    if (saved) {
      try {
        setStaffUsers(JSON.parse(saved));
      } catch (e) {
        setStaffUsers(initialStaffUsers);
        localStorage.setItem('admin_staff_users', JSON.stringify(initialStaffUsers));
      }
    } else {
      setStaffUsers(initialStaffUsers);
      localStorage.setItem('admin_staff_users', JSON.stringify(initialStaffUsers));
    }
  }, []);

  const handleToggleShoppingMall = (enabled: boolean) => {
    setShowShoppingMall(enabled);
    localStorage.setItem('show_shopping_mall', JSON.stringify(enabled));
  };

  const saveStaffUsers = (users: StaffUser[]) => {
    setStaffUsers(users);
    localStorage.setItem('admin_staff_users', JSON.stringify(users));
  };

  const handleCreateStaff = async (e: FormEvent) => {
    e.preventDefault();

    if (!newId.trim() || !newName.trim()) {
      alert('아이디와 이름을 입력해주세요.');
      return;
    }

    if (staffUsers.some((u) => u.id === newId.trim())) {
      alert('이미 존재하는 직원 아이디입니다.');
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;
    const initialHash = await hashPassword(newPassword);

    const newStaff: StaffUser = {
      id: newId.trim(),
      name: newName.trim(),
      email: newEmail.trim() || `${newId}@company.com`,
      role: 'staff',
      department: newDepartment,
      createdAt: formattedDate,
      passwordHash: initialHash,
      isPasswordChanged: false,
      permissions: {
        dashboard: true,
        site: permSite,
        content: permContent,
        products: permProducts,
        shop: permShop,
        orders: permOrders,
        customers: permShop || permOrders,
        system: false,
      },
    };

    const updated = [...staffUsers, newStaff];
    saveStaffUsers(updated);

    alert(`직원 계정 (${newId})이 성공적으로 생성되었습니다.`);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setNewId('');
    setNewName('');
    setNewEmail('');
    setNewPassword('!admin1004');
    setNewDepartment('운영팀');
    setPermShop(true);
    setPermOrders(true);
    setPermContent(true);
    setPermSite(false);
    setPermProducts(true);
  };

  const handleDeleteStaff = (id: string) => {
    if (id === 'siteadmin') {
      alert('최고 관리자(siteadmin) 계정은 삭제할 수 없습니다.');
      return;
    }

    if (window.confirm(`정말 직원 계정 (${id})을 삭제하시겠습니까?`)) {
      const updated = staffUsers.filter((u) => u.id !== id);
      saveStaffUsers(updated);
    }
  };

  const handleTogglePermission = (id: string, key: keyof StaffPermissions) => {
    if (id === 'siteadmin') return; // siteadmin has all permissions

    const updated = staffUsers.map((u) => {
      if (u.id === id) {
        return {
          ...u,
          permissions: {
            ...u.permissions,
            [key]: !u.permissions[key],
          },
        };
      }
      return u;
    });
    saveStaffUsers(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full">
              siteadmin (최고관리자 전용)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface">권한등록 및 시스템 제어 (Permission Management)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Site Admin 전용 메뉴입니다. **쇼핑몰 전체 공개 ON/OFF**, 직원 계정 생성/삭제 및 개별 메뉴별 권한을 부여합니다.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          신규 직원 등록 (Add Staff)
        </button>
      </div>

      {/* Global Shopping Mall ON/OFF Control Widget (siteadmin only) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-amber-700">storefront</span>
            <h3 className="font-bold text-base text-slate-900">쇼핑몰 공개 운영 설정 (Shopping Mall Global Status)</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            사이트 전체에서 쇼핑몰(Shop) 관련 메뉴 및 장바구니/주문 기능의 공개 여부를 설정합니다. (일반 직원 수정 불가)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold ${showShoppingMall ? 'text-emerald-600' : 'text-slate-400'}`}>
            {showShoppingMall ? '● 쇼핑몰 공개 (ON)' : '○ 쇼핑몰 비공개 (OFF)'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={showShoppingMall}
              onChange={(e) => handleToggleShoppingMall(e.target.checked)}
            />
            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
          </label>
        </div>
      </div>

      {/* Staff Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider border-b border-outline-variant">
              <tr>
                <th className="py-3.5 px-4 font-semibold">직원 ID / 역할</th>
                <th className="py-3.5 px-4 font-semibold">이름 / 부서</th>
                <th className="py-3.5 px-4 font-semibold">이메일</th>
                <th className="py-3.5 px-4 font-semibold text-center">쇼핑몰 관리</th>
                <th className="py-3.5 px-4 font-semibold text-center">주문 & 물류</th>
                <th className="py-3.5 px-4 font-semibold text-center">콘텐츠 관리</th>
                <th className="py-3.5 px-4 font-semibold text-center">사이트 관리</th>
                <th className="py-3.5 px-4 font-semibold text-right">계정 관리</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant">
              {staffUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="py-4 px-4 font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-900">{user.id}</span>
                      {user.role === 'superadmin' ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-700 rounded-md">
                          Site Admin
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-md">
                          Staff
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-medium text-on-surface">{user.name}</div>
                    <div className="text-xs text-on-surface-variant">{user.department}</div>
                  </td>

                  <td className="py-4 px-4 text-xs text-on-surface-variant">{user.email}</td>

                  {/* Permission Toggles */}
                  <td className="py-4 px-4 text-center">
                    <button
                      disabled={user.role === 'superadmin'}
                      onClick={() => handleTogglePermission(user.id, 'shop')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        user.permissions.shop
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {user.permissions.shop ? '허용 (ON)' : '차단 (OFF)'}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      disabled={user.role === 'superadmin'}
                      onClick={() => handleTogglePermission(user.id, 'orders')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        user.permissions.orders
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {user.permissions.orders ? '허용 (ON)' : '차단 (OFF)'}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      disabled={user.role === 'superadmin'}
                      onClick={() => handleTogglePermission(user.id, 'content')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        user.permissions.content
                          ? 'bg-amber-50 text-amber-700 border-amber-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {user.permissions.content ? '허용 (ON)' : '차단 (OFF)'}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-center">
                    <button
                      disabled={user.role === 'superadmin'}
                      onClick={() => handleTogglePermission(user.id, 'site')}
                      className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                        user.permissions.site
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      {user.permissions.site ? '허용 (ON)' : '차단 (OFF)'}
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {user.role !== 'superadmin' && (
                      <button
                        onClick={() => handleDeleteStaff(user.id)}
                        className="p-1.5 text-on-surface-variant hover:text-rose-600 transition-colors"
                        title="직원 계정 삭제"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-slate-900">신규 직원 계정 생성</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">직원 접속 ID <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={newId}
                    onChange={(e) => setNewId(e.target.value)}
                    placeholder="예: staff01"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">직원 성명 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">초기 비밀번호</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">부서명</label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    placeholder="운영팀"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">이메일 주소</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="staff01@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-800"
                />
              </div>

              {/* Permission Checkboxes */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-900 mb-2">메뉴 접근 권한 지정 (Role Permissions)</label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={permShop}
                      onChange={(e) => setPermShop(e.target.checked)}
                      className="rounded text-slate-900"
                    />
                    쇼핑몰 관리 (Shop)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={permOrders}
                      onChange={(e) => setPermOrders(e.target.checked)}
                      className="rounded text-slate-900"
                    />
                    주문확인 & 물류관리
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={permContent}
                      onChange={(e) => setPermContent(e.target.checked)}
                      className="rounded text-slate-900"
                    />
                    콘텐츠 관리 (Media)
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={permSite}
                      onChange={(e) => setPermSite(e.target.checked)}
                      className="rounded text-slate-900"
                    />
                    사이트 정보 관리
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 shadow-md"
                >
                  직원 생성 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
