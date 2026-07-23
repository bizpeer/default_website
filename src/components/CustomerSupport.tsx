import { useState, useEffect, FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FAQItem, CustomerInquiry, initialFAQs, initialInquiries } from '../types/SupportTypes';

export function CustomerSupport() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'inquiry' ? 'inquiry' : 'faq';

  const [activeTab, setActiveTab] = useState<'faq' | 'inquiry'>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);

  // Inquiry Form state
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCategory, setCustCategory] = useState('배송/택배');
  const [custSubject, setCustSubject] = useState('');
  const [custMessage, setCustMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // FAQs
    const savedFaqs = localStorage.getItem('support_faqs');
    if (savedFaqs) {
      try {
        setFaqs(JSON.parse(savedFaqs));
      } catch (e) {
        setFaqs(initialFAQs);
      }
    } else {
      setFaqs(initialFAQs);
    }

    // Inquiries
    const savedInq = localStorage.getItem('customer_inquiries');
    if (savedInq) {
      try {
        setInquiries(JSON.parse(savedInq));
      } catch (e) {
        setInquiries(initialInquiries);
      }
    } else {
      setInquiries(initialInquiries);
    }

    // Auto fill customer login email if available
    const loggedCust = localStorage.getItem('customer_logged_in_user');
    if (loggedCust) {
      try {
        const u = JSON.parse(loggedCust);
        setCustName(u.name.replace(' 님', ''));
        setCustEmail(u.email);
      } catch (e) {
        // default
      }
    }
  }, []);

  const handleInquirySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custEmail.trim() || !custSubject.trim() || !custMessage.trim()) {
      alert('모든 필수 정보를 입력해 주세요.');
      return;
    }

    const today = new Date();
    const formattedTime = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    const newInquiry: CustomerInquiry = {
      id: `inq-${Date.now()}`,
      customerName: custName.trim(),
      customerEmail: custEmail.trim(),
      category: custCategory,
      subject: custSubject.trim(),
      message: custMessage.trim(),
      status: '접수완료',
      createdAt: formattedTime,
    };

    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('customer_inquiries', JSON.stringify(updated));

    setSubmitSuccess(true);
    setCustSubject('');
    setCustMessage('');
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesKw = item.question.toLowerCase().includes(searchKeyword.toLowerCase()) || item.answer.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCat && matchesKw;
  });

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      {/* Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-serif tracking-widest text-slate-900 mb-2">CUSTOMER SUPPORT</h1>
        <p className="text-sm text-slate-500">조선미녀 고객센터 - 자주 묻는 질문 및 1:1 상담 문의</p>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-3.5 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'faq'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          자주 묻는 질문 (FAQ)
        </button>
        <button
          onClick={() => setActiveTab('inquiry')}
          className={`flex-1 py-3.5 text-sm font-bold transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'inquiry'
              ? 'border-slate-900 text-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">mail</span>
          1:1 고객 문의하기 (Contact Us)
        </button>
      </div>

      {/* TAB 1: FAQ Section */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">search</span>
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="궁금하신 내용을 입력해보세요 (예: 배송, 반품, 비회원, PDRN)"
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex gap-2 flex-wrap pt-2">
              {['All', '배송/택배', '주문/결제', '취소/반품/교환', '제품/성분', '회원/혜택'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat === 'All' ? '전체 보기' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 font-bold">
                검색 결과에 해당하는 FAQ 질문이 없습니다.
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 pr-4">
                        <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-900 rounded-lg shrink-0">
                          {faq.category}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{faq.question}</span>
                      </div>
                      <span className="material-symbols-outlined text-[20px] text-slate-400 shrink-0">
                        {isExpanded ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 bg-slate-50/70 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2 animate-in fade-in duration-200">
                        <div className="flex gap-2">
                          <span className="font-bold text-amber-800 text-sm">A.</span>
                          <p className="pt-0.5 whitespace-pre-line">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 2: 1:1 Customer Inquiry */}
      {activeTab === 'inquiry' && (
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {submitSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[36px]">mark_email_read</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">1:1 문의가 성공적으로 접수되었습니다!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                담당 직원이 확인 후 작성해주신 이메일({custEmail})로 신속히 답변 드리겠습니다.
              </p>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                추가 문의 작성하기
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-900">1:1 온라인 고객 상담 문의</h3>
                <p className="text-xs text-slate-500 mt-1">제품, 배송, 반품 등 궁금하신 점을 남겨주시면 친절히 안내해 드립니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">성명 <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">답변 수신용 이메일 <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">문의 유형</label>
                <select
                  value={custCategory}
                  onChange={(e) => setCustCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900 font-medium"
                >
                  <option value="배송/택배">배송/택배 문의</option>
                  <option value="주문/결제">주문/결제 문의</option>
                  <option value="취소/반품/교환">취소/반품/교환 문의</option>
                  <option value="제품/성분">제품/성분 문의</option>
                  <option value="기타">기타 문의</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">문의 제목 <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={custSubject}
                  onChange={(e) => setCustSubject(e.target.value)}
                  placeholder="문의 제목을 입력하세요"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">상세 문의 내용 <span className="text-rose-500">*</span></label>
                <textarea
                  rows={5}
                  value={custMessage}
                  onChange={(e) => setCustMessage(e.target.value)}
                  placeholder="궁금하신 내용을 구체적으로 작성해 주시면 보다 정확한 답변이 가능합니다."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-900 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all shadow-md mt-2"
              >
                1:1 문의 제출하기 ➔
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
