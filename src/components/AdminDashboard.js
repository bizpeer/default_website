import { db } from '../services/db.js';

export class AdminDashboard {
  constructor(container, onLogout) {
    this.container = container;
    this.onLogout = onLogout;
    this.currentTab = 'hero'; // 기본 탭: hero
    this.data = null;
  }

  async render() {
    this.data = await db.getContent();
    
    this.container.innerHTML = `
      <div class="dashboard-wrapper">
        <!-- 사이드바 -->
        <aside class="dashboard-sidebar">
          <div class="sidebar-title">Content CMS</div>
          <ul class="sidebar-menu">
            <li class="sidebar-link ${this.currentTab === 'hero' ? 'active' : ''}" data-tab="hero">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Hero 섹션
            </li>
            <li class="sidebar-link ${this.currentTab === 'about' ? 'active' : ''}" data-tab="about">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              소개 섹션
            </li>
            <li class="sidebar-link ${this.currentTab === 'features' ? 'active' : ''}" data-tab="features">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              기능 카드
            </li>
            <li class="sidebar-link ${this.currentTab === 'footer' ? 'active' : ''}" data-tab="footer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              푸터 섹션
            </li>
          </ul>
        </aside>

        <!-- 메인 콘텐츠 영역 -->
        <main class="dashboard-content">
          <div class="dashboard-header">
            <div>
              <h1>CMS 대시보드</h1>
              <p style="color: var(--text-secondary); margin-top: 0.25rem;">웹사이트의 요소를 실시간으로 편집합니다.</p>
            </div>
            
            <div class="user-badge">
              <span style="font-size: 0.9rem; color: var(--text-secondary);">관리자(siteadmin)</span>
              <a href="#/" class="btn-secondary" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
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
            
            <div style="margin-top: 2rem; display: flex; gap: 1rem;">
              <button type="submit" class="btn-primary btn-save">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
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
    
    if (this.currentTab === 'hero') {
      tabContainer.innerHTML = `
        <div class="editor-card">
          <h3>Hero 섹션 설정</h3>
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
              <label class="form-label" for="hero-gradient-start">배경 그라데이션 시작색 (HEX/HSL)</label>
              <input type="text" id="hero-gradient-start" class="form-control" value="${this.escapeHtml(this.data.hero.bgGradientStart || '#1a1b2f')}">
            </div>
            <div class="form-group">
              <label class="form-label" for="hero-gradient-end">배경 그라데이션 종료색 (HEX/HSL)</label>
              <input type="text" id="hero-gradient-end" class="form-control" value="${this.escapeHtml(this.data.hero.bgGradientEnd || '#161625')}">
            </div>
          </div>
        </div>
      `;
    } else if (this.currentTab === 'about') {
      tabContainer.innerHTML = `
        <div class="editor-card">
          <h3>소개 섹션 설정</h3>
          <div class="form-group">
            <label class="form-label" for="about-title">소개 타이틀</label>
            <input type="text" id="about-title" class="form-control" value="${this.escapeHtml(this.data.about.title)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="about-content">소개 내용</label>
            <textarea id="about-content" class="form-control" rows="6" required>${this.data.about.content}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" for="about-image">소개 이미지 URL</label>
            <input type="text" id="about-image" class="form-control" value="${this.escapeHtml(this.data.about.imageUrl)}" required>
          </div>
        </div>
      `;
    } else if (this.currentTab === 'features') {
      let cardsHtml = '';
      this.data.features.forEach((feature, index) => {
        cardsHtml += `
          <div class="feature-editor-item" data-index="${index}">
            <button type="button" class="btn-delete-card" data-index="${index}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              삭제
            </button>
            <div class="form-group">
              <label class="form-label">기능 카드 제목</label>
              <input type="text" class="form-control feature-title" value="${this.escapeHtml(feature.title)}" required>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">기능 설명</label>
              <textarea class="form-control feature-desc" rows="3" required>${feature.desc}</textarea>
            </div>
          </div>
        `;
      });

      tabContainer.innerHTML = `
        <div class="editor-card">
          <h3>기능 카드 설정</h3>
          <div class="feature-editor-list" id="feature-list-container">
            ${cardsHtml}
          </div>
          <button type="button" id="add-feature-btn" class="btn-add-card">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            새로운 기능 카드 추가
          </button>
        </div>
      `;

      this.setupFeatureListEvents();
    } else if (this.currentTab === 'footer') {
      tabContainer.innerHTML = `
        <div class="editor-card">
          <h3>푸터 설정</h3>
          <div class="form-group">
            <label class="form-label" for="footer-email">이메일 주소</label>
            <input type="email" id="footer-email" class="form-control" value="${this.escapeHtml(this.data.footer.email)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="footer-address">사무실 주소</label>
            <input type="text" id="footer-address" class="form-control" value="${this.escapeHtml(this.data.footer.address)}" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="footer-copyright">카피라이트 표시</label>
            <input type="text" id="footer-copyright" class="form-control" value="${this.escapeHtml(this.data.footer.copyright)}" required>
          </div>
        </div>
      `;
    }
  }

  setupEventListeners() {
    // 사이드바 탭 전환
    const links = this.container.querySelectorAll('.sidebar-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        // 입력 폼에 있는 미저장 데이터 유지 또는 알림 없이 그냥 바로 탭 변경
        this.saveCurrentFormState();
        
        links.forEach(l => l.classList.remove('active'));
        const tab = e.currentTarget.getAttribute('data-tab');
        this.currentTab = tab;
        e.currentTarget.classList.add('active');
        this.renderTabContent();
      });
    });

    // 로그아웃 버튼
    const logoutBtn = this.container.querySelector('#logout-btn');
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('admin_session');
      this.onLogout();
    });

    // 에디터 폼 서브밋 (전체 데이터 저장)
    const editorForm = this.container.querySelector('#cms-editor-form');
    editorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.saveCurrentFormState();
      
      try {
        const success = await db.updateContent(this.data);
        if (success) {
          this.showToast("변경사항이 성공적으로 데이터베이스에 반영되었습니다!");
        } else {
          this.showToast("저장에 실패했습니다.", true);
        }
      } catch (err) {
        this.showToast("에러가 발생했습니다: " + err.message, true);
      }
    });

    // 초기화 버튼
    const resetBtn = this.container.querySelector('#reset-btn');
    resetBtn.addEventListener('click', async () => {
      if (confirm("정말로 현재 탭의 수정을 초기화하고 데이터베이스의 원본 데이터를 다시 불러오시겠습니까?")) {
        this.data = await db.getContent();
        this.renderTabContent();
        this.showToast("데이터를 다시 로드했습니다.");
      }
    });
  }

  // 기능 카드 탭 전용 이벤트 리스너 추가 설정
  setupFeatureListEvents() {
    const listContainer = this.container.querySelector('#feature-list-container');
    const addBtn = this.container.querySelector('#add-feature-btn');

    // 카드 추가
    addBtn.addEventListener('click', () => {
      this.saveCurrentFormState();
      this.data.features.push({
        id: `f-${Date.now()}`,
        title: "새로운 특징 항목",
        desc: "이 기능에 대한 상세한 설명을 적어주세요."
      });
      this.renderTabContent();
    });

    // 카드 삭제 위임
    listContainer.addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.btn-delete-card');
      if (deleteBtn) {
        const index = parseInt(deleteBtn.getAttribute('data-index'), 10);
        if (confirm("정말로 이 항목을 삭제하시겠습니까?")) {
          this.saveCurrentFormState();
          this.data.features.splice(index, 1);
          this.renderTabContent();
        }
      }
    });
  }

  // 현재 입력 필드에 입력된 값을 내부 data 구조에 동기화
  saveCurrentFormState() {
    if (!this.data) return;

    if (this.currentTab === 'hero') {
      const title = this.container.querySelector('#hero-title');
      const subtitle = this.container.querySelector('#hero-subtitle');
      const ctaText = this.container.querySelector('#hero-cta-text');
      const ctaLink = this.container.querySelector('#hero-cta-link');
      const startColor = this.container.querySelector('#hero-gradient-start');
      const endColor = this.container.querySelector('#hero-gradient-end');

      if (title) this.data.hero.title = title.value.trim();
      if (subtitle) this.data.hero.subtitle = subtitle.value.trim();
      if (ctaText) this.data.hero.ctaText = ctaText.value.trim();
      if (ctaLink) this.data.hero.ctaLink = ctaLink.value.trim();
      if (startColor) this.data.hero.bgGradientStart = startColor.value.trim();
      if (endColor) this.data.hero.bgGradientEnd = endColor.value.trim();
    } 
    else if (this.currentTab === 'about') {
      const title = this.container.querySelector('#about-title');
      const content = this.container.querySelector('#about-content');
      const imageUrl = this.container.querySelector('#about-image');

      if (title) this.data.about.title = title.value.trim();
      if (content) this.data.about.content = content.value.trim();
      if (imageUrl) this.data.about.imageUrl = imageUrl.value.trim();
    } 
    else if (this.currentTab === 'features') {
      const items = this.container.querySelectorAll('.feature-editor-item');
      items.forEach(item => {
        const index = parseInt(item.getAttribute('data-index'), 10);
        const titleInput = item.querySelector('.feature-title');
        const descTextarea = item.querySelector('.feature-desc');

        if (this.data.features[index]) {
          if (titleInput) this.data.features[index].title = titleInput.value.trim();
          if (descTextarea) this.data.features[index].desc = descTextarea.value.trim();
        }
      });
    } 
    else if (this.currentTab === 'footer') {
      const email = this.container.querySelector('#footer-email');
      const address = this.container.querySelector('#footer-address');
      const copyright = this.container.querySelector('#footer-copyright');

      if (email) this.data.footer.email = email.value.trim();
      if (address) this.data.footer.address = address.value.trim();
      if (copyright) this.data.footer.copyright = copyright.value.trim();
    }
  }

  escapeHtml(unsafe) {
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
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    
    toast.innerHTML = `
      ${svgIcon}
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}
