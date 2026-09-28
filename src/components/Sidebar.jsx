import { NAV_ITEMS } from '../lib/content'
import { profile as fallback } from '../data'

// 왼쪽에 고정되는 열 — 이름, 소개, 메뉴, 연락처.
// 오른쪽 본문만 스크롤된다.
export default function Sidebar({ row, active, onNavigate, isAdmin, onEditProfile, activeKeyword, onKeyword }) {
  const name = row?.name || fallback.name
  const bio = row?.bio || fallback.intro
  const interests = (row?.interests || fallback.skills.join(', '))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  return (
    <aside className="side">
      <div className="side__top">
        <button className="side__name" onClick={() => onNavigate('profile')}>
          {name}
        </button>
        <p className="side__role">{fallback.role}</p>
      </div>

      <nav className="side__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={active === item.key ? 'is-active' : ''}
            onClick={() => onNavigate(item.key)}
          >
            <span className="side__nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="side__body">
        <p>{bio}</p>

        {interests.length > 0 && (
          <div className="side__block">
            <p className="label">Interests</p>
            <div className="chips">
              {interests.map((k) => (
                <button
                  key={k}
                  className={`chip${activeKeyword === k ? ' is-on' : ''}`}
                  onClick={() => onKeyword(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="side__foot">
        {row?.resume && (
          <a href={row.resume} target="_blank" rel="noreferrer noopener" className="side__link">
            Résumé ↗
          </a>
        )}
        <a href={`mailto:${fallback.email}`} className="side__link">
          {fallback.email}
        </a>
        <p className="side__meta">
          {fallback.location} · © {new Date().getFullYear()}
        </p>
        {isAdmin && (
          <button className="link-btn side__edit" onClick={onEditProfile}>
            소개 수정
          </button>
        )}
      </div>
    </aside>
  )
}
