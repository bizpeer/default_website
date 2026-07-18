// SHA-256 해싱 헬퍼 함수 (브라우저 Subtle Crypto API 사용)
export async function hashPassword(password) {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 프리미엄 뷰티 브랜드 기본 시드 데이터
const DEFAULT_CONTENTS = {
  hero: {
    title: "태고의 심해가 간직한 피부 생명력",
    subtitle: "AETERNO는 해저 1,032m 청정 해양 에너지를 피부 과학으로 풀어내어, 자연스럽게 빛나는 본연의 건강함을 되찾아줍니다.",
    ctaText: "컬렉션 보기",
    ctaLink: "#/products",
    bgGradientStart: "#091216", // 딥 오션 오닉스
    bgGradientEnd: "#0b1f24"     // 딥 에메랄드 그린
  },
  about: {
    title: "Brand Story",
    content: "에테르노는 인위적인 일시적 변화 대신, 피부 장벽 본연의 힘을 기르는 데 집중합니다. 오직 무균 상태인 심해 1,032m에서 취수한 해양심층수와 순수 식물 유래 활성 성분을 결합하여 극상의 피부 밀도와 진정을 체감할 수 있는 럭셔리 스킨 솔루션을 탄생시켰습니다.",
    imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80"
  },
  products: [
    {
      id: "p-1",
      category: "skincare",
      title: "마린 리제네레이팅 토너",
      desc: "지친 피부에 미네랄 수분 보호막을 형성하고 피부 결을 정돈해 주는 수분 토너",
      imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "p-2",
      category: "skincare",
      title: "디프 오션 히알루론 앰플",
      desc: "고순도 히알루론산과 심해 에너지가 응축되어 속건조를 빠르게 지워주는 탄력 고농축 앰플",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "p-3",
      category: "makeup",
      title: "아쿠아 세럼 블렌딩 파운데이션",
      desc: "세럼을 바른 듯 하루 종일 투명하고 맑은 수분 광채를 지속해 주는 글로우 파운데이션",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "p-4",
      category: "makeup",
      title: "시그니처 틴티드 밤",
      desc: "내추럴한 활력 생기를 더해주고 입술 각질을 영양으로 진정시키는 멜팅 립밤",
      imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "p-5",
      category: "device",
      title: "듀얼 소닉 아이스 테라피",
      desc: "쿨링 마사지와 음이온 갈바닉 기능을 합쳐 붓기 완화 및 화장품 흡수율을 제고하는 마사저",
      imageUrl: "https://images.unsplash.com/photo-1590156546746-c238c3e87cca?auto=format&fit=crop&w=400&q=80"
    }
  ],
  media: [
    {
      id: "m-1",
      type: "video",
      title: "AETERNO Introduction",
      desc: "태고의 생명력을 지닌 해양심층수 에테르노 브랜드 소개 영상",
      link: "https://www.youtube.com/watch?v=dr_zFr8Xw-E"
    },
    {
      id: "m-2",
      type: "video",
      title: "AETERNO Journey, beyond surface into the deep.",
      desc: "해저 1,032m 심해의 맑고 깨끗함을 찾아가는 에테르노 여정",
      link: "https://www.youtube.com/watch?v=9Z0nV6Tom0w"
    },
    {
      id: "m-3",
      type: "video",
      title: "AETERNO - Science of Pure Depth",
      desc: "피부 과학과 청정 해양 에너지가 만나 탄생한 특별한 마이크로 솔루션",
      link: "https://youtu.be/fswyLzz6H54"
    },
    {
      id: "m-4",
      type: "document",
      title: "AETERNO Brand Brochure [English]",
      desc: "에테르노 코스메틱 영어 공식 안내 브로셔 리소스",
      link: "https://aeterno-bz3.pages.dev/assets/brochure_en.pdf"
    },
    {
      id: "m-5",
      type: "document",
      title: "AETERNO 성분분석 Infographic",
      desc: "심해 무균 미네랄 성분 비율 및 피부 유효 연구 인포그래픽 자료",
      link: "https://aeterno-bz3.pages.dev/assets/infographic_ko.png"
    },
    {
      id: "m-6",
      type: "document",
      title: "해양심층수 효능 피부 임상 요약본",
      desc: "민감성 임상 테스트 보고서 및 주름 탄력 개선 지수 증빙 공식 PDF",
      link: "https://aeterno-bz3.pages.dev/assets/clinical_report.pdf"
    }
  ],
  footer: {
    email: "beauty@aeterno-cosmetics.com",
    address: "서울특별시 강남구 압구정로 럭셔리 뷰티 밸리 101호",
    copyright: "© 2026 AETERNO Beauty Inc. All rights reserved."
  }
};

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
    } else {
      // 마이그레이션: 기존 데이터에 products나 media가 없으면 덮어쓰기하거나 추가
      const existing = JSON.parse(localStorage.getItem('site_contents'));
      if (!existing.products || !existing.media) {
        localStorage.setItem('site_contents', JSON.stringify(DEFAULT_CONTENTS));
      }
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
    await this.init();
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

export class SupabaseDbService {
  constructor(url, apiKey) {
    this.url = url;
    this.apiKey = apiKey;
  }
  async getContent() { return null; }
  async updateContent() { return false; }
  async getAdminSettings() { return null; }
  async updateAdminSettings() { return false; }
  async authenticate() { return { success: false }; }
  async changePassword() { return false; }
}

export const db = new LocalStorageDbService();
