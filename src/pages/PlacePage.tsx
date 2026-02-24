import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { places } from '../data/places'
import '../styles/place.css'

import { getTourById, getDefaultTour } from '../data/tours'

type Progress = {
  unlocked: string[]
  completed: string[]
  attempts: Record<string, number>
  lastAttempt?: number
  currentTaskIndex?: Record<string, number>
}

export default function PlacePage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [hintIndex, setHintIndex] = useState(-1)
  const [isCorrect, setIsCorrect] = useState(false)

  const place = useMemo(() => places.find((p) => p.id === id), [id])
  const placeIndex = useMemo(() => places.findIndex((p) => p.id === id), [id])

  const selectedTourId = localStorage.getItem('selectedTour') || 'oshmyany-city'
  const selectedTour = getTourById(selectedTourId) || getDefaultTour()
  const firstPlaceId = selectedTour.places[0] || '1'

  const [progress, setProgress] = useState<Progress>(() => {
    const progressKey = `questProgress-${selectedTourId}`
    const raw = localStorage.getItem(progressKey)
    if (!raw) return { unlocked: [firstPlaceId], completed: [], attempts: {}, currentTaskIndex: {} }
    try {
      const parsed = JSON.parse(raw) as Progress
      return {
        unlocked: parsed.unlocked.length > 0 ? parsed.unlocked : [firstPlaceId],
        completed: parsed.completed || [],
        attempts: parsed.attempts || {},
        currentTaskIndex: parsed.currentTaskIndex || {},
        lastAttempt: parsed.lastAttempt,
      }
    } catch {
      return { unlocked: [firstPlaceId], completed: [], attempts: {}, currentTaskIndex: {} }
    }
  })

  const isUnlocked = place ? progress.unlocked.includes(place.id) : false
  const isCompleted = place ? progress.completed.includes(place.id) : false
  const attempts = place ? (progress.attempts[place.id] || 0) : 0
  const currentTaskIdx = place ? (progress.currentTaskIndex?.[place.id] ?? 0) : 0
  const currentTask = place ? place.tasks[currentTaskIdx] : null
  const canAttempt = isUnlocked && !isCompleted

  useEffect(() => {
    if (!place || !isUnlocked) return
    if (progress.lastAttempt && Date.now() - progress.lastAttempt < 1000) {
      const timer = setTimeout(() => setError(''), 1000)
      return () => clearTimeout(timer)
    }
  }, [place, isUnlocked, progress.lastAttempt])

  useEffect(() => {
    if (!place || !isUnlocked) return
    const saved = localStorage.getItem(`hint-${place.id}-${currentTaskIdx}`)
    if (saved) setHintIndex(Number(saved))
  }, [place, isUnlocked, currentTaskIdx])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!place || !currentTask || !canAttempt) return

    const normalized = answer.trim().toLowerCase()
    const correct = currentTask.answer.trim().toLowerCase()

    const newAttempts = { ...progress.attempts, [place.id]: attempts + 1 }
    const newProgress: Progress = {
      ...progress,
      attempts: newAttempts,
      lastAttempt: Date.now(),
    }

    if (normalized === correct) {
      setIsCorrect(true)
      setError('')
      setAnswer('')

      // Если есть следующая задача в этой локации
      if (currentTaskIdx < place.tasks.length - 1) {
        const newTaskIndex = { ...progress.currentTaskIndex, [place.id]: currentTaskIdx + 1 }
        const finalProgress: Progress = {
          ...newProgress,
          currentTaskIndex: newTaskIndex,
        }
        setProgress(finalProgress)
        localStorage.setItem(`questProgress-${selectedTourId}`, JSON.stringify(finalProgress))
        localStorage.setItem(`hint-${place.id}-${currentTaskIdx + 1}`, '-1')
        
        // Через 1.5 секунды сбрасываем isCorrect и показываем следующий вопрос
        setTimeout(() => {
          setIsCorrect(false)
          setHintIndex(-1)
        }, 1500)
      } else {
        // Локация завершена
        const nextId = places[placeIndex + 1]?.id
        const newUnlocked = nextId ? [...progress.unlocked, nextId] : progress.unlocked
        const newCompleted = [...progress.completed, place.id]

        const finalProgress: Progress = {
          ...newProgress,
          unlocked: newUnlocked,
          completed: newCompleted,
        }

        setProgress(finalProgress)
        localStorage.setItem(`questProgress-${selectedTourId}`, JSON.stringify(finalProgress))
      }
    } else {
      setError('Неверно. Попробуй ещё.')
      setProgress(newProgress)
      localStorage.setItem(`questProgress-${selectedTourId}`, JSON.stringify(newProgress))
    }
  }

  function requestHint() {
    if (!place || !currentTask || hintIndex >= currentTask.hints.length - 1) return
    const next = hintIndex + 1
    setHintIndex(next)
    localStorage.setItem(`hint-${place.id}-${currentTaskIdx}`, String(next))
  }

  function resetProgress() {
    const newProgress: Progress = {
      unlocked: ['1'],
      completed: [],
      attempts: {},
      currentTaskIndex: {},
    }
    setProgress(newProgress)
    localStorage.setItem(`questProgress-${selectedTourId}`, JSON.stringify(newProgress))
    navigate('/place/1')
  }

  if (!place) {
    return (
      <div className="place">
        <div className="place__card">
          <h1 className="place__title">Локация не найдена</h1>
          <Link className="place__back" to="/map">
            Назад к карте
          </Link>
        </div>
      </div>
    )
  }

  if (!isUnlocked) {
    return (
      <div className="place">
        <div className="place__card">
          <h1 className="place__title">{place.title}</h1>
          <p className="place__text">Эта локация ещё не открыта. Сначала пройди предыдущие задания.</p>
          <Link className="place__back" to="/map">
            На карту
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="place">
      <div className="place__card">
        <div className="place__progress">
          {places.map((p) => (
            <div
              key={p.id}
              className={`place__progressDot ${
                progress.completed.includes(p.id)
                  ? 'place__progressDot--completed'
                  : progress.unlocked.includes(p.id)
                  ? 'place__progressDot--unlocked'
                  : 'place__progressDot--locked'
              }`}
            />
          ))}
        </div>

        <div className="place__header">
          <h1 className="place__title">{place.title}</h1>
          <button className="place__reset" onClick={resetProgress}>
            🔄 Сбросить прогресс
          </button>
        </div>

        <p className="place__text">{place.description}</p>

        <div className="place__divider" />

        {isCompleted ? (
          <div className="place__completed">
            <div className="place__completedHeader">
              <span className="place__completedIcon">🎉</span>
              <h2 className="place__completedTitle">Локация пройдена!</h2>
            </div>
            <p className="place__completedText">Отличная работа! Ты узнал все секреты этого места.</p>
            
            {place.videoUrl && (
              <div className="place__video">
                <h3 className="place__videoTitle">{place.videoTitle || 'Видео о локации'}</h3>
                <div className="place__videoContainer">
                  <iframe 
                    src={place.videoUrl}
                    title={place.videoTitle || 'Видео'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p className="place__videoNote">Посмотри видео, чтобы узнать больше интересного!</p>
              </div>
            )}
            
            <div className="place__completedActions">
              <Link className="place__nextBtn" to={places[placeIndex + 1] ? `/place/${places[placeIndex + 1].id}` : '/map'}>
                {places[placeIndex + 1] ? 'Следующая локация →' : 'На карту'}
              </Link>
              <Link className="place__back" to="/map">
                Вернуться на карту
              </Link>
            </div>
          </div>
        ) : currentTask ? (
          <>
            <div className="place__taskCounter">
              Задание {currentTaskIdx + 1} из {place.tasks.length}
            </div>

            <p className="place__task">{currentTask.question}</p>

            {hintIndex >= 0 && (
              <div className="place__hint">
                Подсказка {hintIndex + 1}: {currentTask.hints[hintIndex]}
              </div>
            )}

            {error && <div className="place__error">{error}</div>}

            {isCorrect && <div className="place__success">Верно! {currentTaskIdx < place.tasks.length - 1 ? 'Следующее задание...' : 'Локация завершена!'}</div>}

            {canAttempt ? (
              <form className="place__form" onSubmit={handleSubmit}>
                <input
                  className="place__input"
                  type="text"
                  placeholder="Введите ответ"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={isCorrect}
                />
                <button className="place__submit" type="submit" disabled={isCorrect || !answer.trim()}>
                  Проверить
                </button>
              </form>
            ) : null}

            {hintIndex < currentTask.hints.length - 1 && (
              <button className="place__hintBtn place__hintBtn--prominent" onClick={requestHint}>
                💡 Нужна подсказка? ({hintIndex + 2}/{currentTask.hints.length})
              </button>
            )}

            <Link className="place__back" to="/map">
              На карту
            </Link>
          </>
        ) : (
          <div className="place__done">
            <p className="place__doneText">Задания не найдены</p>
            <Link className="place__back" to="/map">
              На карту
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
