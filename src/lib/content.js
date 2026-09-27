// ─────────────────────────────────────────────────────────────
// 섹션(표) 정의를 한 곳에 모은다.
//
// 화면과 관리자 폼이 모두 이 정의를 보고 만들어지므로,
// 컬럼을 추가하려면 여기만 고치면 된다.
// ─────────────────────────────────────────────────────────────

// 관리자 폼에 쓰는 입력 종류
//   text | textarea | url | file | checkbox

export const SECTIONS = {
  games: {
    key: 'games',
    table: 'games',
    label: 'Games',
    heading: 'Games',
    blurb: '제가 만든 게임 프로젝트',
    folder: 'games',
    imageField: 'cover_image_url',
    columns:
      'id, title, description, year, role, project_type, link_url, cover_image_url, video_url, youtube_url, pinned, created_at',
    subtitleOf: (row) => [row.year, row.role, row.project_type].filter(Boolean).join(' · '),
    bodyOf: (row) => row.description,
    fields: [
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'description', label: '설명', type: 'textarea' },
      { name: 'year', label: '연도', type: 'text', placeholder: '2025' },
      { name: 'role', label: '역할', type: 'text', placeholder: 'Game Designer' },
      { name: 'project_type', label: '프로젝트 종류', type: 'text', placeholder: '개인 / 팀 / 수업' },
      { name: 'link_url', label: '링크', type: 'url', placeholder: 'https://' },
      { name: 'youtube_url', label: '유튜브 주소', type: 'url', placeholder: 'https://youtu.be/...' },
      { name: 'cover_image_url', label: '대표 이미지', type: 'file', accept: 'image/*', folder: 'games' },
      { name: 'video_url', label: '영상 파일', type: 'file', accept: 'video/*', folder: 'videos' },
      { name: 'pinned', label: '홈 화면에 고정', type: 'checkbox' },
    ],
  },

  papers: {
    key: 'papers',
    table: 'papers',
    label: 'Papers',
    heading: 'Papers',
    blurb: '제가 쓴 게임 관련 글과 논문',
    folder: 'papers',
    imageField: 'cover_image_url',
    columns:
      'id, title, venue, year, abstract, keywords, pdf_url, link_url, cover_image_url, pinned, created_at',
    subtitleOf: (row) => [row.venue, row.year].filter(Boolean).join(' · '),
    bodyOf: (row) => row.abstract,
    fields: [
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'venue', label: '발표처 / 매체', type: 'text' },
      { name: 'year', label: '연도', type: 'text', placeholder: '2025' },
      { name: 'abstract', label: '초록 / 요약', type: 'textarea' },
      { name: 'keywords', label: '키워드', type: 'text', placeholder: '쉼표로 구분' },
      { name: 'link_url', label: '링크', type: 'url', placeholder: 'https://' },
      { name: 'pdf_url', label: 'PDF 파일', type: 'file', accept: '.pdf,application/pdf', folder: 'papers' },
      { name: 'cover_image_url', label: '대표 이미지', type: 'file', accept: 'image/*', folder: 'papers' },
      { name: 'pinned', label: '홈 화면에 고정', type: 'checkbox' },
    ],
  },

  records: {
    key: 'records',
    table: 'records',
    label: 'Records',
    heading: 'Records',
    blurb: '제 글이나 작업이 언급된 기록',
    folder: 'records',
    imageField: 'cover_image_url',
    columns: 'id, title, url, description, source, year, cover_image_url, pinned, created_at',
    subtitleOf: (row) => [row.source, row.year].filter(Boolean).join(' · '),
    bodyOf: (row) => row.description,
    fields: [
      { name: 'title', label: '제목', type: 'text', required: true },
      { name: 'url', label: '링크', type: 'url', required: true, placeholder: 'https://' },
      { name: 'description', label: '간단한 설명', type: 'textarea' },
      { name: 'source', label: '출처', type: 'text', placeholder: '매체 이름' },
      { name: 'year', label: '연도', type: 'text', placeholder: '2025' },
      { name: 'cover_image_url', label: '대표 이미지', type: 'file', accept: 'image/*', folder: 'records' },
      { name: 'pinned', label: '홈 화면에 고정', type: 'checkbox' },
    ],
  },
}

// 홈에서 위에서 아래로 흐르는 순서
export const SECTION_ORDER = ['games', 'papers', 'records']

// 내비게이션 순서 (Profile 이 첫 화면)
export const NAV_ITEMS = [
  { key: 'profile', label: 'Profile' },
  { key: 'games', label: 'Games' },
  { key: 'papers', label: 'Papers' },
  { key: 'records', label: 'Records' },
]

export const PROFILE_FIELDS = [
  { name: 'name', label: '이름', type: 'text' },
  { name: 'bio', label: '소개', type: 'textarea' },
  { name: 'interests', label: '관심 분야', type: 'text', placeholder: '쉼표로 구분' },
  { name: 'profile_image_url', label: '프로필 사진', type: 'file', accept: 'image/*', folder: 'profile/image' },
  { name: 'resume_url', label: '이력서 파일', type: 'file', accept: '.pdf,application/pdf', folder: 'resumes' },
]

// 홈 미리보기에 보여줄 개수 (고정 1 + 최신 2)
export const PREVIEW_COUNT = 3
