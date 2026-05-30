import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getPaintings } from '../api/paintings'

export default function GalleryPage() {
  const [genre, setGenre] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['paintings', genre],
    queryFn: () => getPaintings({ limit: 50, genre: genre || undefined }),
  })

  const genres = [
    { value: null,          label: 'Все' },
    { value: 'историческая', label: 'Исторические' },
    { value: 'пейзаж',       label: 'Пейзажи' },
    { value: 'жанровая',     label: 'Жанровые' },
    { value: 'сказочная',    label: 'Сказочные' },
  ]

  return (
    <div style={{ padding: '24px 16px' }}>

      {/* Заголовок */}
      <h1 style={{
        fontSize: '24px',
        color: 'var(--color-primary)',
        marginBottom: '16px',
        textAlign: 'center',
      }}>
        🖼️ Галерея
      </h1>

      {/* Фильтры */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        marginBottom: '20px',
        paddingBottom: '4px',
      }}>
        {genres.map(g => (
          <button
            key={String(g.value)}
            onClick={() => setGenre(g.value)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: '1px solid var(--color-primary)',
              background: genre === g.value ? 'var(--color-primary)' : 'transparent',
              color: genre === g.value ? 'white' : 'var(--color-primary)',
              fontSize: '13px',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Сетка картин */}
      {isLoading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
        }}>
          {data?.items?.map((painting: any) => (
            <div
              key={painting.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
              }}
            >
              {/* Рамка картины */}
              <div style={{
                padding: '8px',
                background: 'var(--color-bg)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                <img
                  src={painting.image_url}
                  alt={painting.title_ru}
                  style={{
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '3px solid var(--color-gold)',
                  }}
                />
              </div>

              {/* Подпись */}
              <div style={{ padding: '8px' }}>
                <p style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'var(--color-text)',
                  marginBottom: '2px',
                  lineHeight: '1.3',
                }}>
                  {painting.title_ru}
                </p>
                <p style={{
                  fontSize: '11px',
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
  )
}
