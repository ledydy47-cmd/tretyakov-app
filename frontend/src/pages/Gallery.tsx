import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getPaintings } from '../api/paintings'
import PaintingModal from '../components/UI/PaintingModal'

// Правильный путь: одна точка ../
import checkboxEmpty from '../assets/checkbox-empty.png'
import checkboxFilled from '../assets/checkbox-filled.png'

const STORAGE_KEY = 'tretyakov_studied_ids'

export default function GalleryPage() {
  const [genre, setGenre] = useState<string | null>(null)
  const [selectedPainting, setSelectedPainting] = useState<any | null>(null)
  const [studiedIds, setStudiedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } 
    catch { return [] }
  })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(studiedIds)) }, [studiedIds])

  const toggleStudied = (id: number) => {
    setStudiedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const { data, isLoading } = useQuery({
    queryKey: ['paintings', genre],
    queryFn: () => getPaintings({ limit: 50, genre: genre || undefined }),
  })

  const genres = [
    { value: null,           label: 'Все' },
    { value: 'историческая', label: 'Исторические' },
    { value: 'пейзаж',       label: 'Пейзажи' },
    { value: 'жанровая',     label: 'Жанровые' },
    { value: 'сказочная',    label: 'Сказочные' },
  ]

  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '24px', color: 'var(--color-primary)', marginBottom: '16px', textAlign: 'center' }}>️ Галерея</h1>
      
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px', paddingBottom: '4px' }}>
        {genres.map(g => (
          <button
            key={String(g.value)}
            onClick={() => setGenre(g.value)}
            style={{
              padding: '6px 16px', borderRadius: '20px',
              border: '1px solid var(--color-primary)',
              background: genre === g.value ? 'var(--color-primary)' : 'transparent',
              color: genre === g.value ? 'white' : 'var(--color-primary)',
              fontSize: '13px', whiteSpace: 'nowrap', cursor: 'pointer',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: '180px', borderRadius: '12px' }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {data?.items?.map((painting: any) => {
            const isStudied = studiedIds.includes(painting.id)
            return (
              <div
                key={painting.id}
                onClick={() => setSelectedPainting(painting)}
                style={{
                  background: 'white', borderRadius: '12px', overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)', cursor: 'pointer', position: 'relative',
                  opacity: isStudied ? 0.75 : 1,
                }}
              >
                <div style={{ padding: '8px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <img src={painting.image_url} alt={painting.title_ru} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '3px solid var(--color-gold)' }} />
                </div>
                <div style={{ padding: '8px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-text)', marginBottom: '2px', lineHeight: '1.3' }}>{painting.title_ru}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-primary)', fontStyle: 'italic', marginBottom: '2px' }}>{painting.artist_name}</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{painting.year_created} г.</p>
                </div>
                
                {/* --- ТВОЯ КАСТОМНАЯ ИКОНКА ЧЕКБОКСА --- */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleStudied(painting.id) }}
                  style={{
                    position: 'absolute', top: '8px', right: '8px',
                    background: 'white', borderRadius: '50%', width: '32px', height: '32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)', cursor: 'pointer', zIndex: 10,
                    border: 'none', padding: '4px'
                  }}
                >
                  <img 
                    src={isStudied ? checkboxFilled : checkboxEmpty} 
                    alt="checkbox"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
      <PaintingModal painting={selectedPainting} onClose={() => setSelectedPainting(null)} />
    </div>
  )
}