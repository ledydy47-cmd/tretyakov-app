import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getPaintings } from '../api/paintings'
import PaintingModal from '../components/UI/PaintingModal'
import { tg, hapticFeedback, isTelegram } from '../utils/telegram'

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedPainting, setSelectedPainting] = useState<any | null>(null)

  // Telegram: приветствие пользователя
  useEffect(() => {
    if (isTelegram()) {
      const user = tg.initDataUnsafe.user
      if (user?.first_name) {
        console.log(`👋 Привет, ${user.first_name}!`)
        hapticFeedback.impact('soft')
      }
    }
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ['paintings'],
    queryFn: () => getPaintings({ limit: 3 }),
  })

  return (
    <div style={{
      minHeight: '100vh',
      padding: '24px 16px 40px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      
      {/* 🖼️ ГЛАВНЫЙ ЗАГОЛОВОК В РАМКЕ */}
      <div style={{
        background: '#6B1E2A',
        border: '4px solid #D4AF37',
        borderRadius: '12px',
        padding: '32px 16px',
        textAlign: 'center',
        boxShadow: '0 8px 24px rgba(107, 30, 42, 0.4), inset 0 0 0 4px #8B2635',
        marginBottom: '32px',
        position: 'relative',
      }}>
        {/* Декоративные уголки */}
        <div style={{ position: 'absolute', top: '-4px', left: '-4px', width: '20px', height: '20px', borderTop: '4px solid #F5E6C8', borderLeft: '4px solid #F5E6C8' }} />
        <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '20px', height: '20px', borderTop: '4px solid #F5E6C8', borderRight: '4px solid #F5E6C8' }} />
        <div style={{ position: 'absolute', bottom: '-4px', left: '-4px', width: '20px', height: '20px', borderBottom: '4px solid #F5E6C8', borderLeft: '4px solid #F5E6C8' }} />
        <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', borderBottom: '4px solid #F5E6C8', borderRight: '4px solid #F5E6C8' }} />

        {/* Иконка здания */}
        <svg width="48" height="32" viewBox="0 0 48 32" fill="#D4AF37" style={{ marginBottom: '12px' }}>
          <path d="M24 0L4 12h40L24 0zm-2 4l-12 8h24L22 4zM4 20v8h8v-8H4zm12 0v8h8v-8h-8zm12 0v8h8v-8h-8z" />
        </svg>

        <h1 className="gold-text" style={{ fontSize: '56px', fontWeight: 'bold', lineHeight: 1, margin: '0 0 8px 0' }}>
          200
        </h1>
        <p style={{ fontSize: '14px', color: '#D4AF37', letterSpacing: '2px', margin: '0 0 4px 0', textTransform: 'uppercase' }}>
          — шедевров —
        </p>
        <h2 className="gold-text" style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 12px 0', letterSpacing: '1px' }}>
          Третьяковки
        </h2>
        <p style={{ fontSize: '11px', color: '#E8C97A', margin: 0, opacity: 0.8 }}>
          ВЕЛИКОЕ РУССКОЕ ИСКУССТВО В ВАШЕМ ПРИЛОЖЕНИИ
        </p>
      </div>

      {/* 📋 СЕТКА МЕНЮ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: '🖼️', title: 'Коллекция', desc: '200 шедевров', path: '/gallery' },
          { icon: '', title: 'Изучение', desc: 'История картин', path: '/study' },
          { icon: '✏️', title: 'Тесты', desc: 'Проверь знания', path: '/quiz' },
          { icon: '📊', title: 'Прогресс', desc: 'Мои достижения', path: '/profile' },
        ].map((item, i) => (
          <div
            key={i}
            className="menu-card"
            onClick={() => {
              hapticFeedback.impact('light')
              navigate(item.path)
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '20px 12px',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div className="menu-icon-circle" style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '28px' }}>{item.icon}</span>
            </div>
            <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#1A1A1A', margin: '0 0 4px 0', textAlign: 'center' }}>
              {item.title}
            </p>
            <p style={{ fontSize: '10px', color: '#8B6560', margin: 0, textAlign: 'center' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 🖼️ Шедевры коллекции */}
      <div>
        <h2 style={{ fontSize: '18px', color: '#6B1E2A', marginBottom: '16px', fontWeight: 'bold' }}>
          Шедевры коллекции
        </h2>
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.items?.map((painting: any) => (
              <div
                key={painting.id}
                onClick={() => {
                  hapticFeedback.impact('light')
                  setSelectedPainting(painting)
                }}
                style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(5px)',
                }}
              >
                <img
                  src={painting.image_url}
                  alt={painting.title_ru}
                  style={{ width: '90px', height: '90px', objectFit: 'cover', flexShrink: 0 }}
                />
                <div style={{ padding: '12px 12px 12px 0', flex: 1 }}>
                  <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '4px', color: '#1A1A1A' }}>
                    {painting.title_ru}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6B1E2A', fontStyle: 'italic', marginBottom: '2px' }}>
                    {painting.artist_name}
                  </p>
                  <p style={{ fontSize: '12px', color: '#8B6560' }}>
                    {painting.year_created} г.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 💳 Баннер оплаты */}
      <div
        className="payment-banner"
        style={{ marginTop: '24px', cursor: 'pointer' }}
        onClick={() => {
          hapticFeedback.impact('medium')
          if (isTelegram()) {
            tg.showAlert('🔜 Скоро: полная версия за 149⭐')
          } else {
            alert('🔜 Скоро: полная версия за 149 Telegram Stars')
          }
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          background: '#8B2635',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #D4AF37',
          flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 2px 0', color: '#F5E6C8' }}>
            ЕДИНОРАЗОВАЯ ОПЛАТА
          </p>
          <p style={{ fontSize: '11px', margin: 0, opacity: 0.8 }}>
            Полный доступ. Без подписок.
          </p>
        </div>
        <span style={{ color: '#D4AF37', fontSize: '18px', flexShrink: 0 }}>›</span>
      </div>

      {/* 🔍 Модальное окно */}
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </div>
  )
}