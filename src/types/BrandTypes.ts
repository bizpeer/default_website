export interface PhilosophyCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl?: string;
  badge?: string;
}

export interface MoodFilmItem {
  id: string;
  title: string;
  caption: string;
  mediaType: 'video' | 'image';
  videoUrl?: string; // Uploaded MP4 dataURL or Youtube/Vimeo/MP4 link
  thumbnailUrl?: string;
  badge?: string;
}

export interface BrandStorySettings {
  heroTagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroVideoUrl: string; // Uploaded video file or video URL
  heroPosterUrl?: string;

  philosophyTitle: string;
  philosophySubtitle: string;
  philosophyCards: PhilosophyCard[];

  filmSectionTitle: string;
  filmSectionSubtitle: string;
  moodFilms: MoodFilmItem[];

  signatureQuote: string;
  signatureAuthor: string;
}

export const defaultBrandStorySettings: BrandStorySettings = {
  heroTagline: 'HERITAGE & MODERN DERMATOLOGY',
  heroHeadline: '시대를 뛰어넘는 자연의 지혜,\n피부 본연의 빛을 되찾다',
  heroSubheadline: '조선 시대 여성들의 지혜로운 한방 처방과 현대 피부 과학의 결합으로 탄생한 럭셔리 클린 뷰티',
  heroVideoUrl: 'https://cdn.coverr.co/videos/coverr-skincare-routine-and-serum-5192/1080p.mp4',
  heroPosterUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop',

  philosophyTitle: 'BRAND PHILOSOPHY & CRAFTSMANSHIP',
  philosophySubtitle: '조선미녀가 추구하는 3가지 핵심 아름다움의 가치',
  philosophyCards: [
    {
      id: 'phil-1',
      title: '한방 원료의 순수한 정수',
      subtitle: 'Rice & Ginseng Heritage',
      description: '쌀겨수, 인삼, 녹차, 매실 등 오랜 세월 검증된 조선의 한방 성분을 최고 등급 추출 기술로 정제합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1608248597260-50c39f70a784?q=80&w=800&auto=format&fit=crop',
      badge: 'Natural Ingredients',
    },
    {
      id: 'phil-2',
      title: '현대 스킨케어 공학의 혁신',
      subtitle: 'Clean & Dermatological Science',
      description: '민감성 피부 테스트 완료, 유해 성분 배제로 매일 안심하고 바를 수 있는 현대적 스킨케어 텍스처를 선사합니다.',
      imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
      badge: 'Modern Science',
    },
    {
      id: 'phil-3',
      title: '글로벌 모던 뷰티의 표준',
      subtitle: 'Global Luxury Standard',
      description: '미주, 유럽, 아시아 등 전 세계 60개국 이상의 고객들이 극찬한 K-뷰티 대표 럭셔리 브랜드로 자리매김했습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop',
      badge: 'Global Heritage',
    },
  ],

  filmSectionTitle: 'BRAND MOOD FILM & GALLERY',
  filmSectionSubtitle: '감각적인 영상과 이미지로 경험하는 조선미녀 오가닉 무드',
  moodFilms: [
    {
      id: 'film-1',
      title: '조선미녀 브랜드 필름 : 맑은 피부의 시작',
      caption: '자연에서 피어나는 은은한 생기, 조선 시대 여인들의 맑고 고운 피부 비밀',
      mediaType: 'video',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-applying-facial-cream-5193/1080p.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
      badge: 'Brand Film 4K',
    },
    {
      id: 'film-2',
      title: '조선 맑은 쌀 선크림 시그니처 릴리즈',
      caption: '백탁 없이 투명하고 촉촉하게 스며드는 수분 자외선 차단제 스토리',
      mediaType: 'video',
      videoUrl: 'https://cdn.coverr.co/videos/coverr-putting-serum-on-face-5194/1080p.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop',
      badge: 'Signature Film',
    },
    {
      id: 'film-3',
      title: '인삼 아사이 베리 리바이브 세럼 뷰티 필름',
      caption: '깊은 영양감으로 주름과 피부 장벽을 탄탄하게 케어하는 보습 정수',
      mediaType: 'image',
      thumbnailUrl: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
      badge: 'Visual Gallery',
    },
  ],

  signatureQuote: '화려한 겉모습보다 피부 본연의 건강함과 기품을 가꾸는 것이 진정한 뷰티의 완성입니다.',
  signatureAuthor: 'BEAUTY OF JOSEON ARTISTIC DIRECTOR',
};
