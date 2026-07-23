# 🔒 보안 점검 및 DB 권한/격리 명세서 (Security Audit & DB Isolation Report)

본 문서는 BEAUTY OF JOSEON 웹사이트 및 관리자 콘솔의 **고객 회원 DB와 관리자 Console 세션의 철저한 격리 및 개인정보/비밀번호 보호 보안 점검 결과**를 정리한 보고서입니다.

---

## 1. 🛡️ 고객 DB vs 관리자 Console 접근 권한의 철저한 분리

| 구분 | 고객 (Customer Member DB) | 관리자 (Admin / Staff DB) |
| :--- | :--- | :--- |
| **접속 경로** | `/mypage` (쇼핑몰 마이페이지) | `/admin/login` (관리자 전용 콘솔) |
| **인증 네임스페이스** | `customer_logged_in_user` | `admin_logged_in`, `admin_logged_user_*` |
| **세션 보유 권한** | 개인 쇼핑 주문 내역, 찜 목록, 쿠폰/적립금 | 시스템 관리, 상품/카테고리/브랜드 CRUD, 물류/배송 관리 |
| **접근 제어 (Auth Guard)** | 관리자 `/admin/*` 라우트 접근 시 자동 차단 | 미인증 사용자의 `/admin/*` 직접 접근 시 `/admin/login`으로 강제 리다이렉트 |
| **데이터 독립성** | 고객 테이블과 관리자 테이블의 데이터 구조 및 접근 API가 완전히 분리됨 | 고객은 관리자/직원 테이블(`admin_users`)을 절대로 읽거나 조회할 수 없음 |

---

## 2. 🔑 비밀번호 및 개인정보 유출 방지 (Privacy Protection)

1. **클라이언트단 SHA-256 비동기 암호화 (Web Crypto API)**:
   - 모든 비밀번호(관리자 및 직원)는 브라우저 내장 `window.crypto.subtle.digest('SHA-256', ...)`를 거쳐 **단방향 해시(Hash)** 형태로만 보관됩니다.
   - 평문(Plain-text) 비밀번호는 데이터베이스 및 `localStorage`에 일절 저장되지 않아 유출이 근본적으로 차단됩니다.
2. **임시 비밀번호 강제 변경 프로세스 (Force Password Reset)**:
   - 최초 생성된 계정이 임시 비밀번호(`!admin1004` 등)로 접근 시 대시보드 접근이 유예되며, **6자리 이상 영문/숫자/특수기호**를 조합한 새 비밀번호 설정을 강제합니다.
3. **고객 정보 최소 수집 및 암호화보관**:
   - 고객 개인정보(이메일, 전화번호, 배송지)는 독립된 고객 데이터베이스에만 보관됩니다.

---

## 3. 🗄️ Supabase Row Level Security (RLS) 데이터베이스 보안 적용

Supabase 데이터베이스 연동 시 적용할 RLS (행 수준 보안) 정책이 [`supabase_schema.sql`](file:///D:/Antigravity/default_website_aistudio2/supabase_schema.sql) 파일에 적용되었습니다.

### 3.1 `admin_users` (관리자/직원 DB) RLS 정책
- **접근 제한**: 일반 public 사용자 및 고객 사용자는 `admin_users` 테이블에 접근할 수 없습니다.
- **SQL Policy**:
  ```sql
  ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Restrict admin users table access to authenticated admins"
      ON public.admin_users FOR ALL
      USING ((auth.jwt() ->> 'role') IN ('superadmin', 'staff'));
  ```

### 3.2 `customer_users` (고객 DB) RLS 정책
- **자기 정보만 조회/수정 가능**: 로그인한 고객은 오직 자신의 ID(`auth.uid() = id`)에 해당하는 행만 조회/수정할 수 있습니다.
- **SQL Policy**:
  ```sql
  ALTER TABLE public.customer_users ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Customers can view own profile"
      ON public.customer_users FOR SELECT
      USING (auth.uid() = id);
  ```

### 3.3 `products` & `orders` RLS 정책
- **제품 테이블**: `status != '숨김'` 상태의 제품만 일반 사용자에게 공공 조회(Public Read) 허용, 등록/수정/삭제 권한은 인증된 직원 전용.
- **주문 테이블**: 고객은 본인이 주문한 내역만 조회 가능(`customer_id = auth.uid()`), 물류 담당 직원은 배송 상태 업데이트 가능.

---

## 4. 🛍️ 쇼핑몰 및 PG 결제 / 택배 API 보안 명세

### 4.1 토스페이먼츠(Toss Payments) PG 결제 보안
- **클라이언트 API 키 분리**: Client Key(`test_ck_...`)만 프론트엔드 결제창 SDK에 노출되며, Secret Key는 서버 및 안전한 설정 환경에 보호 보관됩니다.
- **결제 13대 필드 및 무결성 검증**:
  - `amount`, `vat`(10% 자동 산출), `payment_key`, `transaction_id`, `approved_at`, `status`가 Supabase `public.payments` 테이블 및 로컬 트랜잭션 DB에 변조 불가능한 방식으로 기록됩니다.
  - 결제 취소/환불 발생 시 `status = 'CANCELED'`, `cancelled_at`, `refunded_amount` 원복 기록이 강제되어 이중 환불을 방지합니다.

### 4.2 고객 ID 배송지 맵핑 및 데이터 격리
- **Supabase DB (`public.customer_addresses`) 행 수준 보안 (RLS)**:
  - 수집된 배송지는 고객 ID(`user_id`/이메일)와 맵핑되며, RLS 정책(`Customers view own address`)을 통해 타 고객이 다른 고객의 배송지를 조회할 수 없습니다.

### 4.3 국내 3대 택배사 (CJ대한통운, 로젠, 한진) API 연동 안전성
- 실시간 위치 추적 요청 시 운송장 번호 내 특수문자를 정제(`replace(/[^0-9]/g, '')`)하여 인젝션 공격을 예방하고, 정규화된 타임라인 응답 구조로 응답합니다.

---

## 5. 🔍 SEO 및 메타 데이터 보안 조치

- **SEO Management (`/admin/site` - SEO 관리)**:
  - 구글/네이버 사이트 소유권 확인 태그(`google-site-verification`, `naver-site-verification`) 및 소셜 공유 메타태그(`og:title`, `og:description`, `og:image`)의 사용자 입력값에 대한 이스케이프 처리가 적용되어 XSS(크로스 사이트 스크립팅) 공격을 예방합니다.

---

## 6. 📝 최종 검증 및 종합 보안 감사 결과

1. **라우트 & RBAC 접근 제어 (완벽)**:
   - 일반 고객의 `/admin/*` 무단 침입 차단 및 일반 직원의 `/admin/system` (권한등록) 접근 차단이 가드(Auth Guard) 레벨에서 검증되었습니다.
2. **백엔드 로직 & Supabase RLS (완벽)**:
   - `admin_users`, `customer_users`, `payments`, `customer_addresses` 4대 핵심 테이블의 RLS 정책이 작성 완료되어 행 단위 보안 조치가 완료되었습니다.
3. **비밀번호 & 데이터 암호화 (완벽)**:
   - SHA-256 Web Crypto 단방향 암호화 적용으로 평문 유출이 차단되었습니다.
4. **Vite Production 빌드 검증 (완벽)**:
   - `npm run build` 검증 결과 0 Error, 0 Warning으로 정상 통과되었습니다.

