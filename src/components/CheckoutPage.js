import { db } from '../services/db.js';

export class CheckoutPage {
  constructor(container) {
    this.container = container;
    this.cart = [];
    this.shopSettings = null;
  }

  async render() {
    this.cart = await db.getCart();
    this.shopSettings = await db.getShopSettings();

    if (this.cart.length === 0) {
      this.container.innerHTML = `
        <div class="checkout-empty-wrapper">
          <div class="checkout-empty-card">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3;margin-bottom:1.5rem"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <h2>장바구니가 비어 있습니다</h2>
            <p style="color:var(--text-secondary);margin-bottom:2rem;">먼저 상품을 장바구니에 담아주세요.</p>
            <a href="#/" class="btn-primary">쇼핑 계속하기</a>
          </div>
        </div>
      `;
      return;
    }

    const subtotal = this.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingFee = subtotal >= this.shopSettings.freeShippingThreshold ? 0 : this.shopSettings.shippingFee;
    const total = subtotal + shippingFee;
    const cur = this.shopSettings.currency;

    this.container.innerHTML = `
      <div class="checkout-wrapper">
        <div class="checkout-header">
          <a href="#/" class="checkout-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            쇼핑 계속하기
          </a>
          <h1>주문서 작성</h1>
        </div>

        <div class="checkout-grid">
          <!-- 좌측: 주문 정보 입력 -->
          <div class="checkout-form-section">
            <form id="checkout-form">
              <div class="editor-card">
                <h3>주문자 정보</h3>
                <div class="editor-row">
                  <div class="form-group">
                    <label class="form-label" for="co-name">이름 *</label>
                    <input type="text" id="co-name" class="form-control" required placeholder="홍길동">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="co-phone">연락처 *</label>
                    <input type="tel" id="co-phone" class="form-control" required placeholder="010-1234-5678">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="co-email">이메일</label>
                  <input type="email" id="co-email" class="form-control" placeholder="example@email.com">
                </div>
                <div class="editor-row">
                  <div class="form-group">
                    <label class="form-label" for="co-zipcode">우편번호</label>
                    <input type="text" id="co-zipcode" class="form-control" placeholder="12345">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="co-address">배송 주소 *</label>
                    <input type="text" id="co-address" class="form-control" required placeholder="서울특별시 강남구...">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="co-memo">배송 메모</label>
                  <textarea id="co-memo" class="form-control" rows="2" placeholder="문 앞에 놓아주세요, 부재 시 연락 부탁드립니다 등"></textarea>
                </div>
              </div>

              <div class="editor-card">
                <h3>결제 안내 (무통장 입금)</h3>
                <div class="bank-info-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  <div>
                    <div class="bank-info-label">입금 계좌</div>
                    <div class="bank-info-value">${this.escapeHtml(this.shopSettings.bankInfo)}</div>
                  </div>
                </div>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-top:1rem;">주문 완료 후 위 계좌로 입금해 주시면 확인 후 발송됩니다.</p>
              </div>

              <div id="checkout-error" class="error-message" style="display:none;margin-bottom:1rem;"></div>

              <button type="submit" class="btn-primary btn-save" style="width:100%;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ${cur}${total.toLocaleString()} 주문 확정하기
              </button>
            </form>
          </div>

          <!-- 우측: 주문 요약 -->
          <div class="checkout-summary-section">
            <div class="editor-card checkout-summary-card">
              <h3>주문 상품 (${this.cart.reduce((s, i) => s + i.qty, 0)}개)</h3>
              <div class="checkout-items-list">
                ${this.cart.map(item => `
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
              <div class="checkout-divider"></div>
              <div class="cart-summary-row"><span>소계</span><span>${cur}${subtotal.toLocaleString()}</span></div>
              <div class="cart-summary-row"><span>배송비</span><span>${shippingFee === 0 ? '무료' : cur + shippingFee.toLocaleString()}</span></div>
              <div class="cart-summary-row cart-total"><span>최종 결제 금액</span><span>${cur}${total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupFormEvents(subtotal, shippingFee, total);
  }

  setupFormEvents(subtotal, shippingFee, total) {
    const form = this.container.querySelector('#checkout-form');
    const errorDiv = this.container.querySelector('#checkout-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.style.display = 'none';

      const name = this.container.querySelector('#co-name').value.trim();
      const phone = this.container.querySelector('#co-phone').value.trim();
      const email = this.container.querySelector('#co-email').value.trim();
      const zipcode = this.container.querySelector('#co-zipcode').value.trim();
      const address = this.container.querySelector('#co-address').value.trim();
      const memo = this.container.querySelector('#co-memo').value.trim();

      if (!name || !phone || !address) {
        errorDiv.textContent = '이름, 연락처, 배송 주소는 필수 항목입니다.';
        errorDiv.style.display = 'block';
        return;
      }

      try {
        const order = await db.addOrder({
          items: this.cart.map(i => ({ ...i })),
          customer: { name, phone, email, address, zipcode, memo },
          subtotal,
          shippingFee,
          totalAmount: total
        });

        await db.clearCart();
        // 주문 완료 페이지로 이동 (주문 ID를 sessionStorage에 임시 저장)
        sessionStorage.setItem('last_order_id', order.id);
        window.location.hash = '#/order-complete';
      } catch (err) {
        errorDiv.textContent = '주문 처리 중 오류가 발생했습니다: ' + err.message;
        errorDiv.style.display = 'block';
      }
    });
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
