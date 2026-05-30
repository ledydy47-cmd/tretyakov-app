import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRandomPainting } from '../api/paintings'

export default function StudyPage() {
  const [key, setKey] = useState(0)
  const [direction, setDirection] = useState(1)
  const [expanded, setExpanded] = useState(false)

  const { data: painting, isLoading } = useQuery({
    queryKey: ['random-painting', key],
    queryFn: getRandomPainting,
    staleTime: 0,
  })

  const handleNext = () => {
    setDirection(1)
    setExpanded(false)
    setKey(k => k + 1)
  }

  const handlePrev = () => {
    setDirection(-1)
    setExpanded(false)
    setKey(k => k + 1)
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{
        fontSize: '22px',
        color: 'var(--color-primary)',
        textAlign: 'center',
        marginBottom: '24px',
      }}>
        📖 Изучение
      </h1>

      <AnimatePresence mode="wait" custom={direction}>
        {isLoading ? (
          <div key="loading" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
            <div className="skeleton" style={{ height: '24px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ height: '16px', borderRadius: '8px', width: '60%' }} />
          </div>
        ) : painting ? (
          <motion.div
            key={key}
            custom={direction}
            variants={{
              enter:  (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit:   (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {/* Картина в рамке */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '12px',
              boxShadow: 'var(--shadow-card)',
              marginBottom: '16px',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{
                border: '6px solid var(--color-gold)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <img
                  src={painting.image_url}
                  alt={painting.title_ru}
                  style={{
                    width: '100%',
                    height: '280px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            </div>

            {/* Информация */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'var(--shadow-card)',
              marginBottom: '16px',
            }}>
              <h2 style={{
                fontSize: '20px',
                color: 'var(--color-primary)',
                marginBottom: '6px',
              }}>
                {painting.title_ru}
              </h2>

              <p style={{
                fontSize: '16px',
                color: 'var(--color-primary)',
                fontWeight: 'bold',
                fontStyle: 'italic',
                marginBottom: '4px',
              }}>
                {painting.artist_name}
              </p>

              <p style={{
                fontSize: '14px',
                color: 'var(--color-gold)',
                marginBottom: '4px',
              }}>
                {painting.year_created} г. · {painting.technique}
              </p>

              <div style={{
                width: '40px',
                height: '2px',
                background: 'var(--color-gold)',
                margin: '12px 0',
              }} />

              <p style={{
                fontSize: '14px',
                color: 'var(--color-text)',
                lineHeight: '1.6',
              }}>
                {painting.description_short}
              </p>

              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p style={{
                    fontSize: '14px',
                    color: 'var(--color-text)',
                    lineHeight: '1.6',
                    marginTop: '12px',
                    marginBottom: '12px',
                  }}>
                    {painting.description_full}
                  </p>

                  {painting.interesting_facts && (
                    <div style={{
                      background: 'var(--color-bg)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}>
                      <p style={{
                        fontWeight: 'bold',
                        fontSize: '13px',
                        color: 'var(--color-primary)',
                        marginBottom: '8px',
                      }}>
                        ✨ Интересные факты
                      </p>
                      {JSON.parse(painting.interesting_facts).map((fact: string, i: number) => (
                        <p key={i} style={{
                          fontSize: '13px',
                          color: 'var(--color-text)',
                          marginBottom: '6px',
                          lineHeight: '1.5',
                        }}>
                          • {fact}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              <button
                onClick={() => setExpanded(e => !e)}
                style={{
                  marginTop: '12px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '13px',
                  cursor: 'pointer',
                  padding: '0',
                  textDecoration: 'underline',
                }}
              >
                {expanded ? 'Скрыть ↑' : 'Читать подробнее ↓'}
              </button>
            </div>

            {/* Кнопки навигации */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" onClick={handlePrev}>
                ← Назад
              </button>
              <button className="btn-primary" onClick={handleNext}>
                Следующая →
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
