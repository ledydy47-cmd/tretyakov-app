import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getPaintings } from '../api/paintings'
import PaintingModal from '../components/UI/PaintingModal'

export default function HomePage() {
  const navigate = useNavigate()
  const [selectedPainting, setSelectedPainting] = useState<any | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['paintings'],
    queryFn: () => getPaintings({ limit: 3 }),
  })

  return (
    <div style={{ padding: '24px 16px' }}>

      {/* Шапка */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          color: 'var(--color-primary)',
          marginBottom: '8px',
        }}>
          200 шедевров
        </h1>
        <p style={{
          color: 'var(--color-text-muted)',
          fontSize: '14px',
        }}>
          Третьяковской галереи
        </p>
        <div style={{
          width: '60px',
          height: '2px',
          background: 'var(--color-gold)',
          margin: '12px auto 0',
        }} />
      </div>

      {/* Кнопки действий */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
        <button className="btn-primary" onClick={() => navigate('/study')}>
          📖 Начать изучение
        </button>
        <button className="btn-outline" onClick={() => navigate('/quiz/run')}>
          ✏️ Пройти тест
        </button>
      </div>

      {/* Последние картины */}
      <div>
        <h2 style={{
          fontSize: '18px',
          color: 'var(--color-primary)',
          marginBottom: '16px',
        }}>
          Шедевры коллекции
        </h2>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '12px' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.items?.map((painting: any) => (
              <div
                key={painting.id}
                onClick={() => setSelectedPainting(painting)}
                style={{
                  display: 'flex',
                  gap: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  cursor: 'pointer',
                }}
              >
                <img
                  src={painting.image_url}
                  alt={painting.title_ru}
                  style={{
                    width: '90px',
                    height: '90px',
                    objectFit: 'cover',
                    flexShrink: 0,
                  }}
                />
                <div style={{ padding: '12px 12px 12px 0' }}>
                  <p style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    marginBottom: '4px',
                    color: 'var(--color-text)',
                  }}>
                    {painting.title_ru}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-primary)',
                    fontStyle: 'italic',
                    marginBottom: '2px',
                  }}>
                    {painting.artist_name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                  }}>
                    {painting.year_created} г.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Модальное окно */}
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </div>
  )
}
