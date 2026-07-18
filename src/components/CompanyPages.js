import { db } from '../services/db.js';

export class CompanyPages {
  constructor(container, subType, paramId = null) {
    this.container = container;
    this.subType = subType;
    this.paramId = paramId;
    this.contents = null;
  }

  async render() {
    this.contents = await db.getContent();
    
    if (this.subType === 'ceo') {
      this.renderCeoGreeting();
    } else if (this.subType === 'info') {
      this.renderCompanyInfo();
    } else if (this.subType === 'careers') {
      this.renderCareers();
    } else if (this.subType === 'products') {
      this.renderProductsList();
    } else if (this.subType === 'product-detail') {
      this.renderProductDetail();
    }
  }

  // 대표이사 인사말
  renderCeoGreeting() {
    const data = this.contents.ceoGreeting || { title: "CEO 인사말", content: "", imageUrl: "" };
    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">CEO Greeting</h1>
            <p style="color: var(--text-secondary);">에테르노가 걸어갈 아름다운 내일의 메시지를 전합니다.</p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 4rem; align-items: center;">
            <div style="text-align: left;">
              <h2 style="font-size: 2rem; color: #fff; margin-bottom: 1.5rem; line-height:1.4;">${this.escapeHtml(data.title)}</h2>
              <p style="color: var(--text-secondary); line-height: 1.8; font-size: 1.05rem; white-space: pre-wrap; margin-bottom: 2rem;">${this.escapeHtml(data.content)}</p>
              <div style="font-size:1.15rem; color: var(--accent-rose-gold); font-weight:700;">
                (주)에테르노 대표이사 김 에 테 르
              </div>
            </div>
            <div class="about-image">
              <img src="${this.escapeHtml(data.imageUrl)}" alt="CEO">
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 회사 정보
  renderCompanyInfo() {
    const data = this.contents.companyInfo || { name: "", ceo: "", businessNo: "", tel: "", address: "", email: "" };
    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Company Info</h1>
            <p style="color: var(--text-secondary);">아름다움의 가치를 실현하는 정직한 기업, 에테르노입니다.</p>
          </div>
          
          <div style="max-width: 800px; margin: 0 auto; background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius: 24px; padding: 3rem; box-shadow: 0 15px 30px rgba(0,0,0,0.3);">
            <h2 style="font-size:1.6rem; color:#fff; border-bottom:1px solid var(--border-glass); padding-bottom:1rem; margin-bottom:2rem;">기본 기업정보</h2>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; text-align:left;">
              <div>
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">회사명</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.name)}</div>
              </div>
              <div>
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">대표이사</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.ceo)}</div>
              </div>
              <div>
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">사업자등록번호</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.businessNo)}</div>
              </div>
              <div>
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">대표번호</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.tel)}</div>
              </div>
              <div style="grid-column: 1 / -1;">
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">본사 주소</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.address)}</div>
              </div>
              <div style="grid-column: 1 / -1;">
                <div style="font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">공식 이메일</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.email)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // 인재채용
  renderCareers() {
    const list = this.contents.recruitment || [];
    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Careers</h1>
            <p style="color: var(--text-secondary);">바이오 뷰티의 시대를 이끌어갈 우수한 인재를 모십니다.</p>
          </div>
          
          <div style="max-width:900px; margin: 0 auto; display:flex; flex-direction:column; gap:1.5rem; text-align:left;">
            ${list.length === 0 ? `
              <div style="text-align:center; padding: 4rem; color: var(--text-muted);">현재 진행 중인 공고가 없습니다.</div>
            ` : list.map(c => `
              <div style="background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius:18px; padding: 2rem; position:relative;">
                <span class="tag-badge ${c.status === 'open' ? 'tag-video' : 'tag-document'}" style="position:absolute; top:2rem; right:2rem;">
                  ${c.status === 'open' ? '모집중' : '마감'}
                </span>
                <span style="font-size:0.85rem; color: var(--accent-rose-gold); font-weight:600; display:block; margin-bottom:0.5rem;">${this.escapeHtml(c.dept)}</span>
                <h3 style="font-size:1.3rem; color:#fff; margin-bottom:0.75rem; padding-right:5rem;">${this.escapeHtml(c.title)}</h3>
                <p style="color: var(--text-secondary); font-size:0.95rem; line-height:1.5; margin-bottom:1.5rem;">${this.escapeHtml(c.desc)}</p>
                <a href="#/contact/inquiry" class="btn-secondary" style="font-size:0.85rem; padding: 0.55rem 1.2rem; display:inline-block;">입사 지원 / 문의하기</a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 제품소개 (조회 전용)
  renderProductsList() {
    const list = this.contents.products || [];
    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Products</h1>
            <p style="color: var(--text-secondary);">독자적인 심해 바이오 과학 기술로 탄생한 컬렉션을 확인하세요.</p>
          </div>
          
          <div class="products-grid">
            ${list.map(product => {
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
                    <a href="#/products/${product.id}" class="btn-secondary" style="font-size:0.85rem; padding: 0.5rem 1rem; width:100%; text-align:center;">제품 상세 보기</a>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // 제품 상세 보기 (조회 전용)
  renderProductDetail() {
    const product = this.contents.products.find(p => p.id === this.paramId);
    if (!product) {
      this.container.innerHTML = `
        <div style="text-align:center; padding: 10rem 2rem;">
          <h2>제품을 찾을 수 없습니다.</h2>
          <a href="#/products" class="btn-primary" style="margin-top:2rem;">전체 제품 목록으로</a>
        </div>
      `;
      return;
    }

    let categoryLabel = '';
    if (product.category === 'skincare') categoryLabel = '기초화장품';
    else if (product.category === 'makeup') categoryLabel = '색조화장품';
    else if (product.category === 'device') categoryLabel = '미용기구';

    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh; text-align:left;">
        <div class="container">
          <a href="#/products" style="display:inline-flex; align-items:center; gap:0.25rem; color:var(--text-secondary); margin-bottom:2.5rem; font-size:0.95rem;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            제품 리스트로 돌아가기
          </a>
          
          <div style="display: grid; grid-template-columns: 1.1fr 1fr; gap: 4.5rem; align-items: start;">
            <div style="border-radius:24px; overflow:hidden; border:1px solid var(--border-glass);">
              <img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}" style="width:100%; height:auto; display:block;">
            </div>
            <div>
              <span style="font-size:0.9rem; color:var(--accent-rose-gold); font-weight:600; text-transform:uppercase;">${categoryLabel}</span>
              <h1 style="font-size:2.8rem; color:#fff; margin: 0.5rem 0 1.5rem; line-height:1.2;">${this.escapeHtml(product.title)}</h1>
              <p style="font-size:1.1rem; color:var(--text-secondary); line-height:1.7; margin-bottom:2.5rem; border-bottom:1px solid var(--border-glass); padding-bottom:2rem;">
                ${this.escapeHtml(product.desc)}
              </p>
              
              <div style="background:var(--bg-secondary); border:1px solid var(--border-glass); border-radius:16px; padding:1.5rem; margin-bottom:2rem;">
                <h4 style="color:#fff; margin-bottom:0.75rem;">주요 성분 & 기술 공법</h4>
                <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.5;">
                  해저 1,032m 취수 청정 해양심층수 함유, 저온 바이오 리포좀 기술 적용, 민감성 피부 임상 테스트 무자극 판정 완료.
                </p>
              </div>

              <!-- 쇼핑몰 바로가기 권장 -->
              <a href="#/shop" class="btn-primary" style="width:100%; text-align:center;">구매하러 자사몰 바로가기</a>
            </div>
          </div>
        </div>
      </section>
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
