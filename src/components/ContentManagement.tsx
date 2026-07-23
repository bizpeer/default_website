import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { MediaPost, initialMediaPosts } from './MediaCenter';
import { BrandManagement } from './BrandManagement';

export function ContentManagement() {
  const [mainTab, setMainTab] = useState<'media' | 'brand'>('media');
  const [activeTab, setActiveTab] = useState<string>('전체');
  const [posts, setPosts] = useState<MediaPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = ['전체', '공지사항', 'News Room', '자료실'];

  useEffect(() => {
    // Media Posts
    const savedPosts = localStorage.getItem('media_center_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts(initialMediaPosts);
      }
    } else {
      setPosts(initialMediaPosts);
      localStorage.setItem('media_center_posts', JSON.stringify(initialMediaPosts));
    }
  }, []);

  const savePosts = (newPosts: MediaPost[]) => {
    setPosts(newPosts);
    localStorage.setItem('media_center_posts', JSON.stringify(newPosts));
  };

  const handleDeletePost = (id: string) => {
    if (window.confirm('정말 이 미디어 게시물을 삭제하시겠습니까?')) {
      const updated = posts.filter((p) => p.id !== id);
      savePosts(updated);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesTab = activeTab === '전체' || p.category === activeTab;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-outline-variant pb-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">콘텐츠 & 미디어 관리 (Content & Media Management)</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            미디어 센터 게시물(공지/News/자료실) 및 **럭셔리 브랜드 스토리 페이지 영상·이미지 커스텀**을 종합 관리합니다.
          </p>
        </div>
        {mainTab === 'media' && (
          <div className="flex gap-3">
            <NavLink
              to="/admin/content/new"
              className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              새 미디어 콘텐츠 등록
            </NavLink>
          </div>
        )}
      </div>

      {/* Main Mode Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setMainTab('media')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            mainTab === 'media'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">article</span>
          미디어 센터 게시물 관리 ({posts.length}건)
        </button>
        <button
          onClick={() => setMainTab('brand')}
          className={`px-5 py-2.5 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            mainTab === 'brand'
              ? 'border-secondary text-secondary'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">movie</span>
          ✨ 브랜드 스토리 커스텀 관리 (/brand 영상·갤러리)
        </button>
      </div>

      {mainTab === 'brand' ? (
        <BrandManagement />
      ) : (
        <>

      {/* Category Tabs */}
      <div className="flex space-x-1 border-b border-outline-variant overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-secondary text-secondary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {tab} {tab !== '전체' && `(${posts.filter((p) => p.category === tab).length})`}
          </button>
        ))}
      </div>

      {/* Media Posts List */}
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant flex items-center justify-between">
          <div className="relative w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목 또는 작성자 검색..."
              className="w-full bg-surface-container border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-sm focus:border-secondary outline-none"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">총 {filteredPosts.length}건</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs uppercase border-b border-outline-variant">
              <tr>
                <th className="py-3.5 px-4 font-semibold">카테고리</th>
                <th className="py-3.5 px-4 font-semibold">게시물 제목</th>
                <th className="py-3.5 px-4 font-semibold">작성자</th>
                <th className="py-3.5 px-4 font-semibold text-center">상단고정 순위</th>
                <th className="py-3.5 px-4 font-semibold text-center">등록일</th>
                <th className="py-3.5 px-4 font-semibold text-center">관리</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-bold">
                    해당 조건에 일치하는 미디어 게시물이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 text-xs font-bold bg-slate-100 text-slate-700 rounded-full">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{post.title}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{post.author}</td>
                    <td className="py-3.5 px-4 text-center">
                      {post.isPinned ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded">
                          ★ Top {post.priority}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">일반</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-slate-400">{post.date}</td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="삭제"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
