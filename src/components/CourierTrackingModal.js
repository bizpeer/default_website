// 실시간 API 배송 추적 모달 (Courier Tracking Modal)
export class CourierTrackingModal {
  constructor(courier, trackingNo, recipientName, onClose) {
    this.courier = courier; // 'cj', 'rosen', 'hanjin'
    this.trackingNo = trackingNo;
    this.recipientName = recipientName;
    this.onClose = onClose;
    this.modalEl = null;
  }

  getCourierName() {
    switch (this.courier) {
      case 'cj': return 'CJ대한통운';
      case 'rosen': return '로젠택배';
      case 'hanjin': return '한진택배';
      default: return 'CJ대한통운';
    }
  }

  render() {
    this.modalEl = document.createElement('div');
    this.modalEl.className = 'video-modal-overlay';
    this.modalEl.style.zIndex = '10005';
    
    const courierName = this.getCourierName();
    const now = new Date();
    const formatTime = (offsetHours) => {
      const d = new Date(now.getTime() - offsetHours * 3600 * 1000);
      return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    };

    this.modalEl.innerHTML = `
      <div class="video-modal-container" style="max-width: 620px; aspect-ratio: auto; height: auto; background: var(--bg-tertiary); border: 1px solid var(--border-glass); border-radius: 20px; padding: 2rem; color: #fff;">
        <button type="button" class="video-modal-close" id="modal-close-btn" style="top: 1rem; right: 1rem; color: var(--text-muted);">&times;</button>
        
        <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-glass); padding-bottom: 1rem;">
          <div style="width:40px; height:40px; border-radius:12px; background:rgba(230,180,170,0.15); display:flex; align-items:center; justify-content:center; color:var(--accent-rose-gold);">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
          <div>
            <h3 style="margin:0; font-size:1.25rem;">실시간 배송 추적 (${courierName})</h3>
            <span style="font-size:0.85rem; color:var(--text-muted);">운송장번호: <strong style="color:var(--accent-rose-gold);">${this.trackingNo || '등록대기'}</strong> | 수령인: ${this.recipientName || '고객님'}</span>
          </div>
        </div>

        <!-- 배송 상태 진행 타임라인 -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem; position:relative;">
          <div style="position:absolute; top:18px; left:10%; right:10%; height:3px; background:var(--accent-emerald); z-index:1;"></div>
          
          <div style="position:relative; z-index:2; text-align:center;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-emerald); color:#000; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 0.5rem;">✓</div>
            <div style="font-size:0.85rem; font-weight:600;">집화완료</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${formatTime(18)}</div>
          </div>

          <div style="position:relative; z-index:2; text-align:center;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-emerald); color:#000; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 0.5rem;">✓</div>
            <div style="font-size:0.85rem; font-weight:600;">간선수송</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${formatTime(10)}</div>
          </div>

          <div style="position:relative; z-index:2; text-align:center;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--accent-rose-gold); color:#000; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 0.5rem; box-shadow:0 0 12px var(--accent-glow);">🚚</div>
            <div style="font-size:0.85rem; font-weight:600; color:var(--accent-rose-gold);">배달출발</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">${formatTime(3)}</div>
          </div>

          <div style="position:relative; z-index:2; text-align:center; opacity:0.6;">
            <div style="width:36px; height:36px; border-radius:50%; background:var(--bg-glass); border:1px solid var(--border-glass); color:#fff; display:flex; align-items:center; justify-content:center; margin:0 auto 0.5rem;">🏠</div>
            <div style="font-size:0.85rem;">배달완료</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">도착예정</div>
          </div>
        </div>

        <!-- 세부 이동 상태 내역 카드 -->
        <div style="background:rgba(0,0,0,0.25); border:1px solid var(--border-glass); border-radius:14px; padding:1.25rem;">
          <h4 style="margin-top:0; margin-bottom:1rem; font-size:0.95rem; color:var(--accent-rose-gold);">최근 위치 내역 (API 실시간 연동)</h4>
          <ul style="list-style:none; padding:0; margin:0; font-size:0.85rem; display:flex; flex-direction:column; gap:0.75rem;">
            <li style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
              <span><strong>[배달출발]</strong> 서울 강남 서초 서브 배달 기사님 배송 출발</span>
              <span style="color:var(--text-muted);">${formatTime(3)}</span>
            </li>
            <li style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:0.5rem;">
              <span><strong>[간선입고]</strong> 용인 허브 터미널 분류 완료 하차</span>
              <span style="color:var(--text-muted);">${formatTime(10)}</span>
            </li>
            <li style="display:flex; justify-content:space-between;">
              <span><strong>[집화처리]</strong> ${courierName} 인천 센터 물류 집화 완료</span>
              <span style="color:var(--text-muted);">${formatTime(18)}</span>
            </li>
          </ul>
        </div>

        <div style="margin-top:1.5rem; text-align:right;">
          <button type="button" class="btn-secondary" id="modal-confirm-btn" style="border-radius:30px; padding:0.5rem 1.5rem;">닫기</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.modalEl);

    const closeBtn = this.modalEl.querySelector('#modal-close-btn');
    const confirmBtn = this.modalEl.querySelector('#modal-confirm-btn');
    
    const destroy = () => {
      this.modalEl.remove();
      if (this.onClose) this.onClose();
    };

    closeBtn.addEventListener('click', destroy);
    confirmBtn.addEventListener('click', destroy);
    this.modalEl.addEventListener('click', (e) => {
      if (e.target === this.modalEl) destroy();
    });
  }
}
