import { db } from '../services/db.js';

export class AdminDashboard {
  constructor(container, onLogout) {
    this.container = container;
    this.onLogout = onLogout;
    this.currentTab = 'dashboard'; // dashboard, contents, members, products, orders, inquiries, system
    this.contentSubTab = 'ceo';   // ceo, info, careers, media, press, gallery, hero_footer
    this.data = null;
    this.shopSettings = null;
    this.orders = [];
    this.inquiries = [];
    this.users = [];
  }

  async render() {
    this.data = await db.getContent();
    this.shopSettings = await db.getShopSettings();
    this.orders = await db.getOrders();
    this.inquiries = await db.getInquiries();
    this.users = await db.getShopUsers();
    
    this.container.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- 사이드바 -->
        <aside class="dashboard-sidebar">
          <div class="sidebar-title">Content CMS</div>
          <ul class="sidebar-menu">
            <li class="sidebar-link ${this.currentTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              대시보드
            </li>
            <li class="sidebar-link ${this.currentTab === 'contents' ? 'active' : ''}" data-tab="contents">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              콘텐츠 관리
            </li>
            <li class="sidebar-link ${this.currentTab === 'members' ? 'active' : ''}" data-tab="members">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              회원 관리
            </li>
            <li class="sidebar-link ${this.currentTab === 'products' ? 'active' : ''}" data-tab="products">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              상품 관리
            </li>
            <li class="sidebar-link ${this.currentTab === 'orders' ? 'active' : ''}" data-tab="orders">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              주문 관리
              ${this.orders.filter(o => o.status === 'pending').length > 0 ? `<span class="order-count-badge">${this.orders.filter(o => o.status === 'pending').length}</span>` : ''}
            </li>
            <li class="sidebar-link ${this.currentTab === 'inquiries' ? 'active' : ''}" data-tab="inquiries">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              문의 관리
              ${this.inquiries.filter(i => i.status === 'pending').length > 0 ? `<span class="order-count-badge" style="background:var(--accent-indigo);">${this.inquiries.filter(i => i.status === 'pending').length}</span>` : ''}
            </li>
            <li class="sidebar-link ${this.currentTab === 'system' ? 'active' : ''}" data-tab="system">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              시스템 설정
            </li>
          </ul>
        </aside>

        <!-- 메인 콘텐츠 영역 -->
        <main class="dashboard-content">
          <div class="dashboard-header">
            <div>
              <h1 id="dashboard-title-text">CMS 대시보드</h1>
              <p style="color: var(--text-secondary); margin-top: 0.25rem;">화장품 브랜드 데이터를 실시간 편집합니다.</p>
            </div>
            
            <div class="user-badge">
              <span style="font-size: 0.9rem; color: var(--text-secondary);">관리자(siteadmin)</span>
              <a href="#/" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                메인 보기
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
    
    // 특정 탭은 저장 버튼이 불필요
    const viewOnlyTabs = ['dashboard', 'members', 'orders', 'inquiries'];
    saveArea.style.display = viewOnlyTabs.includes(this.currentTab) ? 'none' : 'flex';

    if (this.currentTab === 'dashboard') {
      titleText.textContent = "통계 대시보드";
      this.renderDashboardOverview(tabContainer);
    } 
    else if (this.currentTab === 'contents') {
      titleText.textContent = "콘텐츠 관리";
      this.renderContentsTab(tabContainer);
    } 
    else if (this.currentTab === 'members') {
      titleText.textContent = "쇼핑몰 회원 관리";
      this.renderMembersTab(tabContainer);
    } 
    else if (this.currentTab === 'products') {
      titleText.textContent = "상품 목록 관리";
      this.renderProductsTab(tabContainer);
    } 
    else if (this.currentTab === 'orders') {
      titleText.textContent = "주문 현황 및 처리";
      this.renderOrdersTab(tabContainer);
    }
    else if (this.currentTab === 'inquiries') {
      titleText.textContent = "고객 문의 관리";
      this.renderInquiriesTab(tabContainer);
    }
    else if (this.currentTab === 'system') {
      titleText.textContent = "시스템 환경 설정";
      this.renderSystemTab(tabContainer);
    }
  }

  // 1. 통계 대시보드
  renderDashboardOverview(tabContainer) {
    const pendingOrders = this.orders.filter(o => o.status === 'pending').length;
    const pendingInquiries = this.inquiries.filter(i => i.status === 'pending').length;
    const totalSales = this.orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);

    tabContainer.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; text-align:left;">
        <div class="editor-card" style="margin: 0; padding: 2rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">신규 주문 (대기)</div>
          <div style="font-size:2.2rem; font-weight:700; color:var(--accent-rose-gold);">${pendingOrders}건</div>
        </div>
        <div class="editor-card" style="margin: 0; padding: 2rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">미답변 문의</div>
          <div style="font-size:2.2rem; font-weight:700; color:var(--accent-indigo);">${pendingInquiries}건</div>
        </div>
        <div class="editor-card" style="margin: 0; padding: 2rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">쇼핑몰 총 가입 회원</div>
          <div style="font-size:2.2rem; font-weight:700; color:#fff;">${this.users.length}명</div>
        </div>
        <div class="editor-card" style="margin: 0; padding: 2rem; border-radius: 20px;">
          <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.5rem;">누적 매출액</div>
          <div style="font-size:2.2rem; font-weight:700; color:var(--accent-emerald);">${this.shopSettings.currency}${totalSales.toLocaleString()}</div>
        </div>
      </div>
      
      <div class="editor-card" style="text-align:left;">
        <h3 style="margin-bottom:1.5rem;">최근 접수된 문의 (답변 대기)</h3>
        ${this.inquiries.filter(i => i.status === 'pending').length === 0 ? `<p style="color:var(--text-muted);">대기 중인 문의가 없습니다.</p>` : `
          <div style="display:flex; flex-direction:column; gap:1rem;">
            ${this.inquiries.filter(i => i.status === 'pending').slice(0, 3).map(i => `
              <div style="padding:1rem; background:rgba(0,0,0,0.15); border-radius:14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <strong style="color:#fff;">${this.escapeHtml(i.title)}</strong>
                  <span style="font-size:0.8rem; color:var(--text-muted); margin-left:0.75rem;">${this.escapeHtml(i.name)} (${i.phone})</span>
                </div>
                <button type="button" class="btn-secondary" onclick="window.location.hash='#/admin/dashboard'; document.querySelector('[data-tab=inquiries]').click();" style="font-size:0.8rem; border-radius: 50px;">답변 쓰기</button>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // 2. 콘텐츠 관리
  renderContentsTab(tabContainer) {
    tabContainer.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom: 2rem;" id="contents-sub-nav">
        <button type="button" class="filter-btn ${this.contentSubTab === 'ceo' ? 'active' : ''}" data-sub="ceo">인사말</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'info' ? 'active' : ''}" data-sub="info">회사정보</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'careers' ? 'active' : ''}" data-sub="careers">인재채용</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'media' ? 'active' : ''}" data-sub="media">자료실/영상</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'press' ? 'active' : ''}" data-sub="press">보도자료</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'gallery' ? 'active' : ''}" data-sub="gallery">갤러리</button>
        <button type="button" class="filter-btn ${this.contentSubTab === 'hero_footer' ? 'active' : ''}" data-sub="hero_footer">메인 배너/푸터</button>
      </div>
      <div id="contents-editor-panel">
        <!-- 하위 에디터 영역 동적 주입 -->
      </div>
    `;

    this.renderContentsSubTab();

    // 하위 탭 이벤트 바인딩
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
      const data = this.data.ceoGreeting || { title: "", content: "", imageUrl: "" };
      panel.innerHTML = `
        <div class="editor-card">
          <h3>대표이사 인사말 설정</h3>
          <div class="form-group">
            <label class="form-label" for="ceo-title">인사말 타이틀</label>
            <input type="text" id="ceo-title" class="form-control" value="${this.escapeHtml(data.title)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="ceo-content">인사말 본문 내용</label>
            <textarea id="ceo-content" class="form-control" rows="8" required>${data.content}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="ceo-image">대표 사진 이미지 URL</label>
            <input type="text" id="ceo-image" class="form-control" value="${this.escapeHtml(data.imageUrl)}" required>
          </div>
        </div>
      `;
    } 
    else if (this.contentSubTab === 'info') {
      const data = this.data.companyInfo || { name: "", ceo: "", businessNo: "", tel: "", address: "", email: "", mapUrl: "" };
      panel.innerHTML = `
        <div class="editor-card">
          <h3>회사 정보 및 지도</h3>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="info-name">회사명</label>
              <input type="text" id="info-name" class="form-control" value="${this.escapeHtml(data.name)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="info-ceo">대표자명</label>
              <input type="text" id="info-ceo" class="form-control" value="${this.escapeHtml(data.ceo)}" required>
            </div>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="info-biz">사업자번호</label>
              <input type="text" id="info-biz" class="form-control" value="${this.escapeHtml(data.businessNo)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="info-tel">전화번호</label>
              <input type="text" id="info-tel" class="form-control" value="${this.escapeHtml(data.tel)}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="info-address">본사 주소</label>
            <input type="text" id="info-address" class="form-control" value="${this.escapeHtml(data.address)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="info-email">공식 이메일</label>
            <input type="email" id="info-email" class="form-control" value="${this.escapeHtml(data.email)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="info-map">구글 지도 임베드(iframe src URL)</label>
            <input type="text" id="info-map" class="form-control" value="${this.escapeHtml(data.mapUrl)}">
          </div>
        </div>
      `;
    } 
    else if (this.contentSubTab === 'careers') {
      let recruitHtml = '';
      (this.data.recruitment || []).forEach((c, index) => {
        recruitHtml += `
          <div class="feature-editor-item recruit-editor-item" data-index="${index}">
            <button type="button" class="btn-delete-card btn-delete-recruit" data-index="${index}">공고 삭제</button>
            <div class="editor-row">
              <div class="form-group">
                <label class="form-label">모집 부서</label>
                <input type="text" class="form-control recruit-dept" value="${this.escapeHtml(c.dept)}" required>
              </div>
              <div class="form-group">
                <label class="form-label">모집 상태</label>
                <select class="form-control recruit-status" required>
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
              <label class="form-label">자세한 직무 내용</label>
              <textarea class="form-control recruit-desc" rows="2" required>${c.desc}</textarea>
            </div>
          </div>
        `;
      });
      panel.innerHTML = `
        <div class="editor-card">
          <h3>채용 공고 관리</h3>
          <div class="feature-editor-list" id="recruit-list-container">${recruitHtml}</div>
          <button type="button" id="add-recruit-btn" class="btn-add-card">새 채용 공고 추가</button>
        </div>
      `;
      this.setupCareersSubTabEvents();
    }
    else if (this.contentSubTab === 'media') {
      let mediaHtml = '';
      (this.data.media || []).forEach((m, index) => {
        mediaHtml += `
          <div class="feature-editor-item media-editor-item" data-index="${index}">
            <button type="button" class="btn-delete-card btn-delete-media" data-index="${index}">자료 삭제</button>
            <div class="editor-row">
              <div class="form-group">
                <label class="form-label">구분</label>
                <select class="form-control media-type" required>
                  <option value="video" ${m.type === 'video' ? 'selected' : ''}>브랜드 영상 (VIDEO)</option>
                  <option value="document" ${m.type === 'document' ? 'selected' : ''}>문서/PDF (DOCUMENT)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">자료 고유 코드(ID)</label>
                <input type="text" class="form-control media-id" value="${this.escapeHtml(m.id)}" required placeholder="m-X">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">자료 제목</label>
              <input type="text" class="form-control media-title" value="${this.escapeHtml(m.title)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">링크 URL (Youtube 또는 PDF 파일 주소)</label>
              <input type="url" class="form-control media-link" value="${this.escapeHtml(m.link)}" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">간략 설명 개요</label>
              <textarea class="form-control media-desc" rows="2" required>${m.desc}</textarea>
            </div>
          </div>
        `;
      });
      panel.innerHTML = `
        <div class="editor-card">
          <h3>영상 및 문서(자료실) 리소스 관리</h3>
          <div class="feature-editor-list" id="media-list-container">${mediaHtml}</div>
          <button type="button" id="add-media-btn" class="btn-add-card">새로운 미디어/자료 추가</button>
        </div>
      `;
      this.setupMediaSubTabEvents();
    }
    else if (this.contentSubTab === 'press') {
      let pressHtml = '';
      (this.data.press || []).forEach((p, index) => {
        pressHtml += `
          <div class="feature-editor-item press-editor-item" data-index="${index}">
            <button type="button" class="btn-delete-card btn-delete-press" data-index="${index}">삭제</button>
            <div class="editor-row">
              <div class="form-group">
                <label class="form-label">배포 일자</label>
                <input type="date" class="form-control press-date" value="${p.date}" required>
              </div>
              <div class="form-group">
                <label class="form-label">대표 이미지 URL</label>
                <input type="text" class="form-control press-image" value="${this.escapeHtml(p.imageUrl)}" required>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">보도자료 제목</label>
              <input type="text" class="form-control press-title" value="${this.escapeHtml(p.title)}" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">상세 본문 내용</label>
              <textarea class="form-control press-content" rows="3" required>${p.content}</textarea>
            </div>
          </div>
        `;
      });
      panel.innerHTML = `
        <div class="editor-card">
          <h3>보도자료 관리</h3>
          <div class="feature-editor-list" id="press-list-container">${pressHtml}</div>
          <button type="button" id="add-press-btn" class="btn-add-card">새 보도자료 추가</button>
        </div>
      `;
      this.setupPressSubTabEvents();
    }
    else if (this.contentSubTab === 'gallery') {
      let galHtml = '';
      (this.data.gallery || []).forEach((g, index) => {
        galHtml += `
          <div class="feature-editor-item gallery-editor-item" data-index="${index}">
            <button type="button" class="btn-delete-card btn-delete-gallery" data-index="${index}">삭제</button>
            <div class="form-group">
              <label class="form-label">이미지 URL</label>
              <input type="text" class="form-control gallery-image" value="${this.escapeHtml(g.imageUrl)}" required>
            </div>
            <div class="form-group">
              <label class="form-label">작품/룩북 제목</label>
              <input type="text" class="form-control gallery-title" value="${this.escapeHtml(g.title)}" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">설명 및 개요</label>
              <input type="text" class="form-control gallery-desc" value="${this.escapeHtml(g.desc)}" required>
            </div>
          </div>
        `;
      });
      panel.innerHTML = `
        <div class="editor-card">
          <h3>갤러리/룩북 관리</h3>
          <div class="feature-editor-list" id="gallery-list-container">${galHtml}</div>
          <button type="button" id="add-gallery-btn" class="btn-add-card">새 이미지 추가</button>
        </div>
      `;
      this.setupGallerySubTabEvents();
    }
    else if (this.contentSubTab === 'hero_footer') {
      panel.innerHTML = `
        <div class="editor-card">
          <h3>홈페이지 메인 Hero 및 푸터 설정</h3>
          <div class="form-group">
            <label class="form-label" for="hero-title">메인 타이틀</label>
            <input type="text" id="hero-title" class="form-control" value="${this.escapeHtml(this.data.hero.title)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="hero-subtitle">서브 타이틀</label>
            <textarea id="hero-subtitle" class="form-control" rows="3" required>${this.data.hero.subtitle}</textarea>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="hero-cta-text">CTA 버튼 텍스트</label>
              <input type="text" id="hero-cta-text" class="form-control" value="${this.escapeHtml(this.data.hero.ctaText)}" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="hero-cta-link">CTA 버튼 링크</label>
              <input type="text" id="hero-cta-link" class="form-control" value="${this.escapeHtml(this.data.hero.ctaLink)}" required>
            </div>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label" for="hero-gradient-start">배경 그라데이션 시작색</label>
              <input type="text" id="hero-gradient-start" class="form-control" value="${this.escapeHtml(this.data.hero.bgGradientStart || '#091216')}">
            </div>
            <div class="form-group">
              <label class="form-label" for="hero-gradient-end">배경 그라데이션 종료색</label>
              <input type="text" id="hero-gradient-end" class="form-control" value="${this.escapeHtml(this.data.hero.bgGradientEnd || '#0b1f24')}">
            </div>
          </div>
          <div class="checkout-divider"></div>
          <div class="form-group">
            <label class="form-label" for="footer-email">푸터 이메일</label>
            <input type="email" id="footer-email" class="form-control" value="${this.escapeHtml(this.data.footer.email)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="footer-address">푸터 주소</label>
            <input type="text" id="footer-address" class="form-control" value="${this.escapeHtml(this.data.footer.address)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="footer-copy">카피라이트</label>
            <input type="text" id="footer-copy" class="form-control" value="${this.escapeHtml(this.data.footer.copyright)}" required>
          </div>
        </div>
      `;
    }
  }

  // 3. 회원 관리 탭
  renderMembersTab(tabContainer) {
    if (this.users.length === 0) {
      tabContainer.innerHTML = `
        <div class="editor-card">
          <p style="text-align:center; color:var(--text-muted); padding:3rem;">아직 가입한 회원이 없습니다.</p>
        </div>
      `;
      return;
    }

    tabContainer.innerHTML = `
      <div class="archive-box" style="margin-top:0;">
        <div class="archive-table-wrapper">
          <table class="archive-table">
            <thead>
              <tr>
                <th>이메일 계정</th>
                <th>이름</th>
                <th>연락처</th>
                <th>주소</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              ${this.users.map(u => `
                <tr>
                  <td>${this.escapeHtml(u.email)}</td>
                  <td style="color:#fff; font-weight:600;">${this.escapeHtml(u.name)}</td>
                  <td>${this.escapeHtml(u.phone)}</td>
                  <td>${this.escapeHtml(u.address || "-")}</td>
                  <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // 4. 상품 관리 탭
  renderProductsTab(tabContainer) {
    let productsHtml = '';
    this.data.products.forEach((product, index) => {
      productsHtml += `
        <div class="feature-editor-item product-editor-item" data-index="${index}">
          <button type="button" class="btn-delete-card btn-delete-product" data-index="${index}">삭제</button>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label">카테고리</label>
              <select class="form-control product-category" required>
                <option value="skincare" ${product.category === 'skincare' ? 'selected' : ''}>기초화장품</option>
                <option value="makeup" ${product.category === 'makeup' ? 'selected' : ''}>색조화장품</option>
                <option value="device" ${product.category === 'device' ? 'selected' : ''}>미용기구</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">상품 이미지 URL</label>
              <input type="text" class="form-control product-image" value="${this.escapeHtml(product.imageUrl)}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">상품명</label>
            <input type="text" class="form-control product-title" value="${this.escapeHtml(product.title)}" required>
          </div>
          <div class="form-group">
            <label class="form-label">간략 설명</label>
            <textarea class="form-control product-desc" rows="2" required>${product.desc}</textarea>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label">판매가 (원)</label>
              <input type="number" class="form-control product-price" value="${product.price || 0}" required>
            </div>
            <div class="form-group">
              <label class="form-label">정가 (원)</label>
              <input type="number" class="form-control product-original-price" value="${product.originalPrice || 0}">
            </div>
          </div>
          <div class="editor-row">
            <div class="form-group">
              <label class="form-label">재고량</label>
              <input type="number" class="form-control product-stock" value="${product.stock || 0}">
            </div>
            <div class="form-group" style="display:flex; align-items:flex-end; padding-bottom:0.25rem;">
              <label class="toggle-label">
                <input type="checkbox" class="product-soldout" ${product.isSoldOut ? 'checked' : ''}>
                <span class="toggle-switch"></span>
                <span>품절 강제 표시</span>
              </label>
            </div>
          </div>
        </div>
      `;
    });

    tabContainer.innerHTML = `
      <div class="editor-card">
        <h3>쇼핑몰 상품 구성</h3>
        <div class="feature-editor-list" id="products-list-container">${productsHtml}</div>
        <button type="button" id="add-product-btn" class="btn-add-card">새 상품 추가</button>
      </div>
    `;

    this.setupProductListEvents();
  }

  // 5. 주문 관리 탭
  renderOrdersTab(tabContainer) {
    const statusLabels = {
      'pending': '입금 대기',
      'paid': '입금 확인',
      'shipping': '배송 중',
      'delivered': '배송 완료',
      'cancelled': '취소'
    };
    const statusColors = {
      'pending': 'var(--accent-rose-gold)',
      'paid': 'var(--accent-indigo)',
      'shipping': 'var(--accent-emerald)',
      'delivered': 'var(--text-muted)',
      'cancelled': 'var(--error)'
    };

    if (this.orders.length === 0) {
      tabContainer.innerHTML = `
        <div class="editor-card">
          <p style="text-align:center; color:var(--text-muted); padding:3rem;">아직 접수된 쇼핑 주문이 없습니다.</p>
        </div>
      `;
      return;
    }

    tabContainer.innerHTML = `
      <div class="orders-list">
        ${this.orders.map(order => `
          <div class="order-row" style="background:var(--bg-secondary); border:1px solid var(--border-glass);">
            <div class="order-row-header">
              <div class="order-id-group">
                <code style="color:var(--accent-rose-gold); font-weight:700;">${order.id}</code>
                <span style="font-size:0.8rem; color:var(--text-muted);">${new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div>
                <select class="form-control order-status-select" data-order-id="${order.id}" style="width:auto; padding:0.4rem 0.8rem; font-size:0.85rem; border-color:${statusColors[order.status]};">
                  ${Object.entries(statusLabels).map(([v, l]) => `<option value="${v}" ${order.status === v ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="order-row-body">
              <div class="order-customer-info">
                <span><strong>${this.escapeHtml(order.customer.name)}</strong></span>
                <span>${this.escapeHtml(order.customer.phone)} | ${this.escapeHtml(order.customer.email)}</span>
                <span style="color:var(--text-muted);">${this.escapeHtml(order.customer.address)}</span>
              </div>
              <div class="order-items-brief">
                ${order.items.map(i => `<span class="order-item-chip">${this.escapeHtml(i.title)} × ${i.qty}</span>`).join('')}
              </div>
              <div class="order-total-display">
                ${this.shopSettings.currency}${order.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // 주문 상태 동적 업데이트
    tabContainer.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const orderId = e.target.dataset.orderId;
        const newStatus = e.target.value;
        await db.updateOrderStatus(orderId, newStatus);
        this.orders = await db.getOrders();
        this.showToast(`주문번호 ${orderId}의 발송/처리 상태가 변경되었습니다.`);
      });
    });
  }

  // 6. 문의 관리 탭
  renderInquiriesTab(tabContainer) {
    if (this.inquiries.length === 0) {
      tabContainer.innerHTML = `
        <div class="editor-card">
          <p style="text-align:center; color:var(--text-muted); padding:3rem;">접수된 문의사항이 없습니다.</p>
        </div>
      `;
      return;
    }

    tabContainer.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:1.5rem; text-align:left;">
        ${this.inquiries.map(inq => `
          <div class="editor-card" style="margin-bottom:0; background:var(--bg-secondary);">
            <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-glass); padding-bottom:0.75rem; margin-bottom:1rem;">
              <div>
                <span class="tag-badge ${inq.status === 'pending' ? 'tag-video' : 'tag-document'}" style="margin-right:0.5rem;">
                  ${inq.status === 'pending' ? '답변대기' : '답변완료'}
                </span>
                <strong style="font-size:1.15rem; color:#fff;">${this.escapeHtml(inq.title)}</strong>
              </div>
              <span style="font-size:0.8rem; color:var(--text-muted);">${new Date(inq.createdAt).toLocaleString()}</span>
            </div>
            
            <div style="padding:1rem 0; color:var(--text-secondary); line-height:1.6; white-space:pre-wrap;">${this.escapeHtml(inq.content)}</div>
            
            <div style="background:rgba(0,0,0,0.15); padding:1rem; border-radius:14px; font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
              작성자: ${this.escapeHtml(inq.name)} | 이메일: ${this.escapeHtml(inq.email)} | 연락처: ${this.escapeHtml(inq.phone)}
            </div>

            <div class="form-group" style="margin-bottom:1rem;">
              <label class="form-label">답변 내용</label>
              <textarea class="form-control inquiry-reply-textarea" data-inq-id="${inq.id}" rows="3" placeholder="답변을 작성하세요...">${inq.reply || ''}</textarea>
            </div>
            
            <div style="display:flex; justify-content:space-between;">
              <button type="button" class="btn-primary btn-save-reply" data-inq-id="${inq.id}" style="padding:0.5rem 1.5rem; font-size:0.85rem; border-radius: 50px;">답변 등록</button>
              <button type="button" class="btn-delete-inq" data-inq-id="${inq.id}" style="color:var(--error); background:none; border:none; cursor:pointer; font-size:0.85rem;">문의삭제</button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    // 답변 저장 바인딩
    tabContainer.querySelectorAll('.btn-save-reply').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const inqId = e.target.dataset.inqId;
        const textarea = tabContainer.querySelector(`textarea[data-inq-id="${inqId}"]`);
        const replyText = textarea.value.trim();

        await db.saveInquiryReply(inqId, replyText);
        this.inquiries = await db.getInquiries();
        this.renderTabContent();
        this.showToast("답변이 저장되었습니다.");
      });
    });

    // 문의 삭제 바인딩
    tabContainer.querySelectorAll('.btn-delete-inq').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm("정말로 이 문의를 삭제하시겠습니까?")) {
          const inqId = e.target.dataset.inqId;
          await db.deleteInquiry(inqId);
          this.inquiries = await db.getInquiries();
          this.renderTabContent();
          this.showToast("문의가 삭제되었습니다.");
        }
      });
    });
  }

  // 7. 시스템 설정
  renderSystemTab(tabContainer) {
    tabContainer.innerHTML = `
      <div class="editor-card">
        <h3>쇼핑몰 연결 활성화</h3>
        <div class="shop-toggle-row">
          <div class="shop-toggle-info">
            <div class="shop-toggle-title">쇼핑몰 연결 스위치 (ON / OFF)</div>
            <div class="shop-toggle-desc">활성화 시 메인 홈페이지 네비게이션에 쇼핑몰 탭이 자동으로 생성되며, 유저의 쇼핑 및 결제가 허용됩니다.</div>
          </div>
          <label class="toggle-label toggle-large">
            <input type="checkbox" id="shop-enabled-toggle" ${this.shopSettings.enabled ? 'checked' : ''}>
            <span class="toggle-switch"></span>
            <span class="toggle-status">${this.shopSettings.enabled ? 'ON' : 'OFF'}</span>
          </label>
        </div>
      </div>

      <div class="editor-card">
        <h3>배송 및 결제 기초정보</h3>
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label" for="shop-shipping-fee">기본 배송비 (원)</label>
            <input type="number" id="shop-shipping-fee" class="form-control" value="${this.shopSettings.shippingFee}" min="0">
          </div>
          <div class="form-group">
            <label class="form-label" for="shop-free-shipping">무료배송 기준 금액 (원)</label>
            <input type="number" id="shop-free-shipping" class="form-control" value="${this.shopSettings.freeShippingThreshold}" min="0">
          </div>
        </div>
        <div class="editor-row">
          <div class="form-group">
            <label class="form-label" for="shop-min-order">최소 주문 금액 (원)</label>
            <input type="number" id="shop-min-order" class="form-control" value="${this.shopSettings.minOrderAmount}" min="0">
          </div>
          <div class="form-group">
            <label class="form-label" for="shop-currency">통화 기호</label>
            <input type="text" id="shop-currency" class="form-control" value="${this.escapeHtml(this.shopSettings.currency)}">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="shop-bank-info">무통장 결제용 입금 계좌 정보</label>
          <input type="text" id="shop-bank-info" class="form-control" value="${this.escapeHtml(this.shopSettings.bankInfo)}">
        </div>
      </div>
    `;

    const toggle = tabContainer.querySelector('#shop-enabled-toggle');
    toggle.addEventListener('change', () => {
      const label = tabContainer.querySelector('.toggle-status');
      label.textContent = toggle.checked ? 'ON' : 'OFF';
    });
  }

  setupEventListeners() {
    const links = this.container.querySelectorAll('.sidebar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        this.saveCurrentFormState();
        links.forEach(l => l.classList.remove('active'));
        const tab = e.currentTarget.getAttribute('data-tab');
        this.currentTab = tab;
        e.currentTarget.classList.add('active');
        this.renderTabContent();
      });
    });

    this.container.querySelector('#logout-btn').addEventListener('click', () => {
      sessionStorage.removeItem('admin_session');
      this.onLogout();
    });

    this.container.querySelector('#cms-editor-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      this.saveCurrentFormState();
      
      try {
        await db.updateContent(this.data);
        if (this.currentTab === 'system') {
          await db.updateShopSettings(this.shopSettings);
        }
        this.showToast("데이터가 성공적으로 데이터베이스(localStorage)에 동기화되었습니다!");
        this.renderTabContent();
      } catch (err) {
        this.showToast("에러 발생: " + err.message, true);
      }
    });

    this.container.querySelector('#reset-btn').addEventListener('click', async () => {
      if (confirm("정말로 데이터베이스의 최신 데이터를 다시 불러오시겠습니까?")) {
        this.data = await db.getContent();
        this.shopSettings = await db.getShopSettings();
        this.orders = await db.getOrders();
        this.inquiries = await db.getInquiries();
        this.users = await db.getShopUsers();
        this.renderTabContent();
        this.showToast("데이터 리로드 완료");
      }
    });
  }

  // 각 콘텐츠 폼 상태 임시저장
  saveCurrentFormState() {
    if (!this.data) return;

    if (this.currentTab === 'contents') {
      const panel = this.container.querySelector('#contents-editor-panel');
      if (!panel) return;

      if (this.contentSubTab === 'ceo') {
        const title = panel.querySelector('#ceo-title');
        const content = panel.querySelector('#ceo-content');
        const image = panel.querySelector('#ceo-image');
        if (title) this.data.ceoGreeting.title = title.value.trim();
        if (content) this.data.ceoGreeting.content = content.value.trim();
        if (image) this.data.ceoGreeting.imageUrl = image.value.trim();
      } 
      else if (this.contentSubTab === 'info') {
        const name = panel.querySelector('#info-name');
        const ceo = panel.querySelector('#info-ceo');
        const biz = panel.querySelector('#info-biz');
        const tel = panel.querySelector('#info-tel');
        const address = panel.querySelector('#info-address');
        const email = panel.querySelector('#info-email');
        const mapUrl = panel.querySelector('#info-map');
        if (name) this.data.companyInfo.name = name.value.trim();
        if (ceo) this.data.companyInfo.ceo = ceo.value.trim();
        if (biz) this.data.companyInfo.businessNo = biz.value.trim();
        if (tel) this.data.companyInfo.tel = tel.value.trim();
        if (address) this.data.companyInfo.address = address.value.trim();
        if (email) this.data.companyInfo.email = email.value.trim();
        if (mapUrl) this.data.companyInfo.mapUrl = mapUrl.value.trim();
      }
      else if (this.contentSubTab === 'careers') {
        const items = panel.querySelectorAll('.recruit-editor-item');
        items.forEach(item => {
          const index = parseInt(item.dataset.index, 10);
          if (this.data.recruitment[index]) {
            const dept = item.querySelector('.recruit-dept');
            const status = item.querySelector('.recruit-status');
            const title = item.querySelector('.recruit-title');
            const desc = item.querySelector('.recruit-desc');
            if (dept) this.data.recruitment[index].dept = dept.value.trim();
            if (status) this.data.recruitment[index].status = status.value;
            if (title) this.data.recruitment[index].title = title.value.trim();
            if (desc) this.data.recruitment[index].desc = desc.value.trim();
          }
        });
      }
      else if (this.contentSubTab === 'media') {
        const items = panel.querySelectorAll('.media-editor-item');
        items.forEach(item => {
          const index = parseInt(item.dataset.index, 10);
          if (this.data.media[index]) {
            const type = item.querySelector('.media-type');
            const id = item.querySelector('.media-id');
            const title = item.querySelector('.media-title');
            const link = item.querySelector('.media-link');
            const desc = item.querySelector('.media-desc');
            if (type) this.data.media[index].type = type.value;
            if (id) this.data.media[index].id = id.value.trim();
            if (title) this.data.media[index].title = title.value.trim();
            if (link) this.data.media[index].link = link.value.trim();
            if (desc) this.data.media[index].desc = desc.value.trim();
          }
        });
      }
      else if (this.contentSubTab === 'press') {
        const items = panel.querySelectorAll('.press-editor-item');
        items.forEach(item => {
          const index = parseInt(item.dataset.index, 10);
          if (this.data.press[index]) {
            const date = item.querySelector('.press-date');
            const img = item.querySelector('.press-image');
            const title = item.querySelector('.press-title');
            const content = item.querySelector('.press-content');
            if (date) this.data.press[index].date = date.value;
            if (img) this.data.press[index].imageUrl = img.value.trim();
            if (title) this.data.press[index].title = title.value.trim();
            if (content) this.data.press[index].content = content.value.trim();
          }
        });
      }
      else if (this.contentSubTab === 'gallery') {
        const items = panel.querySelectorAll('.gallery-editor-item');
        items.forEach(item => {
          const index = parseInt(item.dataset.index, 10);
          if (this.data.gallery[index]) {
            const img = item.querySelector('.gallery-image');
            const title = item.querySelector('.gallery-title');
            const desc = item.querySelector('.gallery-desc');
            if (img) this.data.gallery[index].imageUrl = img.value.trim();
            if (title) this.data.gallery[index].title = title.value.trim();
            if (desc) this.data.gallery[index].desc = desc.value.trim();
          }
        });
      }
      else if (this.contentSubTab === 'hero_footer') {
        const title = panel.querySelector('#hero-title');
        const subtitle = panel.querySelector('#hero-subtitle');
        const ctaText = panel.querySelector('#hero-cta-text');
        const ctaLink = panel.querySelector('#hero-cta-link');
        const start = panel.querySelector('#hero-gradient-start');
        const end = panel.querySelector('#hero-gradient-end');
        const email = panel.querySelector('#footer-email');
        const address = panel.querySelector('#footer-address');
        const copy = panel.querySelector('#footer-copy');
        if (title) this.data.hero.title = title.value.trim();
        if (subtitle) this.data.hero.subtitle = subtitle.value.trim();
        if (ctaText) this.data.hero.ctaText = ctaText.value.trim();
        if (ctaLink) this.data.hero.ctaLink = ctaLink.value.trim();
        if (start) this.data.hero.bgGradientStart = start.value.trim();
        if (end) this.data.hero.bgGradientEnd = end.value.trim();
        if (email) this.data.footer.email = email.value.trim();
        if (address) this.data.footer.address = address.value.trim();
        if (copy) this.data.footer.copyright = copy.value.trim();
      }
    }
    else if (this.currentTab === 'products') {
      const items = this.container.querySelectorAll('.product-editor-item');
      items.forEach(item => {
        const index = parseInt(item.dataset.index, 10);
        if (this.data.products[index]) {
          const cat = item.querySelector('.product-category');
          const img = item.querySelector('.product-image');
          const title = item.querySelector('.product-title');
          const desc = item.querySelector('.product-desc');
          const price = item.querySelector('.product-price');
          const orig = item.querySelector('.product-original-price');
          const stock = item.querySelector('.product-stock');
          const soldOut = item.querySelector('.product-soldout');
          if (cat) this.data.products[index].category = cat.value;
          if (img) this.data.products[index].imageUrl = img.value.trim();
          if (title) this.data.products[index].title = title.value.trim();
          if (desc) this.data.products[index].desc = desc.value.trim();
          if (price) this.data.products[index].price = parseInt(price.value, 10) || 0;
          if (orig) this.data.products[index].originalPrice = parseInt(orig.value, 10) || 0;
          if (stock) this.data.products[index].stock = parseInt(stock.value, 10) || 0;
          if (soldOut) this.data.products[index].isSoldOut = soldOut.checked;
        }
      });
    }
    else if (this.currentTab === 'system') {
      const enabled = this.container.querySelector('#shop-enabled-toggle');
      const fee = this.container.querySelector('#shop-shipping-fee');
      const threshold = this.container.querySelector('#shop-free-shipping');
      const minOrder = this.container.querySelector('#shop-min-order');
      const currency = this.container.querySelector('#shop-currency');
      const bank = this.container.querySelector('#shop-bank-info');
      if (enabled) this.shopSettings.enabled = enabled.checked;
      if (fee) this.shopSettings.shippingFee = parseInt(fee.value, 10) || 0;
      if (threshold) this.shopSettings.freeShippingThreshold = parseInt(threshold.value, 10) || 0;
      if (minOrder) this.shopSettings.minOrderAmount = parseInt(minOrder.value, 10) || 0;
      if (currency) this.shopSettings.currency = currency.value.trim();
      if (bank) this.shopSettings.bankInfo = bank.value.trim();
    }
  }

  setupCareersSubTabEvents() {
    const panel = this.container.querySelector('#contents-editor-panel');
    const list = panel.querySelector('#recruit-list-container');
    const addBtn = panel.querySelector('#add-recruit-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      this.saveCurrentFormState();
      this.data.recruitment.push({
        id: `recruit-${Date.now()}`,
        title: "신규 공고",
        dept: "인사부",
        desc: "직무 기술서를 간략하게 채워주세요.",
        status: "open"
      });
      this.renderContentsSubTab();
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-recruit');
      if (btn) {
        const index = parseInt(btn.dataset.index, 10);
        if (confirm("정말로 이 채용공고를 삭제하시겠습니까?")) {
          this.saveCurrentFormState();
          this.data.recruitment.splice(index, 1);
          this.renderContentsSubTab();
        }
      }
    });
  }

  setupMediaSubTabEvents() {
    const panel = this.container.querySelector('#contents-editor-panel');
    const list = panel.querySelector('#media-list-container');
    const addBtn = panel.querySelector('#add-media-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      this.saveCurrentFormState();
      this.data.media.push({
        id: `m-${Date.now().toString().slice(-4)}`,
        type: "video",
        title: "새로운 미디어 자료",
        desc: "동영상 설명 또는 PDF 다운로드 개요를 설명해 주세요.",
        link: "https://www.youtube.com/watch?v=dr_zFr8Xw-E"
      });
      this.renderContentsSubTab();
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-media');
      if (btn) {
        const index = parseInt(btn.dataset.index, 10);
        if (confirm("정말로 이 미디어 리소스를 삭제하시겠습니까?")) {
          this.saveCurrentFormState();
          this.data.media.splice(index, 1);
          this.renderContentsSubTab();
        }
      }
    });
  }

  setupPressSubTabEvents() {
    const panel = this.container.querySelector('#contents-editor-panel');
    const list = panel.querySelector('#press-list-container');
    const addBtn = panel.querySelector('#add-press-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      this.saveCurrentFormState();
      this.data.press.push({
        id: `press-${Date.now()}`,
        title: "신규 보도자료",
        content: "보도자료 상세 내용을 적으세요.",
        date: new Date().toISOString().slice(0, 10),
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80"
      });
      this.renderContentsSubTab();
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-press');
      if (btn) {
        const index = parseInt(btn.dataset.index, 10);
        if (confirm("이 보도자료를 목록에서 삭제하시겠습니까?")) {
          this.saveCurrentFormState();
          this.data.press.splice(index, 1);
          this.renderContentsSubTab();
        }
      }
    });
  }

  setupGallerySubTabEvents() {
    const panel = this.container.querySelector('#contents-editor-panel');
    const list = panel.querySelector('#gallery-list-container');
    const addBtn = panel.querySelector('#add-gallery-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      this.saveCurrentFormState();
      this.data.gallery.push({
        id: `gal-${Date.now()}`,
        title: "새 갤러리 이미지",
        desc: "작품 설명 기재",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
      });
      this.renderContentsSubTab();
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-gallery');
      if (btn) {
        const index = parseInt(btn.dataset.index, 10);
        if (confirm("이 작품을 목록에서 삭제하시겠습니까?")) {
          this.saveCurrentFormState();
          this.data.gallery.splice(index, 1);
          this.renderContentsSubTab();
        }
      }
    });
  }

  setupProductListEvents() {
    const list = this.container.querySelector('#products-list-container');
    const addBtn = this.container.querySelector('#add-product-btn');
    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
      this.saveCurrentFormState();
      this.data.products.push({
        id: `p-${Date.now()}`,
        category: "skincare",
        title: "새로운 상품",
        desc: "제품에 대한 간단한 설명을 입력하세요.",
        imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=400&q=80",
        price: 30000,
        originalPrice: 0,
        stock: 100,
        isSoldOut: false
      });
      this.renderTabContent();
    });

    list.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-delete-product');
      if (btn) {
        const index = parseInt(btn.dataset.index, 10);
        if (confirm("이 상품을 완전히 삭제하시겠습니까?")) {
          this.saveCurrentFormState();
          this.data.products.splice(index, 1);
          this.renderTabContent();
        }
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
