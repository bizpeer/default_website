import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order, initialOrders } from '../types/OrderTypes';
import { CustomerInquiry, initialInquiries } from '../types/SupportTypes';
import { Product, initialProducts } from './ProductManagement';
import { StaffUser, initialStaffUsers } from './UserManagement';

function StatCard({
  title,
  value,
  icon,
  badgeText,
  badgeColor = 'bg-slate-100 text-slate-700',
  linkTo,
}: {
  title: string;
  value: string;
  icon: string;
  badgeText?: string;
  badgeColor?: string;
  linkTo?: string;
}) {
  const CardContent = (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-bold text-slate-500">{title}</span>
        <span className="material-symbols-outlined text-slate-400 text-[22px]">{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{value}</h3>
        {badgeText && (
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );

  return linkTo ? <Link to={linkTo}>{CardContent}</Link> : CardContent;
}

export function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [currentAdminName, setCurrentAdminName] = useState('최고 관리자');

  useEffect(() => {
    // 1. Orders
    const savedOrders = localStorage.getItem('shop_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders(initialOrders);
      }
    } else {
      setOrders(initialOrders);
    }

    // 2. Inquiries
    const savedInq = localStorage.getItem('customer_inquiries');
    if (savedInq) {
      try {
        setInquiries(JSON.parse(savedInq));
      } catch (e) {
        setInquiries(initialInquiries);
      }
    } else {
      setInquiries(initialInquiries);
    }

    // 3. Products
    const savedPrd = localStorage.getItem('shop_products');
    if (savedPrd) {
      try {
        setProducts(JSON.parse(savedPrd));
      } catch (e) {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }

    // 4. Staff Accounts
    const savedStaff = localStorage.getItem('admin_staff_accounts');
    if (savedStaff) {
      try {
        setStaffList(JSON.parse(savedStaff));
      } catch (e) {
        setStaffList(initialStaffUsers);
      }
    } else {
      setStaffList(initialStaffUsers);
    }

    const savedName = localStorage.getItem('admin_logged_user_name');
    if (savedName) setCurrentAdminName(savedName);
  }, []);

  // Live Metrics Calculations
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === '주문접수' || o.status === '배송중');
  const pendingInquiries = inquiries.filter((i) => i.status === '접수완료');
  const bestsellerCount = products.filter((p) => p.isBestseller).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 md:p-8 rounded-3xl shadow-xl flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-400 text-slate-900 rounded-full">
              Live Real-Time Sync
            </span>
            <span className="text-xs text-slate-300">BEAUTY OF JOSEON Console</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold">
            안녕하세요, {currentAdminName}님!
          </h2>
          <p className="text-xs md:text-sm text-slate-300 mt-1">
            현재 시스템 상에 총 **{orders.length}건의 주문**과 **{pendingInquiries.length}건의 미답변 고객 문의**가 접수되어 있습니다.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            물류 & 송장관리 ➔
          </Link>
        </div>
      </div>

      {/* Real-time KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="총 누적 주문"
          value={`${orders.length}건`}
          icon="shopping_bag"
          badgeText="Live Orders"
          badgeColor="bg-blue-100 text-blue-800"
          linkTo="/admin/orders"
        />
        <StatCard
          title="총 누적 매출액"
          value={`${(totalSales / 10000).toFixed(0)}만원`}
          icon="payments"
          badgeText="Gross Sales"
          badgeColor="bg-emerald-100 text-emerald-800"
          linkTo="/admin/orders"
        />
        <StatCard
          title="배송대기 / 배송중"
          value={`${pendingOrders.length}건`}
          icon="local_shipping"
          badgeText={pendingOrders.length > 0 ? '배송 필요' : '정상'}
          badgeColor={pendingOrders.length > 0 ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'}
          linkTo="/admin/orders"
        />
        <StatCard
          title="답변대기 고객문의"
          value={`${pendingInquiries.length}건`}
          icon="forum"
          badgeText={pendingInquiries.length > 0 ? 'Action Req.' : '완료'}
          badgeColor={pendingInquiries.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}
          linkTo="/admin/shop"
        />
        <StatCard
          title="등록 제품 / 베스트"
          value={`${products.length} / ${bestsellerCount}`}
          icon="inventory_2"
          badgeText="Products"
          badgeColor="bg-purple-100 text-purple-800"
          linkTo="/admin/products"
        />
        <StatCard
          title="직원 및 관리자 계정"
          value={`${staffList.length}명`}
          icon="manage_accounts"
          badgeText="Staff Users"
          badgeColor="bg-slate-100 text-slate-800"
          linkTo="/admin/system"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Real-time Live Orders & Inquiries */}
        <div className="lg:col-span-2 space-y-8">
          {/* Real-time Orders Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-slate-700">receipt_long</span>
                  실시간 최근 주문 내역 (Live Orders)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">회원 및 비회원 고객의 최신 주문 내역입니다.</p>
              </div>
              <Link to="/admin/orders" className="text-xs font-bold text-slate-900 hover:underline">
                전체 물류관리 보기 ➔
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-5 font-semibold">주문번호 / 일시</th>
                    <th className="py-3.5 px-5 font-semibold">주문자 정보</th>
                    <th className="py-3.5 px-5 font-semibold text-right">결제금액</th>
                    <th className="py-3.5 px-5 font-semibold text-center">배송 및 송장상태</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 text-xs font-bold">
                        접수된 주문이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5">
                          <div className="font-mono font-bold text-xs text-slate-900">{ord.id}</div>
                          <div className="text-[11px] text-slate-400">{ord.createdAt}</div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="font-bold text-slate-900 text-xs">{ord.customerName}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{ord.customerEmail}</div>
                        </td>
                        <td className="py-4 px-5 text-right font-bold text-slate-900 text-xs">
                          {ord.totalAmount.toLocaleString()}원
                        </td>
                        <td className="py-4 px-5 text-center">
                          <div className="space-y-1">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-full ${
                                ord.status === '배송중'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ord.status === '배송완료'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {ord.status}
                            </span>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {ord.courier ? `${ord.courier} ${ord.trackingNumber || ''}` : '송장미등록'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Pending Customer Inquiries */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] text-rose-600">forum</span>
                  답변 대기 1:1 고객 문의 (Action Required Inquiries)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Resend 이메일 API를 통해 답변 메일이 즉시 발송됩니다.</p>
              </div>
              <Link to="/admin/shop" className="text-xs font-bold text-slate-900 hover:underline">
                문의 답변하기 ➔
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {pendingInquiries.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-bold">
                  🎉 답변 대기 중인 고객 문의가 없습니다!
                </div>
              ) : (
                pendingInquiries.slice(0, 4).map((inq) => (
                  <div key={inq.id} className="p-5 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded">
                          {inq.category}
                        </span>
                        <span className="font-bold text-xs text-slate-900">{inq.subject}</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{inq.message}</p>
                      <p className="text-[11px] text-slate-400">
                        작성자: {inq.customerName} ({inq.customerEmail}) | {inq.createdAt}
                      </p>
                    </div>
                    <Link
                      to="/admin/shop"
                      className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shrink-0"
                    >
                      답변 작성
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Quick System Shortcuts & Active Accounts */}
        <div className="space-y-8">
          {/* Quick Management Shortcuts */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-[20px] text-slate-700">bolt</span>
              빠른 관리 메뉴 (Quick Actions)
            </h3>

            <div className="grid grid-cols-1 gap-2.5 text-xs font-bold">
              <Link
                to="/admin/products"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                  제품 등록 / 베스트셀러 설정
                </span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
              <Link
                to="/admin/orders"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  주문 확인 및 송장번호 등록
                </span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
              <Link
                to="/admin/shop"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                  쇼핑몰 관리 / FAQ & 1:1 고객문의
                </span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
              <Link
                to="/admin/content"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">article</span>
                  미디어 센터 게시물 등록 (공지/News/자료실)
                </span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
              <Link
                to="/admin/site"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Resend 이메일 API 설정
                </span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
              <Link
                to="/admin/system"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 text-slate-800 flex items-center justify-between transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                  직원 계정 생성 및 권한 설정
                </span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>

          {/* Active Staff Accounts List */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-slate-700">group</span>
                직원 및 관리자 계정 ({staffList.length}명)
              </h3>
              <Link to="/admin/system" className="text-xs text-slate-500 font-bold hover:underline">
                관리 ➔
              </Link>
            </div>

            <div className="space-y-2.5">
              {staffList.map((st) => (
                <div key={st.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">{st.name} ({st.id})</span>
                    <span className="text-[11px] text-slate-400">{st.department || '운영팀'}</span>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                    st.role === 'superadmin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {st.role === 'superadmin' ? '최고관리자' : '직원'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
