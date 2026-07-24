import { useState, useEffect } from 'react';
import { BrandStorySettings, defaultBrandStorySettings, MoodFilmItem } from '../types/BrandTypes';

export function BrandStory() {
  const [settings, setSettings] = useState<BrandStorySettings>(defaultBrandStorySettings);
  const [activeFilmModal, setActiveFilmModal] = useState<MoodFilmItem | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('brand_story_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        setSettings(defaultBrandStorySettings);
      }
    } else {
      setSettings(defaultBrandStorySettings);
      localStorage.setItem('brand_story_settings', JSON.stringify(defaultBrandStorySettings));
    }
  }, []);

  return (
    <div className="space-y-16 md:space-y-24 animate-in fade-in duration-700 pb-20 -mt-6">
      {/* 1. Hero Video Section (Full Immersive Luxury Header) */}
      <section className="relative w-full min-h-[65vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-xl bg-[#2B2326]">
        {/* Background Video or Poster */}
        {settings.heroVideoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={settings.heroPosterUrl}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 transition-transform duration-1000"
          >
            <source src={settings.heroVideoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={settings.heroPosterUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop'}
            alt="Brand Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2326] via-[#2B2326]/40 to-[#2B2326]/30"></div>

        {/* Hero Overlay Content */}
        <div className="relative z-10 text-center max-w-4xl px-6 py-16 text-white space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <span className="px-4 py-1.5 rounded-full text-xs md:text-sm font-bold bg-white/10 backdrop-blur-md border border-white/20 tracking-widest uppercase text-[#FAF5F6] inline-block shadow-lg">
            {settings.heroTagline}
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight leading-tight text-white drop-shadow-md whitespace-pre-line">
            {settings.heroHeadline}
          </h1>
          <p className="text-sm md:text-lg text-[#FAF5F6]/90 max-w-2xl mx-auto leading-relaxed font-light drop-shadow-xs">
            {settings.heroSubheadline}
          </p>

          <div className="pt-6 flex justify-center gap-4">
            <a
              href="#philosophy"
              className="px-8 py-3.5 bg-[#8C3A5A] text-white font-bold text-xs md:text-sm rounded-full hover:bg-[#79314d] transition-all shadow-xl hover:scale-105 flex items-center gap-2"
            >
              브랜드 철학 탐색하기
              <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Brand Philosophy Grid Section */}
      <section id="philosophy" className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-[#D9779B] uppercase tracking-widest">
            {settings.philosophyTitle}
          </span>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#8C3A5A]">
            {settings.philosophySubtitle}
          </h2>
          <div className="w-12 h-1 bg-[#8C3A5A] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {settings.philosophyCards.map((card) => (
            <div
              key={card.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#F3E8EC] card-elevation hover:shadow-2xl transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 overflow-hidden bg-[#FAF5F6]">
                  <img
                    src={card.imageUrl || 'https://images.unsplash.com/photo-1608248597260-50c39f70a784?q=80&w=800&auto=format&fit=crop'}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {card.badge && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-[#8C3A5A]/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {card.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 md:p-8 space-y-3">
                  <span className="text-[11px] font-bold text-[#D9779B] uppercase tracking-wider block">
                    {card.subtitle}
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-[#2B2326] group-hover:text-[#8C3A5A] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#7C6E74] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Mood Film & Video Showcase Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-16 max-w-6xl mx-auto space-y-10 shadow-2xl">
        <div className="flex justify-between items-end flex-wrap gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
              {settings.filmSectionTitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
              {settings.filmSectionSubtitle}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {settings.moodFilms.length} Media Releases
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {settings.moodFilms.map((film) => (
            <div
              key={film.id}
              onClick={() => setActiveFilmModal(film)}
              className="group cursor-pointer bg-slate-800 rounded-2xl overflow-hidden border border-slate-700/80 hover:border-amber-400/50 transition-all duration-300 shadow-md flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden bg-slate-950">
                <img
                  src={film.thumbnailUrl || 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop'}
                  alt={film.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white text-[24px]">
                      {film.mediaType === 'video' ? 'play_arrow' : 'photo_library'}
                    </span>
                  </div>
                </div>
                {film.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded">
                    {film.badge}
                  </span>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {film.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {film.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Signature Quote Section */}
      <section className="max-w-4xl mx-auto text-center px-6 py-12 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <span className="material-symbols-outlined text-[36px] text-amber-700">format_quote</span>
        <blockquote className="text-xl md:text-2xl font-serif text-slate-900 leading-relaxed font-semibold italic">
          "{settings.signatureQuote}"
        </blockquote>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2">
          — {settings.signatureAuthor} —
        </p>
      </section>

      {/* Media Modal */}
      {activeFilmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <button
              onClick={() => setActiveFilmModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors z-10"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>

            <h3 className="text-lg font-bold font-serif text-white pr-10">
              {activeFilmModal.title}
            </h3>

            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800">
              {activeFilmModal.videoUrl ? (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  src={activeFilmModal.videoUrl}
                >
                  <source src={activeFilmModal.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={activeFilmModal.thumbnailUrl}
                  alt={activeFilmModal.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeFilmModal.caption}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
