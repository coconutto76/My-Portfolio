import { NAV_ITEMS } from '../lib/content'

// 상단 내비게이션: 이름 + Profile / Games / Papers / Records
export default function NavBar({ name, active, onNavigate }) {
  return (
    <header className="nav">
      <div className="nav__inner">
        <button className="nav__brand" onClick={() => onNavigate('profile')}>
          {name}
        </button>
        <nav className="nav__links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={active === item.key ? 'is-active' : ''}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
