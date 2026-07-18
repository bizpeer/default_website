import { db } from '../services/db.js';

export class ShopPages {
  constructor(container, subPath, cartDrawer = null) {
    this.container = container;
    this.subPath = subPath; // '', '/login', '/register', '/mypage', '/orders', '/checkout', '/order-complete', '/product/...' 등
    this.cartDrawer = cartDrawer;
    this.contents = null;
    this.shopSettings = null;
  }

  async render() {
    this.contents = await db.getContent();
    this.shopSettings = await db.getShopSettings();

    const path = this.subPath;
    const isShopHome = path === '' || path === '/' || path.startsWith('?');

    if (isShopHome) {
      this.renderShopHome();
    } else if (path.startsWith('/product/')) {
      const productId = path.replace('/product/', '');
      this.renderShopProductDetail(productId);
    } else if (path === '/login') {
      this.renderLogin();
    } else if (path === '/register') {
      this.renderRegister();
    } else if (path === '/mypage') {
      this.renderMyPage();
    } else if (path === '/orders') {
      this.renderGuestOrderLookup();
    } else if (path === '/checkout') {
      this.renderCheckout();
    } else if (path === '/order-complete') {
      this.renderOrderComplete();
    }
  }

  // 쇼핑몰 홈 상품 판매 목록
  renderShopHome() {
    let categoryFilter = 'all';
    if (this.subPath.includes('?')) {
      const queryString = this.subPath.substring(this.subPath.indexOf('?'));
      const params = new URLSearchParams(queryString);
      categoryFilter = params.get('cat') || 'all';
    }

    let list = this.contents.products || [];
    if (categoryFilter !== 'all') {
      list = list.filter(product => product.category === categoryFilter);
    }

    const cur = this.shopSettings.currency;

    const categoryTitles = {
      'all': '전체 상품 컬렉션',
      'skincare': '기초화장품 컬렉션',
      'makeup': '색조화장품 컬렉션',
      'device': '인텔리전트 미용기구'
    };
    const activeTitle = categoryTitles[categoryFilter] || 'AETERNO Online Store';

    this.container.innerHTML = `
      <section style="padding: 4rem 0; min-height: 80vh;" class="animate-fade-in-up">
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 3rem; border-bottom:1px solid var(--border-glass); padding-bottom:1rem;">
            <div>
              <h1 style="font-size: 2.2rem; color: #fff; font-family: var(--font-display);">${activeTitle}</h1>
              <p style="color: var(--text-secondary); margin-top:0.25rem;">최고급 프리미엄 스킨케어와 미용 제품을 엄선하여 소개합니다.</p>
            </div>
            <div>
              <a href="#/shop/orders" class="btn-secondary" style="font-size:0.9rem; border-radius: 50px;">비회원 주문 조회</a>
            </div>
          </div>

          ${list.length === 0 ? `
            <div style="text-align:center; padding:5rem; color:var(--text-muted); background:var(--bg-secondary); border:1px solid var(--border-glass); border-radius:28px;">
              이 카테고리에 등록된 상품이 없습니다.
            </div>
          ` : `
            <div class="products-grid">
              ${list.map(product => {
                let categoryLabel = '';
                if (product.category === 'skincare') categoryLabel = '기초화장품';
                else if (product.category === 'makeup') categoryLabel = '색조화장품';
                else if (product.category === 'device') categoryLabel = '미용기구';

                const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
                const isSoldOut = product.isSoldOut || product.stock <= 0;

                return `
                  <div class="product-card ${isSoldOut ? 'sold-out' : ''}" style="border-radius: 28px;">
                    <div class="product-image-wrapper" style="cursor: pointer;" onclick="window.location.hash='#/shop/product/${product.id}'">
                      <img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}" loading="lazy">
                      <span class="product-category-tag">${categoryLabel}</span>
                      ${isSoldOut ? '<span class="product-soldout-tag" style="border-radius:12px; backdrop-filter:blur(4px);">SOLD OUT</span>' : ''}
                      ${hasDiscount ? `<span class="product-discount-tag">-${discountPct}%</span>` : ''}
                    </div>
                    <div class="product-info">
                      <h3 style="cursor: pointer; font-size: 1.2rem; color: #fff;" onclick="window.location.hash='#/shop/product/${product.id}'">${this.escapeHtml(product.title)}</h3>
                      <p style="margin-bottom:1rem; font-size: 0.88rem; color: var(--text-secondary);">${this.escapeHtml(product.desc)}</p>
                      <div class="product-price-row" style="margin-bottom: 1rem;">
                        ${hasDiscount ? `<span class="product-original-price">${cur}${product.originalPrice.toLocaleString()}</span>` : ''}
                        <span class="product-current-price">${cur}${product.price.toLocaleString()}</span>
                      </div>
                      <button class="btn-add-to-cart" data-product-id="${product.id}" ${isSoldOut ? 'disabled' : ''} style="border-radius: 50px;">
                        ${isSoldOut ? '품절' : `
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                          장바구니 담기
                        `}
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </section>
    `;

    this.setupCartEvents();
  }

  // 쇼핑몰 상품 상세 보기
  renderShopProductDetail(productId) {
    const product = this.contents.products.find(p => p.id === productId);
    if (!product) {
      this.container.innerHTML = `<div style="padding:8rem; text-align:center;"><h3>상품을 찾을 수 없습니다.</h3><a href="#/shop" class="btn-primary">쇼핑 홈으로</a></div>`;
      return;
    }

    const cur = this.shopSettings.currency;
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const isSoldOut = product.isSoldOut || product.stock <= 0;

    let categoryLabel = '';
    if (product.category === 'skincare') categoryLabel = '기초화장품';
    else if (product.category === 'makeup') categoryLabel = '색조화장품';
    else if (product.category === 'device') categoryLabel = '미용기구';

    this.container.innerHTML = `
      <section style="padding: 4rem 0; min-height: 80vh; text-align:left;" class="animate-fade-in-up">
        <div class="container">
          <a href="#/shop" style="display:inline-flex; align-items:center; gap:0.25rem; color:var(--text-secondary); margin-bottom:2.5rem; font-size:0.95rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            쇼핑 리스트로 돌아가기
          </a>
          
          <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 4.5rem; align-items: start;">
            <div style="border-radius:28px; overflow:hidden; border:1px solid var(--border-glass); position:relative;">
              <img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}" style="width:100%; height:auto; display:block;">
              ${isSoldOut ? '<span class="product-soldout-tag" style="padding:1rem 2.5rem; font-size:1.5rem; border-radius:16px;">SOLD OUT</span>' : ''}
            </div>
            <div>
              <span style="font-size:0.9rem; color:var(--accent-rose-gold); font-weight:600; text-transform:uppercase;">${categoryLabel}</span>
              <h1 style="font-size:2.6rem; color:#fff; margin: 0.5rem 0 1rem; line-height:1.2;">${this.escapeHtml(product.title)}</h1>
              <p style="font-size:1.05rem; color:var(--text-secondary); line-height:1.6; margin-bottom:2rem;">
                ${this.escapeHtml(product.desc)}
              </p>

              <div class="product-price-row" style="margin-bottom: 2rem; border-bottom:1px solid var(--border-glass); padding-bottom:1.5rem;">
                ${hasDiscount ? `
                  <div style="display:flex; flex-direction:column;">
                    <span style="font-size:0.85rem; color:var(--text-muted); text-decoration:line-through;">정가 ${cur}${product.originalPrice.toLocaleString()}</span>
                    <span style="font-size:1.6rem; font-weight:700; color:var(--accent-rose-gold);">${cur}${product.price.toLocaleString()} <span style="font-size:1.15rem; color:var(--error);">(-${discountPct}%)</span></span>
                  </div>
                ` : `
                  <span style="font-size:1.6rem; font-weight:700; color:var(--accent-rose-gold);">${cur}${product.price.toLocaleString()}</span>
                `}
              </div>
              
              <div class="editor-card" style="padding:1.5rem; margin-bottom:2rem; background:rgba(255,255,255,0.01); border-radius: 20px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="color:var(--text-secondary); font-size:0.9rem;">구매 수량</span>
                  <div style="display:flex; align-items:center; gap:0.5rem;">
                    <button class="qty-btn" id="detail-qty-minus" style="border-radius: 8px;">−</button>
                    <span class="qty-value" id="detail-qty-value">1</span>
                    <button class="qty-btn" id="detail-qty-plus" style="border-radius: 8px;">+</button>
                  </div>
                </div>
              </div>

              <div style="display:flex; gap:1rem;">
                <button class="btn-primary" id="detail-btn-buy" style="flex:1.5; padding:1rem; border-radius: 50px;" ${isSoldOut ? 'disabled' : ''}>${isSoldOut ? '품절' : '바로 구매하기'}</button>
                <button class="btn-secondary" id="detail-btn-cart" style="flex:1; padding:1rem; border-radius: 50px; border-color:var(--accent-rose-gold); color:var(--accent-rose-gold);" ${isSoldOut ? 'disabled' : ''}>장바구니 담기</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    this.setupDetailPageEvents(product);
  }

  // 로그인 화면
  renderLogin() {
    this.container.innerHTML = `
      <div class="admin-login-wrapper animate-fade-in-up">
        <div class="admin-card" style="border-radius: 28px;">
          <h2>SHOP LOGIN</h2>
          <p class="subtitle">AETERNO 쇼핑몰 로그인을 진행하세요.</p>
          
          <form id="shop-login-form">
            <div class="form-group">
              <label class="form-label" for="shop-email">이메일 주소</label>
              <input type="email" id="shop-email" class="form-control" required placeholder="example@email.com" autofocus>
            </div>
            <div class="form-group">
              <label class="form-label" for="shop-password">비밀번호</label>
              <input type="password" id="shop-password" class="form-control" required placeholder="••••••••">
            </div>
            <div id="shop-login-error" class="error-message" style="display: none;"></div>
            <button type="submit" class="btn-primary btn-block" style="border-radius: 50px;">로그인</button>
            <div style="margin-top:1.5rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">
              아직 회원이 아니신가요? <a href="#/shop/register" style="color:var(--accent-rose-gold); font-weight:600;">회원가입하기</a>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupLoginFormEvents();
  }

  // 회원가입 화면
  renderRegister() {
    this.container.innerHTML = `
      <div class="admin-login-wrapper animate-fade-in-up">
        <div class="admin-card" style="max-width: 500px; border-radius: 28px;">
          <h2>SIGN UP</h2>
          <p class="subtitle">자사몰 가입 후 특별한 등급별 혜택을 받아보세요.</p>
          
          <form id="shop-register-form">
            <div class="form-group">
              <label class="form-label" for="reg-email">이메일 주소 *</label>
              <input type="email" id="reg-email" class="form-control" required placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-name">이름 *</label>
              <input type="text" id="reg-name" class="form-control" required placeholder="홍길동">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-phone">연락처 *</label>
              <input type="tel" id="reg-phone" class="form-control" required placeholder="010-1234-5678">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-address">기본 배송 주소</label>
              <input type="text" id="reg-address" class="form-control" placeholder="서울특별시 강남구...">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-password">비밀번호 *</label>
              <input type="password" id="reg-password" class="form-control" required placeholder="6자리 이상 비밀번호" minlength="6">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-confirm">비밀번호 확인 *</label>
              <input type="password" id="reg-confirm" class="form-control" required placeholder="비밀번호 다시 입력" minlength="6">
            </div>
            <div id="shop-register-error" class="error-message" style="display: none;"></div>
            <button type="submit" class="btn-primary btn-block" style="border-radius: 50px;">회원 가입 완료</button>
            <div style="margin-top:1.5rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">
              이미 계정이 있으신가요? <a href="#/shop/login" style="color:var(--accent-rose-gold); font-weight:600;">로그인하기</a>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupRegisterFormEvents();
  }

  // 쇼핑몰 마이페이지
  async renderMyPage() {
    const userSession = sessionStorage.getItem('shop_user');
    if (!userSession) {
      window.location.hash = '#/shop/login';
      return;
    }
    const user = JSON.parse(userSession);
    const allOrders = await db.getOrders();
    const myOrders = allOrders.filter(o => o.customer.email === user.email);

    const statusLabels = {
      'pending': '입금 대기',
      'paid': '입금 확인',
      'shipping': '배송 중',
      'delivered': '배송 완료',
      'cancelled': '취소'
    };

    this.container.innerHTML = `
      <section style="padding: 4rem 0; min-height: 80vh; text-align:left;" class="animate-fade-in-up">
        <div class="container">
          <div style="border-bottom:1px solid var(--border-glass); padding-bottom:1rem; margin-bottom:3rem;">
            <h1 style="font-size: 2.2rem; color: #fff; font-family: var(--font-display);">My Page</h1>
            <p style="color: var(--text-secondary); margin-top:0.25rem;"><strong>${this.escapeHtml(user.name)}</strong>님의 개인 주문 및 배송 상태를 확인합니다.</p>
          </div>

          <div class="checkout-grid">
            <div>
              <h3 style="color:#fff; margin-bottom:1.5rem;">주문 내역 (${myOrders.length}건)</h3>
              <div class="orders-list">
                ${myOrders.length === 0 ? `
                  <div style="text-align:center; padding:4rem; color:var(--text-muted); background:var(--bg-secondary); border:1px solid var(--border-glass); border-radius:24px;">주문 내역이 없습니다.</div>
                ` : myOrders.map(order => `
                  <div class="order-row" style="background:var(--bg-secondary); border-radius: 20px;">
                    <div class="order-row-header">
                      <div class="order-id-group">
                        <code style="color:var(--accent-rose-gold); font-weight:700;">${order.id}</code>
                        <span style="font-size:0.8rem; color:var(--text-muted);">${new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span class="tag-badge tag-video" style="font-weight:700;">${statusLabels[order.status]}</span>
                    </div>
                    <div style="padding:1.5rem;">
                      <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
                        ${order.items.map(i => `
                          <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:#fff;">${this.escapeHtml(i.title)} × ${i.qty}</span>
                            <span style="color:var(--text-secondary);">${this.shopSettings.currency}${(i.price * i.qty).toLocaleString()}</span>
                          </div>
                        `).join('')}
                      </div>
                      <div style="border-top:1px solid var(--border-glass); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; color:var(--text-muted);">총 배송비: ${order.shippingFee === 0 ? '무료' : this.shopSettings.currency + order.shippingFee.toLocaleString()}</span>
                        <strong style="color:var(--accent-rose-gold); font-size:1.1rem;">총액 ${this.shopSettings.currency}${order.totalAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            <div>
              <div class="editor-card" style="border-radius: 24px;">
                <h3 style="margin-bottom:1.5rem;">가입 회원 정보</h3>
                <div style="display:flex; flex-direction:column; gap:1rem; font-size:0.9rem; color:var(--text-secondary);">
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">이름</span>
                    <strong style="color:#fff;">${this.escapeHtml(user.name)}</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">이메일 계정</span>
                    <strong style="color:#fff;">${this.escapeHtml(user.email)}</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">연락처</span>
                    <strong style="color:#fff;">${this.escapeHtml(user.phone)}</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">등록 배송 주소</span>
                    <strong style="color:#fff;">${this.escapeHtml(user.address || "미등록")}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 비회원 주문조회
  renderGuestOrderLookup() {
    this.container.innerHTML = `
      <div class="admin-login-wrapper animate-fade-in-up">
        <div class="admin-card" style="border-radius: 28px;">
          <h2>ORDER LOOKUP</h2>
          <p class="subtitle">비회원 주문서 및 배송 조회를 위해 정보를 입력하세요.</p>
          
          <form id="shop-lookup-form">
            <div class="form-group">
              <label class="form-label" for="lookup-id">주문번호 (ORD-YYYYMMDD-XXX)</label>
              <input type="text" id="lookup-id" class="form-control" required placeholder="주문 완료 시 발급받은 번호">
            </div>
            <div class="form-group">
              <label class="form-label" for="lookup-phone">주문자 연락처</label>
              <input type="tel" id="lookup-phone" class="form-control" required placeholder="010-1234-5678">
            </div>
            <div id="shop-lookup-error" class="error-message" style="display: none;"></div>
            <button type="submit" class="btn-primary btn-block" style="border-radius: 50px;">주문 내역 조회</button>
          </form>
        </div>
      </div>
      
      <!-- 조회 결과 모달 -->
      <div id="lookup-result-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width:550px; text-align:left; border-radius: 28px;">
          <h3 class="modal-title">조회된 주문 내역</h3>
          <div id="lookup-result-body" style="margin-top:1.5rem;"></div>
          <button class="btn-secondary" id="btn-close-lookup-modal" style="width:100%; margin-top:2rem; border-radius: 50px;">닫기</button>
        </div>
      </div>
    `;

    this.setupLookupEvents();
  }

  // 주문서 작성
  async renderCheckout() {
    const cart = await db.getCart();
    if (cart.length === 0) {
      this.container.innerHTML = `
        <div class="checkout-empty-wrapper animate-fade-in-up">
          <div class="checkout-empty-card">
            <h2>장바구니가 비어 있습니다</h2>
            <a href="#/shop" class="btn-primary" style="margin-top:1.5rem; border-radius: 50px;">쇼핑 계속하기</a>
          </div>
        </div>
      `;
      return;
    }

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingFee = subtotal >= this.shopSettings.freeShippingThreshold ? 0 : this.shopSettings.shippingFee;
    const total = subtotal + shippingFee;
    const cur = this.shopSettings.currency;

    const userSession = sessionStorage.getItem('shop_user');
    const user = userSession ? JSON.parse(userSession) : null;

    this.container.innerHTML = `
      <div class="checkout-wrapper animate-fade-in-up" style="text-align:left;">
        <div class="checkout-header">
          <a href="#/shop" class="checkout-back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            쇼핑 계속하기
          </a>
          <h1>주문서 작성</h1>
        </div>

        <div class="checkout-grid">
          <div class="checkout-form-section">
            <form id="checkout-order-form">
              <div class="editor-card" style="border-radius: 24px;">
                <h3>배송 정보 입력</h3>
                <div class="editor-row">
                  <div class="form-group">
                    <label class="form-label" for="co-name">주문자명 *</label>
                    <input type="text" id="co-name" class="form-control" required value="${user ? this.escapeHtml(user.name) : ''}" placeholder="홍길동">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="co-phone">연락처 *</label>
                    <input type="tel" id="co-phone" class="form-control" required value="${user ? this.escapeHtml(user.phone) : ''}" placeholder="010-1234-5678">
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="co-email">이메일 주소 *</label>
                  <input type="email" id="co-email" class="form-control" required value="${user ? this.escapeHtml(user.email) : ''}" placeholder="example@email.com">
                </div>
                <div class="form-group">
                  <label class="form-label" for="co-address">배송지 주소 *</label>
                  <input type="text" id="co-address" class="form-control" required value="${user ? this.escapeHtml(user.address) : ''}" placeholder="서울특별시..." autofocus>
                </div>
                <div class="form-group">
                  <label class="form-label" for="co-memo">배송 요청 사항</label>
                  <textarea id="co-memo" class="form-control" rows="2" placeholder="경비실에 맡겨주세요 등"></textarea>
                </div>
              </div>

              <div class="editor-card" style="border-radius: 24px;">
                <h3>결제 안내 (무통장 입금)</h3>
                <div class="bank-info-box" style="border-radius:16px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                  <div>
                    <div class="bank-info-label">입금 계좌</div>
                    <div class="bank-info-value">${this.escapeHtml(this.shopSettings.bankInfo)}</div>
                  </div>
                </div>
              </div>

              <div id="checkout-error" class="error-message" style="display:none; margin-bottom:1.5rem;"></div>

              <button type="submit" class="btn-primary" style="width:100%; padding:1rem; font-weight:700; border-radius: 50px;">
                ${cur}${total.toLocaleString()} 최종 주문하기
              </button>
            </form>
          </div>

          <div class="checkout-summary-section">
            <div class="editor-card checkout-summary-card" style="border-radius: 24px;">
              <h3>주문 내역</h3>
              <div class="checkout-items-list">
                ${cart.map(item => `
                  <div class="checkout-item-row">
                    <img src="${this.escapeHtml(item.imageUrl)}" alt="${item.title}" class="checkout-item-thumb" style="border-radius: 8px;">
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
              <div class="cart-summary-row cart-total"><span>합계</span><span>${cur}${total.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupCheckoutFormEvents(cart, subtotal, shippingFee, total);
  }

  // 주문 완료 안내
  async renderOrderComplete() {
    const orderId = sessionStorage.getItem('last_order_id');
    const orders = await db.getOrders();
    const order = orders.find(o => o.id === orderId);
    const cur = this.shopSettings.currency;

    if (!order) {
      this.container.innerHTML = `
        <div class="checkout-empty-wrapper animate-fade-in-up">
          <div class="checkout-empty-card">
            <h2>주문 정보를 조회할 수 없습니다.</h2>
            <a href="#/shop" class="btn-primary" style="margin-top:1.5rem; border-radius: 50px;">쇼핑 계속하기</a>
          </div>
        </div>
      `;
      return;
    }

    this.container.innerHTML = `
      <div class="order-complete-wrapper animate-fade-in-up">
        <div class="order-complete-card">
          <div class="order-success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h1 class="order-complete-title">주문서 접수가 완료되었습니다.</h1>
          <p class="order-complete-subtitle">안내된 가상 계좌로 입금해 주시면 확인 후 신속 배송해 드립니다.</p>

          <div class="order-info-box" style="border-radius: 20px;">
            <div class="order-info-row">
              <span class="order-info-label">주문번호</span>
              <span class="order-info-value" style="color:var(--accent-rose-gold); font-weight:700;">${order.id}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">총 결제금액</span>
              <span class="order-info-value" style="font-weight:700;">${cur}${order.totalAmount.toLocaleString()}</span>
            </div>
            <div class="order-info-row">
              <span class="order-info-label">주문 일시</span>
              <span class="order-info-value">${new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          <div class="bank-info-box" style="margin: 2rem 0; border-radius:16px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
            <div>
              <div class="bank-info-label">입금 계좌</div>
              <div class="bank-info-value">${this.escapeHtml(this.shopSettings.bankInfo)}</div>
            </div>
          </div>

          <div style="display:flex; gap:1rem; justify-content:center; margin-top:2.5rem;">
            <a href="#/shop" class="btn-primary" style="border-radius: 50px;">계속 쇼핑하기</a>
            <a href="#/" class="btn-secondary" style="border-radius: 50px;">기업 홈페이지로</a>
          </div>
        </div>
      </div>
    `;

    sessionStorage.removeItem('last_order_id');
  }

  // ─── 이벤트 바인딩 ───

  setupCartEvents() {
    const grid = this.container.querySelector('.products-grid');
    if (!grid) return;

    grid.addEventListener('click', async (e) => {
      const addBtn = e.target.closest('.btn-add-to-cart');
      if (addBtn && !addBtn.disabled) {
        const id = addBtn.dataset.productId;
        const product = this.contents.products.find(p => p.id === id);
        if (product && this.cartDrawer) {
          await db.addToCart(product, 1);
          addBtn.textContent = '✓ 담았습니다!';
          addBtn.style.background = 'var(--accent-emerald)';
          addBtn.style.borderColor = 'transparent';
          
          setTimeout(() => {
            addBtn.innerHTML = `
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              장바구니 담기
            `;
            addBtn.style.background = '';
            addBtn.style.borderColor = '';
          }, 1200);

          await this.cartDrawer.refresh();
        }
      }
    });
  }

  setupDetailPageEvents(product) {
    const qtyValue = this.container.querySelector('#detail-qty-value');
    const minusBtn = this.container.querySelector('#detail-qty-minus');
    const plusBtn = this.container.querySelector('#detail-qty-plus');
    const cartBtn = this.container.querySelector('#detail-btn-cart');
    const buyBtn = this.container.querySelector('#detail-btn-buy');

    let currentQty = 1;

    minusBtn.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        qtyValue.textContent = currentQty;
      }
    });

    plusBtn.addEventListener('click', () => {
      currentQty++;
      qtyValue.textContent = currentQty;
    });

    cartBtn.addEventListener('click', async () => {
      if (this.cartDrawer) {
        await db.addToCart(product, currentQty);
        await this.cartDrawer.refresh();
        this.cartDrawer.open();
      }
    });

    buyBtn.addEventListener('click', async () => {
      await db.addToCart(product, currentQty);
      window.location.hash = '#/checkout';
    });
  }

  setupLoginFormEvents() {
    const form = this.container.querySelector('#shop-login-form');
    const errorDiv = this.container.querySelector('#shop-login-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.style.display = 'none';

      const email = form.querySelector('#shop-email').value.trim();
      const password = form.querySelector('#shop-password').value;

      const res = await db.loginShopUser(email, password);
      if (res.success) {
        sessionStorage.setItem('shop_user', JSON.stringify(res.user));
        window.location.hash = '#/shop';
        window.location.reload();
      } else {
        errorDiv.textContent = res.message;
        errorDiv.style.display = 'block';
      }
    });
  }

  setupRegisterFormEvents() {
    const form = this.container.querySelector('#shop-register-form');
    const errorDiv = this.container.querySelector('#shop-register-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.style.display = 'none';

      const email = form.querySelector('#reg-email').value.trim();
      const name = form.querySelector('#reg-name').value.trim();
      const phone = form.querySelector('#reg-phone').value.trim();
      const address = form.querySelector('#reg-address').value.trim();
      const password = form.querySelector('#reg-password').value;
      const confirm = form.querySelector('#reg-confirm').value;

      if (password !== confirm) {
        errorDiv.textContent = "비밀번호가 일치하지 않습니다.";
        errorDiv.style.display = 'block';
        return;
      }

      const res = await db.registerShopUser({ email, name, phone, address, password });
      if (res.success) {
        alert("회원가입이 완료되었습니다. 로그인을 진행해 주세요.");
        window.location.hash = '#/shop/login';
      } else {
        errorDiv.textContent = res.message;
        errorDiv.style.display = 'block';
      }
    });
  }

  setupLookupEvents() {
    const form = this.container.querySelector('#shop-lookup-form');
    const errorDiv = this.container.querySelector('#shop-lookup-error');
    const modal = this.container.querySelector('#lookup-result-modal');
    const resultBody = this.container.querySelector('#lookup-result-body');
    const closeBtn = this.container.querySelector('#btn-close-lookup-modal');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.style.display = 'none';

      const orderId = form.querySelector('#lookup-id').value.trim();
      const phone = form.querySelector('#lookup-phone').value.trim();

      const orders = await db.getOrders();
      const order = orders.find(o => o.id === orderId && o.customer.phone === phone);

      if (order) {
        const statusLabels = {
          'pending': '입금 대기',
          'paid': '입금 확인',
          'shipping': '배송 중',
          'delivered': '배송 완료',
          'cancelled': '취소'
        };

        resultBody.innerHTML = `
          <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid var(--border-glass); padding-bottom:0.5rem;">
            <strong>주문번호: ${order.id}</strong>
            <span style="color:var(--accent-rose-gold); font-weight:700;">${statusLabels[order.status]}</span>
          </div>
          <div style="margin-bottom: 0.3rem;">주문자: ${this.escapeHtml(order.customer.name)}</div>
          <div style="margin-bottom: 0.3rem;">배송지: ${this.escapeHtml(order.customer.address)}</div>
          <div style="margin-top:1rem; font-weight:600; color:#fff;">주문 상품:</div>
          <div style="font-size:0.9rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem;">
            ${order.items.map(i => `<div>- ${this.escapeHtml(i.title)} × ${i.qty}</div>`).join('')}
          </div>
          <div style="margin-top:1.5rem; font-size:1.1rem; text-align:right; font-weight:700; color:var(--accent-rose-gold);">
            총 결제액: ${this.shopSettings.currency}${order.totalAmount.toLocaleString()}
          </div>
        `;
        modal.style.display = 'flex';
      } else {
        errorDiv.textContent = "일치하는 주문 내역이 없습니다. 정보를 다시 확인하세요.";
        errorDiv.style.display = 'block';
      }
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  setupCheckoutFormEvents(cart, subtotal, shippingFee, total) {
    const form = this.container.querySelector('#checkout-order-form');
    const errorDiv = this.container.querySelector('#checkout-error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorDiv.style.display = 'none';

      const name = form.querySelector('#co-name').value.trim();
      const phone = form.querySelector('#co-phone').value.trim();
      const email = form.querySelector('#co-email').value.trim();
      const address = form.querySelector('#co-address').value.trim();
      const memo = form.querySelector('#co-memo').value.trim();

      try {
        const order = await db.addOrder({
          items: cart,
          customer: { name, phone, email, address, memo },
          subtotal,
          shippingFee,
          totalAmount: total
        });

        await db.clearCart();
        sessionStorage.setItem('last_order_id', order.id);
        
        if (this.cartDrawer) {
          await this.cartDrawer.refresh();
        }

        window.location.hash = '#/order-complete';
      } catch (err) {
        errorDiv.textContent = "주문 등록 중 오류가 발생했습니다: " + err.message;
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
