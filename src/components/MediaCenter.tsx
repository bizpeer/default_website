import { useState, useEffect } from 'react';

export interface MediaPost {
  id: string;
  title: string;
  category: '공지사항' | 'News Room' | '자료실';
  content: string;
  date: string;
  priority: number; // 1, 2, 3...
  isPinned: boolean;
  author: string;
  views: number;
  attachmentType?: 'youtube' | 'pdf' | 'image' | 'file';
  attachmentUrl?: string;
  attachmentName?: string;
  thumbnailUrl?: string;
}

export const initialMediaPosts: MediaPost[] = [
  {
    id: 'post-1',
    title: '조선미녀(Beauty of Joseon), 2026 글로벌 K-뷰티 브랜드 대상 수상',
    category: 'News Room',
    content: `조선미녀가 2026 글로벌 K-뷰티 혁신 브랜드 대상을 수상하였습니다. 조선 시대 전통 한방 원료에 현대적 기술을 결합하여 전 세계 소비자들에게 맑은 피부를 선사한 혁신적인 성과를 인정받았습니다. 앞으로도 정직한 원료와 뛰어난 스킨케어 기술력으로 보답하겠습니다.`,
    date: '2026.07.20',
    priority: 1,
    isPinned: true,
    author: '홍보팀',
    views: 3420,
    attachmentType: 'youtube',
    attachmentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&loop=1&playlist=dQw4w9WgXcQ',
    attachmentName: '2026 브랜드 대상 수상 기념 영상',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-2',
    title: '[공지] 2026 하반기 글로벌 신제품 라인업 공식 출시회 안내',
    category: '공지사항',
    content: `2026년 하반기 조선미녀의 글로벌 신제품 런칭 세미나가 개최됩니다. 인삼 및 쌀 추출물을 베이스로 한 프리미엄 스킨케어 신규 라인을 선보일 예정이오니 미디어 파트너 여러분의 많은 관심 부탁드립니다.`,
    date: '2026.07.15',
    priority: 2,
    isPinned: true,
    author: '경영지원팀',
    views: 1890,
    attachmentType: 'pdf',
    attachmentUrl: '#',
    attachmentName: '2026_Beauty_of_Joseon_New_Products.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-3',
    title: '[자료실] 조선미녀 공식 브랜드 가이드북 & CI 백터 로고 다운로드',
    category: '자료실',
    content: `공식 미디어 파트너사 및 글로벌 브랜드 콜라보레이션을 위한 고해상도 CI 벡터 로고 파일과 브랜드 가이드북(PDF)을 제공합니다. 사용 시 가이드라인을 준수해 주시기 바랍니다.`,
    date: '2026.07.10',
    priority: 3,
    isPinned: true,
    author: '디자인팀',
    views: 2450,
    attachmentType: 'file',
    attachmentUrl: '#',
    attachmentName: 'Beauty_of_Joseon_Brand_Assets_2026.zip',
    thumbnailUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-4',
    title: '[News Room] 미주 & 유럽 글로벌 팝업스토어 성황리 종료',
    category: 'News Room',
    content: `뉴욕, 파리, 런던에서 열린 2026 조선미녀 글로벌 체험 팝업스토어가 누적 방문객 10만 명을 돌파하며 성공적으로 마무리되었습니다.`,
    date: '2026.07.05',
    priority: 4,
    isPinned: false,
    author: '글로벌마케팅팀',
    views: 1200,
    attachmentType: 'image',
    attachmentUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80',
    attachmentName: '팝업스토어 현장 스케치 이미지',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-5',
    title: '[공지] 고객센터 시스템 점검에 따른 상담 서비스 일시 중단 안내',
    category: '공지사항',
    content: `더 안정적인 고객 지원 서비스 제공을 위해 서버 및 시스템 정기 점검이 진행됩니다. 점검 시간 동안 전화 및 1:1 상담 서비스가 일시 중단되오니 양해 부탁드립니다.`,
    date: '2026.06.28',
    priority: 5,
    isPinned: false,
    author: '고객지원팀',
    views: 950,
    attachmentType: 'pdf',
    attachmentUrl: '#',
    attachmentName: '시스템점검안내.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'post-6',
    title: '[자료실] 2026 ESG 지속가능경영 공식 보고서 (KOR/ENG)',
    category: '자료실',
    content: `친환경 포장재 도입 및 클린 뷰티 공정 강화를 담은 2026 조선미녀 ESG 지속가능경영 공식 보고서 국문 및 영문 버전입니다.`,
    date: '2026.06.18',
    priority: 6,
    isPinned: false,
    author: 'ESG위원회',
    views: 1580,
    attachmentType: 'pdf',
    attachmentUrl: '#',
    attachmentName: '2026_Beauty_of_Joseon_ESG_Report.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'
  }
];

export function MediaCenter() {
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [activeTab, setActiveTab] = useState<'전체' | '공지사항' | 'News Room' | '자료실'>('전체');
  const [selectedPost, setSelectedPost] = useState<MediaPost | null>(null);

  useEffect(() => {
    const savedPosts = localStorage.getItem('media_center_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts(initialMediaPosts);
        localStorage.setItem('media_center_posts', JSON.stringify(initialMediaPosts));
      }
    } else {
      setPosts(initialMediaPosts);
      localStorage.setItem('media_center_posts', JSON.stringify(initialMediaPosts));
    }
  }, []);

  // Sort by priority (1 is highest) for featured 3 items
  const featuredPosts = [...posts]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  // Filter posts based on active category tab
  const filteredPosts = activeTab === '전체' 
    ? posts 
    : posts.filter((p) => p.category === activeTab);

  return (
    <div className="pt-8 pb-16 max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Page Title Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-slate-900 tracking-wide mb-3">Media Center</h1>
        <p className="text-sm text-slate-500 uppercase tracking-widest font-medium">Beauty of Joseon News & Press</p>
      </div>

      {/* Top 3 Priority Featured Section */}
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
          <span className="material-symbols-outlined text-amber-600 text-2xl">star</span>
          <h2 className="text-xl font-serif font-bold text-slate-900">주요 보도 및 공지사항 (Top Highlights)</h2>
          <span className="text-xs text-slate-400 font-sans ml-2">관리자 지정 우선순위 상위 3개 게시물</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* Media Preview (YouTube Video or Image Thumbnail) */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {post.attachmentType === 'youtube' && post.attachmentUrl ? (
                  <iframe 
                    src={post.attachmentUrl}
                    title={post.title}
                    className="w-full h-full object-cover pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img 
                    src={post.thumbnailUrl || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <span className="text-amber-400">★ TOP {index + 1}</span>
                  <span className="opacity-40">|</span>
                  <span>{post.category}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                    <span>{post.date}</span>
                    <span>조회 {post.views}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-base group-hover:text-slate-700 transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {post.content.replace(/<[^>]*>?/gm, '')}
                  </p>
                </div>

                {/* Attachment Indicator */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <span className="material-symbols-outlined text-[16px] text-slate-500">
                    {post.attachmentType === 'youtube' ? 'smart_display' : post.attachmentType === 'pdf' ? 'picture_as_pdf' : post.attachmentType === 'image' ? 'image' : 'attach_file'}
                  </span>
                  <span className="truncate">{post.attachmentName || '첨부파일 제공'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Section Tabs (Company Info 스타일) */}
      <div className="flex justify-center border-b border-slate-200 mb-10 overflow-x-auto hide-scrollbar">
        {(['전체', '공지사항', 'News Room', '자료실'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-300 ${
              activeTab === tab
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            {tab} {tab !== '전체' && `(${posts.filter((p) => p.category === tab).length})`}
          </button>
        ))}
      </div>

      {/* Posts List Layout */}
      <div className="bg-white border border-slate-100 shadow-xs rounded-2xl overflow-hidden divide-y divide-slate-100">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            등록된 게시물이 없습니다.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="p-6 md:p-8 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center justify-between cursor-pointer group"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    post.category === '공지사항' 
                      ? 'bg-rose-100 text-rose-700' 
                      : post.category === 'News Room' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {post.category}
                  </span>
                  {post.isPinned && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">push_pin</span>
                      상단고정
                    </span>
                  )}
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                  {post.content.replace(/<[^>]*>?/gm, '')}
                </p>

                {post.attachmentName && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 mt-2">
                    <span className="material-symbols-outlined text-[14px]">
                      {post.attachmentType === 'youtube' ? 'smart_display' : post.attachmentType === 'pdf' ? 'picture_as_pdf' : 'attachment'}
                    </span>
                    <span>{post.attachmentName}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="text-xs text-slate-400">조회수 {post.views}</span>
                <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">
                  arrow_forward_ios
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-10 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-slate-400">{selectedPost.date}</span>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 leading-snug">
              {selectedPost.title}
            </h2>

            {/* Video Autoplay Embed if YouTube */}
            {selectedPost.attachmentType === 'youtube' && selectedPost.attachmentUrl && (
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 bg-black shadow-md">
                <iframe
                  src={selectedPost.attachmentUrl}
                  title={selectedPost.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* HTML or Text Content */}
            <div 
              className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed space-y-4 mb-8"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            {/* Attachment File Section */}
            {selectedPost.attachmentName && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-700 text-2xl">
                    {selectedPost.attachmentType === 'pdf' ? 'picture_as_pdf' : selectedPost.attachmentType === 'youtube' ? 'smart_display' : 'download'}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{selectedPost.attachmentName}</p>
                    <p className="text-[11px] text-slate-400">공식 미디어 첨부 자료</p>
                  </div>
                </div>
                <a
                  href={selectedPost.attachmentUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
                >
                  다운로드 / 보기
                </a>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-6 py-2.5 bg-slate-100 text-slate-800 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
              >
                닫기 (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
