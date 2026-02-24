import { Link } from 'react-router-dom'
import { tours } from '../data/tours'
import type { Tour } from '../data/tours'
import '../styles/tour-selection.css'

export default function TourSelectionPage() {
  const handleTourSelect = (tour: Tour) => {
    localStorage.setItem('selectedTour', tour.id)
  }

  return (
    <div className="tour-selection">
      <div className="tour-selection__container">
        <div className="tour-selection__header">
          <h1 className="tour-selection__title">Выберите тур</h1>
          <p className="tour-selection__subtitle">
            Выберите маршрут квеста, который вас интересует больше всего
          </p>
        </div>

        <div className="tour-selection__grid">
          {tours.map((tour) => (
            <Link
              key={tour.id}
              to="/map"
              className="tour-selection__card"
              onClick={() => handleTourSelect(tour)}
            >
              <div className="tour-selection__cardHeader">
                <div className="tour-selection__icon">{tour.image}</div>
                <h2 className="tour-selection__cardTitle">{tour.title}</h2>
              </div>

              <p className="tour-selection__description">{tour.description}</p>

              <div className="tour-selection__meta">
                <div className="tour-selection__metaItem">
                  <span className="tour-selection__metaLabel">⏱️ Длительность:</span>
                  <span className="tour-selection__metaValue">{tour.duration}</span>
                </div>
                <div className="tour-selection__metaItem">
                  <span className="tour-selection__metaLabel">📍 Мест:</span>
                  <span className="tour-selection__metaValue">{tour.places.length}</span>
                </div>
                <div className="tour-selection__metaItem">
                  <span className="tour-selection__metaLabel">🎯 Сложность:</span>
                  <span className={`tour-selection__difficulty tour-selection__difficulty--${tour.difficulty}`}>
                    {tour.difficulty === 'easy' ? 'Лёгкий' :
                     tour.difficulty === 'medium' ? 'Средний' : 'Сложный'}
                  </span>
                </div>
              </div>

              <div className="tour-selection__action">
                <span className="tour-selection__actionText">Выбрать тур</span>
                <span className="tour-selection__actionArrow">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="tour-selection__footer">
          <Link to="/" className="tour-selection__back">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
