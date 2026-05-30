import { Outlet, useNavigate, useLocation } from 'react-router-dom'

// --- ИМПОРТ ТВОИХ ИКОНОК ---
// Убедись, что эти файлы лежат в папке frontend/src/assets/
import homeIcon from '../../assets/home.png'
import galleryIcon from '../../assets/gallery.png'
import studyIcon from '../../assets/study.png'
import quizIcon from '../../assets/quiz.png'
import profileIcon from '../../assets/profile.png'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()

  // --- НАСТРОЙКА ВКЛАДОК ---
  const tabs = [
    { path: '/',        icon: homeIcon,    label: 'Главная' },
    { path: '/gallery', icon: galleryIcon, label: 'Галерея' },
    { path: '/study',   icon: studyIcon,   label: 'Изучение' },
    { path: '/quiz',    icon: quizIcon,    label: 'Тесты' },
    { path: '/profile', icon: profileIcon, label: 'Профиль' },
  ]

  return (
    <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
      <Outlet />
      
      {/* --- НИЖНЕЕ МЕНЮ --- */}
      <nav className="bottom-nav">
        {tabs.map(tab => {
          // Проверяем, активна ли вкладка
          const isActive = location.pathname === tab.path || 
                          (tab.path !== '/' && location.pathname.startsWith(tab.path))

          return (
            <button
              key={tab.path}
              className={`bottom-nav__item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(tab.path)}
            >
              {/* Картинка-иконка */}
              <div className="bottom-nav__icon">
                <img 
                  src={tab.icon} 
                  alt={tab.label}
                  style={{
                    width: '24px',
                    height: '24px',
                    // Если иконка не активна, делаем её полупрозрачной
                    opacity: isActive ? 1 : 0.6,
                    transition: 'opacity 0.2s',
                  }}
                />
              </div>
              {/* Подпись */}
              {tab.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}