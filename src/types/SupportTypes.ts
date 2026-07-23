export interface FAQItem {
  id: string;
  category: '배송/택배' | '주문/결제' | '취소/반품/교환' | '제품/성분' | '회원/혜택';
  question: string;
  answer: string;
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerEmail: string;
  category: string;
  subject: string;
  message: string;
  status: '접수완료' | '답변완료';
  replyContent?: string;
  createdAt: string;
  repliedAt?: string;
}

export const initialFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    category: '배송/택배',
    question: '배송 기간은 얼마나 걸리나요?',
    answer: '평일 오후 2시 이전 결제 완료 건은 당일 출고되며, 일반적으로 영업일 기준 1~3일 이내에 배송이 완료됩니다. (택배사: CJ대한통운, 로젠택배, 한진택배)',
    createdAt: '2026.07.20',
  },
  {
    id: 'faq-2',
    category: '배송/택배',
    question: '비회원도 배송 조회가 가능한가요?',
    answer: '네, 가능합니다. 사이트 하단 마이페이지(My Page) 탭의 [비회원 배송조회] 메뉴에서 주문 시 작성하신 이메일과 주문번호(예: ORD-2026...)를 입력하시면 실시간 배송 및 송장 조회가 가능합니다.',
    createdAt: '2026.07.21',
  },
  {
    id: 'faq-3',
    category: '주문/결제',
    question: '주문 취소 및 변경은 어떻게 하나요?',
    answer: '주문 상태가 [주문접수] 단계인 경우에만 마이페이지 또는 고객센터 1:1 문의를 통해 취소가 가능합니다. 이미 [배송중] 단계로 전환된 경우 반품 절차로 진행해주셔야 합니다.',
    createdAt: '2026.07.22',
  },
  {
    id: 'faq-4',
    category: '제품/성분',
    question: '조선미녀 제품은 비건(Vegan) 및 붉은팥 PDRN 성분인가요?',
    answer: '네, 조선미녀의 붉은팥 PDRN 세럼 및 스킨케어 라인은 동물성 원료를 배제한 100% 비건 성분과 조선 시대 전통 한방 특허 원료를 바탕으로 제조됩니다.',
    createdAt: '2026.07.22',
  },
  {
    id: 'faq-5',
    category: '취소/반품/교환',
    question: '반품 및 교환 배송비는 얼마인가요?',
    answer: '단순 변심으로 인한 반품의 경우 왕복 배송비(6,000원)가 차감 후 환불되며, 제품 오배송 또는 불량에 의한 교환/반품은 배송비가 전액 무료입니다.',
    createdAt: '2026.07.23',
  },
];

export const initialInquiries: CustomerInquiry[] = [
  {
    id: 'inq-1001',
    customerName: '김민지 님',
    customerEmail: 'minji_beauty@gmail.com',
    category: '배송/택배',
    subject: '해외 배송 가능 여부 문의드립니다.',
    message: '미국 뉴욕 주소지로 해외 직배송이 가능한가요?',
    status: '답변완료',
    replyContent: '안녕하세요 김민지 고객님! 조선미녀 공식몰은 글로벌 EMS 및 DHL 직배송 서비스를 지원합니다. 해외 결제 페이지를 이용해 주세요.',
    createdAt: '2026.07.21 14:20',
    repliedAt: '2026.07.21 15:40',
  },
];
