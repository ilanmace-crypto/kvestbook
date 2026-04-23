import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { places } from '../data/places'
import '../styles/home.css'

type Progress = {
  unlocked: string[]
  completed: string[]
  attempts: Record<string, number>
  currentTaskIndex?: Record<string, number>
}

export default function HomePage() {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [progress, setProgress] = useState<Progress>({ unlocked: ['1'], completed: [], attempts: {} })
  const [userName, setUserName] = useState('')
  const [nameSaved, setNameSaved] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const raw = localStorage.getItem('questProgress')
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Progress
        setProgress({
          unlocked: parsed.unlocked || ['1'],
          completed: parsed.completed || [],
          attempts: parsed.attempts || {},
          currentTaskIndex: parsed.currentTaskIndex || {},
        })
      } catch {
        // ignore
      }
    }

    const savedName = localStorage.getItem('userName')
    if (savedName) {
      setUserName(savedName)
      setNameSaved(true)
    }
  }, [])

  const handleStart = () => {
    navigate('/tours')
  }

  const handleNameSubmit = () => {
    if (userName.trim()) {
      localStorage.setItem('userName', userName.trim())
      setNameSaved(true)
    }
  }

  const completedCount = progress.completed.length
  const totalPlaces = places.length
  const unlockedCount = progress.unlocked.length
  const progressPercent = Math.round((completedCount / totalPlaces) * 100)

  return (
    <div className={`home ${isLoaded ? 'home--loaded' : ''}`}>
      {/* Анимированный фон с частицами */}
      <div className="home__bg">
        <div className="home__gradient" />
        <div className="home__particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="home__particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Герой секция */}
      <div className="home__hero">
        <div className="home__hero-content">
          <div className="home__badge animate-fade-in">
            <span className="home__badge-icon">🎯</span>
            <span>Интерактивный квест</span>
          </div>

          <h1 className="home__title animate-fade-in">
            <span className="home__title-word">Ошмяны</span>
            <span className="home__title-highlight">Квест</span>
          </h1>

          <p className="home__subtitle animate-fade-in">
            Откройте тайны древнего города через увлекательное путешествие.
            Исследуйте достопримечательности, решайте загадки и узнавайте
            историю Ошмян в игровом формате.
          </p>

          {!nameSaved && (
            <div className="home__name-input animate-fade-in">
              <input
                type="text"
                placeholder="Введите ваше имя"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="home__name-field"
                maxLength={30}
              />
              <button
                onClick={handleNameSubmit}
                className="home__name-submit"
                disabled={!userName.trim()}
              >
                Сохранить
              </button>
            </div>
          )}

          <div className="home__stats animate-fade-in">
            <div className="home__stat">
              <div className="home__stat-value">{completedCount}/{totalPlaces}</div>
              <div className="home__stat-label">Локаций пройдено</div>
            </div>
            <div className="home__stat">
              <div className="home__stat-value">{unlockedCount}</div>
              <div className="home__stat-label">Доступно</div>
            </div>
            <div className="home__stat">
              <div className="home__stat-value">{progressPercent}%</div>
              <div className="home__stat-label">Прогресс</div>
            </div>
          </div>

          {progressPercent > 0 && (
            <div className="home__progressBar animate-fade-in">
              <div className="home__progressBarFill" style={{ width: `${progressPercent}%` }} />
            </div>
          )}

          <div className="home__features animate-fade-in">
            <div className="home__feature">
              <div className="home__feature-icon">📍</div>
              <span>{totalPlaces} локаций</span>
            </div>
            <div className="home__feature">
              <div className="home__feature-icon">🧩</div>
              <span>40 заданий</span>
            </div>
            <div className="home__feature">
              <div className="home__feature-icon">�</div>
              <span>Видео-истории</span>
            </div>
          </div>

          <button 
            className="home__cta animate-glow" 
            onClick={handleStart}
          >
            <span className="home__cta-text">Начать приключение</span>
            <span className="home__cta-arrow">→</span>
          </button>

          <p className="home__hint animate-fade-in">
            <span className="home__hint-icon">💡</span>
            Откройте в Telegram для лучшего опыта
          </p>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="home__decorations">
        <div className="home__circle home__circle--1" />
        <div className="home__circle home__circle--2" />
        <div className="home__circle home__circle--3" />
        <div className="home__circle home__circle--4" />
        <div className="home__circle home__circle--5" />
      </div>
    </div>
  )
}
