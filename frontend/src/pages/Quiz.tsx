import { useNavigate } from 'react-router-dom'

export default function QuizPage() {
  const navigate = useNavigate()

  const quizTypes = [
    {
      icon: '🖼️',
      title: 'Угадай картину',
      description: 'По фрагменту определи название картины',
      color: '#6B1E2A',
    },
    {
      icon: '🎨',
      title: 'Угадай художника',
      description: 'Кто написал эту картину?',
      color: '#8B2635',
    },
    {
      icon: '📅',
      title: 'Угадай год',
      description: 'В каком веке написана картина?',
      color: '#C9A84C',
    },
    {
      icon: '🏛️',
      title: 'Случайный тест',
      description: 'Вопросы на все темы вперемешку',
      color: '#4A6741',
    },
  ]

  return (
    <div style={{ padding: '24px 16px' }}>

      {/* Заголовок */}
      <h1 style={{
        fontSize: '24px',
        color: 'var(--color-primary)',
        textAlign: 'center',
        marginBottom: '8px',
      }}>
        ✏️ Тесты
      </h1>
      <p style={{
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        fontSize: '14px',
        marginBottom: '24px',
      }}>
        Проверь свои знания
      </p>

      {/* Карточки тестов */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quizTypes.map((quiz, i) => (
          <div
            key={i}
            onClick={() => alert('Тесты скоро будут доступны! 🎨')}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              cursor: 'pointer',
              border: '1px solid var(--color-border)',
            }}
          >
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              background: quiz.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
            }}>
              {quiz.icon}
            </div>
            <div>
              <p style={{
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'var(--color-text)',
                marginBottom: '4px',
              }}>
                {quiz.title}
              </p>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}>
                {quiz.description}
              </p>
            </div>
            <span style={{
              marginLeft: 'auto',
              color: 'var(--color-text-muted)',
              fontSize: '18px',
            }}>
              →
            </span>
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div style={{
        marginTop: '24px',
        background: 'white',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: 'var(--shadow-card)',
      }}>
        <p style={{
          fontWeight: 'bold',
          fontSize: '16px',
          color: 'var(--color-primary)',
          marginBottom: '12px',
        }}>
          📊 Твой прогресс
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { value: '0', label: 'Тестов' },
            { value: '0%', label: 'Точность' },
            { value: '0', label: 'Изучено' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <p style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'var(--color-primary)',
              }}>
                {stat.value}
              </p>
              <p style={{
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
