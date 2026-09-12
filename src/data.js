// ─────────────────────────────────────────────────────────────
// 화면에 고정으로 들어가는 내용 (프로필 / 탭 목록)
//
// 작품 데이터는 여기 없다. Supabase 의 projects 표에서 읽어온다.
//   → src/hooks/useProjects.js
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

// 탭 목록.
// 작품은 projects 표의 video_url 유무로 '이미지' / '영상' 으로 나뉜다.
export const categories = [
  { key: 'image', label: '이미지' },
  { key: 'video', label: '영상' },
  { key: 'profile', label: 'Profile' },
]
