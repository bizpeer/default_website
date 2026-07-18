// SHA-256 해싱 헬퍼 함수 (브라우저 Subtle Crypto API 사용)
export async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 기본 사이트 콘텐츠 시드 데이터
const DEFAULT_CONTENTS = {
  hero: {
    title: "미래를 여는 혁신적인 AI 코딩 파트너",
    subtitle: "Antigravity는 차세대 에이전트 인공지능 기술을 결합하여 완벽하고 아름다운 웹 애플리케이션을 신속하게 설계 및 빌드합니다.",
    ctaText: "시작하기",
    ctaLink: "#/about",
    bgGradientStart: "#1a1b2f",
    bgGradientEnd: "#161625"
  },
  about: {
    title: "회사 소개",
    content: "우리는 최첨단 AI 에이전트 코딩 기술인 Advanced Agentic Coding을 연구하는 전문 디자인 및 개발 팀입니다. 복잡하고 어려운 로직을 단순화하며, 사용자에게 아름다운 시각적 인터페이스와 신뢰성 높은 아키텍처를 제공하는 것을 최우선 가치로 삼고 있습니다.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
  },
  features: [
    {
      id: "f-1",
      title: "프리미엄 HSL 테마",
      desc: "정밀하게 큐레이션된 HSL 기반 컬러 시스템과 다크모드 및 유리 질감의 Glassmorphism UI를 적용하여 첫눈에 반하는 비주얼을 자랑합니다."
    },
    {
      id: "f-2",
      title: "실시간 콘텐츠 관리",
      desc: "강력하고 안전한 어드민 대시보드(CMS)를 통해 사이트 내의 모든 문구, 이미지 링크, 카드 구성을 실시간으로 수정하고 배포할 수 있습니다."
    },
    {
      id: "f-3",
      title: "반응형 레이아웃",
      desc: "모바일에서 울트라 와이드 모니터까지 어떤 화면 해상도에서도 어색함 없이 유려하고 일관된 사용자 경험을 전달하도록 최적화되었습니다."
    }
  ],
  footer: {
    email: "contact@antigravity-ai.com",
    address: "서울특별시 강남구 테헤란로 AI 타워 1004호",
    copyright: "© 2026 Antigravity IDE Group. All rights reserved."
  }
};

// 디폴트 어드민 계정 정보 (최초 id=siteadmin, password=!admin1004)
// !admin1004의 SHA-256 해시값:
// 41656b6451e04cfbb9962a98f12a3203f1917f354ff16a1b92015822f30b91e9 (예시, 코드 최초 기동시 생성하여 해시 비교)
const INITIAL_ADMIN_ID = "siteadmin";
const INITIAL_ADMIN_PLAIN_PASSWORD = "!admin1004";

export class LocalStorageDbService {
  constructor() {
    this.init();
  }

  async init() {
    // 1. 사이트 콘텐츠 데이터 초기화
    if (!localStorage.getItem('site_contents')) {
      localStorage.setItem('site_contents', JSON.stringify(DEFAULT_CONTENTS));
    }

    // 2. 어드민 계정 설정 초기화
    if (!localStorage.getItem('admin_settings')) {
      const initialPasswordHash = await hashPassword(INITIAL_ADMIN_PLAIN_PASSWORD);
      const adminSettings = {
        id: INITIAL_ADMIN_ID,
        passwordHash: initialPasswordHash,
        isPasswordChanged: false
      };
      localStorage.setItem('admin_settings', JSON.stringify(adminSettings));
    }
  }

  async getContent() {
    this.init();
    return JSON.parse(localStorage.getItem('site_contents'));
  }

  async updateContent(data) {
    localStorage.setItem('site_contents', JSON.stringify(data));
    return true;
  }

  async getAdminSettings() {
    await this.init();
    return JSON.parse(localStorage.getItem('admin_settings'));
  }

  async updateAdminSettings(settings) {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    return true;
  }

  // 로그인 인증 로직
  async authenticate(id, password) {
    const adminSettings = await this.getAdminSettings();
    const inputHash = await hashPassword(password);
    
    if (adminSettings.id === id && adminSettings.passwordHash === inputHash) {
      return {
        success: true,
        isPasswordChanged: adminSettings.isPasswordChanged
      };
    }
    return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  // 비밀번호 변경 로직
  async changePassword(newPassword) {
    const adminSettings = await this.getAdminSettings();
    const newHash = await hashPassword(newPassword);
    
    adminSettings.passwordHash = newHash;
    adminSettings.isPasswordChanged = true;
    
    await this.updateAdminSettings(adminSettings);
    return true;
  }
}

// Supabase API를 활용한 서비스 구현체 (준비용)
export class SupabaseDbService {
  constructor(url, apiKey) {
    this.url = url;
    this.apiKey = apiKey;
  }

  // 실제 Supabase와 데이터 매핑할 때 활용할 스터브들
  async getContent() {
    console.warn("Supabase 호스트가 오프라인이므로 로컬 스토리지를 기본 모드로 사용합니다.");
    return null;
  }
  async updateContent() { return false; }
  async getAdminSettings() { return null; }
  async updateAdminSettings() { return false; }
  async authenticate() { return { success: false }; }
  async changePassword() { return false; }
}

// 현재는 LocalStorageDbService를 메인 DB 인스턴스로 제공하며,
// 추후 Supabase 연동이 준비되면 쉽게 인스턴스를 갈아끼울 수 있도록 함.
export const db = new LocalStorageDbService();
