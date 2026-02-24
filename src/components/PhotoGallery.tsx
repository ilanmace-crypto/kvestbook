import { useState, useEffect } from 'react'
import '../styles/photo-gallery.css'

interface PhotoGalleryProps {
  photos: string[]
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function PhotoGallery({ photos, title, isOpen, onClose }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowLeft':
          setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1)
          break
        case 'ArrowRight':
          setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0)
          break
        case 'Escape':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, photos.length, onClose])

  if (!isOpen) return null

  const nextPhoto = () => {
    setCurrentIndex(prev => prev < photos.length - 1 ? prev + 1 : 0)
  }

  const prevPhoto = () => {
    setCurrentIndex(prev => prev > 0 ? prev - 1 : photos.length - 1)
  }

  return (
    <div className="photo-gallery-overlay" onClick={onClose}>
      <div className="photo-gallery" onClick={e => e.stopPropagation()}>
        <button className="photo-gallery-close" onClick={onClose}>
          ✕
        </button>

        <div className="photo-gallery-header">
          <h2 className="photo-gallery-title">{title}</h2>
          <span className="photo-gallery-counter">
            {currentIndex + 1} / {photos.length}
          </span>
        </div>

        <div className="photo-gallery-content">
          <button className="photo-gallery-nav photo-gallery-nav--prev" onClick={prevPhoto}>
            ‹
          </button>

          <div className="photo-gallery-image-container">
            <img
              src={photos[currentIndex]}
              alt={`${title} - фото ${currentIndex + 1}`}
              className="photo-gallery-image"
              loading="lazy"
            />
          </div>

          <button className="photo-gallery-nav photo-gallery-nav--next" onClick={nextPhoto}>
            ›
          </button>
        </div>

        <div className="photo-gallery-thumbnails">
          {photos.map((photo, index) => (
            <button
              key={index}
              className={`photo-gallery-thumbnail ${
                index === currentIndex ? 'photo-gallery-thumbnail--active' : ''
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img src={photo} alt={`Миниатюра ${index + 1}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
