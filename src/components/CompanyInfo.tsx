import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function CompanyInfo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  // Configurable states loaded from localStorage
  const [ceoName, setCeoName] = useState('이소희 대표이사');
  const [ceoPosition, setCeoPosition] = useState('주식회사 원데이즈뷰티 대표이사 (CEO & Founder)');
  const [ceoImageUrl, setCeoImageUrl] = useState('');
  const [ceoSignatureUrl, setCeoSignatureUrl] = useState('');
  const [ceoTitle, setCeoTitle] = useState('자연의 지혜와 정성을 가득 담아 피부 본연의 아름다움을 선물합니다.');
  const [ceoContent, setCeoContent] = useState('안녕하십니까, 원데이즈뷰티(OneDays Beauty) 대표이사 이소희입니다.\n\n저희 브랜드는 한방 화장품의 고루한 이미지를 탈피하여 현대인들이 부담 없이 스킨케어를 즐길 수 있도록 전통과 현대의 조화를 탐구해 왔습니다.\n\n조선 시대 여성들의 단아하고 기품 있는 피부 관리 방식을 현대적인 처방으로 재해석하여, 맑고 투명한 피부 본연의 힘을 되찾아 드리는 것이 저희의 사명입니다.\n\n언제나 좋은 원료와 정직한 제조를 바탕으로 고객 여러분의 신뢰에 보답하겠습니다. 늘 함께해 주셔서 감사합니다.');
  const [ceoSignOff, setCeoSignOff] = useState('원데이즈뷰티 대표이사 이소희 드림');

  const [overviewMission, setOverviewMission] = useState('전통 한방 원료에 현대적 기술을 결합하여 현대인의 피부 고민을 덜어주는 클린 뷰티의 글로벌 스탠다드');
  const [overviewEstYear, setOverviewEstYear] = useState('2020');
  const [overviewEmployees, setOverviewEmployees] = useState('120');
  const [overviewGlobalOffices, setOverviewGlobalOffices] = useState('3');
  const [businessTitle, setBusinessTitle] = useState('사업영역 (Business)');
  const [businessContent, setBusinessContent] = useState('조선미녀는 조선 시대 여성들이 피부를 맑고 투명하게 가꾸기 위해 자연에서 얻은 원료를 활용했던 지혜에 영감을 받았습니다. 인삼, 쌀, 벌꿀 등 전통적인 한방 성분을 엄선하고 현대적인 포뮬러 기술을 결합하여 현대 스킨케어 고민을 자극 없이 해결하는 라이프스타일 뷰티 브랜드입니다.\n\n현재 아시아뿐만 아니라 미주, 유럽 등 전 세계 다양한 국가에서 사랑받으며 한국 전통 스킨케어의 아름다움을 글로벌 시장에 널리 알리고 있습니다.');

  const [careerStatus, setCareerStatus] = useState('현재 마케팅 및 글로벌 영업 직군 채용이 활발하게 진행 중입니다.');
  const [careerPositions, setCareerPositions] = useState('• [신입/경력] 글로벌 브랜드 마케터 (영어가능자 필수)\n• [경력] 국내/해외 화장품 상품 기획자 (BM)\n• [신입/경력] 자사몰 퍼포먼스 마케팅 담당자');

  const [contactAddress, setContactAddress] = useState('서울특별시 종로구 율곡로 10길 (운니동, 한방빌딩 4층)');
  const [contactPhone, setContactPhone] = useState('02-1234-5678');
  const [contactEmail, setContactEmail] = useState('support@beautyofjoseon.com');

  useEffect(() => {
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

    const savedBusinessTitle = localStorage.getItem('site_overview_business_title');
    if (savedBusinessTitle) setBusinessTitle(savedBusinessTitle);

    const savedBusinessContent = localStorage.getItem('site_overview_business_content');
    if (savedBusinessContent) setBusinessContent(savedBusinessContent);

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
  }, []);

  const tabs = [
    { id: 'overview', name: '회사개요 (Overview)' },
    { id: 'ceo', name: '대표이사 인사말 (CEO Message)' },
    { id: 'careers', name: '채용정보 (Careers)' },
    { id: 'contact', name: '찾아오시는 길 (Contact Us)' },
  ];

  return (
    <div className="pt-6 pb-16 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Page Title */}
      <div className="text-center mb-10">
        <span className="text-xs font-bold text-[#D9779B] uppercase tracking-widest block mb-2">About Us</span>
        <h1 className="text-3xl md:text-4xl font-serif text-[#8C3A5A] font-bold tracking-wide">Company Info</h1>
        <div className="w-12 h-1 bg-[#8C3A5A] mx-auto mt-3 rounded-full"></div>
      </div>

      {/* Tabs Menu */}
      <div className="flex justify-center border-b border-[#F3E8EC] mb-10 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSearchParams({ tab: tab.id })}
            className={`px-6 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === tab.id
              ? 'border-[#8C3A5A] text-[#8C3A5A] font-bold'
              : 'border-transparent text-[#7C6E74] hover:text-[#8C3A5A]'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="bg-white border border-[#F3E8EC] card-elevation p-6 md:p-12 min-h-[400px] transition-all">
        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Headline Banner */}
            <div className="text-center py-6 border-b border-[#F3E8EC]">
              <h2 className="text-xl md:text-2xl font-serif text-[#8C3A5A] leading-relaxed max-w-3xl mx-auto font-bold">
                "{overviewMission}"
              </h2>
            </div>

            {/* Key stats infographic */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 text-center pt-4">
              <div className="p-4 bg-[#F3E8EC]/60 rounded-2xl border border-[#F3E8EC]">
                <span className="block text-2xl md:text-4xl font-serif text-[#8C3A5A] mb-1 font-bold">{overviewEstYear}</span>
                <span className="text-xs text-[#7C6E74] uppercase tracking-wider font-semibold">설립년도</span>
              </div>
              <div className="p-4 bg-[#F3E8EC]/60 rounded-2xl border border-[#F3E8EC]">
                <span className="block text-2xl md:text-4xl font-serif text-[#8C3A5A] mb-1 font-bold">{overviewEmployees}+</span>
                <span className="text-xs text-[#7C6E74] uppercase tracking-wider font-semibold">임직원 수</span>
              </div>
              <div className="p-4 bg-[#F3E8EC]/60 rounded-2xl border border-[#F3E8EC]">
                <span className="block text-2xl md:text-4xl font-serif text-[#8C3A5A] mb-1 font-bold">{overviewGlobalOffices}</span>
                <span className="text-xs text-[#7C6E74] uppercase tracking-wider font-semibold">글로벌 지사</span>
              </div>
            </div>

            {/* Business Area Block */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-slate-800 pl-3">
                {businessTitle}
              </h3>
              {businessContent.split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ceo' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* CEO Title */}
            <h2 className="text-xl md:text-2xl font-serif text-slate-900 leading-relaxed border-b border-slate-100 pb-6">
              "{ceoTitle}"
            </h2>

            {/* CEO Profile Photo & Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
              {/* Profile Photo */}
              <div className="md:col-span-1 flex flex-col items-center">
                {ceoImageUrl ? (
                  <div className="w-36 h-48 md:w-full md:h-60 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                    <img src={ceoImageUrl} alt={ceoName} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-36 h-36 md:w-full aspect-square bg-[#fbf9f6] border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <span className="material-symbols-outlined text-[48px] text-slate-300 mb-1">person</span>
                    <span className="text-xs font-bold text-slate-500">{ceoName}</span>
                  </div>
                )}
                <div className="mt-3 text-center">
                  <p className="text-xs font-bold text-slate-900">{ceoName}</p>
                  <p className="text-[11px] text-slate-400">{ceoPosition}</p>
                </div>
              </div>

              {/* Message Text & Signature */}
              <div className="md:col-span-3 space-y-4">
                {ceoContent.split('\n\n').map((para, i) => (
                  <p key={i} className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                    {para}
                  </p>
                ))}

                <div className="pt-6 border-t border-slate-100 flex justify-between items-end flex-wrap gap-4 font-serif">
                  <div>
                    <p className="text-xs text-slate-400">{ceoPosition}</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">{ceoName}</p>
                  </div>

                  {ceoSignatureUrl ? (
                    <div className="h-12 flex items-center">
                      <img src={ceoSignatureUrl} alt="Signature" className="h-full object-contain" />
                    </div>
                  ) : (
                    <p className="text-sm font-semibold text-slate-900 italic font-sans">
                      {ceoSignOff || `${ceoName} 드림`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'careers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Current Openings Banner */}
            <div className="p-6 bg-[#fbf9f6] border border-slate-200/50 rounded-xl flex items-center gap-4">
              <span className="material-symbols-outlined text-[32px] text-slate-800">campaign</span>
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">채용 현황 안내</h3>
                <p className="text-xs text-slate-500 mt-0.5">{careerStatus}</p>
              </div>
            </div>

            {/* Openings */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-slate-800 pl-3">현재 모집 중인 직무</h3>
              <div className="bg-[#fbf9f6] p-6 rounded-xl border border-slate-100">
                <pre className="font-sans text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {careerPositions}
                </pre>
              </div>
            </div>

            {/* Benefits & Culture */}
            <div className="space-y-6 pt-4">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-slate-800 pl-3">근무 환경 및 복지</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <span className="material-symbols-outlined text-slate-800 text-[24px] mb-2">work_history</span>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">유연근무제 운영</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">각자의 라이프 스타일에 맞춘 유연한 출퇴근 시간을 지원합니다.</p>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <span className="material-symbols-outlined text-slate-800 text-[24px] mb-2">rewarded_ads</span>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">성장 및 교육비 지원</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">세미나, 도서 구매, 어학 학습 등 직무 역량 강화를 전폭적으로 지원합니다.</p>
                </div>
                <div className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs">
                  <span className="material-symbols-outlined text-slate-800 text-[24px] mb-2">favorite</span>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">정기 종합 건강검진</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">임직원의 건강과 안정을 위해 매년 전문 검진 센터를 통한 검진을 지원합니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Map Placeholder */}
            <div className="w-full aspect-[21/9] bg-[#fbf9f6] border border-slate-200 rounded-xl overflow-hidden flex flex-col items-center justify-center text-slate-400 gap-2">
              <span className="material-symbols-outlined text-[36px]">map</span>
              <span className="text-sm font-medium">지도 서비스 준비중 (Map Service Placeholder)</span>
              <span className="text-xs text-slate-400">{contactAddress}</span>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="flex gap-4 items-start p-5 bg-[#fbf9f6] rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-slate-800 text-[24px]">location_on</span>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">찾아오시는 길</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{contactAddress}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-[#fbf9f6] rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-slate-800 text-[24px]">call</span>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">대표 번호</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{contactPhone}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-5 bg-[#fbf9f6] rounded-xl border border-slate-100">
                <span className="material-symbols-outlined text-slate-800 text-[24px]">mail</span>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-1">이메일 문의</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{contactEmail}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
