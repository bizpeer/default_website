import { useState, useEffect } from 'react';
import { SEOSettings, defaultSEOSettings } from '../types/SEOTypes';
import { getSEOSettings, saveSEOSettings } from '../services/seoService';

export function SEOManagement() {
  const [seo, setSeo] = useState<SEOSettings>(getSEOSettings());

  useEffect(() => {
    setSeo(getSEOSettings());
  }, []);

  const handleSave = () => {
    saveSEOSettings(seo);
    alert('SEO 검색엔진 최적화 메타 태그 설정이 저장되어 전역 헤더에 실시간 반영되었습니다!');
  };

  const handleOgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('대표 이미지 파일 크기는 2MB 이하만 등록 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSeo({ ...seo, ogImageUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px] text-amber-700">search</span>
            SEO 검색엔진 최적화 관리 (SEO & Social Sharing Management)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            구글, 네이버, 다음 검색엔진 수집(Meta Title/Description) 및 카카오톡·소셜 미디어 공유 시 노출되는 Open Graph(OG) 이미지를 설정합니다.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          SEO 설정 저장하기
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 1. Global Meta Tags */}
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-200 pb-3">
            <span className="material-symbols-outlined text-[18px] text-amber-800">title</span>
            1. 기본 메타 태그 설정 (Global Meta Tags)
          </h4>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              페이지 타이틀 (Meta Title) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
              placeholder="조선미녀 | 전통과 현대가 만나는 프리미엄 한방 스킨케어"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
            />
            <p className="text-[10px] text-slate-400 mt-1">권장 길이: 30~50자 내외 (브랜드명 포함)</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              검색 엔진 요약 설명 (Meta Description) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={seo.metaDescription}
              onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              placeholder="구글, 네이버 검색 결과 하단에 나타나는 2~3줄 요약 설명"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs resize-none text-slate-800"
            />
            <p className="text-[10px] text-slate-400 mt-1">권장 길이: 80~120자 내외</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              검색 키워드 (Meta Keywords)
            </label>
            <input
              type="text"
              value={seo.metaKeywords}
              onChange={(e) => setSeo({ ...seo, metaKeywords: e.target.value })}
              placeholder="조선미녀, 한방 화장품, 맑은쌀선크림, Beauty of Joseon, 클린뷰티"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">쉼표(,)로 구분하여 핵심 키워드 지정</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">발행 기관 / 저작자 (Author)</label>
              <input
                type="text"
                value={seo.author}
                onChange={(e) => setSeo({ ...seo, author: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">대표 Canonical URL</label>
              <input
                type="text"
                value={seo.canonicalUrl}
                onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                placeholder="https://beautyofjoseon.com"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>
          </div>
        </div>

        {/* 2. Open Graph & Verification Keys */}
        <div className="space-y-6">
          {/* OG Social Sharing */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-[18px] text-blue-700">share</span>
              2. Open Graph (카카오톡 / 네이버 / 소셜 공유 카드)
            </h4>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">소셜 공유 카드 제목 (og:title)</label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                placeholder="카카오톡 링크 전달 시 나타나는 제목"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">소셜 공유 요약 문구 (og:description)</label>
              <input
                type="text"
                value={seo.ogDescription}
                onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                소셜 공유 썸네일 이미지 (og:image) URL 또는 파일 등록
              </label>
              <input
                type="text"
                value={seo.ogImageUrl}
                onChange={(e) => setSeo({ ...seo, ogImageUrl: e.target.value })}
                placeholder="https://example.com/og_thumb.jpg 또는 파일 직접 선택"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono mb-2"
              />
              <div className="flex items-center gap-3">
                <label className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer hover:bg-slate-800 transition-colors inline-flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">upload_file</span>
                  대표 썸네일 이미지 업로드 (최대 2MB)
                  <input type="file" accept="image/*" onChange={handleOgImageUpload} className="hidden" />
                </label>
                {seo.ogImageUrl && (
                  <div className="w-12 h-12 rounded-lg border border-slate-300 overflow-hidden shrink-0">
                    <img src={seo.ogImageUrl} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Engine Verification Keys */}
          <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-200 pb-3">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">verified</span>
              3. 구글 서치콘솔 / 네이버 서치어드바이저 소유권 메타키
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Google Site Verification Key</label>
                <input
                  type="text"
                  value={seo.googleSiteVerification}
                  onChange={(e) => setSeo({ ...seo, googleSiteVerification: e.target.value })}
                  placeholder="google-site-verification-..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Naver Site Verification Key</label>
                <input
                  type="text"
                  value={seo.naverSiteVerification}
                  onChange={(e) => setSeo({ ...seo, naverSiteVerification: e.target.value })}
                  placeholder="naver-site-verification-..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Robots 크롤링 색인 설정</span>
                <span className="text-[11px] text-slate-500">검색봇 수집 허용 (index, follow) 지정</span>
              </div>
              <select
                value={seo.robotsIndex}
                onChange={(e) => setSeo({ ...seo, robotsIndex: e.target.value as any })}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="index, follow">index, follow (수집 및 색인 허용 - 권장)</option>
                <option value="noindex, nofollow">noindex, nofollow (검색봇 색인 차단)</option>
                <option value="index, nofollow">index, nofollow (색인만 허용)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
