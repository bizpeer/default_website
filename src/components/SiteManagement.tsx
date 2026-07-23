import { useState, useEffect } from 'react';
import { getEmailSettings, sendInquiryReplyEmail, EmailSettings } from '../services/emailService';
import { applySEOTagsToHead } from '../services/seoService';
import { SEOManagement } from './SEOManagement';

export function SiteManagement() {
  const [activeTab, setActiveTab] = useState<'site' | 'seo'>('site');
  const [showShoppingMall, setShowShoppingMall] = useState(true);
  
  // CEO Message
  const [ceoName, setCeoName] = useState('구태원 대표이사');
  const [ceoPosition, setCeoPosition] = useState('주식회사 조선미녀 대표이사 (CEO & Founder)');
  const [ceoImageUrl, setCeoImageUrl] = useState('');
  const [ceoSignatureUrl, setCeoSignatureUrl] = useState('');
  const [ceoTitle, setCeoTitle] = useState('자연의 지혜와 정성을 가득 담아 피부 본연의 아름다움을 선물합니다.');
  const [ceoContent, setCeoContent] = useState('안녕하십니까, 조선미녀(Beauty of Joseon) 대표이사 구태원입니다.\n\n저희 브랜드는 한방 화장품의 고루한 이미지를 탈피하여 현대인들이 부담 없이 스킨케어를 즐길 수 있도록 전통과 현대의 조화를 탐구해 왔습니다.\n\n조선 시대 여성들의 단아하고 기품 있는 피부 관리 방식을 현대적인 처방으로 재해석하여, 맑고 투명한 피부 본연의 힘을 되찾아 드리는 것이 저희의 사명입니다.\n\n언제나 좋은 원료와 정직한 제조를 바탕으로 고객 여러분의 신뢰에 보답하겠습니다. 늘 함께해 주셔서 감사합니다.');
  const [ceoSignOff, setCeoSignOff] = useState('조선미녀 대표이사 구태원 드림');
  
  // Company Overview
  const [overviewMission, setOverviewMission] = useState('전통 한방 원료에 현대적 기술을 결합하여 현대인의 피부 고민을 덜어주는 클린 뷰티의 글로벌 스탠다드');
  const [overviewEstYear, setOverviewEstYear] = useState('2020');
  const [overviewEmployees, setOverviewEmployees] = useState('120');
  const [overviewGlobalOffices, setOverviewGlobalOffices] = useState('3');
  const [overviewBusinessTitle, setOverviewBusinessTitle] = useState('사업영역 (Business)');
  const [overviewBusinessContent, setOverviewBusinessContent] = useState('조선미녀는 조선 시대 여성들이 피부를 맑고 투명하게 가꾸기 위해 자연에서 얻은 원료를 활용했던 지혜에 영감을 받았습니다. 인삼, 쌀, 벌꿀 등 전통적인 한방 성분을 엄선하고 현대적인 포뮬러 기술을 결합하여 현대 스킨케어 고민을 자극 없이 해결하는 라이프스타일 뷰티 브랜드입니다.\n\n현재 아시아뿐만 아니라 미주, 유럽 등 전 세계 다양한 국가에서 사랑받으며 한국 전통 스킨케어의 아름다움을 글로벌 시장에 널리 알리고 있습니다.');

  // Careers
  const [careerStatus, setCareerStatus] = useState('현재 마케팅 및 글로벌 영업 직군 채용이 활발하게 진행 중입니다.');
  const [careerPositions, setCareerPositions] = useState('• [신입/경력] 글로벌 브랜드 마케터 (영어가능자 필수)\n• [경력] 국내/해외 화장품 상품 기획자 (BM)\n• [신입/경력] 자사몰 퍼포먼스 마케팅 담당자');

  // Brand Name & Favicon Settings
  const [brandNameKo, setBrandNameKo] = useState('조선미녀');
  const [brandNameEn, setBrandNameEn] = useState('BEAUTY OF JOSEON');
  const [faviconUrl, setFaviconUrl] = useState('');

  // Contact & Business Info Settings
  const [businessName, setBusinessName] = useState('주식회사 조선미녀');
  const [businessRegNum, setBusinessRegNum] = useState('120-88-99881');
  const [ecommerceNum, setEcommerceNum] = useState('2026-서울강남-01928호');
  const [privacyOfficer, setPrivacyOfficer] = useState('정보보호관리팀장');

  const [contactAddress, setContactAddress] = useState('서울특별시 강남구 테헤란로 521, 조선미녀 타워 4층');
  const [contactPhone, setContactPhone] = useState('1544-0000');
  const [contactEmail, setContactEmail] = useState('help@beautyofjoseon.com');

  // Email Service Settings (Resend API)
  const [emailProvider, setEmailProvider] = useState<EmailSettings['provider']>('resend');
  const [emailApiKey, setEmailApiKey] = useState('');
  const [emailFromAddr, setEmailFromAddr] = useState('onboarding@resend.dev');
  const [emailFromName, setEmailFromName] = useState('조선미녀 고객지원팀');
  const [showApiKey, setShowApiKey] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBrandKo = localStorage.getItem('site_brand_name_ko');
    if (savedBrandKo) setBrandNameKo(savedBrandKo);

    const savedBrandEn = localStorage.getItem('site_brand_name_en');
    if (savedBrandEn) setBrandNameEn(savedBrandEn);

    const savedFavicon = localStorage.getItem('site_favicon_url');
    if (savedFavicon) setFaviconUrl(savedFavicon);

    const savedShowMall = localStorage.getItem('show_shopping_mall');
    if (savedShowMall !== null) {
      setShowShoppingMall(JSON.parse(savedShowMall));
    }

    const emailConfig = getEmailSettings();
    setEmailProvider(emailConfig.provider);
    setEmailApiKey(emailConfig.apiKey);
    setEmailFromAddr(emailConfig.fromEmail);
    setEmailFromName(emailConfig.fromName);

    const savedCeoName = localStorage.getItem('site_ceo_name');
    if (savedCeoName) setCeoName(savedCeoName);

    const savedCeoPosition = localStorage.getItem('site_ceo_position');
    if (savedCeoPosition) setCeoPosition(savedCeoPosition);

    const savedCeoImg = localStorage.getItem('site_ceo_image_url');
    if (savedCeoImg) setCeoImageUrl(savedCeoImg);

    const savedCeoSig = localStorage.getItem('site_ceo_signature_url');
    if (savedCeoSig) setCeoSignatureUrl(savedCeoSig);

    const savedCeoTitle = localStorage.getItem('site_ceo_title');
    if (savedCeoTitle) setCeoTitle(savedCeoTitle);

    const savedCeoContent = localStorage.getItem('site_ceo_content');
    if (savedCeoContent) setCeoContent(savedCeoContent);

    const savedCeoSignOff = localStorage.getItem('site_ceo_sign_off');
    if (savedCeoSignOff) setCeoSignOff(savedCeoSignOff);

    const savedOverviewMission = localStorage.getItem('site_overview_mission');
    if (savedOverviewMission) setOverviewMission(savedOverviewMission);

    const savedOverviewEstYear = localStorage.getItem('site_overview_est_year');
    if (savedOverviewEstYear) setOverviewEstYear(savedOverviewEstYear);

    const savedOverviewEmployees = localStorage.getItem('site_overview_employees');
    if (savedOverviewEmployees) setOverviewEmployees(savedOverviewEmployees);

    const savedOverviewGlobalOffices = localStorage.getItem('site_overview_global_offices');
    if (savedOverviewGlobalOffices) setOverviewGlobalOffices(savedOverviewGlobalOffices);

    const savedOverviewBusinessTitle = localStorage.getItem('site_overview_business_title');
    if (savedOverviewBusinessTitle) setOverviewBusinessTitle(savedOverviewBusinessTitle);

    const savedOverviewBusinessContent = localStorage.getItem('site_overview_business_content');
    if (savedOverviewBusinessContent) setOverviewBusinessContent(savedOverviewBusinessContent);

    const savedCareerStatus = localStorage.getItem('site_career_status');
    if (savedCareerStatus) setCareerStatus(savedCareerStatus);

    const savedCareerPositions = localStorage.getItem('site_career_positions');
    if (savedCareerPositions) setCareerPositions(savedCareerPositions);

    const savedContactAddress = localStorage.getItem('site_contact_address');
    if (savedContactAddress) setContactAddress(savedContactAddress);

    const savedContactPhone = localStorage.getItem('site_contact_phone');
    if (savedContactPhone) setContactPhone(savedContactPhone);

    const savedContactEmail = localStorage.getItem('site_contact_email');
    if (savedContactEmail) setContactEmail(savedContactEmail);

    const savedBizName = localStorage.getItem('site_business_name');
    if (savedBizName) setBusinessName(savedBizName);

    const savedBizReg = localStorage.getItem('site_business_reg_num');
    if (savedBizReg) setBusinessRegNum(savedBizReg);

    const savedEcom = localStorage.getItem('site_ecommerce_num');
    if (savedEcom) setEcommerceNum(savedEcom);

    const savedOfficer = localStorage.getItem('site_privacy_officer');
    if (savedOfficer) setPrivacyOfficer(savedOfficer);
  }, []);

  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert('파비콘 파일 크기는 1MB 이하만 등록 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setFaviconUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCeoImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('대표이사 이미지 크기는 2MB 이하만 등록 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCeoImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleCeoSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      alert('서명 이미지 크기는 1MB 이하만 등록 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCeoSignatureUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem('site_brand_name_ko', brandNameKo);
    localStorage.setItem('site_brand_name_en', brandNameEn);
    localStorage.setItem('site_favicon_url', faviconUrl);

    localStorage.setItem('show_shopping_mall', JSON.stringify(showShoppingMall));
    
    // CEO Message Items
    localStorage.setItem('site_ceo_name', ceoName);
    localStorage.setItem('site_ceo_position', ceoPosition);
    localStorage.setItem('site_ceo_image_url', ceoImageUrl);
    localStorage.setItem('site_ceo_signature_url', ceoSignatureUrl);
    localStorage.setItem('site_ceo_title', ceoTitle);
    localStorage.setItem('site_ceo_content', ceoContent);
    localStorage.setItem('site_ceo_sign_off', ceoSignOff);

    localStorage.setItem('site_overview_mission', overviewMission);
    localStorage.setItem('site_overview_est_year', overviewEstYear);
    localStorage.setItem('site_overview_employees', overviewEmployees);
    localStorage.setItem('site_overview_global_offices', overviewGlobalOffices);
    localStorage.setItem('site_overview_business_title', overviewBusinessTitle);
    localStorage.setItem('site_overview_business_content', overviewBusinessContent);
    localStorage.setItem('site_career_status', careerStatus);
    localStorage.setItem('site_career_positions', careerPositions);
    
    // Contact & Business Info Items
    localStorage.setItem('site_contact_address', contactAddress);
    localStorage.setItem('site_contact_phone', contactPhone);
    localStorage.setItem('site_contact_email', contactEmail);
    localStorage.setItem('site_business_name', businessName);
    localStorage.setItem('site_business_reg_num', businessRegNum);
    localStorage.setItem('site_ecommerce_num', ecommerceNum);
    localStorage.setItem('site_privacy_officer', privacyOfficer);

    // Dynamic Favicon Update in DOM
    if (faviconUrl) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconUrl;
    }

    // Dynamic Document Title & Head Meta Tags Update
    applySEOTagsToHead();

    // Save Email Settings
    const emailConfig: EmailSettings = {
      provider: emailProvider,
      apiKey: emailApiKey.trim(),
      fromEmail: emailFromAddr.trim() || 'onboarding@resend.dev',
      fromName: emailFromName.trim() || `${brandNameKo} 고객지원팀`,
      enableBcc: false,
    };
    localStorage.setItem('email_service_settings', JSON.stringify(emailConfig));

    alert('브랜드명, 파비콘 및 사이트 설정이 성공적으로 저장되었습니다!');
  };

  const handleTestEmailSend = async () => {
    const targetEmail = prompt('테스트 이메일을 수신할 이메일 주소를 입력하세요:', contactEmail || 'delivered@resend.dev');
    if (!targetEmail) return;

    // Temporarily save current form inputs
    const tempConfig: EmailSettings = {
      provider: emailProvider,
      apiKey: emailApiKey.trim(),
      fromEmail: emailFromAddr.trim() || 'onboarding@resend.dev',
      fromName: emailFromName.trim() || '조선미녀 고객지원팀',
      enableBcc: false,
    };
    localStorage.setItem('email_service_settings', JSON.stringify(tempConfig));

    const res = await sendInquiryReplyEmail({
      toEmail: targetEmail.trim(),
      customerName: '테스트 수신자',
      subject: 'Resend 이메일 연동 테스트입니다',
      replyContent: '안녕하세요! 본 메일은 조선미녀 관리자 콘솔에서 발송된 Resend 이메일 연동 테스트 메시지입니다.',
    });

    if (res.success) {
      alert(`✅ [${res.provider} 연동 성공]\n${res.message}`);
    } else {
      alert(`❌ [${res.provider} 연동 실패]\n${res.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">사이트 및 SEO 관리 (Site & SEO Management)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            공개 웹사이트의 회사정보, 파비콘, 이메일 연동 및 **SEO 검색엔진 최적화(Meta Title/OG/Robots)**를 관리합니다.
          </p>
        </div>
        {activeTab === 'site' && (
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
          >
            사이트 설정 저장하기
          </button>
        )}
      </div>

      {/* Main Mode Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('site')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'site'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">domain</span>
          🏛️ 회사정보 & 브랜드 기본 설정
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'seo'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">search</span>
          🔍 SEO 검색엔진 최적화 & 소셜 메타태그 관리
        </button>
      </div>

      {activeTab === 'seo' ? (
        <SEOManagement />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Brand Name, Favicon & Contact Us & Resend Email Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Brand Name & Favicon */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant space-y-4">
            <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-[20px] text-amber-700">badge</span>
              회사 / 브랜드명 및 파비콘 설정
            </h3>
            
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">한국어 브랜드명 (KR)</label>
              <input
                type="text"
                value={brandNameKo}
                onChange={(e) => setBrandNameKo(e.target.value)}
                placeholder="조선미녀"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">영문 브랜드명 (Header Logo EN)</label>
              <input
                type="text"
                value={brandNameEn}
                onChange={(e) => setBrandNameEn(e.target.value)}
                placeholder="BEAUTY OF JOSEON"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-bold tracking-wider font-serif uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">파비콘 (Favicon) 이미지 URL 또는 직접 등록</label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={faviconUrl}
                  onChange={(e) => setFaviconUrl(e.target.value)}
                  placeholder="https://example.com/favicon.png 또는 파일 선택"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                />
                
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    파비콘 파일 직접 업로드 (최대 1MB)
                    <input
                      type="file"
                      accept="image/png, image/svg+xml, image/x-icon, image/jpeg"
                      onChange={handleFaviconUpload}
                      className="hidden"
                    />
                  </label>
                  {faviconUrl && (
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                      <img src={faviconUrl} alt="Favicon Preview" className="w-6 h-6 object-contain" />
                      <span className="text-[10px] text-slate-500 font-bold">미리보기</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Business & Contact Information Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant space-y-4">
            <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="material-symbols-outlined text-[20px] text-amber-700">domain</span>
              사업자 정보 고지 및 대표 연락처 설정
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">상호명 (법인/사업자명)</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="주식회사 조선미녀"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">사업자등록번호</label>
                <input
                  type="text"
                  value={businessRegNum}
                  onChange={(e) => setBusinessRegNum(e.target.value)}
                  placeholder="120-88-99881"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">통신판매업 신고번호</label>
                <input
                  type="text"
                  value={ecommerceNum}
                  onChange={(e) => setEcommerceNum(e.target.value)}
                  placeholder="2026-서울강남-01928호"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">사업장 주소지</label>
                <input
                  type="text"
                  value={contactAddress}
                  onChange={(e) => setContactAddress(e.target.value)}
                  placeholder="서울특별시 강남구 테헤란로 521, 조선미녀 타워"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">대표 전화번호</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="1544-0000"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">대표 이메일</label>
                  <input
                    type="text"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="help@beautyofjoseon.com"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">개인정보보호책임자</label>
                <input
                  type="text"
                  value={privacyOfficer}
                  onChange={(e) => setPrivacyOfficer(e.target.value)}
                  placeholder="정보보호관리팀장 또는 홍길동 팀장"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Email Service Configuration (Resend API) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-amber-700">mail</span>
                이메일 발송 서비스 (Resend API)
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                3,000건/월 무료
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">이메일 서비스 제공업체 선택</label>
              <select
                value={emailProvider}
                onChange={(e) => setEmailProvider(e.target.value as any)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-bold"
              >
                <option value="resend">Resend (추천 - 3,000건/월 무료, 초고속 REST API)</option>
                <option value="brevo">Brevo (Sendinblue - 9,000건/월 무료, 소규모 적합)</option>
                <option value="sendgrid">SendGrid (100건/일 무료)</option>
                <option value="smtp">커스텀 SMTP 서비스</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Resend API Key 입력</label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={emailApiKey}
                  onChange={(e) => setEmailApiKey(e.target.value)}
                  placeholder="re_123456789..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showApiKey ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                ※ <a href="https://resend.com/api-keys" target="_blank" rel="noreferrer" className="underline text-amber-800 font-bold">Resend 대시보드</a>에서 API Key를 무료 발급받아 입력하세요.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">발신자 이메일 주소 (From Email)</label>
              <input
                type="text"
                value={emailFromAddr}
                onChange={(e) => setEmailFromAddr(e.target.value)}
                placeholder="onboarding@resend.dev 또는 help@beautyofjoseon.com"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">발신자 표시 이름 (From Name)</label>
              <input
                type="text"
                value={emailFromName}
                onChange={(e) => setEmailFromName(e.target.value)}
                placeholder="조선미녀 고객지원팀"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
              />
            </div>

            <button
              type="button"
              onClick={handleTestEmailSend}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              이메일 발송 연동 테스트 (Test Dispatch)
            </button>
          </div>
        </div>

        {/* Right Side: Company Info Pages Editing */}
        <div className="lg:col-span-2 space-y-6">
          {/* CEO Message Edit */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant space-y-4">
            <h3 className="text-lg font-semibold text-on-surface border-b border-slate-100 pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-amber-700">person</span>
              대표이사 인사말 설정 (CEO Message Management)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">대표이사 성명 (CEO Name)</label>
                <input
                  type="text"
                  value={ceoName}
                  onChange={(e) => setCeoName(e.target.value)}
                  placeholder="구태원 대표이사 또는 이 미 녀"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">대표이사 직함 / 소속 (Position)</label>
                <input
                  type="text"
                  value={ceoPosition}
                  onChange={(e) => setCeoPosition(e.target.value)}
                  placeholder="주식회사 조선미녀 대표이사 (CEO & Founder)"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs"
                />
              </div>
            </div>

            {/* CEO Profile Photo Upload & Signature Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* CEO Profile Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">대표이사 프로필 사진 등록</label>
                <input
                  type="text"
                  value={ceoImageUrl}
                  onChange={(e) => setCeoImageUrl(e.target.value)}
                  placeholder="사진 URL 입력 또는 파일 직접 선택"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    대표이사 사진 파일 업로드 (최대 2MB)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCeoImageUpload}
                      className="hidden"
                    />
                  </label>
                  {ceoImageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-300 shrink-0">
                      <img src={ceoImageUrl} alt="CEO Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* CEO Signature / Stamp Image */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">대표이사 서명 / 인장 이미지 등록 (선택)</label>
                <input
                  type="text"
                  value={ceoSignatureUrl}
                  onChange={(e) => setCeoSignatureUrl(e.target.value)}
                  placeholder="서명 이미지 URL 또는 파일 선택"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
                <div className="flex items-center gap-3">
                  <label className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">draw</span>
                    서명 이미지 파일 업로드 (최대 1MB)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCeoSignatureUpload}
                      className="hidden"
                    />
                  </label>
                  {ceoSignatureUrl && (
                    <div className="h-8 p-1 bg-white rounded border border-slate-200 shrink-0">
                      <img src={ceoSignatureUrl} alt="Signature Preview" className="h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">인사말 핵심 헤드라인 (Greeting Title)</label>
              <input
                type="text"
                value={ceoTitle}
                onChange={(e) => setCeoTitle(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">인사말 본문 내용 (Message Content)</label>
              <textarea
                rows={6}
                value={ceoContent}
                onChange={(e) => setCeoContent(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-xs leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1">하단 서명 마무리 문구 (Sign-off Text)</label>
              <input
                type="text"
                value={ceoSignOff}
                onChange={(e) => setCeoSignOff(e.target.value)}
                placeholder="조선미녀 대표이사 구태원 드림"
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-bold"
              />
            </div>
          </div>

          {/* Company Overview Edit */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant">
            <h3 className="text-lg font-semibold text-on-surface mb-4">회사개요 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">브랜드 미션 (Mission)</label>
                <input
                  type="text"
                  value={overviewMission}
                  onChange={(e) => setOverviewMission(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">설립년도 (연도만)</label>
                  <input
                    type="text"
                    value={overviewEstYear}
                    onChange={(e) => setOverviewEstYear(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">임직원 수 (명)</label>
                  <input
                    type="text"
                    value={overviewEmployees}
                    onChange={(e) => setOverviewEmployees(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">글로벌 지사 수 (개)</label>
                  <input
                    type="text"
                    value={overviewGlobalOffices}
                    onChange={(e) => setOverviewGlobalOffices(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm text-center"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">사업영역 섹션 제목 (Business Section Title)</label>
                <input
                  type="text"
                  value={overviewBusinessTitle}
                  onChange={(e) => setOverviewBusinessTitle(e.target.value)}
                  placeholder="사업영역 (Business)"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">사업영역 상세 내용 (Business Description)</label>
                <textarea
                  rows={5}
                  value={overviewBusinessContent}
                  onChange={(e) => setOverviewBusinessContent(e.target.value)}
                  placeholder="사업 영역 및 주요 업무 내용을 입력하세요 (줄바꿈 구분 가능)"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-xs leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>

          {/* Careers Edit */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-outline-variant">
            <h3 className="text-lg font-semibold text-on-surface mb-4">채용정보 설정</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">채용 현황 요약</label>
                <input
                  type="text"
                  value={careerStatus}
                  onChange={(e) => setCareerStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">모집 부문 리스트 (줄바꿈 구분)</label>
                <textarea
                  rows={4}
                  value={careerPositions}
                  onChange={(e) => setCareerPositions(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:border-secondary text-sm resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
