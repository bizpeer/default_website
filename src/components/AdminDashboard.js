import { db } from '../services/db.js';
import { CourierTrackingModal } from './CourierTrackingModal.js';

export class AdminDashboard {
  constructor(container, onLogout) {
    this.container = container;
    this.onLogout = onLogout;
    this.currentTab = 'dashboard'; // dashboard, site, contents, products, shop, orders, customers, system
    this.contentSubTab = 'ceo';   // ceo, overview, press, media, careers, banners
    this.siteSubTab = 'brand';      // brand, seo, resend, footer
    this.data = null;
    this.shopSettings = null;
    this.orders = [];
    this.inquiries = [];
    this.users = [];
    this.tierPolicy = null;
    this.staffUsers = [];

    // 로그인 사용자 정보 및 siteadmin 여부 판단
    const storedUser = sessionStorage.getItem('admin_user');
    this.currentUser = storedUser ? JSON.parse(storedUser) : { id: 'siteadmin', name: '최고관리자', role: 'siteadmin' };
    this.isSiteAdmin = (this.currentUser.role === 'siteadmin' || this.currentUser.id === 'siteadmin');
    this.userPermissions = this.isSiteAdmin ? ['dashboard', 'site', 'contents', 'products', 'shop', 'orders', 'customers', 'system'] : (this.currentUser.menuPermissions || ['dashboard', 'contents', 'orders']);
  }

  async render() {
    this.data = await db.getContent();
    this.shopSettings = await db.getShopSettings();
    this.orders = await db.getOrders();
    this.inquiries = await db.getInquiries();
    this.users = await db.getShopUsers();
    this.tierPolicy = await db.getTierPolicy();
    this.staffUsers = await db.getStaffUsers();

    if (!this.data.categories) {
      this.data.categories = [
        { key: "skincare", name: "기초화장품" },
        { key: "makeup", name: "색조화장품" },
        { key: "device", name: "뷰티 디바이스" }
      ];
    }

    if (!this.userPermissions.includes(this.currentTab)) {
      this.currentTab = this.userPermissions[0] || 'dashboard';
    }

    this.container.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- 사이드바 -->
        <aside class="dashboard-sidebar">
          <div class="sidebar-title">
            <span>BEAUTY OF JOSEON</span>
            <small style="display:block; font-size:0.75rem; color:var(--text-muted); font-weight:normal; margin-top:0.25rem;">Admin Backoffice Console</small>
          </div>
          <ul class="sidebar-menu">
            ${this.userPermissions.includes('dashboard') ? `
              <li class="sidebar-link ${this.currentTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                📊 대시보드
              </li>` : ''}

            ${this.userPermissions.includes('site') ? `
              <li class="sidebar-link ${this.currentTab === 'site' ? 'active' : ''}" data-tab="site">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                🌐 사이트 정보 & SEO
              </li>` : ''}

            ${this.userPermissions.includes('contents') ? `
              <li class="sidebar-link ${this.currentTab === 'contents' ? 'active' : ''}" data-tab="contents">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
                🎬 콘텐츠 & 미디어
              </li>` : ''}

            ${this.userPermissions.includes('products') ? `
              <li class="sidebar-link ${this.currentTab === 'products' ? 'active' : ''}" data-tab="products">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                📦 제품 관리
              </li>` : ''}

            ${this.userPermissions.includes('shop') ? `
              <li class="sidebar-link ${this.currentTab === 'shop' ? 'active' : ''}" data-tab="shop">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                🛒 쇼핑몰 & PG 관리
              </li>` : ''}

            ${this.userPermissions.includes('orders') ? `
              <li class="sidebar-link ${this.currentTab === 'orders' ? 'active' : ''}" data-tab="orders">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                🚛 주문확인 & 물류
                ${this.orders.filter(o => o.status === 'pending').length > 0 ? `<span class="order-count-badge">${this.orders.filter(o => o.status === 'pending').length}</span>` : ''}
              </li>` : ''}

            ${this.userPermissions.includes('customers') ? `
              <li class="sidebar-link ${this.currentTab === 'customers' ? 'active' : ''}" data-tab="customers">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                👥 고객 관리 & 회원등급
              </li>` : ''}

            ${this.isSiteAdmin && this.userPermissions.includes('system') ? `
              <li class="sidebar-link ${this.currentTab === 'system' ? 'active' : ''}" data-tab="system">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                ⚙️ 권한등록 & 운영자
              </li>` : ''}
          </ul>
        </aside>

        <!-- 메인 콘텐츠 영역 -->
        <main class="dashboard-content">
          <div class="dashboard-header">
            <div>
              <h1 id="dashboard-title-text">통계 대시보드</h1>
              <p style="color: var(--text-secondary); margin-top: 0.25rem;">조선미녀(BEAUTY OF JOSEON) 백오피스 콘솔입니다.</p>
            </div>
            
            <div class="user-badge">
              <span style="font-size: 0.85rem; color: var(--text-secondary); background:rgba(230,180,170,0.1); padding:0.3rem 0.75rem; border-radius:20px; border:1px solid rgba(230,180,170,0.2);">
                ${this.escapeHtml(this.currentUser.name)} (${this.isSiteAdmin ? '최고관리자' : '직원/운영자'})
              </span>
              <a href="#/" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                메인 몰 보기
              </a>
              <button id="logout-btn" class="btn-secondary" style="border-color: var(--error); color: var(--error);">
                로그아웃
              </button>
            </div>
          </div>

          <form id="cms-editor-form">
            <div id="editor-tab-content">
              <!-- 동적 탭 렌더링 영역 -->
            </div>
            
            <div id="form-save-area" style="margin-top: 2rem; display: flex; gap: 1rem;">
              <button type="submit" class="btn-primary btn-save">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                변경사항 저장하기
              </button>
              <button type="button" id="reset-btn" class="btn-secondary">
                초기화
              </button>
            </div>
          </form>
        </main>
      </div>
    `;

    this.renderTabContent();
    this.setupEventListeners();
  }

  renderTabContent() {
    const tabContainer = this.container.querySelector('#editor-tab-content');
    const saveArea = this.container.querySelector('#form-save-area');
    const titleText = this.container.querySelector('#dashboard-title-text');
    
    const viewOnlyTabs = ['dashboard', 'orders', 'customers', 'system'];
    saveArea.style.display = viewOnlyTabs.includes(this.currentTab) ? 'none' : 'flex';

    if (this.currentTab === 'dashboard') {
      titleText.textContent = "📊 통계 대시보드 (KPI Monitoring)";
      this.renderDashboardOverview(tabContainer);
    } 
    else if (this.currentTab === 'site') {
      titleText.textContent = "🌐 사이트 정보 & SEO 관리";
      this.renderSiteTab(tabContainer);
    }
    else if (this.currentTab === 'contents') {
      titleText.textContent = "🎬 콘텐츠 & 미디어 관리 (Card Grid)";
      this.renderContentsTab(tabContainer);
    } 
    else if (this.currentTab === 'products') {
      titleText.textContent = "📦 제품 관리 (Product CRUD & 카테고리 관리)";
      this.renderProductsTab(tabContainer);
    } 
    else if (this.currentTab === 'shop') {
      titleText.textContent = "🛒 쇼핑몰 & 토스페이먼츠 PG 관리";
      this.renderShopTab(tabContainer);
    }
    else if (this.currentTab === 'orders') {
      titleText.textContent = "🚛 주문확인 & 물류관리 (Orders & Logistics)";
      this.renderOrdersTab(tabContainer);
    }
    else if (this.currentTab === 'customers') {
      titleText.textContent = "👥 고객 관리 & 회원등급 산정";
      this.renderCustomersTab(tabContainer);
    }
    else if (this.currentTab === 'system') {
      titleText.textContent = "⚙️ 권한등록 & 운영자 관리 (RBAC System)";
      this.renderSystemTab(tabContainer);
    }
  }

  // ─── 메뉴 1: 대시보드 ───
  renderDashboardOverview(tabContainer) {
    const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
    const pendingInquiries = this.inquiries.filter(i => i.status === 'pending').length;
    const activeProducts = (this.data.products || []).filter(p => !p.isSoldOut).length;
    const totalSales = this.orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + (o.totalAmount || o.amount || 0), 0);

    tabContainer.innerHTML = `
      <div class="editor-card" style="margin-bottom:2rem; background: linear-gradient(135deg, rgba(230,180,170,0.1), rgba(9,18,22,0.6)); border: 1px solid var(--accent-rose-gold); display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="margin:0; font-size:1.2rem; color:#fff; display:flex; align-items:center; gap:0.5rem;">
            🛒 쇼핑몰 전역 운영 스위치
            <span class="status-badge ${this.shopSettings.enabled ? 'open' : 'closed'}">${this.shopSettings.enabled ? '실시간 운영중 (ONLINE)' : '점검중 (OFFLINE)'}</span>
          </h3>
          <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">버튼 클릭 시 고객 쇼핑몰 접근 권한을 즉시 제어합니다.</p>
        </div>

        ${this.isSiteAdmin ? `
          <button type="button" id="toggle-shop-btn" class="btn-primary" style="padding:0.75rem 1.5rem; border-radius:30px; font-weight:700; background:${this.shopSettings.enabled ? 'var(--error)' : 'var(--accent-rose-gold)'}">
            ${this.shopSettings.enabled ? '🚫 쇼핑몰 비활성화' : '⚡ 쇼핑몰 운영 시작'}
          </button>
        ` : `
          <button type="button" class="btn-secondary" disabled style="opacity:0.6; cursor:not-allowed; border-radius:30px;">
            🔒 siteadmin 고유 권한
          </button>
        `}
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; text-align:left;">
        <div class="editor-card" style="margin: 0; padding: 1.75rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem; font-weight:600;">오늘 결제 매출액</div>
          <div style="font-size:2.2rem; font-weight:700; color:var(--accent-emerald);">${this.shopSettings.currency}${totalSales.toLocaleString()}</div>
        </div>
        <div class="editor-card" style="margin: 0; padding: 1.75rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem; font-weight:600;">전체 누적 주문 건수</div>
          <div style="font-size:2.2rem; font-weight:700; color:var(--accent-rose-gold);">${this.orders.length}건 <small style="font-size:0.9rem; color:var(--text-muted); font-weight:normal;">(대기 ${pendingOrders}건)</small></div>
        </div>
        <div class="editor-card" style="margin: 0; padding: 1.75rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem; font-weight:600;">등록 제품 수 (판매중)</div>
          <div style="font-size:2.2rem; font-weight:700; color:#fff;">${activeProducts}개 <small style="font-size:0.9rem; color:var(--text-muted); font-weight:normal;">/ 총 ${(this.data.products||[]).length}개</small></div>
        </div>
        <div class="editor-card" style="margin: 0; padding: 1.75rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem; font-weight:600;">미답변 고객 문의</div>
          <div style="font-size:2.2rem; font-weight:700; color:var(--accent-indigo);">${pendingInquiries}건</div>
        </div>
      </div>
      
      <div class="editor-card" style="text-align:left;">
        <h3 style="margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center;">
          <span>최근 발생한 주문 및 결제 내역</span>
          <button type="button" class="btn-secondary" id="go-orders-tab-btn" style="font-size:0.8rem; border-radius:30px;">전체 주문 관리 바로가기 →</button>
        </h3>
        ${this.orders.length === 0 ? `<p style="color:var(--text-muted);">최근 접수된 주문 내역이 없습니다.</p>` : `
          <div style="overflow-x:auto;">
            <table class="cms-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-glass); text-align:left; color:var(--text-muted);">
                  <th style="padding:0.75rem;">주문번호</th>
                  <th style="padding:0.75rem;">주문자</th>
                  <th style="padding:0.75rem;">결제금액</th>
                  <th style="padding:0.75rem;">결제수단</th>
                  <th style="padding:0.75rem;">상태</th>
                  <th style="padding:0.75rem;">일시</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders.slice(0, 5).map(o => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:0.75rem; font-weight:600; color:var(--accent-rose-gold);">${o.id}</td>
                    <td style="padding:0.75rem;">${this.escapeHtml(o.userName || o.customerName || '고객')}</td>
                    <td style="padding:0.75rem; font-weight:700; color:#fff;">₩${(o.totalAmount||o.amount||0).toLocaleString()}</td>
                    <td style="padding:0.75rem;"><span style="background:rgba(255,255,255,0.08); padding:0.2rem 0.5rem; border-radius:4px;">${o.method || '토스페이'}</span></td>
                    <td style="padding:0.75rem;"><span class="status-badge ${o.status === 'cancelled' ? 'closed' : 'open'}">${o.status === 'pending' ? '입금대기' : o.status === 'completed' ? '결제완료' : '주문취소'}</span></td>
                    <td style="padding:0.75rem; color:var(--text-muted);">${(o.createdAt||'').slice(0,10)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    const toggleBtn = tabContainer.querySelector('#toggle-shop-btn');
    if (toggleBtn && this.isSiteAdmin) {
      toggleBtn.addEventListener('click', async () => {
        this.shopSettings.enabled = !this.shopSettings.enabled;
        await db.updateShopSettings(this.shopSettings);
        this.showToast(`쇼핑몰이 ${this.shopSettings.enabled ? '활성화' : '비활성화'} 되었습니다.`);
        this.renderTabContent();
      });
    }

    const goOrdersBtn = tabContainer.querySelector('#go-orders-tab-btn');
    if (goOrdersBtn) {
      goOrdersBtn.addEventListener('click', () => {
        this.currentTab = 'orders';
        this.updateSidebarActive();
        this.renderTabContent();
      });
    }
  }

  // ─── 메뉴 2: 사이트 정보 & SEO ───
  renderSiteTab(tabContainer) {
    tabContainer.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom: 2rem;" id="site-sub-nav">
        <button type="button" class="filter-btn ${this.siteSubTab === 'brand' ? 'active' : ''}" data-sub="brand">브랜드 & CEO</button>
        <button type="button" class="filter-btn ${this.siteSubTab === 'seo' ? 'active' : ''}" data-sub="seo">SEO 메타 태그 & OG</button>
        <button type="button" class="filter-btn ${this.siteSubTab === 'resend' ? 'active' : ''}" data-sub="resend">Resend 이메일 연동</button>
        <button type="button" class="filter-btn ${this.siteSubTab === 'footer' ? 'active' : ''}" data-sub="footer">사업자 Footer 정보</button>
      </div>
      <div id="site-editor-panel"></div>
    `;

    this.renderSiteSubTab();

    tabContainer.querySelectorAll('#site-sub-nav button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.saveCurrentFormState();
        tabContainer.querySelectorAll('#site-sub-nav button').forEach(b => b.classList.remove('active'));
        this.siteSubTab = e.target.dataset.sub;
        e.target.classList.add('active');
        this.renderSiteSubTab();
      });
    });
  }

  renderSiteSubTab() {
    const panel = this.container.querySelector('#site-editor-panel');
    const brand = this.data.brand || { koName: "조선미녀", enName: "BEAUTY OF JOSEON" };
    const ceo = this.data.ceoGreeting || { title: "", content: "", imageUrl: "", signatureUrl: "" };
    const seo = this.data.seo || {};

    if (this.siteSubTab === 'brand') {
      panel.innerHTML = `
        <div class="editor-card" style="margin-bottom:1.5rem;">
          <h3>브랜드 상호명 설정</h3>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="brand-ko">한국어 브랜드명</label>
              <input type="text" id="brand-ko" class="form-control" value="${this.escapeHtml(brand.koName)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="brand-en">영문 브랜드명 (글로벌 파비콘/헤더)</label>
              <input type="text" id="brand-en" class="form-control" value="${this.escapeHtml(brand.enName)}" required>
            </div>
          </div>
        </div>

        <div class="editor-card">
          <h3>대표이사 인사말 (CEO Message) & 인장 이미지</h3>
          <div class="form-group">
            <label class="form-label" for="ceo-title">인사말 제목</label>
            <input type="text" id="ceo-title" class="form-control" value="${this.escapeHtml(ceo.title)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="ceo-content">대표 메시지 본문</label>
            <textarea id="ceo-content" class="form-control" rows="6" required>${ceo.content}</textarea>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="ceo-image">대표이사 프로필 사진 URL</label>
              <input type="url" id="ceo-image" class="form-control" value="${this.escapeHtml(ceo.imageUrl)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="ceo-signature">서명/인장 이미지 URL</label>
              <input type="text" id="ceo-signature" class="form-control" value="${this.escapeHtml(ceo.signatureUrl || '')}">
            </div>
          </div>
        </div>
      `;
    } 
    else if (this.siteSubTab === 'seo') {
      panel.innerHTML = `
        <div class="editor-card" style="margin-bottom:1.5rem;">
          <h3>검색엔진 최적화 (Basic Meta Tags)</h3>
          <div class="form-group">
            <label class="form-label" for="seo-title">Meta Title (페이지 제목)</label>
            <input type="text" id="seo-title" class="form-control" value="${this.escapeHtml(seo.metaTitle || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="seo-desc">Meta Description (검색 설명 요약)</label>
            <textarea id="seo-desc" class="form-control" rows="3" required>${seo.metaDescription || ''}</textarea>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="seo-keywords">검색 키워드 (쉼표 구분)</label>
              <input type="text" id="seo-keywords" class="form-control" value="${this.escapeHtml(seo.keywords || '')}">
            </div>
            <div class="form-group">
              <label class="form-label" for="seo-robots">Robots 정책</label>
              <input type="text" id="seo-robots" class="form-control" value="${this.escapeHtml(seo.robots || 'index, follow')}">
            </div>
          </div>
        </div>

        <div class="editor-card" style="margin-bottom:1.5rem;">
          <h3>소셜 공유 카드 (Open Graph)</h3>
          <div class="form-group">
            <label class="form-label" for="og-title">og:title (카카오톡/SNS 제목)</label>
            <input type="text" id="og-title" class="form-control" value="${this.escapeHtml(seo.ogTitle || '')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="og-desc">og:description (카카오톡/SNS 설명)</label>
            <input type="text" id="og-desc" class="form-control" value="${this.escapeHtml(seo.ogDescription || '')}">
          </div>
          <div class="form-group">
            <label class="form-label" for="og-image">og:image (공유 썸네일 이미지 URL)</label>
            <input type="url" id="og-image" class="form-control" value="${this.escapeHtml(seo.ogImage || '')}">
          </div>
        </div>

        <div class="editor-card">
          <h3>검색엔진 소유권 확인 메타 태그</h3>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="google-verify">구글 메타 태그 (google-site-verification)</label>
              <input type="text" id="google-verify" class="form-control" value="${this.escapeHtml(seo.googleVerification || '')}">
            </div>
            <div class="form-group">
              <label class="form-label" for="naver-verify">네이버 메타 태그 (naver-site-verification)</label>
              <input type="text" id="naver-verify" class="form-control" value="${this.escapeHtml(seo.naverVerification || '')}">
            </div>
          </div>
        </div>
      `;
    }
    else if (this.siteSubTab === 'resend') {
      const resend = this.data.resend || {};
      panel.innerHTML = `
        <div class="editor-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3>Resend 이메일 발송 연동 설정</h3>
            ${!this.isSiteAdmin ? `<span class="status-badge closed">🔒 siteadmin 고유 권한</span>` : ''}
          </div>
          
          <div class="form-group">
            <label class="form-label" for="resend-key">Resend API Key</label>
            <input type="password" id="resend-key" class="form-control" value="${this.escapeHtml(resend.apiKey || '')}" placeholder="re_..." ${!this.isSiteAdmin ? 'disabled readonly style="opacity:0.6; cursor:not-allowed;"' : ''}>
            ${!this.isSiteAdmin ? `<small style="color:var(--accent-rose-gold); display:block; margin-top:0.25rem;">🔒 API Key 변경은 siteadmin (최고 관리자) 고유 권한입니다.</small>` : ''}
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="resend-sender">발신자 이메일 주소</label>
              <input type="email" id="resend-sender" class="form-control" value="${this.escapeHtml(resend.senderEmail || '')}" ${!this.isSiteAdmin ? 'disabled readonly style="opacity:0.6; cursor:not-allowed;"' : ''}>
            </div>
            <div class="form-group">
              <label class="form-label" for="resend-recipient">테스트 수신 이메일</label>
              <input type="email" id="resend-recipient" class="form-control" value="${this.escapeHtml(resend.testEmailRecipient || '')}">
            </div>
          </div>
          <button type="button" id="btn-test-email" class="btn-secondary" style="margin-top:1rem; border-color:var(--accent-rose-gold); color:var(--accent-rose-gold);">
            ✉️ 테스트 이메일 발송해보기
          </button>
        </div>
      `;

      const testBtn = panel.querySelector('#btn-test-email');
      if (testBtn) {
        testBtn.addEventListener('click', () => {
          this.showToast("Resend 테스트 이메일이 발송 요청되었습니다.");
        });
      }
    }
    else if (this.siteSubTab === 'footer') {
      const info = this.data.companyInfo || {};
      panel.innerHTML = `
        <div class="editor-card">
          <h3>사업자 Footer 정보 편집</h3>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="info-name">상호명</label>
              <input type="text" id="info-name" class="form-control" value="${this.escapeHtml(info.name)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="info-ceo">대표자 성명</label>
              <input type="text" id="info-ceo" class="form-control" value="${this.escapeHtml(info.ceo)}" required>
            </div>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="info-biz">사업자등록번호</label>
              <input type="text" id="info-biz" class="form-control" value="${this.escapeHtml(info.businessNo)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="info-tel">고객센터 전화번호</label>
              <input type="text" id="info-tel" class="form-control" value="${this.escapeHtml(info.tel)}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="info-address">사업장 소재지 주소</label>
            <input type="text" id="info-address" class="form-control" value="${this.escapeHtml(info.address)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="info-email">공식 문의 이메일</label>
            <input type="email" id="info-email" class="form-control" value="${this.escapeHtml(info.email)}" required>
          </div>
        </div>
      `;
    }
  }

  // ─── 메뉴 3: 콘텐츠 & 미디어 (Card Grid) ───
  renderContentsTab(tabContainer) {
    tabContainer.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom: 2rem;" id="contents-sub-nav">
        <button type="button" class="filter-btn ${this.contentSubTab === 'ceo' ? 'active' : ''}" data-sub="ceo">무드필름 & 스토리 카드</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'press' ? 'active' : ''}" data-sub="press">언론 보도자료 카드</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'media' ? 'active' : ''}" data-sub="media">미디어 & 자료실 카드</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'careers' ? 'active' : ''}" data-sub="careers">채용 공고 카드</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'gallery' ? 'active' : ''}" data-sub="gallery">룩북 갤러리 카드</button>
      </div>
      <div id="contents-editor-panel"></div>
    `;

    this.renderContentsSubTab();

    tabContainer.querySelectorAll('#contents-sub-nav button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.saveCurrentFormState();
        tabContainer.querySelectorAll('#contents-sub-nav button').forEach(b => b.classList.remove('active'));
        this.contentSubTab = e.target.dataset.sub;
        e.target.classList.add('active');
        this.renderContentsSubTab();
      });
    });
  }

  renderContentsSubTab() {
    const panel = this.container.querySelector('#contents-editor-panel');

    if (this.contentSubTab === 'ceo') {
      const hero = this.data.hero || {};
      const about = this.data.about || {};
      panel.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
          <div class="editor-card" style="margin:0;">
            <div style="position:relative; aspect-ratio:16/9; border-radius:12px; overflow:hidden; margin-bottom:1.25rem; background:#000;">
              <img src="${about.imageUrl || 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80'}" style="width:100%; height:100%; object-fit:cover; opacity:0.85;">
              <span class="product-discount-tag" style="top:0.75rem; right:0.75rem; background:var(--accent-rose-gold);">무드필름 프리뷰</span>
            </div>
            <h3 style="margin-top:0;">메인 비주얼 슬로건</h3>
            <div class="form-group">
              <label class="form-label">메인 제목</label>
              <input type="text" id="hero-title" class="form-control" value="${this.escapeHtml(hero.title)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">서브 타이틀 설명</label>
              <textarea id="hero-subtitle" class="form-control" rows="3">${hero.subtitle}</textarea>
            </div>
          </div>

          <div class="editor-card" style="margin:0;">
            <div style="position:relative; aspect-ratio:16/9; border-radius:12px; overflow:hidden; margin-bottom:1.25rem; background:#000;">
              <img src="${about.imageUrl}" style="width:100%; height:100%; object-fit:cover; opacity:0.85;">
              <span class="product-discount-tag" style="top:0.75rem; right:0.75rem; background:var(--accent-emerald);">브랜드 스토리</span>
            </div>
            <h3 style="margin-top:0;">브랜드 스토리 카드</h3>
            <div class="form-group">
              <label class="form-label">스토리 섹션 제목</label>
              <input type="text" id="about-title" class="form-control" value="${this.escapeHtml(about.title)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">대표 스토리 본문</label>
              <textarea id="about-content" class="form-control" rows="4">${about.content}</textarea>
            </div>
            <div class="form-group">
              <label class="form-label">고화질 썸네일 이미지 URL</label>
              <input type="url" id="about-image" class="form-control" value="${this.escapeHtml(about.imageUrl)}">
            </div>
          </div>
        </div>
      `;
    }
    else if (this.contentSubTab === 'press') {
      const pressList = this.data.press || [];
      panel.innerHTML = `
        <div class="editor-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3>언론 보도자료 & 브랜드 아티클 카드 목록</h3>
            <button type="button" id="add-press-btn" class="btn-secondary" style="border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); border-radius:30px;">+ 신규 보도자료 카드 추가</button>
          </div>
          
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;" id="press-cards-container">
            ${pressList.map((p, index) => `
              <div class="editor-card" style="margin:0; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); position:relative;" data-index="${index}">
                <button type="button" class="btn-delete-card btn-delete-press" data-index="${index}" style="top:1rem; right:1rem;">삭제</button>
                <div style="aspect-ratio:16/9; border-radius:10px; overflow:hidden; margin-bottom:1rem; background:#000;">
                  <img src="${p.imageUrl}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="form-group">
                  <label class="form-label">보도일자</label>
                  <input type="date" class="form-control press-date" value="${p.date}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">기사 제목</label>
                  <input type="text" class="form-control press-title" value="${this.escapeHtml(p.title)}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">기사 요약 내용</label>
                  <textarea class="form-control press-content" rows="3">${p.content}</textarea>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">기사 썸네일 이미지 URL</label>
                  <input type="url" class="form-control press-image" value="${this.escapeHtml(p.imageUrl)}">
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.setupPressEvents();
    }
    else if (this.contentSubTab === 'media') {
      const mediaList = this.data.media || [];
      panel.innerHTML = `
        <div class="editor-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3>미디어 센터 영상 & PDF 자료실 카드</h3>
            <button type="button" id="add-media-btn" class="btn-secondary" style="border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); border-radius:30px;">+ 미디어 카드 추가</button>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;" id="media-cards-container">
            ${mediaList.map((m, index) => `
              <div class="editor-card" style="margin:0; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); position:relative;" data-index="${index}">
                <button type="button" class="btn-delete-card btn-delete-media" data-index="${index}">삭제</button>
                <div style="margin-bottom:0.75rem;">
                  <span class="status-badge ${m.type === 'video' ? 'open' : 'closed'}">${m.type === 'video' ? '🎬 영상 (VIDEO)' : '📄 문서 (PDF)'}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">자료 구분</label>
                  <select class="form-control media-type">
                    <option value="video" ${m.type === 'video' ? 'selected' : ''}>브랜드 영상 (VIDEO)</option>
                    <option value="document" ${m.type === 'document' ? 'selected' : ''}>문서/PDF (DOCUMENT)</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">제목</label>
                  <input type="text" class="form-control media-title" value="${this.escapeHtml(m.title)}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">링크 주소 (Youtube 또는 PDF 파일 URL)</label>
                  <input type="url" class="form-control media-link" value="${this.escapeHtml(m.link)}" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">개요 설명</label>
                  <textarea class="form-control media-desc" rows="2">${m.desc || ''}</textarea>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.setupMediaEvents();
    }
    else if (this.contentSubTab === 'careers') {
      const recruitList = this.data.recruitment || [];
      panel.innerHTML = `
        <div class="editor-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3>채용 공고 카드 목록</h3>
            <button type="button" id="add-recruit-btn" class="btn-secondary" style="border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); border-radius:30px;">+ 새 채용 공고 카드 추가</button>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:1.25rem;" id="recruit-cards-container">
            ${recruitList.map((c, index) => `
              <div class="editor-card" style="margin:0; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); position:relative;" data-index="${index}">
                <button type="button" class="btn-delete-card btn-delete-recruit" data-index="${index}">삭제</button>
                <div class="editor-row">
                  <div class="form-group">
                    <label class="form-label">모집 부서</label>
                    <input type="text" class="form-control recruit-dept" value="${this.escapeHtml(c.dept)}" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">상태</label>
                    <select class="form-control recruit-status">
                      <option value="open" ${c.status === 'open' ? 'selected' : ''}>모집중 (OPEN)</option>
                      <option value="closed" ${c.status === 'closed' ? 'selected' : ''}>마감 (CLOSED)</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">공고 제목</label>
                  <input type="text" class="form-control recruit-title" value="${this.escapeHtml(c.title)}" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">직무 내용 상세 설명</label>
                  <textarea class="form-control recruit-desc" rows="3">${c.desc}</textarea>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.setupCareersEvents();
    }
    else if (this.contentSubTab === 'gallery') {
      const galleryList = this.data.gallery || [];
      panel.innerHTML = `
        <div class="editor-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
            <h3>룩북 갤러리 비주얼 카드 목록</h3>
            <button type="button" id="add-gallery-btn" class="btn-secondary" style="border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); border-radius:30px;">+ 갤러리 카드 추가</button>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:1.25rem;" id="gallery-cards-container">
            ${galleryList.map((g, index) => `
              <div class="editor-card" style="margin:0; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); position:relative;" data-index="${index}">
                <button type="button" class="btn-delete-card btn-delete-gallery" data-index="${index}">삭제</button>
                <div style="aspect-ratio:4/3; border-radius:10px; overflow:hidden; margin-bottom:1rem; background:#000;">
                  <img src="${g.imageUrl}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="form-group">
                  <label class="form-label">작품/화보 제목</label>
                  <input type="text" class="form-control gal-title" value="${this.escapeHtml(g.title)}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">이미지 URL</label>
                  <input type="url" class="form-control gal-image" value="${this.escapeHtml(g.imageUrl)}" required>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">작품 설명</label>
                  <textarea class="form-control gal-desc" rows="2">${g.desc || ''}</textarea>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      this.setupGalleryEvents();
    }
  }

  // ─── 메뉴 4: 제품 관리 (Product CRUD, 카테고리 관리, 이미지 5MB 제한 업로드, 상위노출 3개 제어) ───
  renderProductsTab(tabContainer) {
    const products = this.data.products || [];
    const categories = this.data.categories || [];
    const featuredCount = products.filter(p => p.isFeatured).length;

    tabContainer.innerHTML = `
      <!-- 카테고리 추가 / 수정 관리 섹션 -->
      <div class="editor-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <div>
            <h3 style="margin:0;">🏷️ 상품 카테고리 관리 (Custom Category Manager)</h3>
            <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">카테고리를 자유롭게 추가/편집하여 상품 분류 및 쇼핑몰 네비게이션에 반영합니다.</p>
          </div>
        </div>

        <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem;">
          ${categories.map((cat, idx) => `
            <div style="background:rgba(230,180,170,0.1); border:1px solid rgba(230,180,170,0.25); padding:0.4rem 0.8rem; border-radius:30px; display:inline-flex; align-items:center; gap:0.5rem; font-size:0.85rem; color:#fff;">
              <strong>${this.escapeHtml(cat.name)}</strong> <small style="color:var(--text-muted);">(${cat.key})</small>
              ${categories.length > 1 ? `<button type="button" class="btn-delete-cat" data-index="${idx}" style="background:none; border:none; color:var(--error); cursor:pointer; font-weight:700;">&times;</button>` : ''}
            </div>
          `).join('')}
        </div>

        <div class="editor-row" style="align-items:flex-end;">
          <div class="form-group">
            <label class="form-label">신규 카테고리명 (표시용)</label>
            <input type="text" id="new-cat-name" class="form-control" placeholder="예: 클렌징/마스크">
          </div>
          <div class="form-group">
            <label class="form-label">카테고리 고유 키 (영문/숫자)</label>
            <input type="text" id="new-cat-key" class="form-control" placeholder="예: cleansing">
          </div>
          <div class="form-group">
            <button type="button" id="btn-add-category" class="btn-secondary" style="border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); height:46px; border-radius:12px; font-weight:700;">
              + 카테고리 추가
            </button>
          </div>
        </div>
      </div>

      <!-- 등록 제품 목록 & 상위 노출 3개 선택 제어 카드 -->
      <div class="editor-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div>
            <h3 style="margin:0; display:flex; align-items:center; gap:0.75rem;">
              <span>등록된 제품 목록 (${products.length}개)</span>
              <span class="status-badge ${featuredCount <= 3 ? 'open' : 'closed'}" style="font-size:0.8rem; border-radius:30px; background:rgba(255,215,0,0.15); color:#ffd700; border:1px solid rgba(255,215,0,0.4);">
                ★ 상위 노출 지정: ${featuredCount} / 3개
              </span>
            </h3>
            <p style="margin:0.25rem 0 0; font-size:0.85rem; color:var(--text-secondary);">이미지 URL 및 5MB 이하 파일 업로드를 지원하며, 상위 노출로 지정된 3개 상품은 쇼핑몰 최상단에 우선 표시됩니다.</p>
          </div>
          <button type="button" id="add-product-btn" class="btn-primary" style="border-radius:30px; font-weight:700;">+ 신규 제품 등록</button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:1.5rem;" id="products-cards-container">
          ${products.map((p, index) => `
            <div class="editor-card" style="margin:0; background:rgba(0,0,0,0.3); border:1px solid ${p.isFeatured ? 'rgba(255,215,0,0.5)' : 'var(--border-glass)'}; position:relative;" data-index="${index}">
              <button type="button" class="btn-delete-card btn-delete-product" data-index="${index}" style="top:1rem; right:1rem;">제품 삭제</button>
              
              <div style="display:flex; gap:1rem; margin-bottom:1rem; align-items:center;">
                <div style="position:relative; width:80px; height:80px; flex-shrink:0;">
                  <img src="${p.imageUrl}" class="prod-preview-img" style="width:100%; height:100%; object-fit:cover; border-radius:12px; border:1px solid var(--border-glass);">
                  ${p.isFeatured ? `<span style="position:absolute; bottom:-6px; left:50%; transform:translateX(-50%); font-size:0.65rem; background:#ffd700; color:#000; font-weight:800; padding:0.1rem 0.4rem; border-radius:10px; white-space:nowrap;">BEST 3</span>` : ''}
                </div>
                <div style="flex:1;">
                  <div style="display:flex; gap:0.3rem; margin-bottom:0.25rem;">
                    <span class="status-badge ${p.isSoldOut ? 'closed' : 'open'}">${p.isSoldOut ? '품절' : '판매중'}</span>
                  </div>
                  <div style="font-weight:700; font-size:1.05rem; color:#fff;">${this.escapeHtml(p.title)}</div>
                </div>
              </div>

              <!-- 상위 노출 3개 체크박스 제어 -->
              <div style="background:rgba(255,215,0,0.08); border:1px dashed rgba(255,215,0,0.3); padding:0.6rem 0.9rem; border-radius:10px; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
                <label style="display:inline-flex; align-items:center; gap:0.5rem; font-weight:700; color:#ffd700; font-size:0.9rem; cursor:pointer;">
                  <input type="checkbox" class="prod-featured-check" data-index="${index}" ${p.isFeatured ? 'checked' : ''} style="width:18px; height:18px; accent-color:#ffd700;">
                  ★ 쇼핑몰 메인 상위 노출 (최대 3개)
                </label>
                <small style="color:var(--text-muted); font-size:0.75rem;">${p.isFeatured ? '우선 순위 상단 배치' : '일반 배치'}</small>
              </div>

              <div class="editor-row">
                <div class="form-group">
                  <label class="form-label">제품명</label>
                  <input type="text" class="form-control prod-title" value="${this.escapeHtml(p.title)}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">카테고리</label>
                  <select class="form-control prod-cat">
                    ${categories.map(c => `<option value="${c.key}" ${p.category === c.key ? 'selected' : ''}>${this.escapeHtml(c.name)} (${c.key})</option>`).join('')}
                  </select>
                </div>
              </div>

              <div class="editor-row">
                <div class="form-group">
                  <label class="form-label">판매가 (원)</label>
                  <input type="number" class="form-control prod-price" value="${p.price}" required>
                </div>
                <div class="form-group">
                  <label class="form-label">정가 (원)</label>
                  <input type="number" class="form-control prod-orig-price" value="${p.originalPrice || 0}">
                </div>
                <div class="form-group">
                  <label class="form-label">재고 수량</label>
                  <input type="number" class="form-control prod-stock" value="${p.stock || 100}">
                </div>
              </div>

              <!-- 대표 이미지 URL + 5MB 이하 파일 업로드 폼 -->
              <div class="form-group">
                <label class="form-label">대표 이미지 (URL 또는 5MB 이하 파일 업로드)</label>
                <div style="display:flex; gap:0.5rem; align-items:center;">
                  <input type="url" class="form-control prod-image" value="${this.escapeHtml(p.imageUrl)}" required style="flex:1;">
                  <label class="btn-secondary" style="white-space:nowrap; cursor:pointer; padding:0.6rem 0.9rem; font-size:0.8rem; border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); border-radius:10px;">
                    📁 이미지 업로드 (5MB 이하)
                    <input type="file" class="prod-file-input" accept="image/*" style="display:none;" data-index="${index}">
                  </label>
                </div>
                <small style="color:var(--text-muted); display:block; margin-top:0.25rem;">Direct URL 주소를 넣거나 5MB 이하 이미지 파일(PNG/JPG/WebP)을 클릭하여 직접 첨부하세요.</small>
              </div>

              <div class="editor-row">
                <div class="form-group">
                  <label class="form-label">제형 (Texture)</label>
                  <input type="text" class="form-control prod-texture" value="${this.escapeHtml(p.texture || '워터 세럼')}" placeholder="예: 앰플 세럼">
                </div>
                <div class="form-group">
                  <label class="form-label">피부 타입 (Skin Type)</label>
                  <input type="text" class="form-control prod-skintype" value="${this.escapeHtml(p.skinType || '모든 피부')}" placeholder="예: 민감성/건성">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">핵심 성분 (Key Ingredients)</label>
                <input type="text" class="form-control prod-ingredients" value="${this.escapeHtml(p.ingredients || '해양심층수, 인삼추출물, 히알루론산')}" placeholder="핵심 성분">
              </div>

              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">진열 상태 제어</label>
                <select class="form-control prod-soldout">
                  <option value="false" ${!p.isSoldOut ? 'selected' : ''}>🟢 정상 판매중</option>
                  <option value="true" ${p.isSoldOut ? 'selected' : ''}>🔴 품절 처리</option>
                </select>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.setupProductsEvents();
  }

  // ─── 메뉴 5: 쇼핑몰 & 토스페이먼츠 PG 관리 ───
  renderShopTab(tabContainer) {
    const toss = this.data.tossPg || {};
    const banners = this.data.banners || [];

    tabContainer.innerHTML = `
      <div class="editor-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3>💳 토스페이먼츠 (Toss Payments) PG 연동 설정</h3>
          ${!this.isSiteAdmin ? `<span class="status-badge closed">🔒 siteadmin 고유 권한</span>` : ''}
        </div>
        
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label">Client Key (테스트/실운영)</label>
            <input type="text" id="toss-client-key" class="form-control" value="${this.escapeHtml(toss.clientKey || '')}" placeholder="test_ck_..." ${!this.isSiteAdmin ? 'disabled readonly style="opacity:0.6; cursor:not-allowed;"' : ''}>
          </div>
          <div class="form-group">
            <label class="form-label">Secret Key</label>
            <input type="password" id="toss-secret-key" class="form-control" value="${this.escapeHtml(toss.secretKey || '')}" placeholder="test_sk_..." ${!this.isSiteAdmin ? 'disabled readonly style="opacity:0.6; cursor:not-allowed;"' : ''}>
          </div>
        </div>
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label">가맹점 MID</label>
            <input type="text" id="toss-mid" class="form-control" value="${this.escapeHtml(toss.mid || '')}" ${!this.isSiteAdmin ? 'disabled readonly style="opacity:0.6; cursor:not-allowed;"' : ''}>
          </div>
          <div class="form-group">
            <label class="form-label">결제 모드</label>
            <select id="toss-test-mode" class="form-control" ${!this.isSiteAdmin ? 'disabled readonly style="opacity:0.6; cursor:not-allowed;"' : ''}>
              <option value="true" ${toss.isTestMode !== false ? 'selected' : ''}>🧪 테스트 결제 모드</option>
              <option value="false" ${toss.isTestMode === false ? 'selected' : ''}>⚡ 실운영 PG 승인 모드</option>
            </select>
          </div>
        </div>
        ${!this.isSiteAdmin ? `<small style="color:var(--accent-rose-gold); display:block; margin-top:0.25rem;">🔒 토스페이먼츠 PG 연동 키 및 가맹점 설정은 siteadmin (최고 관리자) 고유 권한입니다.</small>` : ''}
      </div>

      <div class="editor-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <h3>🎠 메인 프로모션 배너 슬라이더 관리</h3>
          <button type="button" id="add-banner-btn" class="btn-secondary" style="border-color:var(--accent-rose-gold); color:var(--accent-rose-gold); border-radius:30px;">+ 프로모션 배너 추가</button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.25rem;" id="banners-cards-container">
          ${banners.map((b, index) => `
            <div class="editor-card" style="margin:0; background:rgba(0,0,0,0.3); border:1px solid var(--border-glass); position:relative;" data-index="${index}">
              <button type="button" class="btn-delete-card btn-delete-banner" data-index="${index}">삭제</button>
              <div style="aspect-ratio:21/9; border-radius:10px; overflow:hidden; margin-bottom:1rem; background:#000;">
                <img src="${b.imageUrl}" style="width:100%; height:100%; object-fit:cover;">
              </div>
              <div class="form-group">
                <label class="form-label">배너 제목</label>
                <input type="text" class="form-control banner-title" value="${this.escapeHtml(b.title)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">서브 설명</label>
                <input type="text" class="form-control banner-sub" value="${this.escapeHtml(b.subtitle || '')}">
              </div>
              <div class="form-group">
                <label class="form-label">배너 이미지 URL</label>
                <input type="url" class="form-control banner-image" value="${this.escapeHtml(b.imageUrl)}" required>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">이동 링크 URL</label>
                <input type="text" class="form-control banner-link" value="${this.escapeHtml(b.linkUrl || '#/shop')}">
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    this.setupShopEvents();
  }

  // ─── 메뉴 6: 주문확인 & 물류관리 ───
  renderOrdersTab(tabContainer) {
    tabContainer.innerHTML = `
      <div class="editor-card">
        <h3 style="margin-bottom:1.5rem;">🚛 토스페이먼츠 주문 & 물류 배송 추적 관리</h3>
        ${this.orders.length === 0 ? `<p style="color:var(--text-muted);">현재 접수된 주문 내역이 없습니다.</p>` : `
          <div style="overflow-x:auto;">
            <table class="cms-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-glass); text-align:left; color:var(--text-muted);">
                  <th style="padding:0.75rem;">주문번호</th>
                  <th style="padding:0.75rem;">주문자</th>
                  <th style="padding:0.75rem;">결제금액</th>
                  <th style="padding:0.75rem;">결제수단</th>
                  <th style="padding:0.75rem;">주문상태</th>
                  <th style="padding:0.75rem;">택배사 & 운송장</th>
                  <th style="padding:0.75rem;">실시간 배송 추적</th>
                  <th style="padding:0.75rem; text-align:right;">취소/환불</th>
                </tr>
              </thead>
              <tbody>
                ${this.orders.map(o => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.05);" data-id="${o.id}">
                    <td style="padding:0.75rem; font-weight:700; color:var(--accent-rose-gold);">${o.id}</td>
                    <td style="padding:0.75rem;">
                      <strong>${this.escapeHtml(o.userName || o.customerName || '고객')}</strong>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${o.phone || ''}</div>
                    </td>
                    <td style="padding:0.75rem; font-weight:700; color:#fff;">₩${(o.totalAmount||o.amount||0).toLocaleString()}</td>
                    <td style="padding:0.75rem;"><span style="background:rgba(255,255,255,0.08); padding:0.2rem 0.5rem; border-radius:4px;">${o.method || 'TOSSPAYMENTS'}</span></td>
                    <td style="padding:0.75rem;"><span class="status-badge ${o.status === 'cancelled' ? 'closed' : 'open'}">${o.status === 'pending' ? '입금대기' : o.status === 'completed' ? '결제완료' : '주문취소'}</span></td>
                    <td style="padding:0.75rem;">
                      <div style="display:flex; gap:0.25rem;">
                        <select class="form-control order-courier-select" style="font-size:0.75rem; padding:0.2rem;" data-id="${o.id}">
                          <option value="cj" ${(o.courier||'cj') === 'cj' ? 'selected' : ''}>CJ대한통운</option>
                          <option value="rosen" ${o.courier === 'rosen' ? 'selected' : ''}>로젠택배</option>
                          <option value="hanjin" ${o.courier === 'hanjin' ? 'selected' : ''}>한진택배</option>
                        </select>
                        <input type="text" class="form-control order-tracking-input" style="font-size:0.75rem; padding:0.2rem; width:100px;" value="${o.trackingNo || ''}" placeholder="운송장입력" data-id="${o.id}">
                      </div>
                    </td>
                    <td style="padding:0.75rem;">
                      <button type="button" class="btn-secondary btn-track-courier" data-id="${o.id}" data-courier="${o.courier||'cj'}" data-tracking="${o.trackingNo||'6502019482'}" data-name="${this.escapeHtml(o.userName||'고객님')}" style="font-size:0.75rem; border-radius:20px; padding:0.2rem 0.6rem;">
                        🔍 배송 추적 모달
                      </button>
                    </td>
                    <td style="padding:0.75rem; text-align:right;">
                      ${o.status !== 'cancelled' ? `
                        <button type="button" class="btn-secondary btn-cancel-refund" data-id="${o.id}" style="font-size:0.75rem; border-color:var(--error); color:var(--error); border-radius:20px; padding:0.25rem 0.6rem;">
                          🚫 주문취소 & 환불
                        </button>
                      ` : `<span style="font-size:0.75rem; color:var(--text-muted);">환불완료</span>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    this.setupOrdersEvents();
  }

  // ─── 메뉴 7: 고객 관리 & 회원등급 산정 ───
  renderCustomersTab(tabContainer) {
    const policy = this.tierPolicy || { silverMinOrders: 1, goldMinOrders: 3, silverPoints: 1000, goldPoints: 3000 };

    tabContainer.innerHTML = `
      <div class="editor-card" style="margin-bottom:1.5rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="margin:0;">👑 가변 회원 등급 승급 기준 설정 (Configurable Tier Policy)</h3>
          <button type="button" id="btn-recalculate-tiers" class="btn-primary" style="border-radius:30px; font-weight:700;">
            ⚡ 기준 저장 & 전체 회원 일괄 재산정
          </button>
        </div>
        <p style="margin:0 0 1.25rem; font-size:0.85rem; color:var(--text-secondary);">완료 결제 횟수 기준 변경 시 전체 회원의 결제 이력을 계산하여 실시간 일괄 등급을 재산정 승급 업데이트합니다.</p>
        
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label">Silver 등급 최소 결제 횟수 (회 이상)</label>
            <input type="number" id="policy-silver-min" class="form-control" value="${policy.silverMinOrders}" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">Gold VIP 등급 최소 결제 횟수 (회 이상)</label>
            <input type="number" id="policy-gold-min" class="form-control" value="${policy.goldMinOrders}" min="2">
          </div>
        </div>
      </div>

      <div class="editor-card" style="margin-bottom:1.5rem;">
        <h3>🎁 회원 등급별 적립금(포인트) 일괄 지급</h3>
        <div class="editor-row" style="align-items:flex-end;">
          <div class="form-group">
            <label class="form-label">지급 대상 그룹</label>
            <select id="batch-target-group" class="form-control">
              <option value="ALL">전체 회원</option>
              <option value="GOLD">GOLD VIP 전체</option>
              <option value="SILVER">SILVER 전체</option>
              <option value="BRONZE">BRONZE 전체</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">지급 적립금 포인트 (P)</label>
            <input type="number" id="batch-points-amount" class="form-control" value="3000">
          </div>
          <div class="form-group">
            <label class="form-label">지급 사유 메모</label>
            <input type="text" id="batch-points-memo" class="form-control" value="신년 승급 및 프로모션 특별 적립금">
          </div>
          <div class="form-group">
            <button type="button" id="btn-batch-assign-points" class="btn-secondary" style="border-color:var(--accent-emerald); color:var(--accent-emerald); height:46px; border-radius:12px; font-weight:700;">
              일괄 포인트 지급
            </button>
          </div>
        </div>
      </div>

      <div class="editor-card">
        <h3 style="margin-bottom:1.5rem;">👥 전체 가입 고객 목록 (${this.users.length}명)</h3>
        ${this.users.length === 0 ? `<p style="color:var(--text-muted);">가입된 고객이 없습니다.</p>` : `
          <div style="overflow-x:auto;">
            <table class="cms-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
              <thead>
                <tr style="border-bottom:1px solid var(--border-glass); text-align:left; color:var(--text-muted);">
                  <th style="padding:0.75rem;">고객명</th>
                  <th style="padding:0.75rem;">소셜 인증</th>
                  <th style="padding:0.75rem;">이메일</th>
                  <th style="padding:0.75rem;">연락처</th>
                  <th style="padding:0.75rem;">회원 등급</th>
                  <th style="padding:0.75rem;">보유 적립금</th>
                  <th style="padding:0.75rem;">가입일시</th>
                </tr>
              </thead>
              <tbody>
                ${this.users.map(u => `
                  <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                    <td style="padding:0.75rem; font-weight:700; color:#fff;">${this.escapeHtml(u.name)}</td>
                    <td style="padding:0.75rem;">
                      <span style="display:inline-flex; align-items:center; gap:0.25rem; font-size:0.75rem; padding:0.2rem 0.5rem; border-radius:30px; background:rgba(255,255,255,0.05);">
                        ${(u.email||'').includes('gmail') ? '🟢 Google' : (u.email||'').includes('naver') ? '🟢 Naver' : '✉️ Email'}
                      </span>
                    </td>
                    <td style="padding:0.75rem; color:var(--text-secondary);">${u.email}</td>
                    <td style="padding:0.75rem;">${u.phone || '-'}</td>
                    <td style="padding:0.75rem;">
                      <span class="status-badge ${u.tier === 'GOLD VIP' ? 'open' : 'closed'}" style="font-weight:700;">${u.tier || 'BRONZE'}</span>
                    </td>
                    <td style="padding:0.75rem; font-weight:700; color:var(--accent-rose-gold);">${(u.points||0).toLocaleString()} P</td>
                    <td style="padding:0.75rem; color:var(--text-muted);">${(u.createdAt||'').slice(0,10)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    `;

    this.setupCustomersEvents();
  }

  // ─── 메뉴 8: 권한등록 & 운영자 관리 (siteadmin 전용) ───
  renderSystemTab(tabContainer) {
    if (!this.isSiteAdmin) {
      tabContainer.innerHTML = `
        <div class="editor-card" style="text-align:center; padding:3.5rem 2rem;">
          <div style="font-size:3rem; margin-bottom:1rem;">🔒</div>
          <h3 style="color:var(--error); margin-bottom:0.5rem;">siteadmin 고유 접근 권한 메뉴</h3>
          <p style="color:var(--text-muted); max-width:500px; margin:0 auto;">운영자 및 직원 계정의 세부 권한(RBAC) 부여/회수는 오직 siteadmin (최고 관리자) 계정만 관리 가능합니다.</p>
        </div>
      `;
      return;
    }

    tabContainer.innerHTML = `
      <div class="editor-card" style="margin-bottom:1.5rem;">
        <h3>🔒 운영자 / 직원 계정 세부 권한(RBAC) 부여 및 관리</h3>
        <p style="margin:0 0 1.25rem; font-size:0.85rem; color:var(--text-secondary);">siteadmin이 물류직원, 쇼핑몰 운영직원의 메뉴별 접근 권한을 개별 부여/회수 관리합니다.</p>
        
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label">직원 성명</label>
            <input type="text" id="staff-name" class="form-control" placeholder="홍길동" required>
          </div>
          <div class="form-group">
            <label class="form-label">직원 이메일 (아이디)</label>
            <input type="email" id="staff-email" class="form-control" placeholder="staff1@company.com" required>
          </div>
        </div>
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label">소속 부서 (예: 물류팀, 쇼핑몰운영팀)</label>
            <input type="text" id="staff-dept" class="form-control" placeholder="이커머스 운영팀" required>
          </div>
          <div class="form-group">
            <label class="form-label">초기 비밀번호</label>
            <input type="password" id="staff-pw" class="form-control" placeholder="!staff1004">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">접근 허용 메뉴 (RBAC Grant/Revoke)</label>
          <div style="display:flex; flex-wrap:wrap; gap:1rem; margin-top:0.5rem; background:rgba(0,0,0,0.2); padding:1rem; border-radius:12px; border:1px solid var(--border-glass);">
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="dashboard" checked> 📊 대시보드</label>
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="site" checked> 🌐 사이트 정보</label>
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="contents" checked> 🎬 콘텐츠 관리</label>
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="products" checked> 📦 제품 관리</label>
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="shop"> 🛒 쇼핑몰/PG 관리</label>
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="orders" checked> 🚛 주문/물류 관리</label>
            <label style="display:flex; align-items:center; gap:0.3rem;"><input type="checkbox" class="staff-perm" value="customers" checked> 👥 고객 관리</label>
          </div>
        </div>
        <button type="button" id="btn-create-staff" class="btn-primary" style="border-radius:30px; font-weight:700;">+ 직원 계정 신규 생성 & 권한 부여</button>
      </div>

      <div class="editor-card">
        <h3>📋 등록된 운영자 / 직원 권한 현황 (${this.staffUsers.length}명)</h3>
        <div style="overflow-x:auto;">
          <table class="cms-table" style="width:100%; border-collapse:collapse; font-size:0.85rem;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-glass); text-align:left; color:var(--text-muted);">
                <th style="padding:0.75rem;">성명</th>
                <th style="padding:0.75rem;">소속 부서</th>
                <th style="padding:0.75rem;">이메일</th>
                <th style="padding:0.75rem;">부여된 권한 메뉴 (RBAC)</th>
                <th style="padding:0.75rem; text-align:right;">권한 회수 & 삭제</th>
              </tr>
            </thead>
            <tbody>
              ${this.staffUsers.map(s => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:0.75rem; font-weight:700; color:#fff;">${this.escapeHtml(s.name)}</td>
                  <td style="padding:0.75rem;">${this.escapeHtml(s.department)}</td>
                  <td style="padding:0.75rem; color:var(--text-secondary);">${s.email}</td>
                  <td style="padding:0.75rem;">
                    <div style="display:flex; flex-wrap:wrap; gap:0.25rem;">
                      ${(s.menuPermissions||[]).map(p => `<span style="background:rgba(230,180,170,0.15); color:var(--accent-rose-gold); padding:0.1rem 0.4rem; border-radius:4px; font-size:0.7rem;">${p}</span>`).join('')}
                    </div>
                  </td>
                  <td style="padding:0.75rem; text-align:right;">
                    <button type="button" class="btn-delete-staff btn-secondary" data-id="${s.id}" style="font-size:0.75rem; color:var(--error); border-color:var(--error); border-radius:20px; padding:0.2rem 0.5rem;">계정 삭제</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    this.setupSystemEvents();
  }

  // ─── 이벤트 핸들러 바인딩 ───
  setupEventListeners() {
    const links = this.container.querySelectorAll('.sidebar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetTab = e.currentTarget.dataset.tab;
        if (targetTab !== this.currentTab) {
          this.currentTab = targetTab;
          links.forEach(l => l.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.renderTabContent();
        }
      });
    });

    const logoutBtn = this.container.querySelector('#logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('admin_session');
        sessionStorage.removeItem('admin_user');
        if (this.onLogout) this.onLogout();
      });
    }

    const form = this.container.querySelector('#cms-editor-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        this.saveCurrentFormState();
        await db.updateContent(this.data);
        await db.updateShopSettings(this.shopSettings);
        this.showToast("변경사항이 성공적으로 저장되었습니다!");
      });
    }
  }

  updateSidebarActive() {
    const links = this.container.querySelectorAll('.sidebar-link');
    links.forEach(l => {
      if (l.dataset.tab === this.currentTab) l.classList.add('active');
      else l.classList.remove('active');
    });
  }

  saveCurrentFormState() {
    if (this.currentTab === 'site') {
      if (this.siteSubTab === 'brand') {
        const ko = this.container.querySelector('#brand-ko');
        const en = this.container.querySelector('#brand-en');
        if (ko && en) {
          if (!this.data.brand) this.data.brand = {};
          this.data.brand.koName = ko.value;
          this.data.brand.enName = en.value;
        }

        const title = this.container.querySelector('#ceo-title');
        const content = this.container.querySelector('#ceo-content');
        const img = this.container.querySelector('#ceo-image');
        const sig = this.container.querySelector('#ceo-signature');
        if (title && content && img) {
          this.data.ceoGreeting = {
            title: title.value,
            content: content.value,
            imageUrl: img.value,
            signatureUrl: sig ? sig.value : ""
          };
        }
      }
      else if (this.siteSubTab === 'seo') {
        const title = this.container.querySelector('#seo-title');
        const desc = this.container.querySelector('#seo-desc');
        const kw = this.container.querySelector('#seo-keywords');
        const rob = this.container.querySelector('#seo-robots');
        const ogt = this.container.querySelector('#og-title');
        const ogd = this.container.querySelector('#og-desc');
        const ogi = this.container.querySelector('#og-image');
        const gv = this.container.querySelector('#google-verify');
        const nv = this.container.querySelector('#naver-verify');

        if (title && desc) {
          this.data.seo = {
            metaTitle: title.value,
            metaDescription: desc.value,
            keywords: kw ? kw.value : "",
            robots: rob ? rob.value : "index, follow",
            ogTitle: ogt ? ogt.value : "",
            ogDescription: ogd ? ogd.value : "",
            ogImage: ogi ? ogi.value : "",
            googleVerification: gv ? gv.value : "",
            naverVerification: nv ? nv.value : ""
          };
        }
      }
      else if (this.siteSubTab === 'resend' && this.isSiteAdmin) {
        const key = this.container.querySelector('#resend-key');
        const sender = this.container.querySelector('#resend-sender');
        const rec = this.container.querySelector('#resend-recipient');
        if (key && sender) {
          this.data.resend = {
            apiKey: key.value,
            senderEmail: sender.value,
            testEmailRecipient: rec ? rec.value : ""
          };
        }
      }
      else if (this.siteSubTab === 'footer') {
        const name = this.container.querySelector('#info-name');
        const ceo = this.container.querySelector('#info-ceo');
        const biz = this.container.querySelector('#info-biz');
        const tel = this.container.querySelector('#info-tel');
        const addr = this.container.querySelector('#info-address');
        const email = this.container.querySelector('#info-email');
        if (name && ceo) {
          this.data.companyInfo = {
            name: name.value,
            ceo: ceo.value,
            businessNo: biz.value,
            tel: tel.value,
            address: addr.value,
            email: email.value
          };
        }
      }
    }
  }

  // ─── Sub-events Setup ───
  setupPressEvents() {
    const container = this.container.querySelector('#press-cards-container');
    const addBtn = this.container.querySelector('#add-press-btn');

    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!this.data.press) this.data.press = [];
        this.data.press.unshift({
          id: `press-${Date.now()}`,
          title: "신규 보도자료 타이틀",
          content: "기사 요약 내용을 입력하세요.",
          date: new Date().toISOString().slice(0, 10),
          imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80"
        });
        this.renderContentsSubTab();
      });
    }

    if (container) {
      container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete-press')) {
          const index = e.target.dataset.index;
          this.data.press.splice(index, 1);
          this.renderContentsSubTab();
        }
      });
    }
  }

  setupMediaEvents() {
    const addBtn = this.container.querySelector('#add-media-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!this.data.media) this.data.media = [];
        this.data.media.unshift({
          id: `m-${Date.now()}`,
          type: "video",
          title: "새 브랜드 미디어 자료",
          desc: "자료 설명을 입력하세요.",
          link: "https://www.youtube.com/watch?v=dr_zFr8Xw-E"
        });
        this.renderContentsSubTab();
      });
    }
  }

  setupCareersEvents() {
    const addBtn = this.container.querySelector('#add-recruit-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!this.data.recruitment) this.data.recruitment = [];
        this.data.recruitment.unshift({
          id: `recruit-${Date.now()}`,
          dept: "경영기획팀",
          title: "신규 채용 공고",
          desc: "직무 자격 요건을 입력하세요.",
          status: "open"
        });
        this.renderContentsSubTab();
      });
    }
  }

  setupGalleryEvents() {
    const addBtn = this.container.querySelector('#add-gallery-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!this.data.gallery) this.data.gallery = [];
        this.data.gallery.unshift({
          id: `gal-${Date.now()}`,
          title: "신규 룩북 캠페인",
          imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
          desc: "캠페인 설명"
        });
        this.renderContentsSubTab();
      });
    }
  }

  setupProductsEvents() {
    // 1. 카테고리 신규 추가 버튼
    const addCatBtn = this.container.querySelector('#btn-add-category');
    if (addCatBtn) {
      addCatBtn.addEventListener('click', async () => {
        const nameInput = this.container.querySelector('#new-cat-name');
        const keyInput = this.container.querySelector('#new-cat-key');
        const name = nameInput ? nameInput.value.trim() : '';
        const key = keyInput ? keyInput.value.trim().toLowerCase() : '';

        if (!name || !key) {
          this.showToast("카테고리명과 고유 키를 모두 입력하세요.", true);
          return;
        }

        if (this.data.categories.find(c => c.key === key)) {
          this.showToast("이미 존재하는 카테고리 키입니다.", true);
          return;
        }

        this.data.categories.push({ key, name });
        await db.updateContent(this.data);
        this.showToast(`신규 카테고리 [${name}]이 성공적으로 추가되었습니다.`);
        this.renderProductsTab(this.container.querySelector('#editor-tab-content'));
      });
    }

    // 2. 카테고리 삭제 버튼
    this.container.querySelectorAll('.btn-delete-cat').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const idx = Number(e.target.dataset.index);
        if (confirm(`카테고리 [${this.data.categories[idx].name}]를 삭제하시겠습니까?`)) {
          this.data.categories.splice(idx, 1);
          await db.updateContent(this.data);
          this.showToast("카테고리가 삭제되었습니다.");
          this.renderProductsTab(this.container.querySelector('#editor-tab-content'));
        }
      });
    });

    // 3. 신규 제품 추가
    const addProdBtn = this.container.querySelector('#add-product-btn');
    if (addProdBtn) {
      addProdBtn.addEventListener('click', () => {
        if (!this.data.products) this.data.products = [];
        const defaultCatKey = (this.data.categories && this.data.categories[0]) ? this.data.categories[0].key : 'skincare';
        this.data.products.unshift({
          id: `p-${Date.now()}`,
          category: defaultCatKey,
          title: "신규 제품명",
          desc: "제품 세부 설명",
          imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=400&q=80",
          price: 50000,
          originalPrice: 60000,
          stock: 100,
          isSoldOut: false,
          isFeatured: false
        });
        this.renderProductsTab(this.container.querySelector('#editor-tab-content'));
      });
    }

    // 4. 제품 삭제
    this.container.querySelectorAll('.btn-delete-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = Number(e.target.dataset.index);
        if (confirm(`제품 [${this.data.products[index].title}]을 삭제하시겠습니까?`)) {
          this.data.products.splice(index, 1);
          this.renderProductsTab(this.container.querySelector('#editor-tab-content'));
        }
      });
    });

    // 5. 상위 노출 3개 선택 제어 (Featured constraint)
    this.container.querySelectorAll('.prod-featured-check').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const index = Number(e.target.dataset.index);
        const isChecked = e.target.checked;

        if (isChecked) {
          const currentFeatured = this.data.products.filter((p, i) => i !== index && p.isFeatured).length;
          if (currentFeatured >= 3) {
            e.target.checked = false;
            this.showToast("상위 노출 상품은 최대 3개까지만 지정할 수 있습니다.", true);
            return;
          }
        }

        this.data.products[index].isFeatured = isChecked;
        this.renderProductsTab(this.container.querySelector('#editor-tab-content'));
      });
    });

    // 6. 이미지 파일 업로드 5MB 이하 제한 처리
    this.container.querySelectorAll('.prod-file-input').forEach(fileInput => {
      fileInput.addEventListener('change', (e) => {
        const index = Number(e.target.dataset.index);
        const file = e.target.files[0];
        if (!file) return;

        // 5MB 용량 제한 검증 (5MB = 5 * 1024 * 1024 bytes)
        if (file.size > 5 * 1024 * 1024) {
          this.showToast("파일 크기가 5MB를 초과합니다. 5MB 이하의 이미지 파일만 업로드 가능합니다.", true);
          e.target.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
          const dataUrl = evt.target.result;
          this.data.products[index].imageUrl = dataUrl;
          
          const card = e.target.closest('.editor-card');
          if (card) {
            const urlInput = card.querySelector('.prod-image');
            const imgPreview = card.querySelector('.prod-preview-img');
            if (urlInput) urlInput.value = dataUrl;
            if (imgPreview) imgPreview.src = dataUrl;
          }
          this.showToast("이미지 파일이 성공적으로 첨부 및 변환되었습니다.");
        };
        reader.readAsDataURL(file);
      });
    });

    // 7. 실시간 폼 필드 입력 동기화
    const cards = this.container.querySelectorAll('#products-cards-container .editor-card');
    cards.forEach(card => {
      const index = Number(card.dataset.index);
      if (isNaN(index)) return;

      const titleInput = card.querySelector('.prod-title');
      const catSelect = card.querySelector('.prod-cat');
      const priceInput = card.querySelector('.prod-price');
      const origPriceInput = card.querySelector('.prod-orig-price');
      const stockInput = card.querySelector('.prod-stock');
      const imgInput = card.querySelector('.prod-image');
      const textureInput = card.querySelector('.prod-texture');
      const skintypeInput = card.querySelector('.prod-skintype');
      const ingrInput = card.querySelector('.prod-ingredients');
      const soldoutSelect = card.querySelector('.prod-soldout');

      if (titleInput) titleInput.addEventListener('input', e => this.data.products[index].title = e.target.value);
      if (catSelect) catSelect.addEventListener('change', e => this.data.products[index].category = e.target.value);
      if (priceInput) priceInput.addEventListener('input', e => this.data.products[index].price = Number(e.target.value));
      if (origPriceInput) origPriceInput.addEventListener('input', e => this.data.products[index].originalPrice = Number(e.target.value));
      if (stockInput) stockInput.addEventListener('input', e => this.data.products[index].stock = Number(e.target.value));
      if (imgInput) imgInput.addEventListener('input', e => {
        this.data.products[index].imageUrl = e.target.value;
        const imgPrev = card.querySelector('.prod-preview-img');
        if (imgPrev) imgPrev.src = e.target.value;
      });
      if (textureInput) textureInput.addEventListener('input', e => this.data.products[index].texture = e.target.value);
      if (skintypeInput) skintypeInput.addEventListener('input', e => this.data.products[index].skinType = e.target.value);
      if (ingrInput) ingrInput.addEventListener('input', e => this.data.products[index].ingredients = e.target.value);
      if (soldoutSelect) soldoutSelect.addEventListener('change', e => this.data.products[index].isSoldOut = (e.target.value === 'true'));
    });
  }

  setupShopEvents() {
    const addBtn = this.container.querySelector('#add-banner-btn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        if (!this.data.banners) this.data.banners = [];
        this.data.banners.push({
          id: `banner-${Date.now()}`,
          title: "프로모션 배너 제목",
          subtitle: "프로모션 이벤트 상세",
          imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=1200&q=80",
          linkUrl: "#/shop"
        });
        this.renderTabContent();
      });
    }
  }

  setupOrdersEvents() {
    this.container.querySelectorAll('.btn-track-courier').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courier = e.target.dataset.courier || 'cj';
        const trackingNo = e.target.dataset.tracking || '6502019482';
        const recipientName = e.target.dataset.name || '고객님';
        const modal = new CourierTrackingModal(courier, trackingNo, recipientName);
        modal.render();
      });
    });

    this.container.querySelectorAll('.btn-cancel-refund').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const orderId = e.target.dataset.id;
        if (confirm(`주문번호 [${orderId}] 건을 정말로 취소 및 토스 PG 환불 승인 처리하시겠습니까?`)) {
          await db.cancelAndRefundOrder(orderId);
          this.orders = await db.getOrders();
          this.showToast("주문이 취소되고 토스페이 결제 환불 승인 처리되었습니다.");
          this.renderTabContent();
        }
      });
    });
  }

  setupCustomersEvents() {
    const recalcBtn = this.container.querySelector('#btn-recalculate-tiers');
    if (recalcBtn) {
      recalcBtn.addEventListener('click', async () => {
        const sMin = Number(this.container.querySelector('#policy-silver-min').value);
        const gMin = Number(this.container.querySelector('#policy-gold-min').value);
        this.tierPolicy = { silverMinOrders: sMin, goldMinOrders: gMin, silverPoints: 1000, goldPoints: 3000 };
        await db.saveTierPolicy(this.tierPolicy);

        const res = await db.recalculateUserTiers();
        this.users = await db.getShopUsers();
        this.showToast(`전체 회원 ${res.totalUsers}명 중 ${res.updatedCount}명의 등급이 재산정 및 업데이트되었습니다.`);
        this.renderTabContent();
      });
    }

    const batchBtn = this.container.querySelector('#btn-batch-assign-points');
    if (batchBtn) {
      batchBtn.addEventListener('click', async () => {
        const group = this.container.querySelector('#batch-target-group').value;
        const pts = Number(this.container.querySelector('#batch-points-amount').value);
        const memo = this.container.querySelector('#batch-points-memo').value;

        const res = await db.batchAssignPoints(group, pts, memo);
        this.users = await db.getShopUsers();
        this.showToast(`대상 그룹 [${group}] 회원 ${res.count}명에게 ${pts.toLocaleString()} P 적립금이 일괄 지급되었습니다.`);
        this.renderTabContent();
      });
    }
  }

  setupSystemEvents() {
    if (!this.isSiteAdmin) return;

    const createBtn = this.container.querySelector('#btn-create-staff');
    if (createBtn) {
      createBtn.addEventListener('click', async () => {
        const name = this.container.querySelector('#staff-name').value;
        const email = this.container.querySelector('#staff-email').value;
        const dept = this.container.querySelector('#staff-dept').value;
        const perms = Array.from(this.container.querySelectorAll('.staff-perm:checked')).map(cb => cb.value);

        if (!name || !email) {
          this.showToast("직원 성명과 이메일을 입력하세요.", true);
          return;
        }

        await db.addStaffUser({ name, email, department: dept, menuPermissions: perms });
        this.staffUsers = await db.getStaffUsers();
        this.showToast(`신규 직원 [${name}] 계정이 성공적으로 등록되었습니다.`);
        this.renderTabContent();
      });
    }

    this.container.querySelectorAll('.btn-delete-staff').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        if (confirm("해당 직원 계정을 삭제하고 권한을 회수하시겠습니까?")) {
          await db.deleteStaffUser(id);
          this.staffUsers = await db.getStaffUsers();
          this.showToast("직원 계정 삭제 및 권한 회수가 완료되었습니다.");
          this.renderTabContent();
        }
      });
    });
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

  showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'error' : ''}`;
    toast.style.zIndex = '10010';
    toast.innerHTML = `<span>${message}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
