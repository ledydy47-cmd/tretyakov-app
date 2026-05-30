import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getRandomPainting } from '../api/paintings'
import PaintingModal from '../components/UI/PaintingModal'

const STORAGE_KEY = 'tretyakov_studied_ids'

export default function StudyPage() {
  const [history, setHistory] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [direction, setDirection] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const [modalPainting, setModalPainting] = useState<any | null>(null)
  
  // Загружаем изученные ID из localStorage
  const [studiedIds, setStudiedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } 
    catch { return [] }
  })

  // Ref чтобы избегать stale state в асинхронных функциях
  const studiedRef = useRef(studiedIds)
  useEffect(() => { studiedRef.current = studiedIds }, [studiedIds])
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(studiedIds)) }, [studiedIds])

  // Загрузка первой картины
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        let p = await getRandomPainting()
        let attempts = 0
        while (studiedRef.current.includes(p.id) && attempts < 20) {
          p = await getRandomPainting()
          attempts++
        }
        setHistory([p])
        setCurrentIndex(0)
      } catch (e) { console.error(e) } 
      finally { setIsLoading(false) }
    }
    init()
  }, [])

  const handleNext = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    setDirection(1)
    setExpanded(false)
    try {
      let p = await getRandomPainting()
      let attempts = 0
      while (studiedRef.current.includes(p.id) && attempts < 20) {
        p = await getRandomPainting()
        attempts++
      }
      setHistory(prev => [...prev, p])
      setCurrentIndex(prev => prev + 1)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  const toggleStudied = (id: number) => {
    setStudiedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const handlePrev = useCallback(() => {
    if (currentIndex <= 0) return
    setDirection(-1)
    setExpanded(false)
    setCurrentIndex(prev => prev - 1)
  }, [currentIndex])

  const painting = history[currentIndex]
  const isStudied = painting ? studiedIds.includes(painting.id) : false

  if (isLoading && !painting) {
    return <div style={{ padding: '24px 16px', textAlign: 'center' }}>Загрузка первой картины...</div>
  }

  return (
    <div style={{ padding: '24px 16px' }}>
      <h1 style={{ fontSize: '22px', color: 'var(--color-primary)', textAlign: 'center', marginBottom: '8px' }}>📖 Изучение</h1>
      {history.length > 1 && (
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '16px' }}>
          {currentIndex + 1} из {history.length}
        </p>
      )}

      <AnimatePresence mode="wait" custom={direction}>
        {painting && !isLoading ? (
          <motion.div
            key={painting.id}
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
            {/* Картина */}
            <div
              onClick={() => setModalPainting(painting)}
              style={{
                background: 'white', borderRadius: '16px', padding: '12px',
                boxShadow: 'var(--shadow-card)', marginBottom: '16px',
                border: '1px solid var(--color-border)', cursor: 'pointer', position: 'relative'
              }}
            >
              <div style={{ border: '6px solid var(--color-gold)', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={painting.image_url} alt={painting.title_ru} style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
              </div>
              
              {/* Чекбокс "Изучено" */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleStudied(painting.id) }}
                style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: 'white', borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontSize: '18px', cursor: 'pointer',
                  border: isStudied ? '2px solid #2e7d32' : '2px solid var(--color-border)'
                }}
              >
                {isStudied ? '✅' : '☐'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                Нажми для подробностей
              </p>
            </div>

            {/* Информация */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-card)', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', color: 'var(--color-primary)', marginBottom: '6px' }}>{painting.title_ru}</h2>
              <p style={{ fontSize: '16px', color: 'var(--color-primary)', fontWeight: 'bold', fontStyle: 'italic', marginBottom: '4px' }}>{painting.artist_name}</p>
              <p style={{ fontSize: '14px', color: 'var(--color-gold)', marginBottom: '4px' }}>{painting.year_created} г. · {painting.technique}</p>
              <div style={{ width: '40px', height: '2px', background: 'var(--color-gold)', margin: '12px 0' }} />
              <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: '1.6' }}>{painting.description_short}</p>
              
              {expanded && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
                  <p style={{ fontSize: '14px', color: 'var(--color-text)', lineHeight: '1.6', marginTop: '12px', marginBottom: '12px' }}>{painting.description_full}</p>
                  {painting.interesting_facts && (
                    <div style={{ background: 'var(--color-bg)', borderRadius: '8px', padding: '12px', marginTop: '8px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '13px', color: 'var(--color-primary)', marginBottom: '8px' }}>✨ Интересные факты</p>
                      {JSON.parse(painting.interesting_facts).map((fact: string, i: number) => (
                        <p key={i} style={{ fontSize: '13px', color: 'var(--color-text)', marginBottom: '6px', lineHeight: '1.5' }}>• {fact}</p>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
              <button onClick={() => setExpanded(e => !e)} style={{ marginTop: '12px', background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '13px', cursor: 'pointer', padding: '0', textDecoration: 'underline' }}>
                {expanded ? 'Скрыть ↑' : 'Читать подробнее ↓'}
              </button>
            </div>

            {/* Навигация */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-outline" onClick={handlePrev} disabled={currentIndex <= 0} style={{ opacity: currentIndex <= 0 ? 0.4 : 1 }}>← Назад</button>
              <button className="btn-primary" onClick={handleNext}>{isLoading ? 'Загрузка...' : 'Следующая →'}</button>
            </div>
          </motion.div>
        ) : (
          <div key="loading" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
            <div className="skeleton" style={{ height: '24px', borderRadius: '8px' }} />
            <div className="skeleton" style={{ height: '16px', borderRadius: '8px', width: '60%' }} />
          </div>
        )}
      </AnimatePresence>

      <PaintingModal painting={modalPainting} onClose={() => setModalPainting(null)} />
    </div>
  )
}