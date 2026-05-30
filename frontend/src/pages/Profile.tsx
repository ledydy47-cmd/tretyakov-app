import { useState, useEffect } from 'react'

const QUIZ_KEY = 'tretyakov_quiz_progress'
const STUDIED_KEY = 'tretyakov_studied_ids'

export default function ProfilePage() {
  const [stats, setStats] = useState({ 
    totalTests: 0, 
    totalQuestions: 0, 
    correctAnswers: 0, 
    studied: 0 
  })

  useEffect(() => {
    const q = JSON.parse(localStorage.getItem(QUIZ_KEY) || '{"totalTests":0,"totalQuestions":0,"correctAnswers":0}')
    const s = JSON.parse(localStorage.getItem(STUDIED_KEY) || '[]')
    setStats({ ...q, studied: s.length })
  }, [])

  const accuracy = stats.totalQuestions > 0 
    ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
    : 0

  return (
    <div style={{ padding: '24px 16px' }}>
      {/* Аватар и имя */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--color-primary)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: 'white',
          border: '3px solid var(--color-gold)',
        }}>
          👤
        </div>
        <h1 style={{ fontSize: '20px', color: 'var(--color-primary)', marginBottom: '4px' }}>
          Исследователь искусства
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '13px' }}>
          Изучает шедевры Третьяковки
        </p>
      </div>

      {/* Статистика */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: 'var(--shadow-card)',
        marginBottom: '24px',
      }}>
        <p style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--color-primary)', marginBottom: '16px', textAlign: 'center' }}>
          📊 Твой прогресс
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { value: stats.studied, label: 'Изучено' },
            { value: stats.totalTests, label: 'Тестов' },
            { value: `${accuracy}%`, label: 'Точность' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Меню профиля */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { icon: '⭐', title: 'Избранное', desc: 'Сохранённые картины' },
          { icon: '📚', title: 'История', desc: 'Просмотренные картины' },
          { icon: '⚙️', title: 'Настройки', desc: 'Язык, уведомления' },
          { icon: 'ℹ️', title: 'О приложении', desc: 'Версия 1.0' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
            }}
            onClick={() => item.title === 'Настройки' && alert('Настройки скоро будут доступны!')}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--color-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', fontSize: '15px', color: 'var(--color-text)' }}>
                {item.title}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {item.desc}
              </p>
            </div>
            <span style={{ color: 'var(--color-text-muted)' }}>→</span>
          </div>
        ))}
      </div>
    </div>
  )
}