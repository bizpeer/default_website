import { useState, useEffect } from 'react';
import { Order, CourierCompany, initialOrders } from '../types/OrderTypes';
import { cancelPaymentRecord } from '../lib/tossPayments';
import { CourierTrackingModal } from './CourierTrackingModal';

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Editing state for courier & tracking
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<CourierCompany>('CJ대한통운');
  const [inputTrackingNo, setInputTrackingNo] = useState('');

  // Live Tracking Modal State
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrders = localStorage.getItem('shop_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        setOrders(initialOrders);
        localStorage.setItem('shop_orders', JSON.stringify(initialOrders));
      }
    } else {
      setOrders(initialOrders);
      localStorage.setItem('shop_orders', JSON.stringify(initialOrders));
    }
  }, []);

  const saveOrders = (updated: Order[]) => {
    setOrders(updated);
    localStorage.setItem('shop_orders', JSON.stringify(updated));
  };

  const handleClearAllOrders = () => {
    if (confirm('모든 주문 및 물류 더미 내역을 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다.)')) {
      saveOrders([]);
      alert('모든 주문 내역이 성공적으로 초기화/삭제되었습니다.');
    }
  };

  const handleStartEditCourier = (ord: Order) => {
    setEditingOrderId(ord.id);
    setSelectedCourier(ord.courier || 'CJ대한통운');
    setInputTrackingNo(ord.trackingNumber || '');
  };

  const handleSaveTrackingInfo = (orderId: string, newStatus?: Order['status']) => {
    if (!inputTrackingNo.trim()) {
      alert('송장번호를 입력해주세요.');
      return;
    }

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          courier: selectedCourier,
          trackingNumber: inputTrackingNo.trim(),
          status: newStatus || '배송중',
        };
      }
      return o;
    });

    saveOrders(updated);
    setEditingOrderId(null);
    alert(`주문 (${orderId})의 택배사[${selectedCourier}] 및 송장번호가 등록되었습니다.`);
  };

  const handleUpdateStatus = async (orderId: string, status: Order['status']) => {
    if (status === '주문취소') {
      if (!confirm(`주문 (${orderId})을 취소하고 토스페이먼츠 결제 승인을 환불 처리하시겠습니까?`)) {
        return;
      }
      await cancelPaymentRecord(orderId, '관리자 취소 및 환불 처리');
    }

    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    saveOrders(updated);
    if (status === '주문취소') {
      alert(`✅ 주문 (${orderId}) 및 토스페이 결제건이 성공적으로 취소/환불 처리되었습니다.`);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesKeyword =
      o.id.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchKeyword.toLowerCase());

    if (filterStatus === 'All') return matchesKeyword;
    if (filterStatus === 'member') return matchesKeyword && o.orderType === 'member';
    if (filterStatus === 'guest') return matchesKeyword && o.orderType === 'guest';
    return matchesKeyword && o.status === filterStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">주문 확인 & 물류 관리 (Orders & Logistics)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            회원 및 비회원 신규 주문을 확인하고, **택배사(CJ대한통운, 로젠, 한진)** 지정 및 송장번호를 등록합니다.
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
            총 {orders.length}건 주문
          </span>
          {orders.length > 0 && (
            <button
              onClick={handleClearAllOrders}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">delete</span>
              주문 내역 전체 삭제
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">주문번호 / 주문자 / 이메일 검색</label>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="ORD-2026... 또는 이메일 검색"
            className="w-full px-3.5 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm outline-none focus:border-secondary"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">주문구분 / 배송상태 필터</label>
          <div className="flex gap-1.5 flex-wrap">
            {['All', '주문접수', '배송중', '배송완료', 'member', 'guest'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st === 'All' && '전체'}
                {st === 'member' && '회원 주문만'}
                {st === 'guest' && '비회원 주문만'}
                {st !== 'All' && st !== 'member' && st !== 'guest' && st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-wider border-b border-outline-variant">
              <tr>
                <th className="py-3.5 px-4 font-semibold">주문번호 / 일시</th>
                <th className="py-3.5 px-4 font-semibold">주문자 정보</th>
                <th className="py-3.5 px-4 font-semibold">주문 상품 정보</th>
                <th className="py-3.5 px-4 font-semibold text-right">총 결제금액</th>
                <th className="py-3.5 px-4 font-semibold text-center">택배사 & 송장등록</th>
                <th className="py-3.5 px-4 font-semibold text-center">배송 상태</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    검색 조건에 해당되는 주문 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-surface-container-low/50 transition-colors">
                    {/* Order ID & Date */}
                    <td className="py-4 px-4">
                      <div className="font-mono font-bold text-slate-900 text-xs">{ord.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{ord.createdAt}</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${
                        ord.orderType === 'member' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.orderType === 'member' ? '회원' : '비회원'}
                      </span>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900">{ord.customerName}</div>
                      <div className="text-xs text-slate-500 font-mono">{ord.customerEmail}</div>
                      <div className="text-[11px] text-slate-400 mt-1 max-w-xs truncate" title={ord.shippingAddress}>
                        📍 {ord.shippingAddress}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-4 px-4 min-w-[200px]">
                      <div className="space-y-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <img src={item.imageUrl} alt={item.productName} className="w-8 h-8 rounded border border-slate-200 object-cover shrink-0" />
                            <span className="text-xs text-slate-800 font-medium line-clamp-1">
                              {item.productName} ({item.quantity}개)
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 text-right font-bold text-slate-900">
                      {ord.totalAmount.toLocaleString()}원
                    </td>

                    {/* Courier & Tracking Edit */}
                    <td className="py-4 px-4 min-w-[240px]">
                      {editingOrderId === ord.id ? (
                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-300 space-y-2">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-500 mb-1">택배사 선택 (3종)</label>
                            <select
                              value={selectedCourier}
                              onChange={(e) => setSelectedCourier(e.target.value as CourierCompany)}
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold"
                            >
                              <option value="CJ대한통운">CJ대한통운</option>
                              <option value="로젠택배">로젠택배</option>
                              <option value="한진택배">한진택배</option>
                            </select>
                          </div>
                          <div>
                            <input
                              type="text"
                              value={inputTrackingNo}
                              onChange={(e) => setInputTrackingNo(e.target.value)}
                              placeholder="송장번호 입력..."
                              className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                            />
                          </div>
                          <div className="flex gap-1 pt-1">
                            <button
                              onClick={() => handleSaveTrackingInfo(ord.id, '배송중')}
                              className="flex-1 py-1 bg-slate-900 text-white text-[11px] font-bold rounded hover:bg-slate-800"
                            >
                              송장 저장 & 배송중
                            </button>
                            <button
                              onClick={() => setEditingOrderId(null)}
                              className="px-2 py-1 border border-slate-300 text-slate-600 text-[11px] font-bold rounded"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          {ord.trackingNumber ? (
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 text-slate-700 rounded border border-slate-200">
                                {ord.courier || 'CJ대한통운'}
                              </span>
                              <p className="text-xs font-mono text-slate-900 font-bold">{ord.trackingNumber}</p>
                              <div className="flex gap-1 justify-center pt-1">
                                <button
                                  onClick={() => setActiveTrackingOrder(ord)}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <span className="material-symbols-outlined text-[13px]">search</span>
                                  API 실시간 추적
                                </button>
                                <button
                                  onClick={() => handleStartEditCourier(ord)}
                                  className="px-2 py-1 border border-slate-300 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-100"
                                >
                                  수정
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleStartEditCourier(ord)}
                              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 transition-colors shadow-xs"
                            >
                              + 송장번호 등록하기
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <div className="space-y-1.5">
                        <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                          ord.status === '주문접수'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === '배송중'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === '배송완료'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {ord.status}
                        </span>

                        <div className="flex flex-col items-center gap-1 text-[11px] pt-1">
                          {ord.status === '배송중' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, '배송완료')}
                              className="text-emerald-700 underline font-bold hover:text-emerald-900"
                            >
                              배송완료 처리
                            </button>
                          )}
                          {ord.status !== '주문취소' && (
                            <button
                              onClick={() => handleUpdateStatus(ord.id, '주문취소')}
                              className="text-rose-600 underline font-bold hover:text-rose-800"
                            >
                              🚫 주문취소 & 환불
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
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
