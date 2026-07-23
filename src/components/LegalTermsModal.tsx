import { useState, useEffect } from 'react';

interface LegalTermsModalProps {
  type: 'terms' | 'privacy' | 'businessInfo' | null;
  onClose: () => void;
}

export function LegalTermsModal({ type, onClose }: LegalTermsModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'businessInfo'>(type || 'terms');

  // Business info states loaded from localStorage
  const [businessName, setBusinessName] = useState('주식회사 조선미녀');
  const [ceoName, setCeoName] = useState('구태원 대표이사');
  const [businessRegNum, setBusinessRegNum] = useState('120-88-99881');
  const [ecommerceNum, setEcommerceNum] = useState('2026-서울강남-01928호');
  const [contactAddress, setContactAddress] = useState('서울특별시 강남구 테헤란로 521, 조선미녀 타워');
  const [contactPhone, setContactPhone] = useState('1544-0000');
  const [contactEmail, setContactEmail] = useState('help@beautyofjoseon.com');
  const [privacyOfficer, setPrivacyOfficer] = useState('정보보호관리팀장');

  useEffect(() => {
    const savedBizName = localStorage.getItem('site_business_name');
    if (savedBizName) setBusinessName(savedBizName);

    const savedCeoName = localStorage.getItem('site_ceo_name');
    if (savedCeoName) setCeoName(savedCeoName);

    const savedReg = localStorage.getItem('site_business_reg_num');
    if (savedReg) setBusinessRegNum(savedReg);

    const savedEcom = localStorage.getItem('site_ecommerce_num');
    if (savedEcom) setEcommerceNum(savedEcom);

    const savedAddr = localStorage.getItem('site_contact_address');
    if (savedAddr) setContactAddress(savedAddr);

    const savedPhone = localStorage.getItem('site_contact_phone');
    if (savedPhone) setContactPhone(savedPhone);

    const savedEmail = localStorage.getItem('site_contact_email');
    if (savedEmail) setContactEmail(savedEmail);

    const savedOfficer = localStorage.getItem('site_privacy_officer');
    if (savedOfficer) setPrivacyOfficer(savedOfficer);
  }, []);

  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-slate-800">gavel</span>
            <h2 className="text-xl font-bold text-slate-900">
              {activeTab === 'terms' && '전자상거래 표준 이용약관 (Terms of Use)'}
              {activeTab === 'privacy' && '개인정보 처리방침 (Privacy Policy)'}
              {activeTab === 'businessInfo' && '사업자 정보 및 통신판매업 신고'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Legal Policy Navigation Tabs */}
        <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'terms' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            서비스 이용약관
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'privacy' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            개인정보 처리방침
          </button>
          <button
            onClick={() => setActiveTab('businessInfo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'businessInfo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            사업자 정보 고지
          </button>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 text-xs text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-200">
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">제1조 (목적)</h3>
              <p>
                본 약관은 {businessName}(이하 "회사")가 운영하는 인터넷 사이트 및 사이버몰(이하 "몰")에서 제공하는 전자상거래 관련 서비스(이하 "서비스")를 이용함에 있어 몰과 이용자의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>

              <h3 className="text-sm font-bold text-slate-900">제2조 (정의)</h3>
              <p>
                1. "몰"이란 회사가 재화 또는 용역을 이용자에게 제공하기 위하여 컴퓨터 등 정보통신설비를 이용하여 재화 등을 거래할 수 있도록 설정한 가상의 영업장을 말합니다.<br />
                2. "이용자"란 "몰"에 접속하여 이 약관에 따라 "몰"이 제공하는 서비스를 받는 회원 및 비회원을 말합니다.<br />
                3. "회원"이라 함은 "몰"에 개인정보를 제공하여 회원등록을 한 자로서, "몰"의 정보를 지속적으로 제공받으며, "몰"이 제공하는 서비스를 계속적으로 이용할 수 있는 자를 말합니다.
              </p>

              <h3 className="text-sm font-bold text-slate-900">제3조 (약관의 명시와 개정)</h3>
              <p>
                1. "몰"은 이 약관의 내용과 상호({businessName}), 영업소 소재지({contactAddress}), 대표자의 성명({ceoName}), 사업자등록번호({businessRegNum}), 연락처({contactPhone}) 등을 이용자가 알 수 있도록 사이트의 초기 서비스화면에 게시합니다.<br />
                2. "몰"은 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.
              </p>

              <h3 className="text-sm font-bold text-slate-900">제4조 (서비스의 제공 및 변경)</h3>
              <p>
                "몰"은 다음과 같은 업무를 수행합니다:<br />
                - 재화 또는 용역에 대한 정보 제공 및 구매계약의 체결<br />
                - 구매계약이 체결된 재화 또는 용역의 배송 및 물류 관리<br />
                - 기타 "몰"이 정하는 고객 유인 및 관련 업무
              </p>

              <h3 className="text-sm font-bold text-slate-900">제5조 (청약철회 및 환불)</h3>
              <p>
                1. "몰"과 재화등의 구매에 관한 계약을 체결한 이용자는 수령한 날로부터 7일 이내에 청약의 철회를 할 수 있습니다.<br />
                2. 단, 이용자에게 책임 있는 사유로 재화 등이 멸실 또는 훼손된 경우나 개봉 후 가치가 현저히 감소한 경우에는 청약철회가 제한될 수 있습니다.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">1. 개인정보의 수집 및 이용 목적</h3>
              <p>
                회사는 다음의 목적을 위하여 최소한의 개인정보를 수집 및 처리합니다:<br />
                - 회원 가입 및 본인 확인, 고객 상담 서비스 제공<br />
                - 주문 상품의 결제, 배송 및 물류 상태 안내<br />
                - 개인 맞춤형 뷰티 컨설팅 및 이벤트 프로모션 정보 안내
              </p>

              <h3 className="text-sm font-bold text-slate-900">2. 수집하는 개인정보 항목</h3>
              <p>
                - 필수항목: 성명, 이메일 주소, 비밀번호(Web Crypto SHA-256 암호화 보관), 휴대폰 번호, 배송지 주소<br />
                - 자동수집항목: IP Address, 쿠키(Cookie), 서비스 이용 기록, 방문 기록
              </p>

              <h3 className="text-sm font-bold text-slate-900">3. 개인정보의 보유 및 파기</h3>
              <p>
                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 전자상거래법 등 관련 법령에 의하여 보존할 필요가 있는 경우 지정된 기간 동안 보관합니다:<br />
                - 계약 또는 청약철회 등에 관한 기록: 5년<br />
                - 대금결제 및 재화 등의 공급에 관한 기록: 5년<br />
                - 소비자의 불만 또는 분쟁처리에 관한 기록: 3년
              </p>

              <h3 className="text-sm font-bold text-slate-900">4. 개인정보 보호책임자 및 상담창구</h3>
              <p>
                - 개인정보 보호책임자: {privacyOfficer}<br />
                - 이메일 문의: {contactEmail}<br />
                - 고객센터: {contactPhone} (평일 09:00 ~ 18:00)
              </p>
            </div>
          )}

          {activeTab === 'businessInfo' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">상호명 / 대표자</span>
                  <span className="text-slate-600 font-bold">{businessName} / {ceoName}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">사업자등록번호</span>
                  <span className="text-slate-600 font-mono">{businessRegNum} <a href="https://www.ftc.go.kr" target="_blank" rel="noreferrer" className="text-slate-400 underline ml-1">[사업자정보확인]</a></span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">통신판매업 신고번호</span>
                  <span className="text-slate-600">{ecommerceNum}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">주소지</span>
                  <span className="text-slate-600">{contactAddress}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">고객센터 문의</span>
                  <span className="text-slate-600">{contactPhone} ({contactEmail})</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800 block mb-0.5">개인정보보호책임자</span>
                  <span className="text-slate-600">{privacyOfficer}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
