import { db } from '../services/db.js';

export class MainPage {
  constructor(container) {
    this.container = container;
    this.data = null;
    this.shopSettings = null;
  }

  async render() {
    this.data = await db.getContent();
    this.shopSettings = await db.getShopSettings();
    
    const heroBgStart = this.data.hero.bgGradientStart || '#091216';
    const heroBgEnd = this.data.hero.bgGradientEnd || '#0b1f24';

    // 최신 보도자료 2개 가져오기
    const recentPress = this.data.press ? this.data.press.slice(0, 2) : [];
    // 대표 상품 3개 가져오기
    const mainProducts = this.data.products ? this.data.products.slice(0, 3) : [];

    this.container.innerHTML = `
      <!-- Hero 섹션 -->
      <header class="hero-section" style="background: linear-gradient(135deg, ${heroBgStart}, ${heroBgEnd});">
        <div class="hero-glow"></div>
        <div class="container hero-content">
          <h1 class="hero-title">${this.escapeHtml(this.data.hero.title)}</h1>
          <p class="hero-subtitle">${this.escapeHtml(this.data.hero.subtitle)}</p>
          <a href="${this.data.hero.ctaLink}" class="btn-primary">${this.escapeHtml(this.data.hero.ctaText)}</a>
        </div>
      </header>

      <!-- About 섹션 -->
      <section class="about-section">
        <div class="container">
          <div class="about-grid">
            <div class="about-text">
              <h2>${this.escapeHtml(this.data.about.title)}</h2>
              <p>${this.escapeHtml(this.data.about.content)}</p>
              <a href="#/about/info" class="btn-primary" style="background: var(--bg-glass); border: 1px solid var(--border-glass); box-shadow: none; color: var(--accent-rose-gold);">브랜드 스토리 자세히 보기</a>
            </div>
            <div class="about-image">
              <img src="${this.escapeHtml(this.data.about.imageUrl)}" alt="Brand Story Image">
            </div>
          </div>
        </div>
      </section>

      <!-- 대표 제품 요약 그리드 (회사 소개 스타일) -->
      <section class="products-section" style="background: var(--bg-secondary); border-top: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass);">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 3.5rem;">
            <h2 style="font-size: 2.6rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Signature Products</h2>
            <p style="color: var(--text-secondary);">피부 본연의 건강함을 일깨우는 AETERNO의 대표적인 라인업을 소개합니다.</p>
          </div>
          <div class="products-grid">
            ${mainProducts.map(product => {
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
                    <p style="margin-bottom:1.5rem;">${this.escapeHtml(product.desc)}</p>
                    <a href="#/products/${product.id}" class="btn-secondary" style="font-size:0.85rem; padding: 0.5rem 1rem; width:100%; text-align:center;">자세히 보기</a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
          <div style="text-align: center; margin-top: 3.5rem;">
            <a href="#/products" class="btn-primary">전체 제품 목록 보기</a>
          </div>
        </div>
      </section>

      <!-- 최신 보도자료 (Press Room) -->
      <section style="padding: 8rem 0; background: var(--bg-primary);">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h2 style="font-size: 2.6rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Press Room</h2>
            <p style="color: var(--text-secondary);">에테르노의 최신 소식 및 언론 보도자료를 신속하게 전해드립니다.</p>
          </div>
          <div class="press-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
            ${recentPress.map(p => `
              <div class="press-card" style="background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
                <img src="${this.escapeHtml(p.imageUrl)}" alt="${this.escapeHtml(p.title)}" style="width:100%; height:200px; object-fit:cover;">
                <div style="padding: 1.5rem; display: flex; flex-direction: column; flex: 1;">
                  <span style="font-size: 0.8rem; color: var(--accent-rose-gold); margin-bottom: 0.5rem;">${p.date}</span>
                  <h3 style="font-size:1.15rem; margin-bottom:0.75rem; color:#fff; line-height:1.4;">${this.escapeHtml(p.title)}</h3>
                  <p style="font-size:0.9rem; color: var(--text-secondary); line-height:1.5; margin-bottom: 1.5rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${this.escapeHtml(p.content)}</p>
                  <a href="#/media/press" style="margin-top:auto; font-size:0.85rem; font-weight:600; color: var(--accent-rose-gold); display:flex; align-items:center; gap:0.25rem;">자세히 보기 →</a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- 쇼핑몰 바로가기 배너 (On일 때만 노출) -->
      ${this.shopSettings.enabled ? `
        <section style="padding: 6rem 0; background: linear-gradient(135deg, rgba(230, 180, 170, 0.05) 0%, rgba(9, 18, 22, 0) 100%); border-top: 1px solid var(--border-glass);">
          <div class="container" style="text-align: center;">
            <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 1rem; font-family: var(--font-display);">AETERNO Online Store Open</h2>
            <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 2.5rem; line-height:1.6;">
              에테르노의 프리미엄 바이오 스킨케어 컬렉션을 공식 온라인 쇼핑몰에서 바로 만나보실 수 있습니다. 회원가입 시 다양한 혜택과 이벤트 참여가 가능합니다.
            </p>
            <a href="#/shop" class="btn-primary" style="padding: 1rem 3rem;">AETERNO 공식 쇼핑몰 이동하기</a>
          </div>
        </section>
      ` : ''}
    `;
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
