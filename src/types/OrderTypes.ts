export interface CartItem {
  productId: string;
  code: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  imageUrl: string;
  brand: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type CourierCompany = 'CJ대한통운' | '로젠택배' | '한진택배';

export interface Order {
  id: string; // e.g. 'ORD-20260723-8821'
  orderType: 'member' | 'guest'; // 회원 / 비회원
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: '주문접수' | '배송중' | '배송완료' | '주문취소';
  courier?: CourierCompany;
  trackingNumber?: string;
  createdAt: string;
}

export const initialOrders: Order[] = [];
