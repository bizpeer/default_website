import { ReactNode, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { StaffPermissions } from './UserManagement';

import { useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState('최고 관리자');
  const [userRole, setUserRole] = useState('superadmin');
  const [userPermissions, setUserPermissions] = useState<StaffPermissions>({
    dashboard: true,
    site: true,
    content: true,
    products: true,
    shop: true,
    orders: true,
    customers: true,
    system: true,
  });

  useEffect(() => {
    const isAdminLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isAdminLoggedIn) {
      navigate('/admin/login', { replace: true });
      return;
    }

    const savedName = localStorage.getItem('admin_logged_user_name');
    if (savedName) setUserName(savedName);

    const savedRole = localStorage.getItem('admin_logged_user_role') || 'superadmin';
    setUserRole(savedRole);

    const savedPerms = localStorage.getItem('admin_logged_user_permissions');
    if (savedPerms) {
      try {
        setUserPermissions(JSON.parse(savedPerms));
      } catch (e) {
        // default
      }
    }

    // STRICT URL GUARD: Only superadmin (siteadmin) can access /admin/system (권한등록)
    if (location.pathname === '/admin/system' && savedRole !== 'superadmin') {
      alert('권한등록 메뉴는 siteadmin(최고관리자) 전용 메뉴입니다.');
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_logged_user_id');
    localStorage.removeItem('admin_logged_user_name');
    localStorage.removeItem('admin_logged_user_role');
    localStorage.removeItem('admin_logged_user_permissions');
    navigate('/admin/login');
  };

  const allMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', permKey: 'dashboard' },
    { name: '사이트 정보 관리', path: '/admin/site', icon: 'settings_input_component', permKey: 'site' },
    { name: '콘텐츠 & 미디어 관리', path: '/admin/content', icon: 'article', permKey: 'content' },
    { name: '제품 관리', path: '/admin/products', icon: 'inventory_2', permKey: 'products' },
    { name: '쇼핑몰 관리', path: '/admin/shop', icon: 'shopping_cart', permKey: 'shop' },
    { name: '주문확인 & 물류관리', path: '/admin/orders', icon: 'local_shipping', permKey: 'orders' },
    { name: '고객 관리', path: '/admin/customers', icon: 'group', permKey: 'customers' },
    { name: '권한등록', path: '/admin/system', icon: 'manage_accounts', permKey: 'system' },
  ];

  // Filter sidebar menus based on assigned permissions
  // ONLY siteadmin (superadmin) can see '권한등록' (/admin/system)
  const visibleMenuItems = allMenuItems.filter((item) => {
    if (item.permKey === 'system') {
      return userRole === 'superadmin';
    }
    if (userRole === 'superadmin') return true;
    const key = item.permKey as keyof StaffPermissions;
    return userPermissions[key] !== false;
  });

  return (
    <div className="flex h-screen bg-background text-on-surface overflow-hidden antialiased">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-on-primary flex flex-col h-full shrink-0 z-50">
        <div className="p-6 flex flex-col gap-1 mb-4 border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center font-bold text-white">
              C
            </div>
            <h1 className="text-xl font-bold">Console CMS</h1>
          </div>
          <p className="text-xs text-on-primary/70">Back-office Management System</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer duration-150 text-sm ${
                  isActive
                    ? 'bg-secondary text-on-secondary font-semibold shadow-xs'
                    : 'text-on-primary/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <span 
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Current User Session Footer */}
        <div className="p-4 border-t border-primary/20 bg-black/10 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[11px] text-on-primary/60">{userRole === 'superadmin' ? 'Site Admin (최고관리자)' : 'Staff Account'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-white/20 rounded-lg text-on-primary/80 hover:text-white transition-colors"
            title="로그아웃"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TopNavBar */}
        <header className="bg-surface text-primary w-full h-16 sticky top-0 z-40 border-b border-outline-variant shadow-xs flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-lg font-bold">Admin Portal</span>
            {userRole === 'superadmin' && (
              <span className="px-2.5 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full">
                Site Admin
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold">
                {userName.charAt(0)}
              </div>
              <div className="text-xs text-left hidden sm:block">
                <p className="font-bold text-slate-900">{userName}</p>
                <p className="text-[11px] text-slate-400">{userRole}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              로그아웃
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
