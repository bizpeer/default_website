# 📘 관리자 콘솔 종합 기능설명서 (Admin Console Functional Manual)

본 문서는 BEAUTY OF JOSEON 웹사이트 및 커머스 백오피스의 **전체 관리자 메뉴별 상세 기능, 연동 아키텍처 및 운용 지침**을 완벽하게 정리한 통합 설명서입니다.

---

## 📋 목차 (Table of Contents)

1. [시스템 접근 및 보안 관리 (Login & Security)](#1-시스템-접근-및-보안-관리-login--security)
2. [메뉴 1: 대시보드 (Dashboard)](#2-메뉴-1-대시보드-dashboard)
3. [메뉴 2: 사이트 정보 및 SEO 관리 (Site & SEO Management)](#3-메뉴-2-사이트-정보-및-seo-관리-site--seo-management)
4. [메뉴 3: 콘텐츠 & 미디어 관리 (Content & Media Management)](#4-메뉴-3-콘텐츠--미디어-관리-content--media-management)
5. [메뉴 4: 제품 관리 (Product Management)](#5-메뉴-4-제품-관리-product-management)
6. [메뉴 5: 쇼핑몰 & 토스페이먼츠 PG 관리 (Shop Management)](#6-메뉴-5-쇼핑몰--토스페이먼츠-pg-관리-shop-management)
7. [메뉴 6: 주문확인 & 물류관리 (Orders & Logistics)](#7-메뉴-6-주문확인--물류관리-orders--logistics)
8. [메뉴 7: 고객 관리 & 회원등급 산정 (Customer Management)](#8-메뉴-7-고객-관리--회원등급-산정-customer-management)
9. [메뉴 8: 권한등록 & 운영자 관리 (System & Staff Management)](#9-메뉴-8-권한등록--운영자-관리-system--staff-management)

---

## 1. 🔑 시스템 접근 및 보안 관리 (Login & Security)

- **접속 경로**: `/admin/login` (고객 쇼핑몰과 철저히 격리된 관리자 전용 포털)
- **계정 체계 및 역할 기반 접근 제어 (RBAC)**:
  - `siteadmin` (최고 관리자): 모든 시스템 설정, 최고 권한 및 직원 권한 관리 전용 계정.
  - `staff` (물류직원/쇼핑몰운영직원): `siteadmin`이 지정/부여한 메뉴(대시보드, 콘텐츠, 제품, 주문/물류, 고객 등)만 접근 가능.
- **🔒 siteadmin 고유 전용 권한 규칙**:
  1. **쇼핑몰 전역 운영 On/Off 스위치** (대시보드)
  2. **Resend 이메일 연동 API Key 설정** (사이트 정보)
  3. **토스페이먼츠 PG 연동 메뉴 & Key 설정** (쇼핑몰/PG 관리)
  4. **권한등록 & 운영자 관리 메뉴** (직원 계정 생성 및 권한 부여/회수)
- **보안 조치**:
  - **SHA-256 클라이언트 단방향 암호화**: 평문 비밀번호 유출이 근본적으로 차단됩니다.
  - **임시 비밀번호 강제 변경 프로세스**: 최초 로그인 시 대시보드 진입 전 안전한 새 비밀번호 설정을 강제합니다.
  - **라우트 가드 (Auth Guard)**: 미인증 사용자의 `/admin/*` URL 직접 진입 시 자동 차단 및 로그인 페이지 리다이렉트.

---

## 2. 📊 메뉴 1: 대시보드 (Dashboard)

- **접속 경로**: `/admin/dashboard`
- **주요 기능**:
  1. **핵심 실시간 KPI 모니터링**:
     - 오늘 총 결제 매출액 (원)
     - 전체 누적 주문 건수
     - 등록 제품 수 (판매 중 제품 수)
     - 미답변 고객 문의 건수
  2. **쇼핑몰 전역 운영 ON / OFF 스위치**:
     - `siteadmin` 권한으로 쇼핑몰 전체 기능을 즉시 활성화/비활성화 제어.
  3. **최근 주문 및 결제 내역 퀵 모니터링**:
     - 실시간 발생한 주문의 결제 수단, 결제 금액, 주문자 성명, 배송 상태를 한눈에 파악.

---

## 3. 🌐 메뉴 2: 사이트 정보 및 SEO 관리 (Site & SEO Management)

- **접속 경로**: `/admin/site`
- **주요 기능**:

### 3.1 브랜드 및 회사 대표 정보 관리
- **브랜드명 관리**: 한국어 브랜드명(예: `조선미녀`) 및 영문 브랜드명(`BEAUTY OF JOSEON`) 설정 (전역 파비콘/헤더/Footer 자동 반영).
- **대표이사 인사말 (CEO Message)**: 대표이사 성명, 직함, 메시지 본문, 프로필 사진 파일 업로드 및 서명/인장 이미지 등록.
- **회사개요 (Overview) 설정**:
  - 브랜드 미션 (Mission), 설립년도, 임직원 수, 글로벌 지사 수
  - **사업영역 (Business) 설정**: 사업영역 섹션 제목 및 본문 내용(줄바꿈 지원) 동적 편집 관리.
- **사업자 Footer 정보 편집**:
  - 상호명, 대표자 성명, 사업자등록번호, 통신판매업신고번호, 개인정보보호책임자, 고객센터 전화번호 및 이메일.

### 3.2 SEO (검색엔진 최적화) Management
- **기본 메타 태그**: Meta Title, Meta Description, 검색 키워드(Keywords), Robots (`index, follow`).
- **소셜 공유 카드 (Open Graph)**:
  - `og:title`, `og:description`, `og:image` (카카오톡, 페이스북 공유 썸네일) 설정.
- **검색엔진 소유권 확인 태그**:
  - 구글 메타 태그 (`google-site-verification`) 및 네이버 메타 태그 (`naver-site-verification`) 등록.

### 3.3 Resend 이메일 발송 연동
- Resend API Key 입력 및 고객 문의 답변 이메일 즉시 테스트 발송 기능.

---

## 4. 🎬 메뉴 3: 콘텐츠 & 미디어 관리 (Content & Media Management)

- **접속 경로**: `/admin/content`, `/admin/content/new`
- **주요 기능**:
  - **브랜드 스토리 & 무드 필름 (Mood Film)**: 비디오 URL 및 고화질 썸네일 이미지 등록.
  - **언론 보도자료 & 브랜드 아티클**: 아티클 제목, 요약, 출처 및 썸네일 등록/삭제.
  - **미디어 센터 갤러리**: 카테고리별 홍보 영상 및 브랜드 미디어 자산 관리.

---

## 5. 📦 메뉴 4: 제품 관리 (Product Management)

- **접속 경로**: `/admin/products`
- **주요 기능**:
  - **카테고리 관리자 (Category Manager)**:
    - 카테고리명(표시용) 및 고유 키 추가/수정/삭제.
    - 쇼핑몰 네비게이션 필터 및 상품 등록 폼에 동적 연동.
  - **이미지 URL 입력 & 5MB 이하 파일 업로드**:
    - 외부 Direct Image URL 입력 및 컴퓨터 로컬 파일 직접 업로드 지원.
    - `file.size <= 5MB` 용량 초과 검증 토스트 안내 및 FileReader 데이터 변환.
  - **상위 노출 3개 선택 제어 (Featured Products)**:
    - 쇼핑몰 최상단에 우선 노출될 상위 3개 대표 상품 지정 기능 (`isFeatured`).
    - 3개 초과 선택 시 자동 차단 알림 통제 및 쇼핑몰 골드 `★ BEST 상위 노출` 배지 노출.
  - **제품 등록 / 수정 / 삭제 (CRUD)**:
    - 제품명, 정가, 할인가, 재고 수량, 제형(Texture), 피부 타입(Skin Type), 핵심 성분 지정.
  - **진열 상태 제어**: `판매중 (IN STOCK)`, `품절 (SOLD OUT)` 전환.

---

## 6. 🛒 메뉴 5: 쇼핑몰 & 토스페이먼츠 PG 관리 (Shop Management)

- **접속 경로**: `/admin/shop`
- **주요 기능**:
  - **토스페이먼츠 (Toss Payments) 메인 PG 연동 설정**:
    - Client Key (`test_ck_...`), Secret Key, 가맹점 MID 지정.
    - 기본 결제 수단 (신용카드, 계좌이체, 가상계좌, 간편결제 등) 선택.
    - 테스트 모드 (`isTestMode`) ↔ 실운영 결제 모드 원클릭 전환.
  - **메인 프로모션 배너 관리**: 쇼핑몰 상단 슬라이드 배너 이미지 및 이동 링크 등록.

---

## 7. 🚛 메뉴 6: 주문확인 & 물류관리 (Orders & Logistics)

- **접속 경로**: `/admin/orders`
- **주요 기능**:

### 7.1 토스페이먼츠 13대 결제 DB 수집 조회
- 결제 시 자동 기록된 `order_id`, `user_id`, `pg` (`TOSSPAYMENTS`), `payment_key`, `transaction_id`, `amount`, `vat`(부가세 10%), `status`, `method`, `approved_at`, `cancelled_at`, `refunded_amount` 등 13대 필수 필드 조회.

### 7.2 국내 3대 택배사 API 연동 & 배송 추적
- **택배사 선택**: **CJ대한통운**, **로젠택배**, **한진택배** 중 선택 후 운송장 번호 입력.
- **실시간 API 배송 추적 모달 (`CourierTrackingModal`)**:
  - 관리자 및 고객 마이페이지에서 택배사 API를 호출하여 배송 타임라인(집화 ➔ 이동중 ➔ 배달완료) 실시간 조회.

### 7.3 주문 취소 & 토스페이 PG 결제 자동 환불
- 주문 목록에서 **`🚫 주문취소 & 환불`** 클릭 시:
  - 주문 상태가 **`주문취소`**로 즉시 변경됩니다.
  - Supabase `payments` DB의 해당 거래가 **`CANCELED`**, **`cancelled_at`**, **`refunded_amount`**로 원복 및 PG 결제 승인이 자동 취소/환불 처리됩니다.

---

## 8. 👥 메뉴 7: 고객 관리 & 회원등급 산정 (Customer Management)

- **접속 경로**: `/admin/customers`
- **주요 기능**:

### 8.1 가변 회원 등급 승급 기준 설정 (Configurable Tier Policy)
- **Silver 승급 기준**: 완료 결제 횟수 **N회 이상** (기본 1회 이상) 관리자가 지정 가능.
- **Gold VIP 승급 기준**: 완료 결제 횟수 **M회 이상** (기본 3회 이상) 관리자가 지정 가능.
- **승급 축하 적립금**: Silver / Gold VIP 승급 시 자동 부여할 보너스 포인트 금액 설정.
- **[기준 저장 & 전체 회원 일괄 재산정]**:
  - 승급 기준 변경 시 전체 회원의 결제 횟수를 계산하여 백엔드/DB에서 실시간으로 일괄 등급을 재산정 승급 업데이트합니다.

### 8.2 회원 등급별 적립금(포인트) 일괄 지급
- **대상 등급 지정**: `GOLD VIP 전체`, `SILVER 전체`, `BRONZE 전체`, `전체 회원`.
- **일괄 포인트 지급**: 사유(메모)와 함께 지정 포인트 금액을 대상 회원 그룹에 일괄 차감/지급 동기화.

### 8.3 소셜 인증 배지 & 고객 ID 맵핑 배송지 조회
- **Google & Naver 소셜 인증 배지**: Google (🟢 Google) / Naver (🟢 Naver) / 일반 이메일 가입 3종 소셜 인증 수단 표시.
- **최종 배송지 자동 맵핑 기록**: 고객이 자사몰에서 1회 이상 주문 시 입력한 수령인, 전화번호, 우편번호, 배송지 주소가 고객 계정 ID에 자동 맵핑 저장되며, 재주문 시 주문서 및 마이페이지에서 자동 완성으로 표출.
- **특정 회원 개별 포인트 부여 및 직권 수동 등급 변경** 지원.

---

## 9. ⚙️ 메뉴 8: 권한등록 & 운영자 관리 (System & Staff Management)

- **접속 경로**: `/admin/system`
- **접근 제한**: 오직 `siteadmin` (최고 관리자) 계정만 접근 가능한 특수 보안 메뉴.
- **주요 기능**:
  - **운영자 / 직원 계정 신규 생성**: 직원 성명, 이메일, 부서, 비밀번호 설정.
  - **메뉴별 상세 세부 권한 (RBAC Permissions) 지정**:
    - 대시보드, 사이트 정보, 콘텐츠 관리, 제품 관리, 쇼핑몰 관리, 주문/물류 관리, 고객 관리 권한을 직원별로 선택적 부여/차감.

---

## 📝 관리자 시스템 최종 검증 현황

- **프로덕션 빌드 (Vite Build)**: 0 Error, 0 Warning 통과.
- **보안 검증 (Security Audit)**: SHA-256 단방향 암호화 및 Supabase Row Level Security (RLS) 적용 완료.
- **배포 서버**: Cloudflare Pages (`https://website2-751.pages.dev/admin/login`) 실시간 동기화 완료.
