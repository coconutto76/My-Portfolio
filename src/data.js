// ─────────────────────────────────────────────────────────────
// 예시 데이터 (지금은 하드코딩, 나중에 로그인/업로드로 교체 예정)
// image 필드는 /public/images 안의 파일을 가리킵니다.
// 파일이 없으면 화면에 "이미지 자리" 플레이스홀더가 표시됩니다.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: '송민서',
  role: '재미와 결합된 임팩트 게임 디자이너',
  intro:
    '플레이어가 웃는 순간에 세상을 바꾸는 질문을 심는다. 재미를 잃지 않으면서 사회적 임팩트를 만드는 게임을 설계한다.',
  email: 'lollop67@g.skku.edu',
  location: 'Seoul, KR',
  portrait: '/images/profile.jpg',
  bio: [
    '성균관대학교에서 게임 디자인을 공부하며, 놀이의 힘으로 실제 행동 변화를 이끄는 프로젝트에 집중해 왔습니다.',
    '기획서와 프로토타입, 레벨 디자인, 내러티브까지 아우르며 "가볍게 시작해서 오래 남는" 경험을 만드는 것을 목표로 합니다.',
  ],
  skills: [
    'Game Design',
    'Level Design',
    'Narrative Design',
    'Rapid Prototyping',
    'Playtesting',
    'Figma / Unity',
  ],
}

// 카테고리 탭: 이미지 / 영상 / Pages / Profile
export const categories = [
  { key: 'image', label: '이미지' },
  { key: 'video', label: '영상' },
  { key: 'pages', label: 'Pages' },
  { key: 'profile', label: 'Profile' },
]

export const works = {
  image: [
    {
      id: 'img-01',
      index: '01',
      title: 'Warm Companion',
      subtitle: '반려동물 케어 시뮬레이션 · 키 비주얼',
      year: '2025',
      image: '/images/work-dog.jpg',
      featured: true,
      description:
        '보호소 강아지를 입양해 함께 살아가는 잔잔한 시뮬레이션 게임의 메인 키 비주얼. 따뜻한 자연광과 시선의 교감을 중심으로 "돌봄"이라는 핵심 정서를 한 장에 담았다.',
      meta: ['Art Direction', 'Key Visual', 'Unsplash 기본 이미지'],
    },
    {
      id: 'img-02',
      index: '02',
      title: 'Quiet Hunter',
      subtitle: '고양이 관찰 퍼즐 · 콘셉트 컷',
      year: '2025',
      image: '/images/work-cat.jpg',
      description:
        '실내 공간에서 고양이의 동선을 예측해 퍼즐을 푸는 게임의 분위기 컷. 정적 속의 긴장감을 표현했다.',
      meta: ['Concept', 'Mood'],
    },
    {
      id: 'img-03',
      index: '03',
      title: 'Slow Morning',
      subtitle: '일상 회복 게임 · 인게임 무드',
      year: '2024',
      image: '/images/work-daily.jpg',
      description:
        '번아웃에서 회복하는 한 달을 다루는 게임. 커피 한 잔, 창가의 빛 같은 사소한 루틴을 플레이의 보상으로 설계했다.',
      meta: ['Systems', 'Narrative'],
    },
    {
      id: 'img-04',
      index: '04',
      title: 'Paper Town',
      subtitle: '종이 공예풍 도시 빌더 · 러프',
      year: '2024',
      image: '/images/work-papertown.jpg',
      description:
        '재활용을 주제로 한 도시 건설 게임의 아트 러프. 실제 파일이 아직 없어 플레이스홀더로 표시된다.',
      meta: ['WIP'],
    },
    {
      id: 'img-05',
      index: '05',
      title: 'Field Notes',
      subtitle: '생태 관찰 카드 게임 · 일러스트',
      year: '2023',
      image: '/images/work-fieldnotes.jpg',
      description:
        '동네 하천의 생물을 기록하는 카드 게임. 관찰 일지를 모으면 지역 생태 지도가 완성된다.',
      meta: ['Card Design', 'Illustration'],
    },
  ],
  video: [
    {
      id: 'vid-01',
      index: '01',
      title: 'Warm Companion — Teaser',
      subtitle: '30초 티저 · 방향성 영상',
      year: '2025',
      image: '/images/video-teaser.jpg',
      featured: true,
      description:
        '입양 첫날의 하루를 압축한 30초 티저. 톤, 사운드, 카메라 무빙의 레퍼런스를 정리한 영상 기획.',
      meta: ['Direction', 'Edit', 'Reference'],
    },
    {
      id: 'vid-02',
      index: '02',
      title: 'Quiet Hunter — Gameplay',
      subtitle: '핵심 루프 플레이 영상',
      year: '2025',
      image: '/images/video-gameplay.jpg',
      description: '한 판의 퍼즐이 풀리는 과정을 담은 플레이 영상. 실제 파일 연결 전 플레이스홀더.',
      meta: ['Capture', 'UX'],
    },
    {
      id: 'vid-03',
      index: '03',
      title: 'Slow Morning — Devlog 01',
      subtitle: '개발 일지 영상',
      year: '2024',
      image: '/images/video-devlog.jpg',
      description: '회복 루프를 어떻게 시스템으로 옮겼는지 설명하는 개발 일지.',
      meta: ['Talk', 'Process'],
    },
    {
      id: 'vid-04',
      index: '04',
      title: 'Playtest Reel',
      subtitle: '플레이테스트 하이라이트',
      year: '2024',
      image: '/images/video-playtest.jpg',
      description: '여러 번의 플레이테스트에서 관찰한 표정과 반응을 모은 릴.',
      meta: ['Research'],
    },
  ],
  pages: [
    {
      id: 'pg-01',
      index: '01',
      title: 'Warm Companion — Design Doc',
      subtitle: '기획서 · 표지 및 주요 스프레드',
      year: '2025',
      image: '/images/page-designdoc.jpg',
      featured: true,
      description:
        '핵심 루프, 감정 곡선, 콘텐츠 로드맵을 담은 40페이지 기획서. 화보처럼 여백을 살린 레이아웃으로 정리했다.',
      meta: ['Editorial', 'Systems', 'Docs'],
    },
    {
      id: 'pg-02',
      index: '02',
      title: 'Level Flow — Chapter 1',
      subtitle: '레벨 플로우 다이어그램',
      year: '2025',
      image: '/images/page-levelflow.jpg',
      description: '1장의 동선과 페이싱을 한 장으로 정리한 플로우. 플레이스홀더로 표시된다.',
      meta: ['Level Design'],
    },
    {
      id: 'pg-03',
      index: '03',
      title: 'Narrative Bible',
      subtitle: '세계관·캐릭터 설정집',
      year: '2024',
      image: '/images/page-bible.jpg',
      description: '톤 앤 매너, 대사 원칙, 캐릭터 관계도를 담은 설정집의 표지 스프레드.',
      meta: ['Narrative', 'Worldbuilding'],
    },
    {
      id: 'pg-04',
      index: '04',
      title: 'Impact Report',
      subtitle: '플레이 이후 행동 변화 리포트',
      year: '2023',
      image: '/images/page-impact.jpg',
      description: '게임 플레이 전후의 설문과 인터뷰를 정리한 임팩트 리포트.',
      meta: ['Research', 'Report'],
    },
  ],
}
