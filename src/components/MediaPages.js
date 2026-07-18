import { db } from '../services/db.js';

export class MediaPages {
  constructor(container, subType) {
    this.container = container;
    this.subType = subType; // press, gallery
    this.contents = null;
  }

  async render() {
    this.contents = await db.getContent();

    if (this.subType === 'press') {
      this.renderPressList();
    } else if (this.subType === 'gallery') {
      this.renderGalleryList();
    }
  }

  // 보도자료 (Press Room)
  renderPressList() {
    const list = this.contents.press || [];
    const videos = this.contents.media ? this.contents.media.filter(m => m.type === 'video') : [];

    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh; text-align:left;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Press Releases</h1>
            <p style="color: var(--text-secondary);">에테르노의 혁신과 성장에 대한 공식 언론 보도자료입니다.</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 2rem; max-width: 900px; margin: 0 auto 5rem;">
            ${list.length === 0 ? `
              <div style="text-align:center; padding: 4rem; color: var(--text-muted);">등록된 보도자료가 없습니다.</div>
            ` : list.map(p => `
              <div class="press-item" style="background: var(--bg-secondary); border:1px solid var(--border-glass); border-radius:18px; padding: 2rem; display:flex; gap:2rem; align-items:center; transition: var(--transition-smooth);">
                <img src="${this.escapeHtml(p.imageUrl)}" alt="Press Image" style="width:160px; height:120px; object-fit:cover; border-radius:10px; flex-shrink:0;">
                <div>
                  <span style="font-size:0.85rem; color:var(--accent-rose-gold); font-weight:600; display:block; margin-bottom:0.4rem;">${p.date}</span>
                  <h3 style="font-size:1.25rem; color:#fff; margin-bottom:0.75rem;">${this.escapeHtml(p.title)}</h3>
                  <p style="color:var(--text-secondary); font-size:0.95rem; line-height:1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${this.escapeHtml(p.content)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- 영상 라이브러리 연계 노출 -->
          <div class="archive-box" style="margin-top: 4rem; padding: 2.5rem; background: var(--bg-secondary);">
            <h3 style="color:#fff; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
              브랜드 영상 보관소
            </h3>
            <div class="media-left-videos" id="video-grid-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1.5rem;">
              ${videos.map(video => {
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
                      <h4 style="font-size:0.95rem; font-weight:600; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${this.escapeHtml(video.title)}</h4>
                      <p style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4; height:2.4rem; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">${this.escapeHtml(video.desc)}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- 비디오 팝업 모달 플레이어 -->
      <div id="video-player-modal" class="video-modal-overlay" style="display: none;">
        <div class="video-modal-container">
          <button class="video-modal-close" id="modal-close-btn">&times;</button>
          <iframe id="video-iframe" width="100%" height="100%" src="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      </div>
    `;

    this.setupVideoEvents();
  }

  // 갤러리/룩북
  renderGalleryList() {
    const list = this.contents.gallery || [];
    const docs = this.contents.media ? this.contents.media.filter(m => m.type === 'document') : [];

    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh; text-align:left;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Visual Gallery</h1>
            <p style="color: var(--text-secondary);">변하지 않는 투명한 빛을 담은 에테르노 브랜드 룩북입니다.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin-bottom: 5rem;">
            ${list.length === 0 ? `
              <div style="text-align:center; padding: 4rem; color: var(--text-muted); grid-column: 1/-1;">등록된 갤러리 이미지가 없습니다.</div>
            ` : list.map(g => `
              <div class="gallery-card" style="background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius: 20px; overflow: hidden; display: flex; flex-direction: column;">
                <div style="aspect-ratio: 4/3; overflow:hidden;">
                  <img src="${this.escapeHtml(g.imageUrl)}" alt="${this.escapeHtml(g.title)}" style="width:100%; height:100%; object-fit:cover; transition: var(--transition-smooth);" class="gallery-img">
                </div>
                <div style="padding: 1.5rem;">
                  <h3 style="font-size:1.15rem; color:#fff; margin-bottom:0.5rem;">${this.escapeHtml(g.title)}</h3>
                  <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.4;">${this.escapeHtml(g.desc)}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- 문서 자료실 연계 노출 -->
          <div class="archive-box" style="padding: 2.5rem; background: var(--bg-secondary);">
            <h3 style="color:#fff; margin-bottom:1.5rem; display:flex; align-items:center; gap:0.5rem;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
              제품 문서 자료실
            </h3>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem;">
              ${docs.map(doc => `
                <div class="pdf-item-bar" style="background: var(--bg-primary);">
                  <div class="pdf-info-group">
                    <div class="pdf-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                    </div>
                    <div class="pdf-text-box">
                      <div class="pdf-item-title">${this.escapeHtml(doc.title)}</div>
                      <div class="pdf-item-desc">${this.escapeHtml(doc.desc)}</div>
                    </div>
                  </div>
                  <a href="${this.escapeHtml(doc.link)}" target="_blank" class="btn-pdf-download" title="다운로드">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </a>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  setupVideoEvents() {
    const videoGrid = this.container.querySelector('#video-grid-container');
    if (!videoGrid) return;
    
    videoGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.video-card');
      if (card) {
        const link = card.getAttribute('data-video-url');
        this.playVideo(link);
      }
    });

    const modal = this.container.querySelector('#video-player-modal');
    const closeBtn = this.container.querySelector('#modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        this.container.querySelector('#video-iframe').src = '';
      });
    }
  }

  playVideo(url) {
    const modal = this.container.querySelector('#video-player-modal');
    const iframe = this.container.querySelector('#video-iframe');
    const ytId = this.getYouTubeId(url);
    if (ytId) {
      iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
      modal.style.display = 'flex';
    } else {
      window.open(url, '_blank');
    }
  }

  getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
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
