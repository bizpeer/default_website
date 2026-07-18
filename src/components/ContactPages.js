import { db } from '../services/db.js';

export class ContactPages {
  constructor(container, subType) {
    this.container = container;
    this.subType = subType; // inquiry, map
    this.contents = null;
  }

  async render() {
    this.contents = await db.getContent();

    if (this.subType === 'inquiry') {
      this.renderInquiryForm();
    } else if (this.subType === 'map') {
      this.renderLocationMap();
    }
  }

  // 문의하기 등록 폼
  renderInquiryForm() {
    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh; text-align:left;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Contact Us</h1>
            <p style="color: var(--text-secondary);">궁금하신 점이 있다면 언제든 문의를 남겨주세요. 신속히 답변 드리겠습니다.</p>
          </div>

          <div style="max-width: 650px; margin: 0 auto; background: var(--bg-secondary); border: 1px solid var(--border-glass); border-radius: 24px; padding: 3rem; box-shadow: 0 15px 30px rgba(0,0,0,0.4);">
            <form id="contact-inquiry-form">
              <div class="editor-row">
                <div class="form-group">
                  <label class="form-label" for="inq-name">이름 *</label>
                  <input type="text" id="inq-name" class="form-control" required placeholder="홍길동">
                </div>
                <div class="form-group">
                  <label class="form-label" for="inq-phone">연락처 *</label>
                  <input type="tel" id="inq-phone" class="form-control" required placeholder="010-1234-5678">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="inq-email">이메일 *</label>
                <input type="email" id="inq-email" class="form-control" required placeholder="example@email.com">
              </div>
              <div class="form-group">
                <label class="form-label" for="inq-title">제목 *</label>
                <input type="text" id="inq-title" class="form-control" required placeholder="문의 제목을 입력하세요">
              </div>
              <div class="form-group">
                <label class="form-label" for="inq-content">문의 내용 *</label>
                <textarea id="inq-content" class="form-control" rows="5" required placeholder="문의하실 상세 내용을 입력하세요"></textarea>
              </div>

              <div id="inq-success-msg" class="tag-badge tag-video" style="display:none; width:100%; text-align:center; padding:0.8rem; margin-bottom:1.5rem; font-size:0.9rem;">
                ✓ 문의가 성공적으로 접수되었습니다.
              </div>

              <button type="submit" class="btn-primary" style="width:100%; font-weight:700;">문의 제출하기</button>
            </form>
          </div>
        </div>
      </section>
    `;

    this.setupInquiryFormEvents();
  }

  // 오시는 길
  renderLocationMap() {
    const data = this.contents.companyInfo || { name: "", address: "", tel: "", email: "", mapUrl: "" };
    this.container.innerHTML = `
      <section style="padding: 6rem 0; min-height: 80vh; text-align:left;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
            <h1 style="font-size: 2.8rem; background: linear-gradient(135deg, #fff, var(--accent-rose-gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem;">Location</h1>
            <p style="color: var(--text-secondary);">에테르노 본사로 찾아오시는 길을 안내해 드립니다.</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr; gap: 2.5rem; max-width: 900px; margin: 0 auto;">
            <!-- 구글맵 iframe -->
            ${data.mapUrl ? `
              <div style="width:100%; height:450px; border-radius:24px; overflow:hidden; border:1px solid var(--border-glass); box-shadow: 0 15px 30px rgba(0,0,0,0.5);">
                <iframe src="${data.mapUrl}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
              </div>
            ` : `
              <div style="width:100%; height:450px; border-radius:24px; background:var(--bg-secondary); border:1px dashed var(--border-glass); display:flex; align-items:center; justify-content:center; color:var(--text-muted);">
                등록된 지도가 없습니다.
              </div>
            `}

            <!-- 주소 상세 -->
            <div style="background:var(--bg-secondary); border:1px solid var(--border-glass); border-radius:20px; padding:2.5rem; display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:2rem;">
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">본사 위치</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600; line-height:1.4;">${this.escapeHtml(data.address)}</div>
              </div>
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">전화번호</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.tel)}</div>
              </div>
              <div>
                <div style="font-size:0.8rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.25rem;">이메일 문의</div>
                <div style="font-size:1.05rem; color:#fff; font-weight:600;">${this.escapeHtml(data.email)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  setupInquiryFormEvents() {
    const form = this.container.querySelector('#contact-inquiry-form');
    const successMsg = this.container.querySelector('#inq-success-msg');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      successMsg.style.display = 'none';

      const name = form.querySelector('#inq-name').value.trim();
      const phone = form.querySelector('#inq-phone').value.trim();
      const email = form.querySelector('#inq-email').value.trim();
      const title = form.querySelector('#inq-title').value.trim();
      const content = form.querySelector('#inq-content').value.trim();

      try {
        await db.addInquiry({ name, phone, email, title, content });
        
        successMsg.style.display = 'block';
        form.reset();

        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 5000);
      } catch (err) {
        alert("오류가 발생했습니다: " + err.message);
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
}
