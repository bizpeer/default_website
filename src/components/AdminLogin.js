import { db } from '../services/db.js';

export class AdminLogin {
  constructor(container, onLoginSuccess) {
    this.container = container;
    this.onLoginSuccess = onLoginSuccess;
    this.isChangingPassword = false;
  }

  render() {
    this.container.innerHTML = `
      <div class="admin-login-wrapper">
        <div class="admin-card">
          <h2>ADMIN PORTAL</h2>
          <p class="subtitle">콘텐츠 관리를 위해 로그인하세요.</p>
          
          <form id="login-form">
            <div class="form-group">
              <label class="form-label" for="admin-id">아이디</label>
              <input type="text" id="admin-id" class="form-control" placeholder="siteadmin" required autofocus>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="admin-password">비밀번호</label>
              <input type="password" id="admin-password" class="form-control" placeholder="••••••••" required>
            </div>
            
            <div id="login-error" class="error-message" style="display: none;"></div>
            
            <button type="submit" class="btn-primary btn-block">로그인</button>
          </form>
        </div>
      </div>
      
      <!-- 비밀번호 변경 모달 -->
      <div id="password-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <h3 class="modal-title">최초 비밀번호 변경 필수</h3>
          <p class="modal-desc">안전한 사이트 운영을 위해 최초 로그인 시 반드시 비밀번호를 변경해야 합니다.</p>
          
          <form id="password-change-form">
            <div class="form-group">
              <label class="form-label" for="new-password">새 비밀번호</label>
              <input type="password" id="new-password" class="form-control" placeholder="새 비밀번호 입력" required minlength="6">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="confirm-password">새 비밀번호 확인</label>
              <input type="password" id="confirm-password" class="form-control" placeholder="새 비밀번호 다시 입력" required minlength="6">
            </div>
            
            <div id="password-error" class="error-message" style="display: none;"></div>
            
            <button type="submit" class="btn-primary btn-block">비밀번호 변경 및 저장</button>
          </form>
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const loginForm = this.container.querySelector('#login-form');
    const loginError = this.container.querySelector('#login-error');
    
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.style.display = 'none';
      
      const id = this.container.querySelector('#admin-id').value.trim();
      const password = this.container.querySelector('#admin-password').value;
      
      const authResult = await db.authenticate(id, password);
      
      if (authResult.success) {
        if (!authResult.isPasswordChanged) {
          // 최초 비밀번호 변경이 수행되지 않은 경우 -> 변경 모달 띄우기
          this.showPasswordChangeModal();
        } else {
          // 인증 완료 -> 세션 생성 및 대시보드로 이동
          sessionStorage.setItem('admin_session', 'active');
          this.onLoginSuccess();
        }
      } else {
        loginError.textContent = authResult.message;
        loginError.style.display = 'block';
      }
    });

    const passwordForm = this.container.querySelector('#password-change-form');
    const passwordError = this.container.querySelector('#password-error');

    passwordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      passwordError.style.display = 'none';

      const newPassword = this.container.querySelector('#new-password').value;
      const confirmPassword = this.container.querySelector('#confirm-password').value;

      if (newPassword === '!admin1004') {
        passwordError.textContent = "최초 비밀번호와 동일한 비밀번호는 사용할 수 없습니다.";
        passwordError.style.display = 'block';
        return;
      }

      if (newPassword !== confirmPassword) {
        passwordError.textContent = "비밀번호가 서로 일치하지 않습니다.";
        passwordError.style.display = 'block';
        return;
      }

      try {
        await db.changePassword(newPassword);
        // 세션 활성화 및 완료 알림
        sessionStorage.setItem('admin_session', 'active');
        
        // 간단한 토스트 알림 띄우기
        this.showToast("비밀번호가 성공적으로 변경되었습니다.");
        
        // 약간의 딜레이 후 대시보드 진입
        setTimeout(() => {
          this.onLoginSuccess();
        }, 1000);
      } catch (err) {
        passwordError.textContent = "비밀번호 변경 중 오류가 발생했습니다.";
        passwordError.style.display = 'block';
      }
    });
  }

  showPasswordChangeModal() {
    const modal = this.container.querySelector('#password-modal');
    modal.style.display = 'flex';
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }
}
