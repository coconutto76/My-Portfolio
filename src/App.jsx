import { useEffect, useRef, useState } from 'react'
import NavBar from './components/NavBar'
import CategoryPage from './components/CategoryPage'
import Profile from './components/Profile'
import WorkDetail from './components/WorkDetail'
import AdminBar from './components/AdminBar'
import LoginPanel from './components/LoginPanel'
import WorkForm from './components/WorkForm'
import useProjects from './hooks/useProjects'
import useAuth from './hooks/useAuth'
import { deleteProject } from './lib/admin'
import { categories, profile } from './data'

export default function App() {
  const [tab, setTab] = useState('image') // image | video | profile
  const [selected, setSelected] = useState(null) // 상세 보기 중인 작품
  const worksRef = useRef(null)
  const footerRef = useRef(null)

  // Supabase 의 projects 표에서 최신순으로 읽어온다.
  const { status, works, error, reload } = useProjects()

  // 관리자 로그인 상태
  const { user, isAdmin, signIn, signOut } = useAuth()

  const [showLogin, setShowLogin] = useState(false)
  // undefined = 닫힘 / null = 새 작품 / 작품객체 = 수정
  const [formWork, setFormWork] = useState(undefined)
  const [adminError, setAdminError] = useState(null)

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

  const navActive = tab === 'profile' ? 'about' : 'works'

  async function handleDelete(work) {
    const ok = window.confirm(`"${work.title}" 작품을 삭제할까요? 되돌릴 수 없습니다.`)
    if (!ok) return

    try {
      await deleteProject(work.rawId)
      setSelected(null)
      reload()
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function handleSaved() {
    setFormWork(undefined)
    setSelected(null)
    reload()
  }

  return (
    <>
      {isAdmin && (
        <AdminBar
          email={user?.email}
          onNewWork={() => setFormWork(null)}
          onSignOut={signOut}
        />
      )}

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
          items={works?.[tab]}
          status={status}
          error={error}
          onOpen={setSelected}
        />
      )}

      {/* Contact 푸터 */}
      <footer className="footer" ref={footerRef} id="contact">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h2>
            Let's make
            <br />
            something playful.
          </h2>
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className="footer__base">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span>
              {isAdmin ? (
                <button className="link-btn" onClick={signOut}>
                  로그아웃
                </button>
              ) : (
                <button className="link-btn" onClick={() => setShowLogin(true)}>
                  관리자 로그인
                </button>
              )}
            </span>
          </div>
        </div>
      </footer>

      {selected && (
        <WorkDetail
          work={selected}
          isAdmin={isAdmin}
          onEdit={() => setFormWork(selected)}
          onDelete={() => handleDelete(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {showLogin && (
        <LoginPanel onSignIn={signIn} onClose={() => setShowLogin(false)} />
      )}

      {formWork !== undefined && (
        <WorkForm
          work={formWork}
          onSaved={handleSaved}
          onClose={() => setFormWork(undefined)}
        />
      )}

      {adminError && (
        <div className="toast" role="alert">
          <span>{adminError}</span>
          <button className="link-btn" onClick={() => setAdminError(null)}>
            닫기
          </button>
        </div>
      )}
    </>
  )
}
