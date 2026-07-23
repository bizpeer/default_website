import { db } from '../services/db.js';
import { CourierTrackingModal } from './CourierTrackingModal.js';

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

    let list = [...(this.contents.products || [])];
    if (categoryFilter !== 'all') {
      list = list.filter(product => product.category === categoryFilter);
    }

    // 🌟 상위 노출 (isFeatured === true) 제품을 최우선 상단에 정렬
    list.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

    const categories = this.contents.categories || [
      { key: "skincare", name: "기초화장품" },
      { key: "makeup", name: "색조화장품" },
      { key: "device", name: "뷰티 디바이스" }
    ];

    const cur = this.shopSettings.currency;
    const matchedCat = categories.find(c => c.key === categoryFilter);
    const activeTitle = categoryFilter === 'all' ? '전체 상품 컬렉션' : (matchedCat ? `${matchedCat.name} 컬렉션` : 'AETERNO Online Store');

    this.container.innerHTML = `
      <section style="padding: 4rem 0; min-height: 80vh;" class="animate-fade-in-up">
        <div class="container">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 3rem; border-bottom:1px solid var(--border-glass); padding-bottom:1rem;">
            <div>
              <h1 style="font-size: 2.2rem; color: #fff; font-family: var(--font-display);">${activeTitle}</h1>
              <p style="color: var(--text-secondary); margin-top:0.25rem;">최고급 프리미엄 스킨케어와 미용 제품을 엄선하여 소개합니다.</p>
            </div>
            <div style="display:flex; gap:0.5rem;">
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
                const foundCat = categories.find(c => c.key === product.category);
                const categoryLabel = foundCat ? foundCat.name : product.category;

                const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                const discountPct = hasDiscount ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
                const isSoldOut = product.isSoldOut || product.stock <= 0;

                return `
                  <div class="product-card ${isSoldOut ? 'sold-out' : ''}" style="border-radius: 28px; position:relative; ${product.isFeatured ? 'border: 1px solid rgba(255,215,0,0.4);' : ''}">
                    <div class="product-image-wrapper" style="cursor: pointer;" onclick="window.location.hash='#/shop/product/${product.id}'">
                      ${product.isFeatured ? `
                        <span style="position:absolute; top:0.75rem; left:0.75rem; background:linear-gradient(135deg, #ffd700, #ff8c00); color:#000; font-weight:800; font-size:0.7rem; padding:0.2rem 0.6rem; border-radius:30px; box-shadow:0 0 12px rgba(255,215,0,0.6); z-index:3; letter-spacing:0.05em;">
                          ★ BEST 상위 노출
                        </span>
                      ` : ''}
                      <img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}" loading="lazy">
                      <span class="product-category-tag" style="${product.isFeatured ? 'right:0.75rem;' : ''}">${categoryLabel}</span>
                      ${isSoldOut ? '<span class="product-soldout-tag" style="border-radius:12px; backdrop-filter:blur(4px);">SOLD OUT</span>' : ''}
                      ${hasDiscount ? `<span class="product-discount-tag" style="${product.isFeatured ? 'bottom:0.75rem;' : ''}">-${discountPct}%</span>` : ''}
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

    const categories = this.contents.categories || [];
    const foundCat = categories.find(c => c.key === product.category);
    const categoryLabel = foundCat ? foundCat.name : product.category;

    this.container.innerHTML = `
      <section style="padding: 4rem 0; min-height: 80vh; text-align:left;" class="animate-fade-in-up">
        <div class="container">
          <a href="#/shop" style="display:inline-flex; align-items:center; gap:0.25rem; color:var(--text-secondary); margin-bottom:2.5rem; font-size:0.95rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            쇼핑 리스트로 돌아가기
          </a>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:4rem; align-items:start;">
            <div style="border-radius: 28px; overflow:hidden; border:1px solid var(--border-glass); background:#000; position:relative;">
              <img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}" style="width:100%; display:block;">
              ${product.isFeatured ? `<span style="position:absolute; top:1rem; left:1rem; background:linear-gradient(135deg, #ffd700, #ff8c00); color:#000; font-weight:800; font-size:0.8rem; padding:0.25rem 0.8rem; border-radius:30px;">★ BEST 대표 상위 상품</span>` : ''}
            </div>

            <div>
              <span class="product-category-tag" style="position:static; display:inline-block; margin-bottom:1rem; border-radius:30px;">${categoryLabel}</span>
              <h1 style="font-size: 2.2rem; color: #fff; margin-bottom: 0.75rem; font-family: var(--font-display);">${this.escapeHtml(product.title)}</h1>
              <p style="color: var(--text-secondary); font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">${this.escapeHtml(product.desc)}</p>

              <div class="editor-card" style="padding:1.25rem; margin-bottom:2rem; background:rgba(255,255,255,0.02); border-radius:20px;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-size:0.88rem;">
                  <div><span style="color:var(--text-muted);">제형 (Texture):</span> <strong style="color:#fff;">${this.escapeHtml(product.texture || '워터 세럼')}</strong></div>
                  <div><span style="color:var(--text-muted);">피부 타입:</span> <strong style="color:#fff;">${this.escapeHtml(product.skinType || '모든 피부')}</strong></div>
                  <div style="grid-column: span 2;"><span style="color:var(--text-muted);">핵심 성분:</span> <strong style="color:var(--accent-rose-gold);">${this.escapeHtml(product.ingredients || '해양심층수, 인삼추출물')}</strong></div>
                </div>
              </div>

              <div style="margin-bottom: 2.5rem;">
                ${hasDiscount ? `
                  <div style="display:flex; align-items:baseline; gap:0.75rem;">
                    <span style="font-size:1.2rem; text-decoration:line-through; color:var(--text-muted);">${cur}${product.originalPrice.toLocaleString()}</span>
                    <span style="font-size:2.2rem; font-weight:800; color:var(--accent-rose-gold);">${cur}${product.price.toLocaleString()}</span>
                    <span class="product-discount-tag" style="position:static; font-size:0.9rem; border-radius:12px;">-${discountPct}%</span>
                  </div>
                ` : `
                  <span style="font-size:2.2rem; font-weight:800; color:var(--accent-rose-gold);">${cur}${product.price.toLocaleString()}</span>
                `}
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

  // 로그인 화면 (Google/네이버 소셜 로그인 지원)
  renderLogin() {
    this.container.innerHTML = `
      <div class="admin-login-wrapper animate-fade-in-up">
        <div class="admin-card" style="border-radius: 28px; max-width:440px;">
          <h2>STORE LOGIN</h2>
          <p class="subtitle">AETERNO 브랜드 자사몰 회원 로그인을 진행하세요.</p>

          <!-- 소셜 로그인 1초 시작 버튼 -->
          <div style="margin-bottom:1.5rem;">
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <button type="button" class="btn-social-google" id="btn-google-login" style="display:flex; align-items:center; justify-content:center; gap:0.75rem; width:100%; padding:0.85rem; background:#ffffff; color:#000000; border-radius:50px; font-weight:700; border:none; cursor:pointer; font-size:0.95rem; box-shadow:0 4px 15px rgba(255,255,255,0.15);">
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Google 계정으로 1초 시작하기
              </button>

              <button type="button" class="btn-social-naver" id="btn-naver-login" style="display:flex; align-items:center; justify-content:center; gap:0.75rem; width:100%; padding:0.85rem; background:#03C75A; color:#ffffff; border-radius:50px; font-weight:700; border:none; cursor:pointer; font-size:0.95rem; box-shadow:0 4px 15px rgba(3,199,90,0.2);">
                <span style="font-weight:900; font-size:1.1rem; font-family:sans-serif;">N</span>
                네이버 계정으로 1초 시작하기
              </button>
            </div>

            <div style="margin:1.5rem 0 1rem; position:relative; text-align:center;">
              <span style="background:#091216; padding:0 0.75rem; font-size:0.8rem; color:var(--text-muted); position:relative; z-index:1;">또는 이메일 로그인</span>
              <div style="position:absolute; top:50%; left:0; right:0; height:1px; background:var(--border-glass); z-index:0;"></div>
            </div>
          </div>
          
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
            <button type="submit" class="btn-primary btn-block" style="border-radius: 50px;">이메일 로그인</button>
            <div style="margin-top:1.5rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">
              아직 회원이 아니신가요? <a href="#/shop/register" style="color:var(--accent-rose-gold); font-weight:600;">간편 회원가입하기</a>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupLoginFormEvents();
  }

  // 간편 회원가입 화면 (이메일 + 전화번호 전용 수집 & 소셜가입)
  renderRegister() {
    this.container.innerHTML = `
      <div class="admin-login-wrapper animate-fade-in-up">
        <div class="admin-card" style="max-width: 460px; border-radius: 28px;">
          <h2>QUICK SIGN UP</h2>
          <p class="subtitle">이메일과 전화번호만으로 3초 만에 자사몰 가입 완료!</p>

          <!-- 소셜 로그인 1초 시작 버튼 -->
          <div style="margin-bottom:1.5rem;">
            <div style="display:flex; flex-direction:column; gap:0.75rem;">
              <button type="button" class="btn-social-google" id="btn-google-register" style="display:flex; align-items:center; justify-content:center; gap:0.75rem; width:100%; padding:0.85rem; background:#ffffff; color:#000000; border-radius:50px; font-weight:700; border:none; cursor:pointer; font-size:0.95rem;">
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                Google 계정으로 간편 가입하기
              </button>

              <button type="button" class="btn-social-naver" id="btn-naver-register" style="display:flex; align-items:center; justify-content:center; gap:0.75rem; width:100%; padding:0.85rem; background:#03C75A; color:#ffffff; border-radius:50px; font-weight:700; border:none; cursor:pointer; font-size:0.95rem;">
                <span style="font-weight:900; font-size:1.1rem; font-family:sans-serif;">N</span>
                네이버 계정으로 간편 가입하기
              </button>
            </div>

            <div style="margin:1.5rem 0 1rem; position:relative; text-align:center;">
              <span style="background:#091216; padding:0 0.75rem; font-size:0.8rem; color:var(--text-muted); position:relative; z-index:1;">또는 정보 직접 입력</span>
              <div style="position:absolute; top:50%; left:0; right:0; height:1px; background:var(--border-glass); z-index:0;"></div>
            </div>
          </div>

          <form id="shop-register-form">
            <div class="form-group">
              <label class="form-label" for="reg-email">이메일 주소 *</label>
              <input type="email" id="reg-email" class="form-control" required placeholder="example@email.com">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-phone">휴대폰 연락처 *</label>
              <input type="tel" id="reg-phone" class="form-control" required placeholder="010-1234-5678">
            </div>
            <div class="form-group">
              <label class="form-label" for="reg-password">비밀번호 *</label>
              <input type="password" id="reg-password" class="form-control" required placeholder="6자리 이상 입력" minlength="6">
            </div>
            <div id="shop-register-error" class="error-message" style="display: none;"></div>
            <button type="submit" class="btn-primary btn-block" style="border-radius: 50px;">가입 완료 & 1,000P 받기</button>
            <div style="margin-top:1.5rem; text-align:center; font-size:0.85rem; color:var(--text-muted);">
              이미 계정이 있으신가요? <a href="#/shop/login" style="color:var(--accent-rose-gold); font-weight:600;">로그인하기</a>
            </div>
          </form>
        </div>
      </div>
    `;

    this.setupRegisterFormEvents();
  }

  // 쇼핑몰 마이페이지 (최종 매핑 주소 & 주문 내역 확인)
  async renderMyPage() {
    const userSession = sessionStorage.getItem('shop_user');
    if (!userSession) {
      window.location.hash = '#/shop/login';
      return;
    }
    const user = JSON.parse(userSession);
    const allOrders = await db.getOrders();
    const myOrders = allOrders.filter(o => (o.customer && o.customer.email === user.email) || o.userEmail === user.email);

    const statusLabels = {
      'pending': '입금 대기',
      'completed': '결제 완료',
      'shipped': '배송 중',
      'delivered': '배송 완료',
      'cancelled': '주문 취소'
    };

    const providerBadge = user.socialProvider === 'google' ? '🟢 Google' : user.socialProvider === 'naver' ? '🟢 Naver' : '✉️ Email';

    this.container.innerHTML = `
      <section style="padding: 4rem 0; min-height: 80vh; text-align:left;" class="animate-fade-in-up">
        <div class="container">
          <div style="border-bottom:1px solid var(--border-glass); padding-bottom:1rem; margin-bottom:3rem; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h1 style="font-size: 2.2rem; color: #fff; font-family: var(--font-display);">My Page</h1>
              <p style="color: var(--text-secondary); margin-top:0.25rem;"><strong>${this.escapeHtml(user.name)}</strong>님의 자사몰 등급 및 주문 내역을 확인합니다.</p>
            </div>
            <button id="shop-logout-btn" class="btn-secondary" style="border-color:var(--error); color:var(--error); border-radius:30px;">로그아웃</button>
          </div>

          <div class="checkout-grid">
            <div>
              <h3 style="color:#fff; margin-bottom:1.5rem;">나의 주문 내역 (${myOrders.length}건)</h3>
              <div class="orders-list">
                ${myOrders.length === 0 ? `
                  <div style="text-align:center; padding:4rem; color:var(--text-muted); background:var(--bg-secondary); border:1px solid var(--border-glass); border-radius:24px;">접수된 주문 내역이 없습니다.</div>
                ` : myOrders.map(order => `
                  <div class="order-row" style="background:var(--bg-secondary); border-radius: 20px; margin-bottom:1.25rem; border:1px solid var(--border-glass);">
                    <div class="order-row-header" style="padding:1rem 1.5rem; border-bottom:1px solid var(--border-glass); display:flex; justify-content:space-between; align-items:center;">
                      <div class="order-id-group">
                        <code style="color:var(--accent-rose-gold); font-weight:700;">${order.id}</code>
                        <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.5rem;">${new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span class="status-badge ${order.status === 'cancelled' ? 'closed' : 'open'}" style="font-weight:700;">${statusLabels[order.status] || order.status}</span>
                    </div>
                    <div style="padding:1.25rem 1.5rem;">
                      <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
                        ${order.items.map(i => `
                          <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:#fff;">${this.escapeHtml(i.title)} × ${i.qty}</span>
                            <span style="color:var(--text-secondary);">${this.shopSettings.currency}${(i.price * i.qty).toLocaleString()}</span>
                          </div>
                        `).join('')}
                      </div>
                      <div style="border-top:1px solid rgba(255,255,255,0.05); padding-top:0.75rem; display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.85rem; color:var(--text-muted);">배송지: ${this.escapeHtml(order.customer ? order.customer.address : order.shippingAddress)}</span>
                        <strong style="color:var(--accent-rose-gold); font-size:1.1rem;">총액 ${this.shopSettings.currency}${(order.totalAmount || order.amount || 0).toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div>
              <!-- 자사몰 가입 회원 및 매핑된 배송 주소 카드 -->
              <div class="editor-card" style="border-radius: 24px; background:rgba(255,255,255,0.02);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
                  <h3 style="margin:0;">내 회원 프로필</h3>
                  <span class="status-badge open" style="font-size:0.75rem; border-radius:20px;">${user.tier || 'BRONZE'} VIP</span>
                </div>
                
                <div style="display:flex; flex-direction:column; gap:1.2rem; font-size:0.9rem;">
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">계정 인증 유형</span>
                    <strong style="color:#fff;">${providerBadge}</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">이메일 계정 ID</span>
                    <strong style="color:#fff;">${this.escapeHtml(user.email)}</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">휴대폰 연락처</span>
                    <strong style="color:#fff;">${this.escapeHtml(user.phone)}</strong>
                  </div>
                  <div>
                    <span style="color:var(--text-muted); display:block; font-size:0.75rem; text-transform:uppercase;">보유 적립금</span>
                    <strong style="color:var(--accent-rose-gold); font-size:1.1rem;">${(user.points || 1000).toLocaleString()} P</strong>
                  </div>

                  <div style="background:rgba(230,180,170,0.08); border:1px dashed rgba(230,180,170,0.3); padding:1rem; border-radius:14px; margin-top:0.5rem;">
                    <div style="display:flex; align-items:center; gap:0.4rem; color:var(--accent-rose-gold); font-weight:700; font-size:0.85rem; margin-bottom:0.3rem;">
                      📍 최종 주문 배송지 주소 (자동 매핑)
                    </div>
                    <div style="color:#fff; font-weight:600; font-size:0.9rem; line-height:1.4;">
                      ${user.address ? this.escapeHtml(user.address) : '<span style="color:var(--text-muted); font-weight:normal;">주문 시 입력한 최종 배송지가 여기에 자동 기록 및 매핑됩니다.</span>'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const logoutBtn = this.container.querySelector('#shop-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('shop_user');
        window.location.hash = '#/shop';
        window.location.reload();
      });
    }
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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                  <h3 style="margin:0;">배송 정보 입력</h3>
                  ${user && user.address ? `<span style="font-size:0.75rem; color:var(--accent-rose-gold); background:rgba(230,180,170,0.1); padding:0.2rem 0.6rem; border-radius:20px; border:1px solid rgba(230,180,170,0.2);">📌 회원 매핑 배송지 자동 완성</span>` : ''}
                </div>
                
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
                  <input type="text" id="co-address" class="form-control" required value="${user ? this.escapeHtml(user.address) : ''}" placeholder="서울특별시 강남구..." autofocus>
                  <small style="color:var(--text-muted); display:block; margin-top:0.25rem;">주문 완료 시 해당 배송지 주소가 고객 계정 프로필에 자동 매핑 기록됩니다.</small>
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

              <div id="checkout-error" class="error-message" style="display: none;"></div>
              <button type="submit" class="btn-primary btn-block btn-pay" style="border-radius: 50px;">
                ${cur}${total.toLocaleString()} 결제 신청하기
              </button>
            </form>
          </div>

          <div class="checkout-summary-section">
            <div class="editor-card" style="border-radius: 24px;">
              <h3>주문 상품 목록 (${cart.length}개)</h3>
              <div class="checkout-items-list">
                ${cart.map(item => `
                  <div class="checkout-item-row">
                    <img src="${this.escapeHtml(item.imageUrl)}" alt="${this.escapeHtml(item.title)}">
                    <div class="checkout-item-info">
                      <h4>${this.escapeHtml(item.title)}</h4>
                      <p>${cur}${item.price.toLocaleString()} × ${item.qty}</p>
                    </div>
                    <strong class="checkout-item-subtotal">${cur}${(item.price * item.qty).toLocaleString()}</strong>
                  </div>
                `).join('')}
              </div>

              <div class="checkout-totals">
                <div class="total-row">
                  <span>상품 합계</span>
                  <span>${cur}${subtotal.toLocaleString()}</span>
                </div>
                <div class="total-row">
                  <span>배송비</span>
                  <span>${shippingFee === 0 ? '무료배송' : cur + shippingFee.toLocaleString()}</span>
                </div>
                <div class="total-row grand-total">
                  <span>최종 결제 금액</span>
                  <strong>${cur}${total.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.setupCheckoutFormEvents(cart, subtotal, shippingFee, total);
  }

  // 주문 완료 화면
  renderOrderComplete() {
    const orderId = sessionStorage.getItem('last_order_id') || 'ORD-20260718-001';
    this.container.innerHTML = `
      <div class="checkout-empty-wrapper animate-fade-in-up">
        <div class="checkout-empty-card" style="border-radius: 28px; max-width:550px;">
          <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
          <h2 style="font-size:1.8rem; margin-bottom:0.5rem;">주문이 정상 접수되었습니다!</h2>
          <p style="color:var(--text-secondary); margin-bottom:1.5rem;">주문 내역과 배송지는 고객 회원 정보에 자동 매핑되었습니다.</p>
          
          <div style="background:rgba(230,180,170,0.1); border:1px solid rgba(230,180,170,0.3); padding:1rem; border-radius:16px; margin-bottom:2rem;">
            <div style="font-size:0.85rem; color:var(--text-muted);">주문번호</div>
            <strong style="font-size:1.3rem; color:var(--accent-rose-gold);">${orderId}</strong>
          </div>

          <div style="display:flex; gap:1rem; justify-content:center;">
            <a href="#/shop/mypage" class="btn-primary" style="border-radius: 50px;">마이페이지 주문 확인</a>
            <a href="#/shop" class="btn-secondary" style="border-radius: 50px;">쇼핑 계속하기</a>
          </div>
        </div>
      </div>
    `;
  }

  // ─── 이벤트 바인딩 ───
  setupCartEvents() {
    const buttons = this.container.querySelectorAll('.btn-add-to-cart');
    buttons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.productId;
        const product = this.contents.products.find(p => p.id === id);
        if (product) {
          await db.addToCart(product, 1);
          if (this.cartDrawer) {
            await this.cartDrawer.refresh();
            this.cartDrawer.open();
          }
        }
      });
    });
  }

  setupDetailPageEvents(product) {
    let qty = 1;
    const minusBtn = this.container.querySelector('#detail-qty-minus');
    const plusBtn = this.container.querySelector('#detail-qty-plus');
    const qtyValue = this.container.querySelector('#detail-qty-value');
    const buyBtn = this.container.querySelector('#detail-btn-buy');
    const cartBtn = this.container.querySelector('#detail-btn-cart');

    if (minusBtn) {
      minusBtn.addEventListener('click', () => {
        if (qty > 1) { qty--; qtyValue.textContent = qty; }
      });
    }
    if (plusBtn) {
      plusBtn.addEventListener('click', () => {
        qty++; qtyValue.textContent = qty;
      });
    }
    if (cartBtn) {
      cartBtn.addEventListener('click', async () => {
        await db.addToCart(product, qty);
        if (this.cartDrawer) {
          await this.cartDrawer.refresh();
          this.cartDrawer.open();
        }
      });
    }
    if (buyBtn) {
      buyBtn.addEventListener('click', async () => {
        await db.addToCart(product, qty);
        if (this.cartDrawer) {
          await this.cartDrawer.refresh();
        }
        window.location.hash = '#/checkout';
      });
    }
  }

  setupLoginFormEvents() {
    const form = this.container.querySelector('#shop-login-form');
    const errorDiv = this.container.querySelector('#shop-login-error');

    // 이메일 로그인 처리
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const email = form.querySelector('#shop-email').value.trim();
        const password = form.querySelector('#shop-password').value;

        const res = await db.loginShopUser(email, password);
        if (res.success) {
          window.location.hash = '#/shop';
          window.location.reload();
        } else {
          errorDiv.textContent = res.message;
          errorDiv.style.display = 'block';
        }
      });
    }

    // Google / Naver 소셜 로그인 클릭 이벤트
    const googleBtn = this.container.querySelector('#btn-google-login');
    const naverBtn = this.container.querySelector('#btn-naver-login');

    const handleSocialAuth = async (provider) => {
      const email = prompt(`[${provider.toUpperCase()} 소셜 로그인] 연동할 이메일 주소를 입력하세요:`, `user_${provider}@gmail.com`);
      if (!email) return;

      const phone = prompt(`[${provider.toUpperCase()} 소셜 로그인] 휴대폰 연락처를 입력하세요:`, '010-1234-5678');
      if (!phone) return;

      const res = await db.loginOrRegisterSocialUser(provider, { email, phone, name: `${provider.toUpperCase()} 고객` });
      if (res.success) {
        alert(`🎉 ${provider.toUpperCase()} 소셜 로그인 성공! 즐거운 쇼핑 되세요.`);
        window.location.hash = '#/shop';
        window.location.reload();
      }
    };

    if (googleBtn) googleBtn.addEventListener('click', () => handleSocialAuth('google'));
    if (naverBtn) naverBtn.addEventListener('click', () => handleSocialAuth('naver'));
  }

  setupRegisterFormEvents() {
    const form = this.container.querySelector('#shop-register-form');
    const errorDiv = this.container.querySelector('#shop-register-error');

    // 간편 이메일 + 휴대폰 번호 회원가입
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const email = form.querySelector('#reg-email').value.trim();
        const phone = form.querySelector('#reg-phone').value.trim();
        const password = form.querySelector('#reg-password').value;

        const res = await db.registerShopUser({ email, phone, password });
        if (res.success) {
          alert("🎉 자사몰 회원가입이 완료되었습니다! 1,000 P 적립금이 최초 지급되었습니다.");
          window.location.hash = '#/shop';
          window.location.reload();
        } else {
          errorDiv.textContent = res.message;
          errorDiv.style.display = 'block';
        }
      });
    }

    // Google / Naver 소셜 회원가입
    const googleBtn = this.container.querySelector('#btn-google-register');
    const naverBtn = this.container.querySelector('#btn-naver-register');

    const handleSocialAuth = async (provider) => {
      const email = prompt(`[${provider.toUpperCase()} 소셜 회원가입] 이메일 주소를 입력하세요:`, `user_${provider}@gmail.com`);
      if (!email) return;

      const phone = prompt(`[${provider.toUpperCase()} 소셜 회원가입] 휴대폰 연락처를 입력하세요:`, '010-1234-5678');
      if (!phone) return;

      const res = await db.loginOrRegisterSocialUser(provider, { email, phone, name: `${provider.toUpperCase()} 고객` });
      if (res.success) {
        alert(`🎉 ${provider.toUpperCase()} 소셜 가입 완료! 1,000 P 적립금이 최초 지급되었습니다.`);
        window.location.hash = '#/shop';
        window.location.reload();
      }
    };

    if (googleBtn) googleBtn.addEventListener('click', () => handleSocialAuth('google'));
    if (naverBtn) naverBtn.addEventListener('click', () => handleSocialAuth('naver'));
  }

  setupLookupEvents() {
    const form = this.container.querySelector('#shop-lookup-form');
    const errorDiv = this.container.querySelector('#shop-lookup-error');
    const modal = this.container.querySelector('#lookup-result-modal');
    const resultBody = this.container.querySelector('#lookup-result-body');
    const closeBtn = this.container.querySelector('#btn-close-lookup-modal');

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.style.display = 'none';

        const orderId = form.querySelector('#lookup-id').value.trim();
        const phone = form.querySelector('#lookup-phone').value.trim();

        const orders = await db.getOrders();
        const order = orders.find(o => o.id === orderId && (o.phone === phone || (o.customer && o.customer.phone === phone)));

        if (order) {
          const statusLabels = {
            'pending': '입금 대기',
            'completed': '결제 완료',
            'shipped': '배송 중',
            'delivered': '배송 완료',
            'cancelled': '주문 취소'
          };

          const custName = order.customer ? order.customer.name : order.userName || '고객';
          const custAddr = order.customer ? order.customer.address : order.shippingAddress || '';

          resultBody.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:1rem; border-bottom:1px solid var(--border-glass); padding-bottom:0.5rem;">
              <strong>주문번호: ${order.id}</strong>
              <span style="color:var(--accent-rose-gold); font-weight:700;">${statusLabels[order.status] || order.status}</span>
            </div>
            <div style="margin-bottom: 0.3rem;">주문자: ${this.escapeHtml(custName)}</div>
            <div style="margin-bottom: 0.3rem;">배송지: ${this.escapeHtml(custAddr)}</div>
            <div style="margin-top:1rem; font-weight:600; color:#fff;">주문 상품:</div>
            <div style="font-size:0.9rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.4rem;">
              ${order.items.map(i => `<div>- ${this.escapeHtml(i.title)} × ${i.qty}</div>`).join('')}
            </div>
            <div style="margin-top:1.5rem; font-size:1.1rem; text-align:right; font-weight:700; color:var(--accent-rose-gold);">
              총 결제액: ${this.shopSettings.currency}${(order.totalAmount || order.amount || 0).toLocaleString()}
            </div>
          `;
          modal.style.display = 'flex';
        } else {
          errorDiv.textContent = "일치하는 주문 내역이 없습니다. 정보를 다시 확인하세요.";
          errorDiv.style.display = 'block';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
  }

  setupCheckoutFormEvents(cart, subtotal, shippingFee, total) {
    const form = this.container.querySelector('#checkout-order-form');
    const errorDiv = this.container.querySelector('#checkout-error');

    if (form) {
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
            userEmail: email,
            userName: name,
            phone,
            shippingAddress: address,
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
  }

  escapeHtml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
