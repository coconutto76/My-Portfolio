// ─────────────────────────────────────────────────────────────
// 섹션(표) 정의를 한 곳에 모은다.
//
// 화면과 관리자 폼이 모두 이 정의를 보고 만들어지므로,
// 컬럼을 추가하려면 여기만 고치면 된다.
//
// 입력 종류: text | textarea | url | file | select
// ─────────────────────────────────────────────────────────────

// 홈에 고정할 자리. 비우면 고정하지 않는다.
const PIN_FIELD = {
  name: 'pin_order',
  label: '첫 화면에 올리기',
  type: 'select',
  options: [
    { value: '', label: '올리지 않음' },
    { value: '1', label: '첫 번째' },
    { value: '2', label: '두 번째' },
    { value: '3', label: '세 번째' },
  ],
  hint: '왼쪽부터 1·2·3 순서로 놓입니다. 비워 두면 최신순으로 들어갑니다.',
}

const KEYWORDS_FIELD = {
  name: 'keywords',
  label: '키워드',
  type: 'text',
  placeholder: '중독, 몰입, 협동  (쉼표로 구분)',
  hint: '누르면 세 카테고리 전체에서 같은 키워드를 가진 글이 드러납니다.',
}

export const SECTIONS = {
  games: {
    key: 'games',
    table: 'games',
    label: 'Games',
    heading: 'Games',
    blurb: '규칙과 보상으로 사회적 질문을 설계한 작업',
    folder: 'games',
    imageField: 'cover_image_url',
    columns:
      'id, title, description, year, role, project_type, progress, keywords, link_url, cover_image_url, video_url, youtube_url, pin_order, created_at',
    subtitleOf: (row) => [row.year, row.role, row.project_type].filter(Boolean).join(' · '),
    bodyOf: (row) => row.description,
    fields: [
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'description', label: '설명', type: 'textarea' },
      { name: 'progress', label: '현재 진행 상황', type: 'textarea', placeholder: '예: 프로토타입 완성, 플레이테스트 준비 중' },
      { name: 'year', label: '연도', type: 'text', placeholder: '2025' },
      { name: 'role', label: '역할', type: 'text', placeholder: 'Game Designer' },
      { name: 'project_type', label: '프로젝트 종류', type: 'text', placeholder: '개인 / 팀 / 수업' },
      KEYWORDS_FIELD,
      { name: 'link_url', label: '링크', type: 'url', placeholder: 'https://' },
      { name: 'youtube_url', label: '유튜브 주소', type: 'url', placeholder: 'https://youtu.be/...' },
      { name: 'cover_image_url', label: '대표 이미지', type: 'file', accept: 'image/*', folder: 'games' },
      { name: 'video_url', label: '영상 파일', type: 'file', accept: 'video/*', folder: 'videos' },
      PIN_FIELD,
    ],
  },

  papers: {
    key: 'papers',
    table: 'papers',
    label: 'Papers',
    heading: 'Papers',
    blurb: '게임과 사회를 잇는 연구와 비평',
    folder: 'papers',
    imageField: 'cover_image_url',
    columns:
      'id, title, venue, year, abstract, keywords, link_url, cover_image_url, pin_order, created_at',
    subtitleOf: (row) => [row.venue, row.year].filter(Boolean).join(' · '),
    bodyOf: (row) => row.abstract,
    fields: [
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'venue', label: '발표처 / 매체', type: 'text' },
      { name: 'year', label: '연도', type: 'text', placeholder: '2025' },
      { name: 'abstract', label: '초록 / 요약', type: 'textarea' },
      KEYWORDS_FIELD,
      { name: 'link_url', label: '링크', type: 'url', placeholder: 'https://' },
      { name: 'cover_image_url', label: '대표 이미지', type: 'file', accept: 'image/*', folder: 'papers' },
      PIN_FIELD,
    ],
  },

  archive: {
    key: 'archive',
    table: 'records',   // DB 표 이름은 그대로 둔다 (자료를 옮길 필요가 없도록)
    label: 'Archive',
    heading: 'Archive',
    blurb: '작업과 글이 바깥에 놓인 자리',
    folder: 'records',
    imageField: 'cover_image_url',
    columns: 'id, title, url, description, source, year, keywords, cover_image_url, pin_order, created_at',
    subtitleOf: (row) => [row.source, row.year].filter(Boolean).join(' · '),
    bodyOf: (row) => row.description,
    fields: [
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'url', label: '링크', type: 'url', required: true, placeholder: 'https://' },
      { name: 'description', label: '간단한 설명', type: 'textarea' },
      { name: 'source', label: '출처', type: 'text', placeholder: '매체 이름' },
      { name: 'year', label: '연도', type: 'text', placeholder: '2025' },
      KEYWORDS_FIELD,
      { name: 'cover_image_url', label: '대표 이미지', type: 'file', accept: 'image/*', folder: 'records' },
      PIN_FIELD,
    ],
  },
}

export const SECTION_ORDER = ['games', 'papers', 'archive']

export const NAV_ITEMS = [
  { key: 'profile', label: 'Profile' },
  { key: 'games', label: 'Games' },
  { key: 'papers', label: 'Papers' },
  { key: 'archive', label: 'Archive' },
]

export const PROFILE_FIELDS = [
  { name: 'name', label: '이름', type: 'text' },
  { name: 'bio', label: '소개', type: 'textarea' },
  { name: 'interests', label: '관심 분야', type: 'text', placeholder: '쉼표로 구분' },
  { name: 'profile_image_url', label: '프로필 사진', type: 'file', accept: 'image/*', folder: 'profile/image' },
  { name: 'resume_url', label: '이력서 파일', type: 'file', accept: '.pdf,application/pdf', folder: 'resumes' },
]

// 홈 미리보기에 보여줄 개수 (고정 최대 3 + 나머지 최신순으로 채움)
export const PREVIEW_COUNT = 3

// "중독, 몰입" 같은 문자열을 배열로
export function parseKeywords(raw) {
  if (!raw) return []
  return String(raw)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}
