import { motion, AnimatePresence } from 'framer-motion'

interface Painting {
  id: number
  title_ru: string
  artist_name: string
  year_created: number
  technique: string
  genre: string
  description_short: string
  description_full: string
  interesting_facts: string
  image_url: string
}

interface Props {
  painting: Painting | null
  onClose: () => void
}

export default function PaintingModal({ painting, onClose }: Props) {
  if (!painting) return null

  return (
    <AnimatePresence>
      {painting && (
        <>
          {/* Затемнение фона */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 200,
            }}
          />

          {/* Модальное окно */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  width: '100%',
  maxWidth: '480px',
  margin: '0 auto',

              background: 'white',
              borderRadius: '24px 24px 0 0',
              zIndex: 201,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Ручка */}
            <div style={{
              width: '40px',
              height: '4px',
              background: 'var(--color-border)',
              borderRadius: '2px',
              margin: '12px auto 0',
            }} />

            {/* Кнопка закрыть */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'var(--color-bg)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>

            <div style={{ padding: '16px 16px 32px' }}>
              {/* Картина */}
              <div style={{
                border: '6px solid var(--color-gold)',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px',
                marginTop: '8px',
              }}>
                <img
                  src={painting.image_url}
                  alt={painting.title_ru}
                  style={{
                    width: '100%',
                    height: '260px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>

              {/* Название */}
              <h2 style={{
                fontSize: '20px',
                color: 'var(--color-primary)',
                marginBottom: '4px',
              }}>
                {painting.title_ru}
              </h2>

              {/* Художник */}
              <p style={{
                fontSize: '16px',
                color: 'var(--color-primary)',
                fontStyle: 'italic',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}>
                {painting.artist_name}
              </p>

              {/* Год и техника */}
              <p style={{
                fontSize: '14px',
                color: 'var(--color-gold)',
                marginBottom: '12px',
              }}>
                {painting.year_created} г. · {painting.technique}
              </p>

              <div style={{
                width: '40px',
                height: '2px',
                background: 'var(--color-gold)',
                marginBottom: '12px',
              }} />

              {/* Описание короткое */}
              <p style={{
                fontSize: '14px',
                color: 'var(--color-text)',
                lineHeight: '1.6',
                marginBottom: '12px',
              }}>
                {painting.description_short}
              </p>

              {/* Описание полное */}
              <p style={{
                fontSize: '14px',
                color: 'var(--color-text)',
                lineHeight: '1.6',
                marginBottom: '16px',
              }}>
                {painting.description_full}
              </p>

              {/* Интересные факты */}
              {painting.interesting_facts && (
                <div style={{
                  background: 'var(--color-bg)',
                  borderRadius: '12px',
                  padding: '16px',
                }}>
                  <p style={{
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: 'var(--color-primary)',
                    marginBottom: '10px',
                  }}>
                    ✨ Интересные факты
                  </p>
                  {JSON.parse(painting.interesting_facts).map((fact: string, i: number) => (
                    <p key={i} style={{
                      fontSize: '13px',
                      color: 'var(--color-text)',
                      marginBottom: '8px',
                      lineHeight: '1.5',
                    }}>
                      • {fact}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
