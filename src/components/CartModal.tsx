import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem, Order, OrderItem, initialOrders } from '../types/OrderTypes';
import { getTossPaymentsConfig, savePaymentRecord, TossPaymentRecord } from '../lib/tossPayments';
import { saveCustomerAddress, getCustomerSavedAddress } from '../lib/customerAddresses';
import { updateCustomerTierOnOrder } from '../services/membershipService';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [orderType, setOrderType] = useState<'member' | 'guest'>('guest');

  // Checkout Form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('카드');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      const savedCart = localStorage.getItem('shop_cart_items');
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (e) {
          setCartItems([]);
        }
      }

      // Check if logged in customer exists
      const loggedCust = localStorage.getItem('customer_logged_in_user');
      if (loggedCust) {
        try {
          const user = JSON.parse(loggedCust);
          setOrderType('member');
          setGuestName(user.name.replace(' 님', ''));
          setGuestEmail(user.email);
          setGuestPhone(user.phone || '');

          // Retrieve saved shipping address mapped to customer ID (email)
          const savedAddr = getCustomerSavedAddress(user.email);
          if (savedAddr && savedAddr.address) {
            setGuestAddress(savedAddr.address);
            if (savedAddr.recipient_name) setGuestName(savedAddr.recipient_name);
            if (savedAddr.phone) setGuestPhone(savedAddr.phone);
          }
        } catch (e) {
          setOrderType('guest');
        }
      } else {
        setOrderType('guest');
      }
    }
  }, [isOpen]);

  // Handle pre-filling address when guest inputs an email used in prior orders
  const handleEmailBlur = () => {
    if (guestEmail.trim()) {
      const savedAddr = getCustomerSavedAddress(guestEmail.trim());
      if (savedAddr && savedAddr.address) {
        setGuestAddress(savedAddr.address);
        if (savedAddr.recipient_name && !guestName) setGuestName(savedAddr.recipient_name);
        if (savedAddr.phone && !guestPhone) setGuestPhone(savedAddr.phone);
      }
    }
  };

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('shop_cart_items', JSON.stringify(items));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const handleRemoveItem = (productId: string) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    saveCart(updated);
  };

  const totalPrice = cartItems.reduce((acc, item) => {
    const itemPrice = item.salePrice || item.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('장바구니에 담긴 제품이 없습니다.');
      return;
    }

    if (!guestName.trim() || !guestEmail.trim() || !guestAddress.trim()) {
      alert('주문자 성명, 이메일, 배송지 주소를 모두 입력해 주세요.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${dateStr}-${randomCode}`;

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      productId: item.productId,
      productName: item.name,
      price: item.salePrice || item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    }));

    const formattedTime = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    const newOrder: Order = {
      id: orderId,
      orderType,
      customerName: guestName.trim(),
      customerEmail: guestEmail.trim(),
      customerPhone: guestPhone.trim() || '010-0000-0000',
      shippingAddress: guestAddress.trim(),
      items: orderItems,
      totalAmount: totalPrice,
      status: '주문접수',
      courier: 'CJ대한통운',
      trackingNumber: '',
      createdAt: formattedTime,
    };

    // Calculate Toss Payments VAT (10% standard VAT)
    const vatAmount = Math.round((totalPrice * 0.1) / 1.1);
    const paymentKey = `tvV8_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const txId = `TX_${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}_${Math.floor(100000 + Math.random() * 900000)}`;

    // Toss Payment Record with all 13 fields requested by USER
    const paymentRecord: TossPaymentRecord = {
      order_id: orderId,
      user_id: guestEmail.trim(),
      pg: 'TOSSPAYMENTS',
      payment_key: paymentKey,
      transaction_id: txId,
      amount: totalPrice,
      vat: vatAmount,
      status: 'DONE',
      method: paymentMethod || '카드',
      approved_at: new Date().toISOString(),
      cancelled_at: undefined,
      refunded_amount: 0,
      created_at: new Date().toISOString(),
    };

    // Save Payment Transaction to Supabase DB 'payments' table (13 fields)
    await savePaymentRecord(paymentRecord);

    // Save & Map Customer Shipping Address to Customer ID (email) for Future Orders
    await saveCustomerAddress({
      user_id: guestEmail.trim(),
      recipient_name: guestName.trim(),
      phone: guestPhone.trim() || '010-0000-0000',
      address: guestAddress.trim(),
      is_default: true,
    });

    // Save order to localStorage
    const savedOrders = localStorage.getItem('shop_orders');
    let ordersList: Order[] = savedOrders ? JSON.parse(savedOrders) : initialOrders;
    ordersList = [newOrder, ...ordersList];
    localStorage.setItem('shop_orders', JSON.stringify(ordersList));

    // Update Customer Tier Automatically based on Backend Policy
    const tierResult = await updateCustomerTierOnOrder(guestEmail.trim());
    if (tierResult.upgraded) {
      alert(`🎉 축하합니다! 회원님의 결제 횟수 조건 충족으로 [${tierResult.newTier}] 등급으로 자동 승급되셨습니다!\n(승급 축하 보너스 적립금 +${tierResult.bonusPoints?.toLocaleString()}P 지급 완료)`);
    }

    // Clear Cart
    saveCart([]);
    setCompletedOrder(newOrder);
    setCheckoutStep('success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-slate-800">shopping_bag</span>
            <h2 className="text-xl font-bold text-slate-900">
              {checkoutStep === 'cart' && `장바구니 (${cartItems.length}개)`}
              {checkoutStep === 'checkout' && '주문 및 결제 작성 (Checkout)'}
              {checkoutStep === 'success' && '주문 완료 (Order Placed)'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* STEP 1: CART LIST */}
        {checkoutStep === 'cart' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-slate-400 my-auto">
                <span className="material-symbols-outlined text-[48px] text-slate-300 mb-2">remove_shopping_cart</span>
                <p className="text-sm font-bold text-slate-600">장바구니가 비어 있습니다.</p>
                <p className="text-xs text-slate-400 mt-1">마음에 드는 조선미녀 제품을 담아보세요!</p>
              </div>
            ) : (
              <div className="overflow-y-auto space-y-3 pr-2 flex-1">
                {cartItems.map((item) => {
                  const itemPrice = item.salePrice || item.price;
                  return (
                    <div key={item.productId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex gap-4 items-center">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-amber-800 uppercase">{item.brand}</p>
                        <h4 className="font-bold text-sm text-slate-900 truncate">{item.name}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{itemPrice.toLocaleString()}원</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shrink-0">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, -1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, 1)}
                          className="px-2 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-slate-100 mt-4 space-y-4">
                <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl">
                  <span className="text-xs font-bold">총 결제 금액</span>
                  <span className="text-xl font-bold">{totalPrice.toLocaleString()}원</span>
                </div>
                <button
                  onClick={() => setCheckoutStep('checkout')}
                  className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  주문서 작성하기 ➔
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT (MEMBER / GUEST) */}
        {checkoutStep === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto space-y-4 pr-2">
            {/* Order Type Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setOrderType('member')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  orderType === 'member' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                회원 주문
              </button>
              <button
                type="button"
                onClick={() => setOrderType('guest')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${
                  orderType === 'guest' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                비회원 주문 (Guest Checkout)
              </button>
            </div>

            {orderType === 'guest' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-700">info</span>
                <span>※ 비회원 주문은 제출하신 **이메일 주소**와 **발급되는 주문번호**로 배송 조회가 가능합니다.</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">주문자 성명 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="홍길동"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">주문 확인용 이메일 주소 <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="order_guest@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">연락처</label>
                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">배송지 주소 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              {/* Toss Payments PG Method Selector */}
              <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2">
                <label className="block text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">credit_card</span>
                  토스페이먼츠 (Toss Payments) 결제 수단 선택
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: '카드', name: '신용·체크카드' },
                    { id: '토스페이', name: '토스페이 (TossPay)' },
                    { id: '계좌이체', name: '실시간 계좌이체' },
                    { id: '가상계좌', name: '가상계좌 (무통장)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between ${
                        paymentMethod === m.id
                          ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{m.name}</span>
                      {paymentMethod === m.id && (
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setCheckoutStep('cart')}
                className="py-3 px-5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
              >
                장바구니로 돌아가기
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors shadow-md"
              >
                {totalPrice.toLocaleString()}원 결제 및 주문완료
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER SUCCESS */}
        {checkoutStep === 'success' && completedOrder && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-1">주문이 정상적으로 접수되었습니다!</h3>
              <p className="text-xs text-slate-500">소중한 상품을 빠르게 배송해 드리겠습니다.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold border-b border-slate-200 pb-2 text-slate-900">
                <span>주문 번호 (Order ID)</span>
                <span className="font-mono text-amber-800">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-1">
                <span>주문자 / 이메일</span>
                <span>{completedOrder.customerName} ({completedOrder.customerEmail})</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>총 결제금액</span>
                <span className="font-bold text-slate-900">{completedOrder.totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 text-left">
              <p className="font-bold mb-1">💡 배송 조회 안내</p>
              <p>비회원은 **마이페이지({completedOrder.customerEmail})** 및 **비회원 배송조회**에서 주문번호({completedOrder.id})를 입력하여 실시간 배송 상태를 조회할 수 있습니다.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onClose();
                  navigate('/mypage');
                }}
                className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 shadow-sm"
              >
                배송조회 (마이페이지 이동)
              </button>
              <button
                onClick={onClose}
                className="py-3 px-6 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
              >
                쇼핑 계속하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
