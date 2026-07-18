import { db } from '../services/db.js';

export class CartDrawer {
  constructor(containerEl, onNavigateCheckout) {
    this.containerEl = containerEl;
    this.onNavigateCheckout = onNavigateCheckout;
    this.isOpen = false;
    this.cart = [];
    this.shopSettings = null;
  }

  async init() {
    this.shopSettings = await db.getShopSettings();
    this.cart = await db.getCart();
    this.injectDrawer();
    this.setupEvents();
  }

  injectDrawer() {
    // 이미 DOM에 존재하면 제거 후 재생성
    const old = document.getElementById('cart-drawer-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'cart-drawer-overlay';
    overlay.className = 'cart-overlay';
    overlay.innerHTML = `
      <aside class="cart-drawer" id="cart-drawer-panel">
        <div class="cart-drawer-header">
          <h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            장바구니
          </h3>
          <button class="cart-close-btn" id="cart-close-btn">&times;</button>
        </div>
        <div class="cart-drawer-body" id="cart-drawer-body">
          <!-- 동적 렌더링 -->
        </div>
        <div class="cart-drawer-footer" id="cart-drawer-footer">
          <!-- 합계/주문 버튼 -->
        </div>
      </aside>
    `;
    document.body.appendChild(overlay);
    this.overlayEl = overlay;
    this.renderItems();
  }

  renderItems() {
    const body = document.getElementById('cart-drawer-body');
    const footer = document.getElementById('cart-drawer-footer');

    if (this.cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>장바구니가 비어 있습니다.</p>
        </div>
      `;
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = this.cart.map(item => `
      <div class="cart-item" data-product-id="${item.productId}">
        <img src="${this.escapeHtml(item.imageUrl)}" alt="${this.escapeHtml(item.title)}" class="cart-item-img">
        <div class="cart-item-info">
          <div class="cart-item-title">${this.escapeHtml(item.title)}</div>
          <div class="cart-item-price">${this.shopSettings.currency}${item.price.toLocaleString()}</div>
          <div class="cart-item-qty-row">
            <button class="qty-btn qty-minus" data-id="${item.productId}">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn qty-plus" data-id="${item.productId}">+</button>
            <button class="cart-item-remove" data-id="${item.productId}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = this.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingFee = subtotal >= this.shopSettings.freeShippingThreshold ? 0 : this.shopSettings.shippingFee;
    const total = subtotal + shippingFee;
    const freeShipDiff = this.shopSettings.freeShippingThreshold - subtotal;

    footer.innerHTML = `
      ${freeShipDiff > 0 ? `<div class="cart-free-ship-msg">${this.shopSettings.currency}${freeShipDiff.toLocaleString()} 더 담으면 <strong>무료배송!</strong></div>` : '<div class="cart-free-ship-msg cart-free-ship-done">🎉 무료배송 적용!</div>'}
      <div class="cart-summary-row"><span>소계</span><span>${this.shopSettings.currency}${subtotal.toLocaleString()}</span></div>
      <div class="cart-summary-row"><span>배송비</span><span>${shippingFee === 0 ? '무료' : this.shopSettings.currency + shippingFee.toLocaleString()}</span></div>
      <div class="cart-summary-row cart-total"><span>합계</span><span>${this.shopSettings.currency}${total.toLocaleString()}</span></div>
      <button class="btn-primary btn-checkout" id="btn-go-checkout">주문하기</button>
    `;
  }

  setupEvents() {
    // 오버레이 클릭 닫기
    this.overlayEl.addEventListener('click', (e) => {
      if (e.target === this.overlayEl) this.close();
    });

    // 닫기 버튼
    document.getElementById('cart-close-btn').addEventListener('click', () => this.close());

    // 수량 변경/삭제/주문 이벤트 위임
    this.overlayEl.addEventListener('click', async (e) => {
      const minusBtn = e.target.closest('.qty-minus');
      const plusBtn = e.target.closest('.qty-plus');
      const removeBtn = e.target.closest('.cart-item-remove');
      const checkoutBtn = e.target.closest('#btn-go-checkout');

      if (minusBtn) {
        const id = minusBtn.dataset.id;
        const item = this.cart.find(i => i.productId === id);
        if (item && item.qty > 1) {
          item.qty -= 1;
          await db.updateCart(this.cart);
          this.renderItems();
          this.updateBadge();
        }
      }

      if (plusBtn) {
        const id = plusBtn.dataset.id;
        const item = this.cart.find(i => i.productId === id);
        if (item) {
          item.qty += 1;
          await db.updateCart(this.cart);
          this.renderItems();
          this.updateBadge();
        }
      }

      if (removeBtn) {
        const id = removeBtn.dataset.id;
        this.cart = await db.removeFromCart(id);
        this.renderItems();
        this.updateBadge();
      }

      if (checkoutBtn) {
        this.close();
        if (this.onNavigateCheckout) this.onNavigateCheckout();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.overlayEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) this.close();
    else this.open();
  }

  async refresh() {
    this.cart = await db.getCart();
    this.renderItems();
    this.updateBadge();
  }

  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const totalQty = this.cart.reduce((s, i) => s + i.qty, 0);
      badge.textContent = totalQty;
      badge.style.display = totalQty > 0 ? 'flex' : 'none';
    }
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
