import { db } from '../services/db.js';

export class MainPage {
  constructor(container) {
    this.container = container;
    this.currentCategory = 'all'; // all, skincare, makeup, device
    this.data = null;
  }

  async render() {
    this.data = await db.getContent();
    
    const heroBgStart = this.data.hero.bgGradientStart || '#091216';
    const heroBgEnd = this.data.hero.bgGradientEnd || '#0b1f24';

    this.container.innerHTML = `
      <!-- 네비게이션 바 -->
      <nav class="navbar">
        <div class="container navbar-container">
          <a href="#/" class="logo">AETERNO</a>
          <div class="nav-links">
            <a href="#/" class="nav-link active">Home</a>
            <a href="#/about" class="nav-link" id="nav-about-link">About</a>
            <a href="#/products" class="nav-link" id="nav-products-link">Products</a>
            <a href="#/media" class="nav-link" id="nav-media-link">Media Center</a>
            <a href="#/admin" class="btn-admin-nav">Console</a>
          </div>
        </div>
      </nav>

      <!-- Hero 섹션 -->
      <header class="hero-section" style="background: linear-gradient(135deg, ${heroBgStart}, ${heroBgEnd});">
        <div class="hero-glow"></div>
        <div class="container hero-content">
          <h1 class="hero-title">${this.escapeHtml(this.data.hero.title)}</h1>
          <p class="hero-subtitle">${this.escapeHtml(this.data.hero.subtitle)}</p>
          <button id="hero-cta-btn" class="btn-primary">${this.escapeHtml(this.data.hero.ctaText)}</button>
        </div>
      </header>

      <!-- About 섹션 -->
      <section id="about" class="about-section">
        <div class="container">
          <div class="about-grid">
            <div class="about-text">
              <h2>${this.escapeHtml(this.data.about.title)}</h2>
              <p>${this.escapeHtml(this.data.about.content)}</p>
              <button id="about-products-btn" class="btn-primary" style="background: var(--bg-glass); border: 1px solid var(--border-glass); box-shadow: none; color: var(--accent-rose-gold);">제품 구성 둘러보기</button>
            </div>
            <div class="about-image">
              <img src="${this.escapeHtml(this.data.about.imageUrl)}" alt="Brand Story Image">
            </div>
          </div>
        </div>
      </section>

      <!-- Products 섹션 (카테고리 필터링 그리드) -->
      <section id="products" class="products-section">
        <div class="container">
          <div class="section-header">
            <h2 style="font-size: 2.6rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Our Products</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">피부 타입과 부위별 목적에 최적화된 라인업을 제공합니다.</p>
          </div>
          
          <!-- 카테고리 필터 탭 -->
          <div class="category-filter-container">
            <button class="filter-btn ${this.currentCategory === 'all' ? 'active' : ''}" data-category="all">전체보기</button>
            <button class="filter-btn ${this.currentCategory === 'skincare' ? 'active' : ''}" data-category="skincare">기초화장품</button>
            <button class="filter-btn ${this.currentCategory === 'makeup' ? 'active' : ''}" data-category="makeup">색조화장품</button>
            <button class="filter-btn ${this.currentCategory === 'device' ? 'active' : ''}" data-category="device">미용기구</button>
          </div>

          <!-- 제품 리스트 그리드 -->
          <div class="products-grid" id="products-grid-container">
            <!-- 동적 제품 카드 렌더링 -->
          </div>
        </div>
      </section>

      <!-- Media Center 섹션 (2단 분할 레이아웃 & 아카이브 테이블) -->
      <section id="media" class="media-section">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: 2.6rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Media & Resources</h2>
            <p style="color: var(--text-secondary);">공식 브랜드 영상과 제품 임상 결과, 브로셔 자료를 다운로드 받으실 수 있습니다.</p>
          </div>

          <div class="media-split-layout">
            <!-- 좌측: 영상 센터 (60%) -->
            <div class="media-column">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                브랜드 영상관
              </h3>
              <div class="media-left-videos" id="video-grid-container">
                <!-- 동적 비디오 카드 렌더링 -->
              </div>
            </div>

            <!-- 우측: 다운로드 센터 (40%) -->
            <div class="media-column">
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                문서 다운로드
              </h3>
              <div class="pdf-download-list" id="pdf-list-container">
                <!-- 동적 PDF 바 렌더링 -->
              </div>
            </div>
          </div>

          <!-- 하단: 리소스 아카이브 테이블 -->
          <div class="archive-box">
            <div class="archive-header">
              <h4>전체 리소스 통합 아카이브</h4>
              <span style="font-size: 0.8rem; color: var(--text-muted);">총 <span id="archive-count" style="color: var(--accent-rose-gold); font-weight: 600;">0</span>개 자료 보관 중</span>
            </div>
            <div class="archive-table-wrapper">
              <table class="archive-table">
                <thead>
                  <tr>
                    <th style="width: 15%;">구분</th>
                    <th style="width: 50%;">자료 제목 및 개요</th>
                    <th style="width: 20%;">리소스 코드</th>
                    <th style="width: 15%; text-align: center;">작업</th>
                  </tr>
                </thead>
                <tbody id="archive-table-body">
                  <!-- 동적 테이블 행 렌더링 -->
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <!-- 푸터 -->
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
              <p>Email: ${this.escapeHtml(this.data.footer.email)}</p>
              <p>Address: ${this.escapeHtml(this.data.footer.address)}</p>
            </div>
          </div>
          <div class="footer-bottom">
            <p>${this.escapeHtml(this.data.footer.copyright)}</p>
          </div>
        </div>
      </footer>

      <!-- 비디오 팝업 모달 플레이어 -->
      <div id="video-player-modal" class="video-modal-overlay" style="display: none;">
        <div class="video-modal-container">
          <button class="video-modal-close" id="modal-close-btn">&times;</button>
          <iframe id="video-iframe" width="100%" height="100%" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    `;

    this.renderProducts();
    this.renderMediaCenter();
    this.setupEventListeners();
  }

  renderProducts() {
    const grid = this.container.querySelector('#products-grid-container');
    const filtered = this.currentCategory === 'all'
      ? this.data.products
      : this.data.products.filter(p => p.category === this.currentCategory);

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 3rem 0;">등록된 제품이 없습니다.</div>`;
      return;
    }

    grid.innerHTML = filtered.map(product => {
      let categoryLabel = '';
      if (product.category === 'skincare') categoryLabel = '기초화장품';
      else if (product.category === 'makeup') categoryLabel = '색조화장품';
      else if (product.category === 'device') categoryLabel = '미용기구';

      return `
        <div class="product-card">
          <div class="product-image-wrapper">
            <img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}" loading="lazy">
            <span class="product-category-tag">${categoryLabel}</span>
          </div>
          <div class="product-info">
            <h3>${this.escapeHtml(product.title)}</h3>
            <p>${this.escapeHtml(product.desc)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  renderMediaCenter() {
    // 1. 영상 목록 렌더링
    const videoGrid = this.container.querySelector('#video-grid-container');
    const videos = this.data.media.filter(m => m.type === 'video');
    
    videoGrid.innerHTML = videos.map(video => {
      const ytId = this.getYouTubeId(video.link);
      const thumbUrl = ytId 
        ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
        : 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80';
      
      return `
        <div class="video-card" data-video-url="${this.escapeHtml(video.link)}">
          <div class="video-thumbnail">
            <img src="${thumbUrl}" alt="${this.escapeHtml(video.title)}">
            <div class="play-btn-overlay">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
          <div class="video-details">
            <h4>${this.escapeHtml(video.title)}</h4>
            <p>${this.escapeHtml(video.desc)}</p>
          </div>
        </div>
      `;
    }).join('');

    // 2. PDF 다운로드 바 렌더링
    const pdfList = this.container.querySelector('#pdf-list-container');
    const docs = this.data.media.filter(m => m.type === 'document');

    pdfList.innerHTML = docs.map(doc => `
      <div class="pdf-item-bar">
        <div class="pdf-info-group">
          <div class="pdf-icon-box">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
          </div>
          <div class="pdf-text-box">
            <div class="pdf-item-title">${this.escapeHtml(doc.title)}</div>
            <div class="pdf-item-desc">${this.escapeHtml(doc.desc)}</div>
          </div>
        </div>
        <a href="${this.escapeHtml(doc.link)}" target="_blank" class="btn-pdf-download" title="다운로드">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        </a>
      </div>
    `).join('');

    // 3. 아카이브 테이블 렌더링
    const tableBody = this.container.querySelector('#archive-table-body');
    const archiveCount = this.container.querySelector('#archive-count');
    
    archiveCount.textContent = this.data.media.length;
    
    tableBody.innerHTML = this.data.media.map((item, index) => {
      const typeBadge = item.type === 'video' 
        ? `<span class="tag-badge tag-video">VIDEO</span>`
        : `<span class="tag-badge tag-document">PDF</span>`;

      // 고유 ID 단축형 코드 생성
      const shortId = item.id ? item.id.toUpperCase() : `RES-${index + 100}`;
      const actionText = item.type === 'video' ? '영상 시청' : '열기/다운로드';

      return `
        <tr>
          <td>${typeBadge}</td>
          <td>
            <div style="font-weight: 600; color: #fff; margin-bottom: 0.2rem;">${this.escapeHtml(item.title)}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${this.escapeHtml(item.desc)}</div>
          </td>
          <td><code style="font-family: monospace; color: var(--accent-rose-gold); background: rgba(0,0,0,0.2); padding: 0.2rem 0.4rem; border-radius: 4px;">${shortId}</code></td>
          <td style="text-align: center;">
            <button class="btn-table-action" data-type="${item.type}" data-link="${this.escapeHtml(item.link)}">
              ${actionText}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  setupEventListeners() {
    // 카테고리 필터 클릭 리스너
    const filterButtons = this.container.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentCategory = e.target.getAttribute('data-category');
        this.renderProducts();
      });
    });

    // 앵커 스무스 스크롤 연동
    const navigationLinks = {
      '#nav-about-link': '#about',
      '#nav-products-link': '#products',
      '#nav-media-link': '#media',
      '#hero-cta-btn': '#products',
      '#about-products-btn': '#products'
    };

    Object.entries(navigationLinks).forEach(([selector, targetSelector]) => {
      const element = this.container.querySelector(selector);
      if (element) {
        element.addEventListener('click', (e) => {
          e.preventDefault();
          this.container.querySelector(targetSelector).scrollIntoView({ behavior: 'smooth' });
          // 해시 URL 업데이트
          window.history.pushState(null, null, targetSelector.replace('#', '#/'));
        });
      }
    });

    // 비디오 클릭 핸들링 (좌측 그리드 비디오 카드)
    const videoGrid = this.container.querySelector('#video-grid-container');
    videoGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.video-card');
      if (card) {
        const link = card.getAttribute('data-video-url');
        this.playVideo(link);
      }
    });

    // 아카이브 테이블 액션 버튼 핸들링
    const tableBody = this.container.querySelector('#archive-table-body');
    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-table-action');
      if (btn) {
        const type = btn.getAttribute('data-type');
        const link = btn.getAttribute('data-link');
        
        if (type === 'video') {
          this.playVideo(link);
        } else {
          window.open(link, '_blank');
        }
      }
    });

    // 비디오 모달 닫기
    const modal = this.container.querySelector('#video-player-modal');
    const closeBtn = this.container.querySelector('#modal-close-btn');
    
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
      this.container.querySelector('#video-iframe').src = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
        this.container.querySelector('#video-iframe').src = '';
      }
    });
  }

  playVideo(url) {
    const modal = this.container.querySelector('#video-player-modal');
    const iframe = this.container.querySelector('#video-iframe');
    const ytId = this.getYouTubeId(url);
    
    if (ytId) {
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      modal.style.display = 'flex';
    } else {
      // 일반 주소일 경우 새창 이동
      window.open(url, '_blank');
    }
  }

  getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
