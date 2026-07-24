 # Mobile Design & Layout Specification (Trendy Premium Pink)

이 문서는 모바일 웹사이트 구축 시 AI 웹 빌더 및 개발 프로세스(Vibe Coding)의 일관성을 유지하기 위한 디자인/UI/UX 가이드라인입니다.

---

## 🎨 1. Design System & Tokens

### 1.1 Color Palette
* **Main Background (`--bg-main`):** `#FAF5F6` (소프트 로즈 - 따뜻한 핑크빛 아이보리)
* **Card Background (`--bg-card`):** `#FFFFFF` (순백색 - 콘텐츠 모듈화)
* **Sub Container Background (`--bg-sub`):** `#F3E8EC` (소프트 모브 핑크 - 섹션 구분용)
* **Body Text (`--text-body`):** `#2B2326` (딥 로즈 차콜 - 가독성 최우선 소프트 블랙)
* **Caption Text (`--text-caption`):** `#7C6E74` (더스티 로즈 그레이)
* **Primary / Heading (`--primary`):** `#8C3A5A` (트렌디 딥 로즈 - 묵직한 프리미엄 핑크)
* **Accent / CTA (`--accent`):** `#D9779B` (뮤티드 차일드 핑크 - 감각적 Accent)
* **Button Text (`--text-btn`):** `#FFFFFF` (화이트)

### 1.2 Typography (CSS Specification)
* **Hero Title (H1):** `28px` ~ `32px` | Line-height: `1.3` | Font-weight: `700`
* **Section Title (H2):** `20px` ~ `24px` | Line-height: `1.4` | Font-weight: `700`
* **Card / Sub Title (H3):** `18px` | Line-height: `1.4` | Font-weight: `600`
* **Body Text:** `16px` | Line-height: `1.6` | Font-weight: `400`
* **Caption Text:** `13px` ~ `14px` | Line-height: `1.5` | Font-weight: `400`

### 1.3 UI/UX Layout Rules
* **Min Touch Target:** 최소 `44px` × `44px` (버튼, 링크, 메뉴 아이콘 필수)
* **Container Padding:** 좌우 Side Padding 최소 `16px` ~ `20px`
* **Card Elevation:** `box-shadow: 0 4px 12px rgba(140, 58, 90, 0.08);`
* **Border Radius:** 카드 및 버튼 모서리 `12px` ~ `16px` 적용

---

## 📐 2. Page Layout Structure (Mobile First)
 ### Section Details

#### ① Header & GNB
* **Layout:** `flex justify-between items-center`
* **Background:** `--bg-main` (`#FAF5F6`), Sticky Position (`top: 0`, `z-index: 50`)
* **Components:** * Left: 브랜드 로고
  * Right: 햄버거 메뉴 버튼 (Touch Zone: 최소 44px × 44px)

#### ② Hero Section (Brand Main Vision)
* **Background:** `--bg-main` (`#FAF5F6`)
* **Padding:** Top `40px`, Bottom `40px`, Side `20px`
* **Components:**
  * **H1 Title:** 컬러 `--primary` (`#8C3A5A`), 크기 `30px`, Bold
  * **Body Text:** 컬러 `--text-body` (`#2B2326`), 크기 `16px` (브랜드 핵심 가치 요약)
  * **Visual:** 고화질 브랜드 메인 이미지 (Aspect ratio 최적화, Alt 텍스트 필수)

#### ③ Brand Story Section
* **Background:** `--bg-main` (`#FAF5F6`)
* **Components:**
  * **H2 Title:** 컬러 `--text-body` (`#2B2326`), 크기 `22px`
  * **Card Container:** 배경 `--bg-card` (`#FFFFFF`), Padding `20px`, Margin-X `16px`
  * **Box Shadow:** `0 4px 12px rgba(140, 58, 90, 0.08)`
  * **Content:** 가독성을 위해 2~3개 단락으로 구분된 스토리 텍스트 (`16px`)

#### ④ Company Profile & Core Values
* **Background:** `--bg-sub` (`#F3E8EC`) (시각적 구분을 위한 모브 핑크 배경)
* **Padding:** Top `36px`, Bottom `36px`, Side `20px`
* **Layout:** Vertical Stack (1열 모바일 카드리스트)
* **Components:**
  * 회사 기본 정보
  * 3가지 핵심 가치 카드 (타이틀 `--primary` 적용)

#### ⑤ Timeline & Key Milestones
* **Background:** `--bg-main` (`#FAF5F6`)
* **Components:**
  * 세로형 타임라인 레이아웃
  * **Vertical Line & Points:** 컬러 `--accent` (`#D9779B`)
  * **Year Text:** 크기 `18px`, Bold, 컬러 `--primary` (`#8C3A5A`)
  * **Description:** 크기 `14px`, 컬러 `--text-caption` (`#7C6E74`)

#### ⑥ CTA & Footer
* **CTA Section:**
  * **Button Background:** `--primary` (`#8C3A5A`) 또는 `--accent` (`#D9779B`)
  * **Button Text:** `--text-btn` (`#FFFFFF`), `16px`, Bold
  * **Button Size:** Minimum Height `48px`
* **Footer Section:**
  * **Background:** `--text-body` (`#2B2326`) (안정감을 제공하는 딥 차콜)
  * **Text Color:** `--bg-main` (`#FAF5F6`), 크기 `13px`
  * **Content:** 회사 주소, 연락처, 카피라이트 정보


 