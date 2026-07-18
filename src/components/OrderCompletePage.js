import { db } from '../services/db.js';

export class OrderCompletePage {
  constructor(container) {
    this.container = container;
  }

  async render() {
    const orderId = sessionStorage.getItem('last_order_id');
    const orders = await db.getOrders();
    const order = orders.find(o => o.id === orderId);
    const shopSettings = await db.getShopSettings();
    const cur = shopSettings.currency;

    if (!order) {
      this.container.innerHTML = `
        <div class="checkout-empty-wrapper">
          <div class="checkout-empty-card">
            <h2>주문 정보를 찾을 수 없습니다</h2>
            <p style="color:var(--text-secondary);margin-bottom:2rem;">유효하지 않은 접근입니다.</p>
            <a href="#/" class="btn-primary">메인으로 돌아가기</a>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="order-complete-wrapper">
        <div class="order-complete-card">
          <div class="order-success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h1 class="order-complete-title">주문이 접수되었습니다!</h1>
          <p class="order-complete-subtitle">아래 계좌로 입금이 확인되면 상품을 발송해 드립니다.</p>
          
          <div class="order-info-box">
            <div class="order-info-row">
              <span class="order-info-label">주문번호</span>
              <span class="order-info-value" style="color:var(--accent-rose-gold);font-weight:700;">${this.escapeHtml(order.id)}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">주문일시</span>
              <span class="order-info-value">${new Date(order.createdAt).toLocaleString('ko-KR')}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">결제 금액</span>
              <span class="order-info-value" style="font-size:1.2rem;font-weight:700;">${cur}${order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div class="bank-info-box" style="margin:2rem 0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            <div>
              <div class="bank-info-label">입금 계좌</div>
              <div class="bank-info-value">${this.escapeHtml(shopSettings.bankInfo)}</div>
            </div>
          </div>

          <div class="order-items-summary">
            <h4 style="margin-bottom:1rem;">주문 상품</h4>
            ${order.items.map(item => `
              <div class="checkout-item-row">
                <img src="${this.escapeHtml(item.imageUrl)}" alt="${this.escapeHtml(item.title)}" class="checkout-item-thumb">
                <div class="checkout-item-detail">
                  <div class="checkout-item-name">${this.escapeHtml(item.title)}</div>
                  <div class="checkout-item-meta">${cur}${item.price.toLocaleString()} × ${item.qty}</div>
                </div>
                <div class="checkout-item-total">${cur}${(item.price * item.qty).toLocaleString()}</div>
              </div>
            `).join('')}
          </div>

          <div style="display:flex;gap:1rem;margin-top:2.5rem;justify-content:center;">
            <a href="#/" class="btn-primary">쇼핑 계속하기</a>
            <a href="#/products" class="btn-secondary" style="display:inline-flex;align-items:center;gap:0.5rem;">제품 둘러보기</a>
          </div>
        </div>
      </div>
    `;

    // 세션에서 주문 ID 제거 (새로고침 방지)
    sessionStorage.removeItem('last_order_id');
  }

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
