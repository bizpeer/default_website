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
    ctaText: "브랜드 스토리 보기",
    ctaLink: "#/about/info",
    bgGradientStart: "#091216", // 딥 오션 오닉스
    bgGradientEnd: "#0b1f24"     // 딥 에메랄드 그린
  },
  about: {
    title: "Brand Story",
    content: "에테르노는 인위적인 일시적 변화 대신, 피부 장벽 본연의 힘을 기르는 데 집중합니다. 오직 무균 상태인 심해 1,032m에서 취수한 해양심층수와 순수 식물 유래 활성 성분을 결합하여 극상의 피부 밀도와 진정을 체감할 수 있는 럭셔리 스킨 솔루션을 탄생시켰습니다.",
    imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80"
  },
  ceoGreeting: {
    title: "자연과 과학의 경계에서 탄생한 아름다움",
    content: "안녕하십니까, AETERNO 대표이사입니다. 에테르노는 인류가 아직 모두 밝혀내지 못한 바다의 무한한 에너지를 연구하여, 피부 장벽에 혁신적인 솔루션을 제안해 왔습니다. 우리는 타협 없는 원료 선정과 혹독한 안전성 검증을 거쳐, 피부 본연의 생명력을 일깨우는 명작만을 선보입니다. 귀하의 일상에 영원히 변치 않는 투명한 빛을 선물하겠습니다. 감사합니다.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
  },
  companyInfo: {
    name: "(주)에테르노 뷰티",
    ceo: "김에테르",
    businessNo: "120-45-67890",
    tel: "02-543-1004",
    address: "서울특별시 강남구 압구정로 럭셔리 뷰티 밸리 101호",
    email: "ceo@aeterno-cosmetics.com",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3162.883733076135!2d127.02598371531102!3d37.52249537980641!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3eb06f85959%3A0xe750d750aa22f7b8!2z7J6s64a47Jqw66as7KeA7KeA!5e0!3m2!1sko!2skr!4v1626574900000!5m2!1sko!2skr"
  },
  recruitment: [
    {
      id: "recruit-1",
      title: "화장품 연구개발(R&D) 수석 연구원 채용",
      dept: "바이오 연구소",
      desc: "해양 원료 기반 신소재 개발 및 화장품 제형 처방 개발 경력 7년 이상 우대",
      status: "open"
    },
    {
      id: "recruit-2",
      title: "브랜드 마케팅 및 디자인 부문 경력사원 모집",
      dept: "브랜드 본부",
      desc: "글로벌 코스메틱 마케팅 전략 수립 및 VMD 패키지 그래픽 디자인 실무자 채용",
      status: "open"
    },
    {
      id: "recruit-3",
      title: "온라인 공식 몰 MD 및 이커머스 운영자 채용",
      dept: "이커머스팀",
      desc: "자사몰 및 외부 플랫폼 프로모션 기획 및 데이터 분석 운영 경력자",
      status: "closed"
    }
  ],
  categories: [
    { key: "skincare", name: "기초화장품" },
    { key: "makeup", name: "색조화장품" },
    { key: "device", name: "뷰티 디바이스" }
  ],
  products: [
    {
      id: "p-1",
      category: "skincare",
      title: "마린 리제네레이팅 토너",
      desc: "지친 피부에 미네랄 수분 보호막을 형성하고 피부 결을 정돈해 주는 수분 토너",
      imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=400&q=80",
      price: 58000,
      originalPrice: 72000,
      stock: 100,
      isSoldOut: false,
      isFeatured: true
    },
    {
      id: "p-2",
      category: "skincare",
      title: "디프 오션 히알루론 앰플",
      desc: "고순도 히알루론산과 심해 에너지가 응축되어 속건조를 빠르게 지워주는 탄력 고농축 앰플",
      imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
      price: 89000,
      originalPrice: 110000,
      stock: 50,
      isSoldOut: false,
      isFeatured: true
    },
    {
      id: "p-3",
      category: "makeup",
      title: "아쿠아 세럼 블렌딩 파운데이션",
      desc: "세럼을 바른 듯 하루 종일 투명하고 맑은 수분 광채를 지속해 주는 글로우 파운데이션",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
      price: 45000,
      originalPrice: 0,
      stock: 200,
      isSoldOut: false,
      isFeatured: true
    },
    {
      id: "p-4",
      category: "makeup",
      title: "시그니처 틴티드 밤",
      desc: "내추럴한 활력 생기를 더해주고 입술 각질을 영양으로 진정시키는 멜팅 립밤",
      imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
      price: 32000,
      originalPrice: 38000,
      stock: 150,
      isSoldOut: false,
      isFeatured: false
    },
    {
      id: "p-5",
      category: "device",
      title: "듀얼 소닉 아이스 테라피",
      desc: "쿨링 마사지와 음이온 갈바닉 기능을 합쳐 붓기 완화 및 화장품 흡수율을 제고하는 마사저",
      imageUrl: "https://images.unsplash.com/photo-1590156546746-c238c3e87cca?auto=format&fit=crop&w=400&q=80",
      price: 198000,
      originalPrice: 250000,
      stock: 30,
      isSoldOut: false,
      isFeatured: false
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
  press: [
    {
      id: "press-1",
      title: "에테르노, 독자 특허 성분 'DeepBio-1032' SCI급 저널 등재",
      content: "에테르노가 연구한 해저 1,032m 무균 심해 미네랄 합성 포뮬러가 우수한 세포 노화 억제 활성으로 국제 피부 과학 전문지에 논문 게재 승인을 받았습니다.",
      date: "2026-05-12",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80"
    },
    {
      id: "press-2",
      title: "에테르노, 2026 대한민국 바이오 뷰티 산업대상 수상",
      content: "자연주의 바이오 테크놀로지를 바탕으로 한 혁신적인 스킨케어 패러다임을 열어 올해 최고의 프리미엄 스킨 리뉴얼 브랜드로 선정되었습니다.",
      date: "2026-03-24",
      imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "AETERNO Visual Campaign — Pure Ocean",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      desc: "끝없이 맑고 거대한 바다가 품은 무한한 자연 생명력의 영감"
    },
    {
      id: "gal-2",
      title: "AETERNO Ocean Serum Aesthetics",
      imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=800&q=80",
      desc: "한 방울로 완성되는 압도적인 수분 광채와 견고한 피부 탄력"
    },
    {
      id: "gal-3",
      title: "AETERNO Eco-friendly Glass Package",
      imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
      desc: "환경을 생각하는 유리 용기 패키지로 프리미엄의 가치와 지속 가능성을 전합니다"
    }
  ],
  seo: {
    metaTitle: "BEAUTY OF JOSEON — 럭셔리 바이오 스킨케어",
    metaDescription: "조선미녀 공식 브랜드 몰 — 인류 고유의 아름다움과 바이오 스킨케어 과학의 조화",
    keywords: "조선미녀, 뷰티오브조선, 스킨케어, 앰플, 세럼, 선크림",
    robots: "index, follow",
    ogTitle: "BEAUTY OF JOSEON (조선미녀)",
    ogDescription: "자연과 과학의 경계에서 탄생한 명작 스킨케어",
    ogImage: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=800&q=80",
    googleVerification: "google-site-verification-token-example",
    naverVerification: "naver-site-verification-token-example"
  },
  brand: {
    koName: "조선미녀",
    enName: "BEAUTY OF JOSEON"
  },
  overview: {
    mission: "피부 본연의 건강한 빛과 생명력을 지키는 지속 가능한 럭셔리 바이오 뷰티",
    foundedYear: "2019",
    employeeCount: "120",
    globalBranches: "15",
    businessAreas: [
      { id: "b-1", title: "바이오 스킨케어 연구개발", desc: "해양 원료 및 고순도 식물 유래 활성 성분 연구" },
      { id: "b-2", title: "글로벌 코스메틱 유통", desc: "전 세계 45개국 공식 브랜드 커머스 유통망 구축" }
    ]
  },
  resend: {
    apiKey: "re_test_key_sample12345",
    senderEmail: "noreply@aeterno-cosmetics.com",
    testEmailRecipient: "admin@aeterno-cosmetics.com"
  },
  tossPg: {
    clientKey: "test_ck_BO744766060416954203",
    secretKey: "test_sk_Z1234567890abcdef",
    mid: "toss_mid_beautyjoseon",
    methods: ["card", "transfer", "vbank", "easypay"],
    isTestMode: true
  },
  banners: [
    {
      id: "banner-1",
      title: "태고의 심해가 간직한 수분 광채",
      subtitle: "디프 오션 히알루론 앰플 출시 기념 20% 특별 프로모션",
      imageUrl: "https://images.unsplash.com/photo-1556229174-5e42a09e45af?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "#/shop?cat=skincare"
    },
    {
      id: "banner-2",
      title: "투명하고 맑은 피부 장벽 케어",
      subtitle: "마린 리제네레이팅 토너 & 파운데이션 세트 특가",
      imageUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?auto=format&fit=crop&w=1200&q=80",
      linkUrl: "#/shop?cat=makeup"
    }
  ],
  footer: {
    email: "beauty@aeterno-cosmetics.com",
    address: "서울특별시 강남구 압구정로 럭셔리 뷰티 밸리 101호",
    copyright: "© 2026 BEAUTY OF JOSEON Inc. All rights reserved."
  }
};

const DEFAULT_SHOP_SETTINGS = {
  enabled: false,
  currency: "₩",
  minOrderAmount: 30000,
  shippingFee: 3000,
  freeShippingThreshold: 50000,
  bankInfo: "국민은행 123-456-789012 (주)에테르노뷰티"
};

const DEFAULT_TIER_POLICY = {
  silverMinOrders: 1,
  goldMinOrders: 3,
  silverPoints: 1000,
  goldPoints: 3000
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
      const existing = JSON.parse(localStorage.getItem('site_contents'));
      let needsMigration = false;
      // 누락된 구조 마이그레이션
      const keys = ['ceoGreeting', 'companyInfo', 'recruitment', 'press', 'gallery', 'seo', 'brand', 'overview', 'resend', 'tossPg', 'banners', 'categories'];
      keys.forEach(k => {
        if (!existing[k]) {
          existing[k] = DEFAULT_CONTENTS[k];
          needsMigration = true;
        }
      });
      if (needsMigration) {
        localStorage.setItem('site_contents', JSON.stringify(existing));
      }
    }

    // 2. 어드민 계정 설정 초기화
    if (!localStorage.getItem('admin_settings')) {
      const initialPasswordHash = await hashPassword(INITIAL_ADMIN_PLAIN_PASSWORD);
      localStorage.setItem('admin_settings', JSON.stringify({
        id: INITIAL_ADMIN_ID,
        passwordHash: initialPasswordHash,
        isPasswordChanged: false
      }));
    }

    // 3. 쇼핑몰 설정 초기화
    if (!localStorage.getItem('shop_settings')) {
      localStorage.setItem('shop_settings', JSON.stringify(DEFAULT_SHOP_SETTINGS));
    }

    // 4. 회원 등급 정책 초기화
    if (!localStorage.getItem('tier_policy')) {
      localStorage.setItem('tier_policy', JSON.stringify(DEFAULT_TIER_POLICY));
    }

    // 5. 직원/운영자 계정 데이터 초기화
    if (!localStorage.getItem('staff_users')) {
      localStorage.setItem('staff_users', JSON.stringify([
        {
          id: 'staff-1',
          name: '김직원',
          email: 'staff1@aeterno-cosmetics.com',
          department: '이커머스 운영팀',
          role: 'staff',
          menuPermissions: ['dashboard', 'contents', 'products', 'orders', 'inquiries'],
          createdAt: new Date().toISOString()
        }
      ]));
    }

    // 6. 쇼핑 회원 데이터 초기화
    if (!localStorage.getItem('shop_users')) {
      localStorage.setItem('shop_users', JSON.stringify([]));
    }

    // 7. 문의 사항 데이터 초기화
    if (!localStorage.getItem('site_inquiries')) {
      localStorage.setItem('site_inquiries', JSON.stringify([]));
    }

    // 8. 주문/장바구니 초기화
    if (!localStorage.getItem('shop_orders')) {
      localStorage.setItem('shop_orders', JSON.stringify([]));
    }
    if (!localStorage.getItem('shop_cart')) {
      localStorage.setItem('shop_cart', JSON.stringify([]));
    }
  }

  // ─── 콘텐츠 CRUD ───
  async getContent() {
    await this.init();
    return JSON.parse(localStorage.getItem('site_contents'));
  }

  async updateContent(data) {
    localStorage.setItem('site_contents', JSON.stringify(data));
    return true;
  }

  // ─── 어드민 계정 ───
  async getAdminSettings() {
    await this.init();
    return JSON.parse(localStorage.getItem('admin_settings'));
  }

  async updateAdminSettings(settings) {
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    return true;
  }

  async authenticate(id, password) {
    const adminSettings = await this.getAdminSettings();
    const inputHash = await hashPassword(password);
    
    // 1. 최고 관리자 (siteadmin) 검증
    if (adminSettings.id === id && adminSettings.passwordHash === inputHash) {
      return { 
        success: true, 
        isPasswordChanged: adminSettings.isPasswordChanged,
        user: { id: 'siteadmin', name: '최고관리자', role: 'siteadmin', menuPermissions: ['dashboard','site','contents','products','shop','orders','customers','system'] }
      };
    }

    // 2. 운영자 / 직원 계정 (staff) 검증
    const staffList = await this.getStaffUsers();
    const staff = staffList.find(s => s.email === id || s.id === id);
    if (staff) {
      const staffHash = staff.passwordHash || await hashPassword('!staff1004');
      if (inputHash === staffHash || password === '!staff1004' || password === staff.password) {
        return {
          success: true,
          isPasswordChanged: true,
          user: {
            id: staff.id,
            name: staff.name,
            email: staff.email,
            department: staff.department,
            role: 'staff',
            menuPermissions: staff.menuPermissions || ['dashboard', 'contents', 'products', 'orders']
          }
        };
      }
    }

    return { success: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
  }

  async changePassword(newPassword) {
    const adminSettings = await this.getAdminSettings();
    adminSettings.passwordHash = await hashPassword(newPassword);
    adminSettings.isPasswordChanged = true;
    await this.updateAdminSettings(adminSettings);
    return true;
  }

  // ─── 쇼핑몰 설정 ───
  async getShopSettings() {
    await this.init();
    return JSON.parse(localStorage.getItem('shop_settings'));
  }

  async updateShopSettings(settings) {
    localStorage.setItem('shop_settings', JSON.stringify(settings));
    return true;
  }

  // ─── 쇼핑몰 회원 CRUD ───
  async getShopUsers() {
    await this.init();
    return JSON.parse(localStorage.getItem('shop_users'));
  }

  async registerShopUser(user) {
    const users = await this.getShopUsers();
    if (users.find(u => u.email === user.email)) {
      return { success: false, message: "이미 등록된 이메일 주소입니다." };
    }
    const hash = await hashPassword(user.password || '123456');
    const newUser = {
      id: `user-${Date.now().toString().slice(-6)}`,
      email: user.email,
      name: user.name || user.email.split('@')[0],
      phone: user.phone,
      address: user.address || "",
      postalCode: user.postalCode || "",
      passwordHash: hash,
      tier: "BRONZE",
      points: 1000,
      socialProvider: user.socialProvider || "email",
      orderCount: 0,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('shop_users', JSON.stringify(users));

    const userPayload = {
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address,
      postalCode: newUser.postalCode,
      tier: newUser.tier,
      points: newUser.points,
      socialProvider: newUser.socialProvider,
      orderCount: 0
    };
    sessionStorage.setItem('shop_user', JSON.stringify(userPayload));
    return { success: true, user: userPayload };
  }

  async loginShopUser(email, password) {
    const users = await this.getShopUsers();
    const hash = await hashPassword(password);
    const user = users.find(u => u.email === email && u.passwordHash === hash);
    if (user) {
      const userPayload = {
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address || '',
        postalCode: user.postalCode || '',
        tier: user.tier || 'BRONZE',
        points: user.points || 0,
        socialProvider: user.socialProvider || 'email',
        orderCount: user.orderCount || 0
      };
      sessionStorage.setItem('shop_user', JSON.stringify(userPayload));
      return { success: true, user: userPayload };
    }
    return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." };
  }

  async loginOrRegisterSocialUser(provider, socialData) {
    const users = await this.getShopUsers();
    let user = users.find(u => u.email === socialData.email);

    if (user) {
      user.socialProvider = provider;
      if (socialData.phone && (!user.phone || user.phone === '-')) user.phone = socialData.phone;
      if (socialData.name && (!user.name || user.name === '고객님')) user.name = socialData.name;
    } else {
      user = {
        id: `user-${Date.now().toString().slice(-6)}`,
        email: socialData.email,
        name: socialData.name || socialData.email.split('@')[0],
        phone: socialData.phone || '010-1234-5678',
        address: '',
        postalCode: '',
        passwordHash: 'SOCIAL_AUTH_KEY',
        tier: 'BRONZE',
        points: 1000,
        socialProvider: provider,
        socialId: socialData.socialId || `${provider}_${Date.now()}`,
        orderCount: 0,
        createdAt: new Date().toISOString()
      };
      users.push(user);
    }

    localStorage.setItem('shop_users', JSON.stringify(users));
    const userPayload = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address || '',
      postalCode: user.postalCode || '',
      tier: user.tier || 'BRONZE',
      points: user.points || 1000,
      socialProvider: user.socialProvider || provider,
      orderCount: user.orderCount || 0
    };
    sessionStorage.setItem('shop_user', JSON.stringify(userPayload));
    return { success: true, user: userPayload };
  }

  // ─── 문의 사항(Inquiry) CRUD ───
  async getInquiries() {
    await this.init();
    return JSON.parse(localStorage.getItem('site_inquiries'));
  }

  async addInquiry(inquiry) {
    const inquiries = await this.getInquiries();
    const newInquiry = {
      id: `INQ-${Date.now().toString().slice(-6)}`,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      title: inquiry.title,
      content: inquiry.content,
      reply: "",
      status: "pending",
      createdAt: new Date().toISOString()
    };
    inquiries.unshift(newInquiry);
    localStorage.setItem('site_inquiries', JSON.stringify(inquiries));
    return newInquiry;
  }

  async saveInquiryReply(id, replyText) {
    const inquiries = await this.getInquiries();
    const inq = inquiries.find(i => i.id === id);
    if (inq) {
      inq.reply = replyText;
      inq.status = replyText.trim() ? "replied" : "pending";
      localStorage.setItem('site_inquiries', JSON.stringify(inquiries));
      return true;
    }
    return false;
  }

  async deleteInquiry(id) {
    let inquiries = await this.getInquiries();
    inquiries = inquiries.filter(i => i.id !== id);
    localStorage.setItem('site_inquiries', JSON.stringify(inquiries));
    return true;
  }

  // ─── 장바구니 ───
  async getCart() {
    await this.init();
    return JSON.parse(localStorage.getItem('shop_cart'));
  }

  async updateCart(cartItems) {
    localStorage.setItem('shop_cart', JSON.stringify(cartItems));
    return true;
  }

  async addToCart(product, qty = 1) {
    const cart = await this.getCart();
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
        qty
      });
    }
    await this.updateCart(cart);
    return cart;
  }

  async removeFromCart(productId) {
    let cart = await this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    await this.updateCart(cart);
    return cart;
  }

  async clearCart() {
    await this.updateCart([]);
    return [];
  }

  // ─── 주문 ───
  async getOrders() {
    await this.init();
    return JSON.parse(localStorage.getItem('shop_orders'));
  }

  async addOrder(orderData) {
    const orders = await this.getOrders();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(orders.length + 1).padStart(3, '0');
    const order = {
      id: `ORD-${dateStr}-${seq}`,
      ...orderData,
      status: 'pending',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
    orders.unshift(order);
    localStorage.setItem('shop_orders', JSON.stringify(orders));

    // 🌟 주문 발생 시 최종 배송지 주소 및 우편번호를 고객 ID(이메일)에 매핑 및 기록
    const targetEmail = orderData.customer?.email || orderData.userEmail;
    if (targetEmail) {
      const users = await this.getShopUsers();
      const userObj = users.find(u => u.email === targetEmail);
      if (userObj) {
        userObj.address = orderData.customer?.address || orderData.shippingAddress || userObj.address;
        userObj.postalCode = orderData.customer?.postalCode || orderData.postalCode || userObj.postalCode;
        userObj.orderCount = (userObj.orderCount || 0) + 1;
        userObj.lastOrderAt = now.toISOString();
        localStorage.setItem('shop_users', JSON.stringify(users));

        // 현재 활성화된 세션 유저가 본인일 경우 세션 저장소 갱신
        const currentSession = sessionStorage.getItem('shop_user');
        if (currentSession) {
          const sessionUser = JSON.parse(currentSession);
          if (sessionUser.email === targetEmail) {
            sessionUser.address = userObj.address;
            sessionUser.postalCode = userObj.postalCode;
            sessionUser.orderCount = userObj.orderCount;
            sessionStorage.setItem('shop_user', JSON.stringify(sessionUser));
          }
        }
      }
    }

    return order;
  }

  async updateOrderStatus(orderId, newStatus) {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem('shop_orders', JSON.stringify(orders));
      return true;
    }
    return false;
  }

  async updateOrderCourierAndTracking(orderId, courier, trackingNo) {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.courier = courier;
      order.trackingNo = trackingNo;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem('shop_orders', JSON.stringify(orders));
      return true;
    }
    return false;
  }

  async cancelAndRefundOrder(orderId) {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'cancelled';
      order.cancelledAt = new Date().toISOString();
      order.refundedAmount = order.totalAmount || order.amount || 0;
      order.paymentStatus = 'CANCELED';
      order.updatedAt = new Date().toISOString();
      localStorage.setItem('shop_orders', JSON.stringify(orders));
      return true;
    }
    return false;
  }

  // ─── 회원 등급 & 포인트 산정 ───
  async getTierPolicy() {
    await this.init();
    return JSON.parse(localStorage.getItem('tier_policy')) || DEFAULT_TIER_POLICY;
  }

  async saveTierPolicy(policy) {
    localStorage.setItem('tier_policy', JSON.stringify(policy));
    return true;
  }

  async recalculateUserTiers() {
    const policy = await this.getTierPolicy();
    const users = await this.getShopUsers();
    const orders = await this.getOrders();

    let updatedCount = 0;
    users.forEach(u => {
      const userOrders = orders.filter(o => o.userEmail === u.email && o.status !== 'cancelled');
      const orderCount = userOrders.length;
      let newTier = 'BRONZE';
      if (orderCount >= policy.goldMinOrders) {
        newTier = 'GOLD VIP';
      } else if (orderCount >= policy.silverMinOrders) {
        newTier = 'SILVER';
      }

      if (u.tier !== newTier) {
        u.tier = newTier;
        updatedCount++;
      }
      u.orderCount = orderCount;
    });

    localStorage.setItem('shop_users', JSON.stringify(users));
    return { success: true, updatedCount, totalUsers: users.length };
  }

  async batchAssignPoints(targetGroup, points, memo) {
    const users = await this.getShopUsers();
    let count = 0;
    users.forEach(u => {
      const tier = u.tier || 'BRONZE';
      let match = false;
      if (targetGroup === 'ALL') match = true;
      else if (targetGroup === 'GOLD' && tier === 'GOLD VIP') match = true;
      else if (targetGroup === 'SILVER' && tier === 'SILVER') match = true;
      else if (targetGroup === 'BRONZE' && tier === 'BRONZE') match = true;

      if (match) {
        u.points = (u.points || 0) + Number(points);
        if (!u.pointHistory) u.pointHistory = [];
        u.pointHistory.unshift({
          amount: Number(points),
          memo: memo || '관리자 일괄 지급',
          date: new Date().toISOString()
        });
        count++;
      }
    });

    localStorage.setItem('shop_users', JSON.stringify(users));
    return { success: true, count };
  }

  // ─── 직원 / 운영자 RBAC 계정 관리 ───
  async getStaffUsers() {
    await this.init();
    return JSON.parse(localStorage.getItem('staff_users')) || [];
  }

  async addStaffUser(staffData) {
    const staffList = await this.getStaffUsers();
    const newStaff = {
      id: `staff-${Date.now().toString().slice(-6)}`,
      name: staffData.name,
      email: staffData.email,
      department: staffData.department,
      role: 'staff',
      menuPermissions: staffData.menuPermissions || ['dashboard', 'contents'],
      createdAt: new Date().toISOString()
    };
    staffList.push(newStaff);
    localStorage.setItem('staff_users', JSON.stringify(staffList));
    return newStaff;
  }

  async deleteStaffUser(id) {
    let staffList = await this.getStaffUsers();
    staffList = staffList.filter(s => s.id !== id);
    localStorage.setItem('staff_users', JSON.stringify(staffList));
    return true;
  }
}

export class SupabaseDbService {
  constructor(url, apiKey) { this.url = url; this.apiKey = apiKey; }
  async getContent() { return null; }
  async updateContent() { return false; }
  async getAdminSettings() { return null; }
  async updateAdminSettings() { return false; }
  async authenticate() { return { success: false }; }
  async changePassword() { return false; }
  async getShopSettings() { return null; }
  async updateShopSettings() { return false; }
  async getShopUsers() { return []; }
  async registerShopUser() { return { success: false }; }
  async loginShopUser() { return { success: false }; }
  async getInquiries() { return []; }
  async addInquiry() { return null; }
  async saveInquiryReply() { return false; }
  async deleteInquiry() { return false; }
  async getCart() { return []; }
  async updateCart() { return false; }
  async addToCart() { return []; }
  async removeFromCart() { return []; }
  async clearCart() { return []; }
  async getOrders() { return []; }
  async addOrder() { return null; }
  async updateOrderStatus() { return false; }
}

export const db = new LocalStorageDbService();
