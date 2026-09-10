import { useEffect, useRef, useState } from 'react'
import NavBar from './components/NavBar'
import CategoryPage from './components/CategoryPage'
import Profile from './components/Profile'
import WorkDetail from './components/WorkDetail'
import { categories, works, profile } from './data'

export default function App() {
  const [tab, setTab] = useState('image') // image | video | pages | profile
  const [selected, setSelected] = useState(null) // 상세 보기 중인 작품
  const worksRef = useRef(null)
  const footerRef = useRef(null)

  // 탭이 바뀌면 맨 위 작품 영역으로
  useEffect(() => {
    worksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [tab])

  const handleNav = (key) => {
    if (key === 'about') {
      setTab('profile')
    } else if (key === 'contact') {
      footerRef.current?.scrollIntoView({ behavior: 'smooth' })
    } else {
      setTab((t) => (t === 'profile' ? 'image' : t))
      worksRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navActive =
    tab === 'profile' ? 'about' : 'works'

  return (
    <>
      <NavBar onNavigate={handleNav} active={navActive} />

      {/* 에디토리얼 헤더 */}
      <div className="masthead wrap">
        <h1 className="masthead__name">{profile.name}</h1>
        <blockquote className="masthead__quote">{profile.role}</blockquote>
        <div className="masthead__meta">
          <span>Game Designer</span>
          <span>{profile.location}</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="tabs" ref={worksRef}>
        <div className="tabs__inner">
          {categories.map((c) => (
            <button
              key={c.key}
              className={tab === c.key ? 'is-active' : ''}
              onClick={() => setTab(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 본문 */}
      {tab === 'profile' ? (
        <Profile />
      ) : (
        <CategoryPage
          key={tab}
          label={categories.find((c) => c.key === tab).label}
          categoryKey={tab}
          items={works[tab]}
          onOpen={setSelected}
        />
      )}

      {/* Contact 푸터 */}
      <footer className="footer" ref={footerRef} id="contact">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h2>Let's make<br />something playful.</h2>
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="footer__base">
            <span>© {new Date().getFullYear()} {profile.name}</span>
            <span>Editorial portfolio · React + Vite</span>
          </div>
        </div>
      </footer>

      {selected && (
        <WorkDetail work={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
