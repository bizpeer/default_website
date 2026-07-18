import { db } from './services/db.js';
import { MainPage } from './components/MainPage.js';
import { AdminLogin } from './components/AdminLogin.js';
import { AdminDashboard } from './components/AdminDashboard.js';
import { CompanyPages } from './components/CompanyPages.js';
import { MediaPages } from './components/MediaPages.js';
import { ContactPages } from './components/ContactPages.js';
import { ShopPages } from './components/ShopPages.js';
import { CartDrawer } from './components/CartDrawer.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.cartDrawer = null;
    this.init();
  }

  init() {
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('DOMContentLoaded', () => this.route());
  }

  // 쇼핑몰 전용 네비게이션 이벤트 바인딩 헬퍼
  bindShopNavEvents(shopEnabled) {
    if (!shopEnabled) return;

    // 네비 장바구니 버튼 클릭 바인딩
    const cartBtn = document.getElementById('nav-cart-btn');
    if (cartBtn && !cartBtn.dataset.bound) {
      cartBtn.dataset.bound = "true";
      cartBtn.addEventListener('click', () => {
        if (this.cartDrawer) {
          this.cartDrawer.refresh();
          this.cartDrawer.open();
        }
      });
    }

    // 로그아웃 버튼 바인딩
    const logoutBtn = document.getElementById('btn-shop-logout');
    if (logoutBtn && !logoutBtn.dataset.bound) {
      logoutBtn.dataset.bound = "true";
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        sessionStorage.removeItem('shop_user');
        await db.clearCart();
        this.showToast("로그아웃되었습니다.");
        window.location.hash = '#/shop';
        this.route();
      });
    }
  }

  // 사용자 공통 레이아웃 렌더링
  async renderUserLayout(shopSettings, isShopActive) {
    const shopEnabled = shopSettings.enabled;
    const contents = await db.getContent();

    // 1. 레이아웃 뼈대 생성 (최초 1회)
    if (!document.getElementById('user-layout-wrapper')) {
      this.appContainer.innerHTML = `
        <div id="user-layout-wrapper" style="min-height: 100vh; display: flex; flex-direction: column;">
          <div id="navbar-container-wrapper"></div>
          <main id="user-content-area" style="flex: 1; padding-top: 5rem;"></main>
          <div id="footer-container-wrapper"></div>
        </div>
      `;
      
      // 공통 푸터 렌더링
      document.getElementById('footer-container-wrapper').innerHTML = `
        <footer class="footer">
          <div class="container">
            <div class="footer-grid">
              <div class="footer-info">
                <h3>AETERNO</h3>
                <p>에테르노는 변하지 않는 자연 본연의 아름다움을 추구하는 프리미엄 바이오 스킨케어 브랜드입니다.</p>
              </div>
              <div></div>
              <div class="footer-contact">
                <h4>CONTACT</h4>
                <p>Email: ${this.escapeHtml(contents.footer.email)}</p>
                <p>Address: ${this.escapeHtml(contents.footer.address)}</p>
              </div>
            </div>
            <div class="footer-bottom">
              <p>${this.escapeHtml(contents.footer.copyright)}</p>
            </div>
          </div>
        </footer>
      `;

      // 장바구니 드로어 인스턴스화
      if (shopEnabled) {
        this.cartDrawer = new CartDrawer(this.appContainer, () => {
          window.location.hash = '#/checkout';
        });
        await this.cartDrawer.init();
      }
    }

    // 2. 현재 라우팅(isShopActive)에 맞춰 헤더 네비게이션 전면 교체
    const navWrapper = document.getElementById('navbar-container-wrapper');
    const userSession = sessionStorage.getItem('shop_user');
    const isLoggedIn = !!userSession;
    const user = isLoggedIn ? JSON.parse(userSession) : null;

    if (isShopActive) {
      // ─── [쇼핑몰 전용 네비게이션 헤더] ───
      navWrapper.innerHTML = `
        <nav class="navbar store-navbar animate-fade-in-up">
          <div class="container navbar-container">
            <a href="#/shop" class="logo">AETERNO <span style="font-size:0.75rem; font-weight:500; color:var(--accent-rose-gold); margin-left:0.25rem; letter-spacing:0.1em; border:1px solid rgba(230,180,170,0.3); padding:0.15rem 0.5rem; border-radius:30px; background:rgba(230,180,170,0.05);">STORE</span></a>
            <div class="nav-links">
              <a href="#/shop?cat=all" class="nav-link" id="nav-shop-all">All Products</a>
              <a href="#/shop?cat=skincare" class="nav-link" id="nav-shop-skincare">Skincare</a>
              <a href="#/shop?cat=makeup" class="nav-link" id="nav-shop-makeup">Makeup</a>
              <a href="#/shop?cat=device" class="nav-link" id="nav-shop-device">Devices</a>
              <a href="#/" class="nav-link" style="color: var(--text-muted); font-size:0.9rem; margin-left:1.5rem;">회사홈페이지</a>
              
              <!-- 쇼핑 유틸리티 (장바구니, 로그인/가입 등) -->
              <div id="nav-auth-area" style="display: flex; align-items: center; gap: 1rem;">
                ${this.getAuthLinksHtml(isLoggedIn, user, shopEnabled, true)}
              </div>
            </div>
          </div>
        </nav>
      `;

      // 카트 배지 갱신 및 이벤트 바인딩
      const cart = await db.getCart();
      const cartCount = cart.reduce((s, i) => s + i.qty, 0);
      const badge = document.getElementById('cart-badge');
      if (badge) {
        badge.textContent = cartCount;
        badge.style.display = cartCount > 0 ? 'flex' : 'none';
      }
      this.bindShopNavEvents(shopEnabled);
    } else {
      // ─── [회사소개용 기업 네비게이션 헤더] ───
      navWrapper.innerHTML = `
        <nav class="navbar corporate-navbar animate-fade-in-up">
          <div class="container navbar-container">
            <a href="#/" class="logo">AETERNO</a>
            <div class="nav-links">
              <a href="#/" class="nav-link" id="nav-home">Home</a>
              
              <!-- 회사소개 드롭다운 -->
              <div class="nav-dropdown">
                <span class="nav-link-trigger">회사소개 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                <div class="dropdown-content">
                  <a href="#/about/ceo">대표이사 인사말</a>
                  <a href="#/about/info">회사정보</a>
                  <a href="#/about/careers">인재채용</a>
                </div>
              </div>

              <a href="#/products" class="nav-link" id="nav-products">제품소개</a>

              <!-- 미디어랩 드롭다운 -->
              <div class="nav-dropdown">
                <span class="nav-link-trigger">미디어랩 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                <div class="dropdown-content">
                  <a href="#/media/press">보도자료</a>
                  <a href="#/media/gallery">갤러리</a>
                </div>
              </div>

              <!-- Contact Us 드롭다운 -->
              <div class="nav-dropdown">
                <span class="nav-link-trigger">Contact Us <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg></span>
                <div class="dropdown-content">
                  <a href="#/contact/inquiry">문의게시판</a>
                  <a href="#/contact/map">오시는 길</a>
                </div>
              </div>

              <!-- 쇼핑몰 바로가기 링크 (카트 및 로그인/가입은 비표시) -->
              <div id="nav-auth-area" style="display: flex; align-items: center; gap: 1rem;">
                ${this.getAuthLinksHtml(isLoggedIn, user, shopEnabled, false)}
              </div>

              <a href="#/admin" class="btn-admin-nav">Console</a>
            </div>
          </div>
        </nav>
      `;
    }

    return document.getElementById('user-content-area');
  }

  // 사용자 위치(isShopActive)에 따른 우측 메뉴 분리 출력
  getAuthLinksHtml(isLoggedIn, user, shopEnabled, isShopActive) {
    if (!shopEnabled) return '';
    
    // 회사 소개 일반 페이지: 오직 쇼핑몰 이동 링크만 출력 (카트/회원 기능 미사용)
    if (!isShopActive) {
      return `
        <a href="#/shop" class="nav-link" id="nav-shop" style="color: var(--accent-rose-gold); font-weight: 600;">쇼핑몰</a>
      `;
    }

    // 쇼핑몰 내부 진입: 쇼핑 카트 및 회원가입/로그인/마이페이지 제공
    let html = `
      <button class="nav-cart-btn" id="nav-cart-btn" title="장바구니" style="margin-left: 0.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <span class="cart-badge" id="cart-badge" style="display:none">0</span>
      </button>
    `;

    if (isLoggedIn) {
      html += `
        <span class="nav-user-welcome" style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 0.5rem;">${this.escapeHtml(user.name)}님</span>
        <a href="#/shop/mypage" class="nav-link" style="font-size: 0.9rem; padding: 0.2rem 0.5rem;">마이페이지</a>
        <a href="#" id="btn-shop-logout" class="nav-link" style="font-size: 0.9rem; padding: 0.2rem 0.5rem; color: var(--error);">로그아웃</a>
      `;
    } else {
      html += `
        <a href="#/shop/login" class="nav-link" style="font-size: 0.9rem; padding: 0.2rem 0.5rem; margin-left: 0.5rem;">로그인</a>
        <a href="#/shop/register" class="nav-link" style="font-size: 0.9rem; padding: 0.2rem 0.5rem;">회원가입</a>
      `;
    }
    return html;
  }

  async route() {
    const hash = window.location.hash || '#/';
    
    // 어드민 세션 여부
    const isAdminAuthenticated = sessionStorage.getItem('admin_session') === 'active';
    const shopSettings = await db.getShopSettings();

    // 1. 관리자 레이아웃 분리
    if (hash === '#/admin') {
      if (isAdminAuthenticated) {
        window.location.hash = '#/admin/dashboard';
        return;
      }
      const adminLogin = new AdminLogin(this.appContainer, () => {
        window.location.hash = '#/admin/dashboard';
      });
      adminLogin.render();
      return;
    } 
    else if (hash === '#/admin/dashboard') {
      if (!isAdminAuthenticated) {
        window.location.hash = '#/admin';
        return;
      }
      const dashboard = new AdminDashboard(this.appContainer, () => {
        window.location.hash = '#/admin';
      });
      await dashboard.render();
      return;
    }

    // 2. 쇼핑몰 On/Off에 따른 접근 제한
    const isShopActive = hash.startsWith('#/shop') || hash === '#/checkout' || hash === '#/order-complete';
    if (isShopActive) {
      if (!shopSettings.enabled) {
        this.showToast("쇼핑몰이 현재 운영 중이 아닙니다.", true);
        window.location.hash = '#/';
        return;
      }
    }

    // 3. 사용자 레이아웃 마운트 (쇼핑 영역 여부 전달)
    const contentContainer = await this.renderUserLayout(shopSettings, isShopActive);
    this.updateNavbarActiveLink(hash);

    // 4. 세부 라우팅
    if (hash === '#/' || hash === '') {
      const page = new MainPage(contentContainer);
      await page.render();
    } 
    // 회사소개 서브 라우트
    else if (hash.startsWith('#/about/')) {
      const sub = hash.replace('#/about/', '');
      const page = new CompanyPages(contentContainer, sub);
      await page.render();
    }
    // 제품소개
    else if (hash === '#/products') {
      const page = new CompanyPages(contentContainer, 'products');
      await page.render();
    }
    else if (hash.startsWith('#/products/')) {
      const productId = hash.replace('#/products/', '');
      const page = new CompanyPages(contentContainer, 'product-detail', productId);
      await page.render();
    }
    // 미디어랩 서브 라우트
    else if (hash.startsWith('#/media/')) {
      const sub = hash.replace('#/media/', '');
      const page = new MediaPages(contentContainer, sub);
      await page.render();
    }
    // Contact Us 서브 라우트
    else if (hash.startsWith('#/contact/')) {
      const sub = hash.replace('#/contact/', '');
      const page = new ContactPages(contentContainer, sub);
      await page.render();
    }
    // 쇼핑몰 서브 라우트
    else if (hash.startsWith('#/shop')) {
      const sub = hash.replace('#/shop', ''); // '', '/login', '/register', '/mypage', '/orders' 등
      const page = new ShopPages(contentContainer, sub, this.cartDrawer);
      await page.render();
    }
    // 결제/주문 완료
    else if (hash === '#/checkout') {
      const page = new ShopPages(contentContainer, '/checkout', this.cartDrawer);
      await page.render();
    }
    else if (hash === '#/order-complete') {
      const page = new ShopPages(contentContainer, '/order-complete', this.cartDrawer);
      await page.render();
    }
    else {
      window.location.hash = '#/';
    }
  }

  updateNavbarActiveLink(hash) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      // 쿼리 파라미터가 있는 해시 매칭 유연성 확보
      if (href === hash || (hash.startsWith('#/shop') && href && href.startsWith('#/shop') && href.split('?')[0] === hash.split('?')[0])) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(dd => {
      const trigger = dd.querySelector('.nav-link-trigger');
      let hasActiveChild = false;
      dd.querySelectorAll('.dropdown-content a').forEach(a => {
        if (a.getAttribute('href') === hash) {
          hasActiveChild = true;
          a.classList.add('active');
        } else {
          a.classList.remove('active');
        }
      });
      if (hasActiveChild) trigger.classList.add('active');
      else trigger.classList.remove('active');
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

  showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    const svgIcon = isError 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    toast.innerHTML = `${svgIcon}<span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

new App();
