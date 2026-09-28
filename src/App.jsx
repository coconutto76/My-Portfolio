import { useEffect, useRef, useState } from 'react'
import NavBar from './components/NavBar'
import ProfileSection from './components/ProfileSection'
import SectionPreview from './components/SectionPreview'
import SectionPage from './components/SectionPage'
import ItemDetail from './components/ItemDetail'
import ItemForm from './components/ItemForm'
import AdminBar from './components/AdminBar'
import LoginPanel from './components/LoginPanel'
import useSection from './hooks/useSection'
import useProfileRow from './hooks/useProfileRow'
import useAuth from './hooks/useAuth'
import { deleteRow, saveProfile } from './lib/admin'
import { SECTIONS, SECTION_ORDER, PROFILE_FIELDS } from './lib/content'
import { profile as fallback } from './data'

// 주소에 ?admin 이 붙어 있으면 관리자 모드로 들어간다.
// 화면 어디에도 로그인 버튼을 두지 않는다.
function wantsAdmin() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('admin')
}

export default function App() {
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [adminError, setAdminError] = useState(null)

  // { sectionKey, item } 이면 글 폼, { profile: true } 면 소개 폼
  const [form, setForm] = useState(null)

  // 어떤 섹션에서 어떤 키워드가 켜져 있는지 — { games: '중독', ... }
  const [activeKeywords, setActiveKeywords] = useState({})

  const games = useSection('games')
  const papers = useSection('papers')
  const records = useSection('records')
  const data = { games, papers, records }

  const profileRow = useProfileRow()
  const { user, isAdmin, checking, signIn, signOut } = useAuth()

  const [showLogin, setShowLogin] = useState(false)
  const topRef = useRef(null)

  useEffect(() => {
    if (!checking && wantsAdmin() && !isAdmin) setShowLogin(true)
  }, [checking, isAdmin])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  function handleNav(key) {
    if (key === 'profile') {
      setView('home')
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    setView(key)
  }

  // 같은 키워드를 다시 누르면 해제된다.
  function toggleKeyword(sectionKey, word) {
    setActiveKeywords((prev) => ({
      ...prev,
      [sectionKey]: prev[sectionKey] === word ? null : word,
    }))
  }

  // 상세 보기에서 키워드를 누르면 그 섹션 목록으로 이동해 강조한다.
  function keywordFromDetail(word) {
    const key = selected?.sectionKey
    if (!key) return
    setActiveKeywords((prev) => ({ ...prev, [key]: word }))
    setSelected(null)
    setView(key)
  }

  async function handleDelete(item) {
    const section = SECTIONS[item.sectionKey]
    if (!window.confirm(`"${item.title}" 을(를) 삭제할까요? 되돌릴 수 없습니다.`)) return
    try {
      await deleteRow(section.table, item.id)
      setSelected(null)
      data[item.sectionKey].reload()
    } catch (err) {
      setAdminError(err.message)
    }
  }

  function handleSaved(savedSectionKey) {
    const wasProfile = form?.profile
    setForm(null)
    setSelected(null)
    if (wasProfile) profileRow.reload()
    else if (savedSectionKey && data[savedSectionKey]) data[savedSectionKey].reload()
  }

  const activeNav = view === 'home' ? 'profile' : view

  return (
    <>
      {isAdmin && (
        <AdminBar
          email={user?.email}
          onNewPost={() => setForm({ sectionKey: null, item: null })}
          onEditProfile={() => setForm({ profile: true, item: profileRow.row })}
          onSignOut={signOut}
        />
      )}

      <span ref={topRef} />
      <NavBar name={fallback.name} active={activeNav} onNavigate={handleNav} />

      {view === 'home' ? (
        <>
          <div className="masthead wrap">
            <h1 className="masthead__name">{profileRow.row?.name || fallback.name}</h1>
            <blockquote className="masthead__quote">{fallback.role}</blockquote>
            <div className="masthead__meta">
              <span>Game Designer</span>
              <span>{fallback.location}</span>
              <a href={`mailto:${fallback.email}`}>{fallback.email}</a>
            </div>
          </div>

          <ProfileSection
            row={profileRow.row}
            isAdmin={isAdmin}
            onEdit={() => setForm({ profile: true, item: profileRow.row })}
          />

          {SECTION_ORDER.map((key) => (
            <SectionPreview
              key={key}
              section={SECTIONS[key]}
              status={data[key].status}
              items={data[key].items}
              error={data[key].error}
              onOpen={setSelected}
              onMore={setView}
              activeKeyword={activeKeywords[key] ?? null}
              onKeyword={toggleKeyword}
            />
          ))}
        </>
      ) : (
        <SectionPage
          key={view}
          section={SECTIONS[view]}
          status={data[view].status}
          items={data[view].items}
          error={data[view].error}
          onOpen={setSelected}
          onBack={() => setView('home')}
          activeKeyword={activeKeywords[view] ?? null}
          onKeyword={toggleKeyword}
        />
      )}

      <footer className="footer" id="contact">
        <div className="wrap">
          <p className="eyebrow">Contact</p>
          <h2>Let's make<br />something playful.</h2>
          <a className="mail" href={`mailto:${fallback.email}`}>{fallback.email}</a>
          <div className="footer__base">
            <span>© {new Date().getFullYear()} {fallback.name}</span>
            {isAdmin && <button className="link-btn" onClick={signOut}>로그아웃</button>}
          </div>
        </div>
      </footer>

      {selected && (
        <ItemDetail
          item={selected}
          isAdmin={isAdmin}
          onEdit={() => setForm({ sectionKey: selected.sectionKey, item: selected })}
          onDelete={() => handleDelete(selected)}
          onClose={() => setSelected(null)}
          onKeyword={keywordFromDetail}
        />
      )}

      {showLogin && <LoginPanel onSignIn={signIn} onClose={() => setShowLogin(false)} />}

      {form?.profile && (
        <ItemForm
          profileSection={{ label: 'Profile', table: 'profile', fields: PROFILE_FIELDS }}
          item={form.item}
          saveFn={(payload) => saveProfile(form.item?.id ?? null, payload)}
          onSaved={handleSaved}
          onClose={() => setForm(null)}
        />
      )}

      {form && !form.profile && (
        <ItemForm
          sectionKey={form.sectionKey}
          item={form.item}
          onSaved={handleSaved}
          onClose={() => setForm(null)}
        />
      )}

      {adminError && (
        <div className="toast" role="alert">
          <span>{adminError}</span>
          <button className="link-btn" onClick={() => setAdminError(null)}>닫기</button>
        </div>
      )}
    </>
  )
}
