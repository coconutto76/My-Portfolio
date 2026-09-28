import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import IndexList from './components/IndexList'
import HoverPreview from './components/HoverPreview'
import ItemDetail from './components/ItemDetail'
import ItemForm from './components/ItemForm'
import AdminBar from './components/AdminBar'
import LoginPanel from './components/LoginPanel'
import useSection from './hooks/useSection'
import useProfileRow from './hooks/useProfileRow'
import useAuth from './hooks/useAuth'
import { deleteRow, saveProfile } from './lib/admin'
import { SECTIONS, SECTION_ORDER, PROFILE_FIELDS } from './lib/content'

// 주소에 ?admin 이 붙어 있으면 관리자 모드로 들어간다.
// 화면 어디에도 로그인 버튼을 두지 않는다.
function wantsAdmin() {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('admin')
}

// 첫 화면에서 섹션마다 보여줄 줄 수
const HOME_LIMIT = 3

export default function App() {
  const [view, setView] = useState('home')
  const [selected, setSelected] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [adminError, setAdminError] = useState(null)
  const [form, setForm] = useState(null)
  const [activeKeyword, setActiveKeyword] = useState(null)

  const games = useSection('games')
  const papers = useSection('papers')
  const records = useSection('records')
  const data = { games, papers, records }

  const profileRow = useProfileRow()
  const { user, isAdmin, checking, signIn, signOut } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    if (!checking && wantsAdmin() && !isAdmin) setShowLogin(true)
  }, [checking, isAdmin])

  // 화면을 바꾸면 본문을 맨 위로
  useEffect(() => {
    document.querySelector('.main')?.scrollTo({ top: 0, behavior: 'smooth' })
    setHovered(null)
  }, [view])

  function handleNav(key) {
    if (key === 'profile') {
      setView('home')
      document.querySelector('.main')?.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setView(key)
  }

  function toggleKeyword(word) {
    setActiveKeyword((prev) => (prev === word ? null : word))
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
  const sectionsToShow = view === 'home' ? SECTION_ORDER : [view]

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

      <div className="layout">
        <Sidebar
          row={profileRow.row}
          active={activeNav}
          onNavigate={handleNav}
          isAdmin={isAdmin}
          onEditProfile={() => setForm({ profile: true, item: profileRow.row })}
          activeKeyword={activeKeyword}
          onKeyword={toggleKeyword}
        />

        <main className="main">
          {view !== 'home' && (
            <button className="main__back" onClick={() => setView('home')}>
              ← 전체 인덱스
            </button>
          )}

          {sectionsToShow.map((key) => (
            <IndexList
              key={key}
              section={SECTIONS[key]}
              status={data[key].status}
              items={data[key].items}
              error={data[key].error}
              limit={view === 'home' ? HOME_LIMIT : null}
              onOpen={setSelected}
              onMore={setView}
              activeKeyword={activeKeyword}
              onKeyword={toggleKeyword}
              onHover={setHovered}
            />
          ))}

          <p className="main__end">Play is how we rehearse society.</p>
        </main>
      </div>

      <HoverPreview item={hovered} />

      {selected && (
        <ItemDetail
          item={selected}
          isAdmin={isAdmin}
          onEdit={() => setForm({ sectionKey: selected.sectionKey, item: selected })}
          onDelete={() => handleDelete(selected)}
          onClose={() => setSelected(null)}
          onKeyword={(w) => {
            setActiveKeyword(w)
            setSelected(null)
          }}
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
