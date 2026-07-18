import { MainPage } from './components/MainPage.js';
import { AdminLogin } from './components/AdminLogin.js';
import { AdminDashboard } from './components/AdminDashboard.js';

class App {
  constructor() {
    this.appContainer = document.getElementById('app');
    this.init();
  }

  init() {
    // 라우터 바인딩
    window.addEventListener('hashchange', () => this.route());
    window.addEventListener('DOMContentLoaded', () => this.route());
  }

  async route() {
    const hash = window.location.hash || '#/';
    
    // 네비게이션 액티브 효과 처리(메인 페이지용)
    this.updateNavbarActiveLink(hash);

    // 로그인 세션 여부 확인
    const isAdminAuthenticated = sessionStorage.getItem('admin_session') === 'active';

    if (hash === '#/' || hash === '' || hash.startsWith('#/about') || hash.startsWith('#/features')) {
      // 메인 페이지 렌더링
      const mainPage = new MainPage(this.appContainer);
      await mainPage.render();
      
      // 약식 스크롤 제어 (해시에 따라 해당 섹션으로 이동)
      if (hash === '#/about') {
        const aboutSection = document.getElementById('about');
        if (aboutSection) aboutSection.scrollIntoView({ behavior: 'smooth' });
      } else if (hash === '#/features') {
        const featuresSection = document.getElementById('features');
        if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
      }
    } 
    else if (hash === '#/admin') {
      // 이미 로그인되어 있으면 대시보드로 이동
      if (isAdminAuthenticated) {
        window.location.hash = '#/admin/dashboard';
        return;
      }
      
      // 로그인 컴포넌트 로드
      const adminLogin = new AdminLogin(this.appContainer, () => {
        window.location.hash = '#/admin/dashboard';
      });
      adminLogin.render();
    } 
    else if (hash === '#/admin/dashboard') {
      // 세션이 없으면 로그인 화면으로 리다이렉트
      if (!isAdminAuthenticated) {
        window.location.hash = '#/admin';
        return;
      }
      
      // 대시보드 컴포넌트 로드
      const dashboard = new AdminDashboard(this.appContainer, () => {
        window.location.hash = '#/admin';
      });
      await dashboard.render();
    } 
    else {
      // 404 폴백: 메인 페이지로 복귀
      window.location.hash = '#/';
    }
  }

  updateNavbarActiveLink(hash) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === hash) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

// 앱 실행
new App();
