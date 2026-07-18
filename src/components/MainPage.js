import { db } from '../services/db.js';

export class MainPage {
  constructor(container) {
    this.container = container;
  }

  async render() {
    const data = await db.getContent();
    
    // 네비게이션 및 각 섹션 마크업
    const heroBgStart = data.hero.bgGradientStart || '#1a1b2f';
    const heroBgEnd = data.hero.bgGradientEnd || '#161625';
    
    let featuresHtml = '';
    data.features.forEach((feature) => {
      featuresHtml += `
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <h3>${this.escapeHtml(feature.title)}</h3>
          <p>${this.escapeHtml(feature.desc)}</p>
        </div>
      `;
    });

    this.container.innerHTML = `
      <!-- 네비게이션 바 -->
      <nav class="navbar">
        <div class="container navbar-container">
          <a href="#/" class="logo">ANTIGRAVITY</a>
          <div class="nav-links">
            <a href="#/" class="nav-link active">Home</a>
            <a href="#/about" class="nav-link" id="nav-about-link">About</a>
            <a href="#/features" class="nav-link" id="nav-features-link">Features</a>
            <a href="#/admin" class="btn-admin-nav">Console</a>
          </div>
        </div>
      </nav>

      <!-- Hero 섹션 -->
      <header class="hero-section" style="background: linear-gradient(135deg, ${heroBgStart}, ${heroBgEnd});">
        <div class="hero-glow"></div>
        <div class="container hero-content">
          <h1 class="hero-title">${this.escapeHtml(data.hero.title)}</h1>
          <p class="hero-subtitle">${this.escapeHtml(data.hero.subtitle)}</p>
          <a href="${this.escapeHtml(data.hero.ctaLink)}" class="btn-primary">${this.escapeHtml(data.hero.ctaText)}</a>
        </div>
      </header>

      <!-- About 섹션 -->
      <section id="about" class="about-section">
        <div class="container">
          <div class="about-grid">
            <div class="about-text">
              <h2>${this.escapeHtml(data.about.title)}</h2>
              <p>${this.escapeHtml(data.about.content)}</p>
              <a href="#/features" class="btn-primary" style="background: var(--bg-glass); border: 1px solid var(--border-glass); box-shadow: none;">핵심 기능 보기</a>
            </div>
            <div class="about-image">
              <img src="${this.escapeHtml(data.about.imageUrl)}" alt="About Antigravity">
            </div>
          </div>
        </div>
      </section>

      <!-- Features 섹션 -->
      <section id="features" class="features-section">
        <div class="container">
          <div class="section-header">
            <h2>핵심 강점</h2>
            <p>Antigravity 프레임워크가 제공하는 핵심 기능들을 한눈에 살펴보세요.</p>
          </div>
          <div class="features-grid">
            ${featuresHtml}
          </div>
        </div>
      </section>

      <!-- 푸터 -->
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-info">
              <h3>ANTIGRAVITY</h3>
              <p>우리는 사용자의 성공을 돕는 최고 수준의 웹 및 AI 자동화 코딩 인프라를 지향합니다.</p>
            </div>
            <div></div>
            <div class="footer-contact">
              <h4>연락처</h4>
              <p>이메일: ${this.escapeHtml(data.footer.email)}</p>
              <p>주소: ${this.escapeHtml(data.footer.address)}</p>
            </div>
          </div>
          <div class="footer-bottom">
            <p>${this.escapeHtml(data.footer.copyright)}</p>
          </div>
        </div>
      </footer>
    `;

    this.setupSmoothScroll();
  }

  setupSmoothScroll() {
    // 앵커 네비게이션 지원 (About, Features로의 부드러운 스크롤)
    const aboutLink = this.container.querySelector('#nav-about-link');
    const featuresLink = this.container.querySelector('#nav-features-link');

    if (aboutLink) {
      aboutLink.addEventListener('click', (e) => {
        // 이미 메인 페이지라면 스크롤 다운 수행
        if (window.location.hash === '' || window.location.hash === '#/') {
          e.preventDefault();
          this.container.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (featuresLink) {
      featuresLink.addEventListener('click', (e) => {
        if (window.location.hash === '' || window.location.hash === '#/') {
          e.preventDefault();
          this.container.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
        }
      });
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
}
