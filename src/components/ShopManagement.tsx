import { useState, useEffect, FormEvent } from 'react';
import { FAQItem, CustomerInquiry, initialFAQs, initialInquiries } from '../types/SupportTypes';
import { sendInquiryReplyEmail } from '../services/emailService';
import { TossPaymentsConfig, getTossPaymentsConfig, saveTossPaymentsConfig } from '../lib/tossPayments';

export function ShopManagement() {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'faq' | 'payment'>('inquiry');

  // Toss Payments PG Config State
  const [tossConfig, setTossConfig] = useState<TossPaymentsConfig>(getTossPaymentsConfig());

  // FAQs & Inquiries State
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);

  // FAQ Modal State
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [faqCategory, setFaqCategory] = useState<FAQItem['category']>('배송/택배');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Inquiry Reply State
  const [replyingInquiry, setReplyingInquiry] = useState<CustomerInquiry | null>(null);
  const [replyText, setReplyText] = useState('');

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
      localStorage.setItem('support_faqs', JSON.stringify(initialFAQs));
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
      localStorage.setItem('customer_inquiries', JSON.stringify(initialInquiries));
    }
  }, []);

  const saveFaqs = (newFaqs: FAQItem[]) => {
    setFaqs(newFaqs);
    localStorage.setItem('support_faqs', JSON.stringify(newFaqs));
  };

  const saveInquiries = (newInq: CustomerInquiry[]) => {
    setInquiries(newInq);
    localStorage.setItem('customer_inquiries', JSON.stringify(newInq));
  };

  // FAQ Handlers
  const handleOpenFaqModal = (item?: FAQItem) => {
    if (item) {
      setEditingFaq(item);
      setFaqCategory(item.category);
      setFaqQuestion(item.question);
      setFaqAnswer(item.answer);
    } else {
      setEditingFaq(null);
      setFaqCategory('배송/택배');
      setFaqQuestion('');
      setFaqAnswer('');
    }
    setShowFaqModal(true);
  };

  const handleSaveFaq = (e: FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

    if (editingFaq) {
      const updated = faqs.map((f) =>
        f.id === editingFaq.id
          ? { ...f, category: faqCategory, question: faqQuestion.trim(), answer: faqAnswer.trim() }
          : f
      );
      saveFaqs(updated);
    } else {
      const newFaq: FAQItem = {
        id: `faq-${Date.now()}`,
        category: faqCategory,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        createdAt: dateStr,
      };
      saveFaqs([newFaq, ...faqs]);
    }

    setShowFaqModal(false);
  };

  const handleDeleteFaq = (id: string) => {
    if (window.confirm('이 FAQ 질문 항목을 삭제하시겠습니까?')) {
      const updated = faqs.filter((f) => f.id !== id);
      saveFaqs(updated);
    }
  };

  // Reply Handler
  const handleSendReply = async (inquiryId: string) => {
    if (!replyText.trim()) {
      alert('답변 내용을 입력해 주세요.');
      return;
    }

    const targetInquiry = inquiries.find((i) => i.id === inquiryId);
    if (!targetInquiry) return;

    const today = new Date();
    const formattedTime = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

    const updated = inquiries.map((inq) => {
      if (inq.id === inquiryId) {
        return {
          ...inq,
          status: '답변완료' as const,
          replyContent: replyText.trim(),
          repliedAt: formattedTime,
        };
      }
      return inq;
    });

    saveInquiries(updated);
    setReplyingInquiry(null);

    // Send Resend Email Dispatch
    const emailResult = await sendInquiryReplyEmail({
      toEmail: targetInquiry.customerEmail,
      customerName: targetInquiry.customerName,
      subject: targetInquiry.subject,
      replyContent: replyText.trim(),
    });

    setReplyText('');
    alert(`[답변 등록 완료]\n${emailResult.message}`);
  };

  const pendingInquiriesCount = inquiries.filter((i) => i.status === '접수완료').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">쇼핑몰 관리 및 고객지원 (Shopping Mall & Customer Support)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            쇼핑몰 운영 권한 직원이 **1:1 고객 온라인 문의 답변** 및 **자주 묻는 질문(FAQ) 등록**을 관리합니다.
          </p>
        </div>
        {activeTab === 'faq' && (
          <button
            onClick={() => handleOpenFaqModal()}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            신규 FAQ 등록
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-outline-variant overflow-x-auto">
        <button
          onClick={() => setActiveTab('inquiry')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'inquiry'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">forum</span>
          1:1 고객 온라인 문의 ({pendingInquiriesCount}건 미처리)
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'payment'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">credit_card</span>
          💳 토스페이먼츠 PG 결제 연동 설정
        </button>
      </div>

      {/* TAB 3: 토스페이먼츠 PG 결제 연동 설정 */}
      {activeTab === 'payment' && (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[24px] text-blue-600">payments</span>
                토스페이먼츠 (Toss Payments) 지급결제(PG) 설정
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                공식 토스페이먼츠 API Key (Client Key, Secret Key) 및 가맹점 정보를 등록하여 자사몰 메인 결제 시스템으로 반영합니다.
              </p>
            </div>
            <button
              onClick={() => {
                saveTossPaymentsConfig(tossConfig);
                alert('토스페이먼츠 PG 지급결제 설정이 저장되었습니다!');
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              PG 설정 저장하기
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Key & Toggle Settings */}
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">토스페이먼츠 PG 연동 활성화</span>
                  <span className="text-[11px] text-slate-500">체크 시 장바구니 결제창에서 토스페이먼츠 결제호출을 실행합니다.</span>
                </div>
                <input
                  type="checkbox"
                  checked={tossConfig.isEnabled}
                  onChange={(e) => setTossConfig({ ...tossConfig, isEnabled: e.target.checked })}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  클라이언트 키 (Client Key) <span className="text-rose-500">*필수</span>
                </label>
                <input
                  type="text"
                  value={tossConfig.clientKey}
                  onChange={(e) => setTossConfig({ ...tossConfig, clientKey: e.target.value })}
                  placeholder="test_ck_..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 font-bold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  토스페이먼츠 상점 관리자(https://developers.tosspayments.com) API 키 메뉴에서 발급받은 API Client Key입니다.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  시크릿 키 (Secret Key) <span className="text-slate-400">(백엔드 승인/취소용)</span>
                </label>
                <input
                  type="password"
                  value={tossConfig.secretKey}
                  onChange={(e) => setTossConfig({ ...tossConfig, secretKey: e.target.value })}
                  placeholder="test_sk_..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Right: MID & Method Settings */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">가맹점 표시 상호명 (MID / Shop Name)</label>
                <input
                  type="text"
                  value={tossConfig.mid}
                  onChange={(e) => setTossConfig({ ...tossConfig, mid: e.target.value })}
                  placeholder="조선미녀 공식몰"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">기본 결제 방식 (Default Payment Method)</label>
                <select
                  value={tossConfig.defaultMethod}
                  onChange={(e) => setTossConfig({ ...tossConfig, defaultMethod: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                >
                  <option value="카드">신용 · 체크카드 (국내/해외 카드)</option>
                  <option value="토스페이">토스페이 (TossPay 간편결제)</option>
                  <option value="계좌이체">실시간 계좌이체</option>
                  <option value="가상계좌">가상계좌 (무통장 입금)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">verified</span>
                  토스페이먼츠 API 연동 가이드
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  • 장바구니에서 결제 진행 시 토스페이먼츠 SDK V1/V2가 연동됩니다.<br />
                  • 결제 완료 시 13가지 결제 상세 필드(<code className="font-mono text-blue-700">order_id</code>, <code className="font-mono text-blue-700">payment_key</code>, <code className="font-mono text-blue-700">transaction_id</code>, <code className="font-mono text-blue-700">amount</code>, <code className="font-mono text-blue-700">vat</code>, <code className="font-mono text-blue-700">status</code> 등)가 Supabase DB <code className="font-mono text-blue-700">payments</code> 테이블에 자동으로 저장됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: 1:1 고객 온라인 문의 답변 */}
      {activeTab === 'inquiry' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">고객 1:1 온라인 문의 내역 ({inquiries.length}건)</span>
          </div>

          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-800 rounded-full">
                      {inq.category}
                    </span>
                    <span className="font-bold text-sm text-slate-900">{inq.subject}</span>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    inq.status === '답변완료' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {inq.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500 flex justify-between">
                  <span>작성자: **{inq.customerName}** ({inq.customerEmail})</span>
                  <span>{inq.createdAt}</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-800 border border-slate-200">
                  <p className="font-bold text-slate-900 mb-1">💬 고객 문의 내용</p>
                  <p className="whitespace-pre-line">{inq.message}</p>
                </div>

                {inq.replyContent ? (
                  <div className="bg-emerald-50 p-4 rounded-xl text-xs text-emerald-950 border border-emerald-200 space-y-1">
                    <div className="flex justify-between font-bold text-emerald-900">
                      <span>✅ 답변 완료 내용 (Resend 이메일 발송됨)</span>
                      <span className="text-[11px] font-normal text-emerald-700">{inq.repliedAt}</span>
                    </div>
                    <p className="whitespace-pre-line">{inq.replyContent}</p>
                  </div>
                ) : replyingInquiry?.id === inq.id ? (
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-300 space-y-3">
                    <label className="block text-xs font-bold text-amber-900">1:1 문의 답변 작성 (Resend 이메일 자동전송)</label>
                    <textarea
                      rows={3}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="고객 이메일로 수신될 답변 내용을 상세히 입력하세요."
                      className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs focus:outline-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setReplyingInquiry(null)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSendReply(inq.id)}
                        className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                      >
                        답변 등록 및 이메일 전송
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setReplyingInquiry(inq);
                      setReplyText('');
                    }}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
                  >
                    ✏️ 답변 작성하기
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: FAQ 관리 */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-700">쇼핑몰 고객센터 FAQ 항목 ({faqs.length}개)</span>
            <button
              onClick={() => handleOpenFaqModal()}
              className="px-3.5 py-1.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800 transition-colors"
            >
              + 새 FAQ 등록하기
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {faqs.map((f) => (
              <div key={f.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-start gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-900 rounded-full">
                      {f.category}
                    </span>
                    <span className="text-[11px] text-slate-400">{f.createdAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Q. {f.question}</h4>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                    A. {f.answer}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenFaqModal(f)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(f.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              {editingFaq ? 'FAQ 항목 수정' : '신규 FAQ 항목 등록'}
            </h3>

            <form onSubmit={handleSaveFaq} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">카테고리</label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="배송/택배">배송/택배</option>
                  <option value="주문/결제">주문/결제</option>
                  <option value="취소/반품/교환">취소/반품/교환</option>
                  <option value="제품/성분">제품/성분</option>
                  <option value="회원/혜택">회원/혜택</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">질문 (Question)</label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="자주 묻는 질문 내용 입력"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">답변 (Answer)</label>
                <textarea
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="친절하고 정확한 답변 내용을 입력하세요"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                  required
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowFaqModal(false)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 shadow-md"
                >
                  {editingFaq ? '수정 완료' : '등록 완료'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
