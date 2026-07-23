-- ====================================================================
-- BEAUTY OF JOSEON - Supabase Production Database Schema & RLS Security
-- ====================================================================

-- 1. Enable Cryptography Extension for Password Hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --------------------------------------------------------------------
-- 2. Customer Users Table (고객/회원 DB - 고객 전용)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Client SHA-256 or bcrypt hash (Optional for Social Login)
    name TEXT NOT NULL,
    phone TEXT,
    membership_tier TEXT DEFAULT 'SILVER',
    points INT DEFAULT 3000,
    coupons INT DEFAULT 1,
    provider TEXT DEFAULT 'email',
    provider_id TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was created previously
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS membership_tier TEXT DEFAULT 'SILVER';
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS points INT DEFAULT 3000;
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS coupons INT DEFAULT 1;
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS provider TEXT DEFAULT 'email';
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS provider_id TEXT;
ALTER TABLE public.customer_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Enable RLS for Customer Table
ALTER TABLE public.customer_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running script
DROP POLICY IF EXISTS "Customers can view own profile" ON public.customer_users;
DROP POLICY IF EXISTS "Customers can update own profile" ON public.customer_users;
DROP POLICY IF EXISTS "Allow public customer registration" ON public.customer_users;

-- Policy 1: Customer can only view their own profile
CREATE POLICY "Customers can view own profile"
    ON public.customer_users
    FOR SELECT
    USING (auth.uid() = id);

-- Policy 2: Customer can update their own profile
CREATE POLICY "Customers can update own profile"
    ON public.customer_users
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy 3: Allow new customer registration (Sign Up)
CREATE POLICY "Allow public customer registration"
    ON public.customer_users
    FOR INSERT
    WITH CHECK (true);


-- --------------------------------------------------------------------
-- 3. Admin & Staff Users Table (관리자/직원 DB - 고객 접근 철저 차단)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id TEXT PRIMARY KEY, -- e.g. 'siteadmin', 'staff_shop'
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('superadmin', 'staff')),
    department TEXT,
    password_hash TEXT NOT NULL, -- SHA-256 Web Crypto Hashed
    is_password_changed BOOLEAN DEFAULT FALSE,
    permissions JSONB NOT NULL DEFAULT '{
        "dashboard": true,
        "site": false,
        "content": false,
        "products": false,
        "shop": false,
        "orders": false,
        "customers": false,
        "system": false
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Admin Table (STRICT ISOLATION)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Restrict admin users table access to authenticated admins" ON public.admin_users;

-- Policy 1: Only Super Admin (siteadmin) or Authenticated Staff can view Admin Users
CREATE POLICY "Restrict admin users table access to authenticated admins"
    ON public.admin_users
    FOR ALL
    USING (
        (auth.jwt() ->> 'role') = 'superadmin' OR 
        (auth.jwt() ->> 'role') = 'staff'
    );


-- --------------------------------------------------------------------
-- 4. Products Table (제품 & 베스트셀러 DB)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    price INT NOT NULL DEFAULT 0 CHECK (price >= 0),
    sale_price INT,
    stock INT DEFAULT 100 CHECK (stock >= 0),
    is_bestseller BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT '판매중',
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table already existed with different schema
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price INT DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sale_price INT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INT DEFAULT 100;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '판매중';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active products" ON public.products;
DROP POLICY IF EXISTS "Staff manage products" ON public.products;

-- Public can view active products
CREATE POLICY "Public read active products"
    ON public.products
    FOR SELECT
    USING (status != '숨김');

-- Admin staff can manage products
CREATE POLICY "Staff manage products"
    ON public.products
    FOR ALL
    USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));


-- --------------------------------------------------------------------
-- 5. Orders Table (주문 & 물류 DB)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_id UUID REFERENCES public.customer_users(id),
    total_amount INT NOT NULL DEFAULT 0,
    status TEXT DEFAULT '주문접수',
    tracking_number TEXT,
    shipping_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was created previously with different schema
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customer_users(id);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount INT DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '주문접수';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers view own orders" ON public.orders;
DROP POLICY IF EXISTS "Staff manage orders" ON public.orders;

-- Customers can view their own orders
CREATE POLICY "Customers view own orders"
    ON public.orders
    FOR SELECT
    USING (auth.uid() = customer_id);

-- Staff with logistics/superadmin permission can manage all orders
CREATE POLICY "Staff manage orders"
    ON public.orders
    FOR ALL
    USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));


-- --------------------------------------------------------------------
-- 6. FAQs Table (자주 묻는 질문 DB)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read faqs" ON public.faqs;
DROP POLICY IF EXISTS "Staff manage faqs" ON public.faqs;

-- Public read FAQs
CREATE POLICY "Public read faqs"
    ON public.faqs
    FOR SELECT
    USING (true);

-- Staff manage FAQs
CREATE POLICY "Staff manage faqs"
    ON public.faqs
    FOR ALL
    USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));


-- --------------------------------------------------------------------
-- 7. Customer Inquiries Table (1:1 고객 온라인 문의 DB)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_inquiries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT '접수완료',
    reply_content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    replied_at TIMESTAMPTZ
);

-- Ensure columns exist if table already existed
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS status TEXT DEFAULT '접수완료';
ALTER TABLE public.customer_inquiries ADD COLUMN IF NOT EXISTS reply_content TEXT;

ALTER TABLE public.customer_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Customers view own inquiries" ON public.customer_inquiries;
DROP POLICY IF EXISTS "Staff manage inquiries" ON public.customer_inquiries;

-- Public / Customer can insert 1:1 inquiries
CREATE POLICY "Public insert inquiries"
    ON public.customer_inquiries
    FOR INSERT
    WITH CHECK (true);

-- Customers view own inquiries by email
CREATE POLICY "Customers view own inquiries"
    ON public.customer_inquiries
    FOR SELECT
    USING (customer_email = current_setting('request.jwt.claims', true)::json ->> 'email');

-- Staff view and reply to all inquiries
CREATE POLICY "Staff manage inquiries"
    ON public.customer_inquiries
    FOR ALL
    USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));

-- --------------------------------------------------------------------
-- 8. Payments Table (토스페이먼츠 및 PG 지급결제 내역 DB)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL,
    user_id TEXT,
    pg TEXT DEFAULT 'TOSSPAYMENTS',
    payment_key TEXT,
    transaction_id TEXT,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    vat NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'READY',
    method TEXT, -- 카드, 계좌이체, 가상계좌, 간편결제, 토스페이
    approved_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    refunded_amount NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table already existed
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS pg TEXT DEFAULT 'TOSSPAYMENTS';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS payment_key TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS transaction_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS amount NUMERIC DEFAULT 0;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS vat NUMERIC DEFAULT 0;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'READY';
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS method TEXT;

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert payments" ON public.payments;
DROP POLICY IF EXISTS "Customers view own payments" ON public.payments;
DROP POLICY IF EXISTS "Staff manage payments" ON public.payments;

-- Customers / Public can insert payment records on checkout completion
CREATE POLICY "Public insert payments"
    ON public.payments
    FOR INSERT
    WITH CHECK (true);

-- Customers can view their own payment transactions
CREATE POLICY "Customers view own payments"
    ON public.payments
    FOR SELECT
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

-- Staff / Admin can manage and view all payment transactions
CREATE POLICY "Staff manage payments"
    ON public.payments
    FOR ALL
    USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));

-- --------------------------------------------------------------------
-- 9. Customer Addresses Table (고객 배송지 정보 수집 및 맵핑 DB)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- Mapped to Customer Email or Customer User ID
    recipient_name TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    is_default BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;

-- Ensure columns exist if table already existed
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS recipient_name TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.customer_addresses ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT TRUE;

DROP POLICY IF EXISTS "Public insert customer address" ON public.customer_addresses;
DROP POLICY IF EXISTS "Customers view own address" ON public.customer_addresses;
DROP POLICY IF EXISTS "Staff manage customer addresses" ON public.customer_addresses;

-- Customers / Public can insert address on order placement
CREATE POLICY "Public insert customer address"
    ON public.customer_addresses
    FOR INSERT
    WITH CHECK (true);

-- Customers can view/update their mapped shipping addresses
CREATE POLICY "Customers view own address"
    ON public.customer_addresses
    FOR ALL
    USING (user_id = auth.uid()::text OR user_id = current_setting('request.jwt.claims', true)::json ->> 'sub');

-- Staff manage customer addresses
CREATE POLICY "Staff manage customer addresses"
    ON public.customer_addresses
    FOR ALL
    USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));

-- ====================================================================
-- End of Schema
-- ====================================================================
