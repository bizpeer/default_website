import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageCode, supportedLanguages, translations } from '../i18n';
import { LegalTermsModal } from './LegalTermsModal';
import { CartModal } from './CartModal';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const [showShoppingMall, setShowShoppingMall] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>('ko');
  const [legalModalType, setLegalModalType] = useState<'terms' | 'privacy' | 'businessInfo' | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Dynamic Brand & Favicon States
  const [brandNameKo, setBrandNameKo] = useState('조선미녀');
  const [brandNameEn, setBrandNameEn] = useState('BEAUTY OF JOSEON');
  const [faviconUrl, setFaviconUrl] = useState('');

  const location = useLocation();

  useEffect(() => {
    const savedBrandKo = localStorage.getItem('site_brand_name_ko');
    if (savedBrandKo) setBrandNameKo(savedBrandKo);

    const savedBrandEn = localStorage.getItem('site_brand_name_en');
    if (savedBrandEn) setBrandNameEn(savedBrandEn);

    const savedFavicon = localStorage.getItem('site_favicon_url');
    if (savedFavicon) {
      setFaviconUrl(savedFavicon);
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = savedFavicon;
    }

    const savedShowMall = localStorage.getItem('show_shopping_mall');
    if (savedShowMall !== null) {
      setShowShoppingMall(JSON.parse(savedShowMall));
    }

    const savedLang = localStorage.getItem('selected_language') as LanguageCode;
    if (savedLang && translations[savedLang]) {
      setCurrentLang(savedLang);
    }
  }, []);

  const handleLanguageChange = (code: LanguageCode) => {
    setCurrentLang(code);
    localStorage.setItem('selected_language', code);
    setLangDropdownOpen(false);

    // Apply RTL for Arabic
    if (code === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  const t = (key: string) => {
    return translations[currentLang]?.[key] || translations['ko']?.[key] || key;
  };

  const isShopPage = location.pathname === '/';
  const currentLangObj = supportedLanguages.find((l) => l.code === currentLang) || supportedLanguages[0];

  return (
    <div className="text-[#2B2326] font-sans antialiased min-h-screen flex flex-col bg-[#FAF5F6]">
      {/* Header & GNB (Design.md Specs: Sticky, #FAF5F6 background, touch targets >= 44px) */}
      <header className="sticky top-0 left-0 w-full z-50 bg-[#FAF5F6]/95 backdrop-blur-md border-b border-[#F3E8EC] shadow-xs transition-all duration-300">
        <div className="flex justify-between items-center px-4 md:px-10 py-3.5 w-full max-w-[1440px] mx-auto min-h-[56px]">
          
          {/* Brand Logo Left */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden touch-target p-2 text-[#8C3A5A] hover:bg-[#F3E8EC] rounded-xl transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[26px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>

            <Link to="/" className="text-lg md:text-2xl font-serif tracking-widest text-[#8C3A5A] hover:opacity-85 transition-opacity flex items-center gap-2 font-bold">
              {faviconUrl && <img src={faviconUrl} alt="Logo Icon" className="w-7 h-7 object-contain" />}
              <span>{brandNameEn || 'BEAUTY OF JOSEON'}</span>
            </Link>
          </div>

          {/* Desktop Navigation Center */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link
              to="/company"
              className={`text-sm font-semibold transition-colors duration-200 ${
                location.pathname === '/company'
                  ? 'text-[#8C3A5A] font-bold border-b-2 border-[#8C3A5A] pb-1'
                  : 'text-[#7C6E74] hover:text-[#8C3A5A]'
              }`}
            >
              {t('company')}
            </Link>
            <Link
              to="/brand"
              className={`text-sm font-semibold transition-colors duration-200 ${
                location.pathname === '/brand'
                  ? 'text-[#8C3A5A] font-bold border-b-2 border-[#8C3A5A] pb-1'
                  : 'text-[#7C6E74] hover:text-[#8C3A5A]'
              }`}
            >
              {t('brand')}
            </Link>
            <Link
              to="/media"
              className={`text-sm font-semibold transition-colors duration-200 ${
                location.pathname === '/media'
                  ? 'text-[#8C3A5A] font-bold border-b-2 border-[#8C3A5A] pb-1'
                  : 'text-[#7C6E74] hover:text-[#8C3A5A]'
              }`}
            >
              {t('media')}
            </Link>
            {showShoppingMall && (
              <Link
                to="/"
                className={`text-sm font-semibold transition-colors duration-200 ${
                  isShopPage
                    ? 'text-[#8C3A5A] font-bold border-b-2 border-[#8C3A5A] pb-1'
                    : 'text-[#7C6E74] hover:text-[#8C3A5A]'
                }`}
              >
                {t('shop')}
              </Link>
            )}
          </nav>

          {/* Header Right Tools: Language Selector + User MyPage + Cart */}
          <div className="flex gap-2 md:gap-3 items-center text-[#2B2326]">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#F3E8EC] bg-white hover:bg-[#F3E8EC] transition-colors text-xs font-bold text-[#8C3A5A]"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.label}</span>
                <span className="material-symbols-outlined text-[16px] text-[#8C3A5A]">expand_more</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#F3E8EC] py-2 z-50 animate-in fade-in duration-200">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#7C6E74] uppercase tracking-wider border-b border-[#F3E8EC]">
                    Language (언어 선택)
                  </div>
                  {supportedLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-4 py-2 text-xs text-left flex items-center justify-between hover:bg-[#FAF5F6] transition-colors ${
                        currentLang === lang.code ? 'font-bold text-[#8C3A5A] bg-[#F3E8EC]/50' : 'text-[#2B2326]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {currentLang === lang.code && (
                        <span className="material-symbols-outlined text-[16px] text-[#8C3A5A]">check</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* MyPage Icon */}
            <Link
              to="/mypage"
              className="touch-target text-[#8C3A5A] hover:bg-[#F3E8EC] rounded-xl transition-colors"
              title={t('mypage')}
            >
              <span className="material-symbols-outlined text-[24px]">person</span>
            </Link>

            {showShoppingMall && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="touch-target text-[#8C3A5A] hover:bg-[#F3E8EC] rounded-xl transition-colors"
                title={t('cart')}
              >
                <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Header Shop Sub-Menu */}
        {showShoppingMall && isShopPage && (
          <div className="hidden md:block bg-[#F3E8EC]/70 border-t border-[#F3E8EC] px-5 md:px-10 py-2.5">
            <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-8 overflow-x-auto text-xs md:text-sm font-medium">
              <a href="#product-catalog" className="flex items-center gap-1.5 text-[#2B2326] hover:text-[#8C3A5A] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">category</span>
                <span>{t('categories')}</span>
              </a>
              <Link to="/?filter=bestsellers" className="flex items-center gap-1.5 text-[#8C3A5A] font-bold transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span>{t('bestsellers')}</span>
              </Link>
              <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-1.5 text-[#2B2326] hover:text-[#8C3A5A] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                <span>{t('cart')}</span>
              </button>
              <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-1.5 text-[#2B2326] hover:text-[#8C3A5A] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                <span>{t('orders')}</span>
              </button>
              <Link to="/mypage" className="flex items-center gap-1.5 text-[#2B2326] hover:text-[#8C3A5A] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">account_circle</span>
                <span>{t('mypage')}</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Navigation Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#2B2326]/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="fixed top-[60px] left-0 right-0 bg-[#FAF5F6] border-b border-[#F3E8EC] p-6 space-y-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Main Nav Links */}
            <div className="space-y-3 pb-4 border-b border-[#F3E8EC]">
              <p className="text-[10px] font-bold text-[#7C6E74] uppercase tracking-widest">Main Navigation</p>
              <div className="grid grid-cols-2 gap-3 text-sm font-bold">
                <Link
                  to="/company"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 bg-white rounded-xl text-[#8C3A5A] flex items-center justify-between shadow-xs border border-[#F3E8EC]"
                >
                  <span>{t('company')}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
                <Link
                  to="/brand"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 bg-white rounded-xl text-[#8C3A5A] flex items-center justify-between shadow-xs border border-[#F3E8EC]"
                >
                  <span>{t('brand')}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
                <Link
                  to="/media"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3.5 bg-white rounded-xl text-[#8C3A5A] flex items-center justify-between shadow-xs border border-[#F3E8EC]"
                >
                  <span>{t('media')}</span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </Link>
                {showShoppingMall && (
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-3.5 bg-white rounded-xl text-[#8C3A5A] flex items-center justify-between shadow-xs border border-[#F3E8EC]"
                  >
                    <span>{t('shop')}</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Shop Sub-Menu Links */}
            {showShoppingMall && (
              <div className="space-y-2 pb-4 border-b border-[#F3E8EC]">
                <p className="text-[10px] font-bold text-[#7C6E74] uppercase tracking-widest">Shop Shortcuts</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                  <a
                    href="#product-catalog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 border border-[#F3E8EC] bg-white rounded-lg text-[#2B2326] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#8C3A5A]">category</span>
                    <span>{t('categories')}</span>
                  </a>
                  <Link
                    to="/?filter=bestsellers"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 border border-[#D9779B]/40 bg-[#F3E8EC] rounded-lg text-[#8C3A5A] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#D9779B]">star</span>
                    <span>{t('bestsellers')}</span>
                  </Link>
                  <Link
                    to="/mypage"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 border border-[#F3E8EC] bg-white rounded-lg text-[#2B2326] flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#8C3A5A]">account_circle</span>
                    <span>{t('mypage')}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Mobile Multi-Language Grid Selector */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-[#7C6E74] uppercase tracking-widest">
                Language (다국어 선택 - 7개 국어)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleLanguageChange(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                      currentLang === lang.code
                        ? 'border-[#8C3A5A] bg-[#8C3A5A] text-white shadow-xs'
                        : 'border-[#F3E8EC] bg-white text-[#2B2326] hover:bg-[#F3E8EC]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className={`flex flex-1 ${isShopPage && showShoppingMall ? 'pt-[110px] md:pt-[120px]' : 'pt-[60px] md:pt-[68px]'}`}>
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 pb-16">
          {children}
        </main>
      </div>

      {/* Footer (Design.md Specs: Background --text-body #2B2326, Text --bg-main #FAF5F6, 13px) */}
      <footer className="w-full py-12 px-6 md:px-10 bg-[#2B2326] text-[#FAF5F6] border-t border-[#8C3A5A]/20">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-[13px]">
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-xl md:text-2xl font-serif uppercase tracking-wider text-[#FAF5F6] mb-1">{brandNameEn || 'BEAUTY OF JOSEON'}</h4>
            <p className="text-xs font-bold text-[#D9779B] mb-3">{brandNameKo || '조선미녀'}</p>
            <p className="text-xs text-[#FAF5F6]/70 leading-relaxed">
              서울특별시 종로구 사직로 161 (경복궁 옆)<br />
              고객센터: 1544-0000 | 이메일: support@beautyofjoseon.com
            </p>
            <p className="text-xs text-[#FAF5F6]/50 mt-3">Copyright © {brandNameEn || 'BEAUTY OF JOSEON'} {t('rights')}</p>
          </div>

          <div className="col-span-1 flex flex-col gap-2.5">
            <h5 className="text-xs font-bold uppercase text-[#D9779B] tracking-wider mb-1">Legal Policies</h5>
            <button onClick={() => setLegalModalType('terms')} className="text-[#FAF5F6]/90 hover:text-[#D9779B] transition-colors text-left">
              {t('terms')}
            </button>
            <button onClick={() => setLegalModalType('privacy')} className="text-[#FAF5F6]/90 hover:text-[#D9779B] transition-colors text-left">
              {t('privacy')}
            </button>
            <button onClick={() => setLegalModalType('businessInfo')} className="text-[#FAF5F6]/70 hover:text-[#FAF5F6] transition-colors text-left">
              {t('businessInfo')}
            </button>
          </div>

          <div className="col-span-1 flex flex-col gap-2.5">
            <h5 className="text-xs font-bold uppercase text-[#D9779B] tracking-wider mb-1">Customer Support</h5>
            <Link to="/support?tab=inquiry" className="text-[#FAF5F6]/90 hover:text-[#D9779B] transition-colors">{t('customerService')}</Link>
            <Link to="/support?tab=faq" className="text-[#FAF5F6]/90 hover:text-[#D9779B] transition-colors">{t('faq')}</Link>
            <Link to="/admin/login" className="text-[#FAF5F6]/50 hover:text-[#D9779B] transition-colors mt-2">{t('console')}</Link>
          </div>

          <div className="col-span-1 flex flex-col gap-3">
            <h5 className="text-xs font-bold uppercase text-[#D9779B] tracking-wider mb-1">Follow Us</h5>
            <div className="flex gap-4">
              <Link to="#" className="w-10 h-10 rounded-full bg-[#8C3A5A]/40 flex items-center justify-center text-[#FAF5F6] hover:bg-[#D9779B] transition-colors"><span className="material-symbols-outlined text-[20px]">public</span></Link>
              <Link to="#" className="w-10 h-10 rounded-full bg-[#8C3A5A]/40 flex items-center justify-center text-[#FAF5F6] hover:bg-[#D9779B] transition-colors"><span className="material-symbols-outlined text-[20px]">mail</span></Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Policy Modal */}
      <LegalTermsModal type={legalModalType} onClose={() => setLegalModalType(null)} />

      {/* Cart & Checkout Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
