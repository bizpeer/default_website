-- ====================================================================
-- BEAUTY OF JOSEON (조선미녀) Supabase Database Schema & RLS Policy
-- ====================================================================

-- 1. 확장 기능 활성화 (UUID 생성 등)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. 사이트 기본 콘텐츠 테이블 (site_contents)
CREATE TABLE IF NOT EXISTS public.site_contents (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    hero JSONB NOT NULL DEFAULT '{}'::jsonb,
    about JSONB NOT NULL DEFAULT '{}'::jsonb,
    ceo_greeting JSONB NOT NULL DEFAULT '{}'::jsonb,
    company_info JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo JSONB NOT NULL DEFAULT '{}'::jsonb,
    brand JSONB NOT NULL DEFAULT '{}'::jsonb,
    overview JSONB NOT NULL DEFAULT '{}'::jsonb,
    resend JSONB NOT NULL DEFAULT '{}'::jsonb,
    toss_pg JSONB NOT NULL DEFAULT '{}'::jsonb,
    footer JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 언론 보도자료 테이블 (press_articles)
CREATE TABLE IF NOT EXISTS public.press_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 미디어 Center & PDF 자료실 테이블 (media_resources)
CREATE TABLE IF NOT EXISTS public.media_resources (
    id VARCHAR(100) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'document')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    link_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 채용 공고 테이블 (job_postings)
CREATE TABLE IF NOT EXISTS public.job_postings (
    id VARCHAR(100) PRIMARY KEY,
    department VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. 룩북 갤러리 테이블 (lookbook_gallery)
CREATE TABLE IF NOT EXISTS public.lookbook_gallery (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. 메인 프로모션 배너 테이블 (promotion_banners)
CREATE TABLE IF NOT EXISTS public.promotion_banners (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_url TEXT NOT NULL,
    link_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. 제품 테이블 (products)
CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL CHECK (category IN ('skincare', 'makeup', 'device')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    gallery_images JSONB DEFAULT '[]'::jsonb,
    price INT NOT NULL CHECK (price >= 0),
    original_price INT DEFAULT 0,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    texture VARCHAR(100),
    skin_type VARCHAR(100),
    ingredients TEXT,
    is_sold_out BOOLEAN DEFAULT FALSE,
    display_status VARCHAR(20) DEFAULT 'visible' CHECK (display_status IN ('visible', 'soldout', 'hidden')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. 쇼핑몰 회원 테이블 (shop_users)
CREATE TABLE IF NOT EXISTS public.shop_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) DEFAULT '고객님',
    phone VARCHAR(50) NOT NULL,
    address TEXT, -- 최종 주문 배송지 주소 자동 매핑
    postal_code VARCHAR(20),
    password_hash TEXT,
    tier VARCHAR(20) DEFAULT 'BRONZE' CHECK (tier IN ('BRONZE', 'SILVER', 'GOLD VIP')),
    points INT DEFAULT 0 CHECK (points >= 0),
    social_provider VARCHAR(20) DEFAULT 'email' CHECK (social_provider IN ('email', 'google', 'naver')),
    social_id TEXT,
    order_count INT DEFAULT 0,
    last_order_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. 토스페이먼츠 주문 & 결제 DB (orders & payments)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY, -- ORD-YYYYMMDD-SEQ
    user_email VARCHAR(255),
    user_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    recipient VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    shipping_address TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount INT NOT NULL,
    vat_amount INT NOT NULL DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'TOSSPAYMENTS',
    payment_key TEXT,
    transaction_id TEXT,
    payment_status VARCHAR(30) DEFAULT 'READY' CHECK (payment_status IN ('READY', 'DONE', 'CANCELED', 'ABORTED')),
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'shipped', 'delivered', 'cancelled')),
    courier VARCHAR(30) DEFAULT 'cj',
    tracking_no VARCHAR(100),
    cancelled_at TIMESTAMP WITH TIME ZONE,
    refunded_amount INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. 1:1 고객 문의 게시판 (site_inquiries)
CREATE TABLE IF NOT EXISTS public.site_inquiries (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    reply TEXT DEFAULT '',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. 운영자 / 직원 RBAC 계정 테이블 (staff_users)
CREATE TABLE IF NOT EXISTS public.staff_users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('siteadmin', 'staff')),
    menu_permissions JSONB NOT NULL DEFAULT '["dashboard", "contents"]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. 가변 회원 등급 정책 테이블 (tier_policies)
CREATE TABLE IF NOT EXISTS public.tier_policies (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    silver_min_orders INT NOT NULL DEFAULT 1,
    gold_min_orders INT NOT NULL DEFAULT 3,
    silver_points INT NOT NULL DEFAULT 1000,
    gold_points INT NOT NULL DEFAULT 3000,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) 보안 정책
-- ====================================================================

-- 1. 모든 테이블 RLS 활성화
ALTER TABLE public.site_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lookbook_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tier_policies ENABLE ROW LEVEL SECURITY;

-- 2. 퍼블릭 읽기 전용 뷰 (고객 쇼핑몰/사이트조회) RLS 정책
DROP POLICY IF EXISTS "Public Read Site Contents" ON public.site_contents;
CREATE POLICY "Public Read Site Contents" ON public.site_contents FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Press" ON public.press_articles;
CREATE POLICY "Public Read Press" ON public.press_articles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Media" ON public.media_resources;
CREATE POLICY "Public Read Media" ON public.media_resources FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Careers" ON public.job_postings;
CREATE POLICY "Public Read Careers" ON public.job_postings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Lookbook" ON public.lookbook_gallery;
CREATE POLICY "Public Read Lookbook" ON public.lookbook_gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Banners" ON public.promotion_banners;
CREATE POLICY "Public Read Banners" ON public.promotion_banners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Products" ON public.products;
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);

-- 3. 고객 문의 등록 RLS 정책 (누구나 문의 등록 가능)
DROP POLICY IF EXISTS "Public Create Inquiry" ON public.site_inquiries;
CREATE POLICY "Public Create Inquiry" ON public.site_inquiries FOR INSERT WITH CHECK (true);

-- 4. 서비스 로키 (service_role) 관리자 전용 완전 접근 정책
DROP POLICY IF EXISTS "Service Role Full Access Site Contents" ON public.site_contents;
CREATE POLICY "Service Role Full Access Site Contents" ON public.site_contents USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service Role Full Access Products" ON public.products;
CREATE POLICY "Service Role Full Access Products" ON public.products USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service Role Full Access Orders" ON public.orders;
CREATE POLICY "Service Role Full Access Orders" ON public.orders USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service Role Full Access Inquiries" ON public.site_inquiries;
CREATE POLICY "Service Role Full Access Inquiries" ON public.site_inquiries USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service Role Full Access Staff Users" ON public.staff_users;
CREATE POLICY "Service Role Full Access Staff Users" ON public.staff_users USING (auth.role() = 'service_role');
