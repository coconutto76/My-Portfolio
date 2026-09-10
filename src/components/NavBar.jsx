import { profile } from '../data'

// 상단 내비게이션: 이름 + Works / About / Contact
export default function NavBar({ onNavigate, active }) {
  const links = [
    { key: 'works', label: 'Works' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ]

  return (
    <header className="nav">
      <div className="nav__inner">
        <button className="nav__brand" onClick={() => onNavigate('works')}>
          {profile.name}
        </button>
        <nav className="nav__links">
          {links.map((l) => (
            <button
              key={l.key}
              className={active === l.key ? 'is-active' : ''}
              onClick={() => onNavigate(l.key)}
            >
              {l.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
