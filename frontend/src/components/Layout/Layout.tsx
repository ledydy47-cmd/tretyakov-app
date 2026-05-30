import { Outlet, useNavigate, useLocation } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
  { path: '/',        icon: '🏛️',  label: 'Главная' },
  { path: '/gallery', icon: '🖼️',  label: 'Галерея' },
  { path: '/study',   icon: '📖',  label: 'Изучение' },
  { path: '/quiz',    icon: '✏️',  label: 'Тесты' },
  { path: '/profile', icon: '👤',  label: 'Профиль' }, // ← Добавили эту строку
]

  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
      <Outlet />

      <nav className="bottom-nav">
        {tabs.map(tab => (
          <button
            key={tab.path}
            className={`bottom-nav__item ${location.pathname === tab.path ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="bottom-nav__icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
