import { useState, useEffect, useRef, useMemo } from 'react'

import L from 'leaflet'

import { places, START_POINT, type Place } from '../data/places'
import { getTourById, getDefaultTour } from '../data/tours'

import '../styles/map.css'

import Chatbot from '../components/Chatbot'
import PhotoGallery from '../components/PhotoGallery'
import { useNavigate } from 'react-router-dom'

type Progress = {
  unlocked: string[]
  completed: string[]
  attempts: Record<string, number>
  lastAttempt?: number
}

type Point = { lat: number; lng: number }

const carIcon = L.divIcon({
  className: 'carMarker',
  html: '<div class="carMarker__body" />',
  iconSize: [34, 34],
  iconAnchor: [17, 17],
})

function placeIcon(type: 'completed' | 'open' | 'locked' | 'newlyUnlocked') {
  const icons = {
    completed: `
      <div class="placeMarker placeMarker--completed">
        <div class="placeMarker__glow"></div>
        <div class="placeMarker__body">
          <div class="placeMarker__icon">✅</div>
          <div class="placeMarker__ring placeMarker__ring--completed"></div>
        </div>
      </div>
    `,
    open: `
      <div class="placeMarker placeMarker--open">
        <div class="placeMarker__glow"></div>
        <div class="placeMarker__body">
          <div class="placeMarker__icon">📍</div>
          <div class="placeMarker__ring placeMarker__ring--open"></div>
        </div>
      </div>
    `,
    newlyUnlocked: `
      <div class="placeMarker placeMarker--newly-unlocked">
        <div class="placeMarker__glow placeMarker__glow--red"></div>
        <div class="placeMarker__body">
          <div class="placeMarker__icon">🔥</div>
          <div class="placeMarker__ring placeMarker__ring--newly-unlocked"></div>
        </div>
      </div>
    `,
    locked: `
      <div class="placeMarker placeMarker--locked">
        <div class="placeMarker__body">
          <div class="placeMarker__icon">🔒</div>
          <div class="placeMarker__ring placeMarker__ring--locked"></div>
        </div>
      </div>
    `,
  }

  return L.divIcon({
    className: 'placeMarker-wrapper',
    html: icons[type],
    iconSize: [48, 48],
    iconAnchor: [24, 44],
  })
}

export default function MapPage() {
  const navigate = useNavigate()

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  const carMarkerRef = useRef<L.Marker | null>(null)

  const animationFrameRef = useRef<number | null>(null)
  const timeoutRef = useRef<number | null>(null)
  const [isDriving] = useState(false)
  const [carPosition] = useState<Point | null>(null)
  const [followCar, setFollowCar] = useState(true)

  // Состояние для фотогалереи
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([])
  const [galleryTitle, setGalleryTitle] = useState('')
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  // Состояние для принудительного обновления маркеров при изменении прогресса бота
  const [botProgressUpdateTrigger, setBotProgressUpdateTrigger] = useState(0)

  // Прослушиватель обновления прогресса бота
  useEffect(() => {
    const handleBotProgressUpdate = () => {
      setBotProgressUpdateTrigger(prev => prev + 1)
    }

    window.addEventListener('botProgressUpdated', handleBotProgressUpdate)
    return () => window.removeEventListener('botProgressUpdated', handleBotProgressUpdate)
  }, [])

  const selectedTourId = localStorage.getItem('selectedTour') || getDefaultTour().id
  const selectedTour = useMemo(() => getTourById(selectedTourId) || getDefaultTour(), [selectedTourId])

  const filteredPlaces = useMemo(() => {
    return places.filter(place => selectedTour.places.includes(place.id))
  }, [selectedTour])

  // Прослушиватель изменений прогресса бота
  useEffect(() => {
    const handleBotProgressUpdate = () => {
      setBotProgressUpdateTrigger(prev => prev + 1)
    }

    window.addEventListener('botProgressUpdated', handleBotProgressUpdate)

    return () => {
      window.removeEventListener('botProgressUpdated', handleBotProgressUpdate)
    }
  }, [])

  const [progress] = useState<Progress>(() => {
    const progressKey = `questProgress-${selectedTourId}`
    const raw = localStorage.getItem(progressKey)
    if (!raw) {
      // Для тура Сапег изначально никаких точек не открыто
      if (selectedTourId === 'sapieha-seal') {
        return { unlocked: [], completed: [], attempts: {} }
      }
      // Для других туров открываем первую точку
      const firstPlaceId = selectedTour.places[0] || '1'
      return { unlocked: [firstPlaceId], completed: [], attempts: {} }
    }
    try {
      const parsed = JSON.parse(raw) as Progress
      return {
        unlocked: parsed.unlocked || [],
        completed: parsed.completed || [],
        attempts: parsed.attempts || {},
        lastAttempt: parsed.lastAttempt,
      }
    } catch {
      if (selectedTourId === 'sapieha-seal') {
        return { unlocked: [], completed: [], attempts: {} }
      }
      const firstPlaceId = selectedTour.places[0] || '1'
      return { unlocked: [firstPlaceId], completed: [], attempts: {} }
    }
  })

  const isDrivingRef = useRef(false)

  useEffect(() => {
    isDrivingRef.current = isDriving
  }, [isDriving])

  useEffect(() => {
    if (!mapContainerRef.current) return
    if (mapRef.current) return

    // Центрируем карту на первой точке тура
    const firstPlace = filteredPlaces[0]
    const centerLat = firstPlace ? firstPlace.lat : START_POINT.lat
    const centerLng = firstPlace ? firstPlace.lng : START_POINT.lng

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView([centerLat, centerLng], 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    mapRef.current = map

    filteredPlaces.forEach((p: Place) => {
      // Для обоих туров используем прогресс бота для разблокировки маркеров
      const botProgressKey = `${selectedTourId}-botProgress`
      const savedBotProgress = localStorage.getItem(botProgressKey)
      let currentBotProgress = null
      
      if (savedBotProgress) {
        try {
          currentBotProgress = JSON.parse(savedBotProgress)
        } catch (e) {
          console.error('Error parsing bot progress:', e)
        }
      }
      
      const isOpen = currentBotProgress?.unlockedMarkers?.includes(p.id) || false
      const isNewlyUnlocked = currentBotProgress?.newlyUnlocked === p.id
      const isCompleted = progress.completed.includes(p.id)
      
      // Определяем тип иконки
      let iconType: 'locked' | 'open' | 'completed' | 'newlyUnlocked' = 'locked'
      if (isNewlyUnlocked) {
        iconType = 'newlyUnlocked'
      } else if (isOpen) {
        iconType = isCompleted ? 'completed' : 'open'
      }
      
      const icon = placeIcon(iconType)
      
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(map)
      
      if (isOpen) {
        // Для разблокированных маркеров показываем описание и галерею при клике
        const popupContent = `
          <div style="max-width: 300px; text-align: center;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${p.title}</h3>
            <p style="margin: 0 0 15px 0; font-size: 14px; color: #666;">${p.description}</p>
            ${p.photos && p.photos.length > 0 ? `
              <button onclick="window.openGallery && window.openGallery('${p.id}')" 
                      style="background: #ffd24a; color: #000; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                📸 Посмотреть фото (${p.photos.length})
              </button>
            ` : ''}
            ${p.videoUrl ? `
              <div style="margin-top: 15px;">
                <h4 style="margin: 0 0 10px 0; font-size: 16px; color: #333;">${p.videoTitle || 'Видео о локации'}</h4>
                <iframe 
                  width="280" 
                  height="157" 
                  src="${p.videoUrl}" 
                  title="${p.videoTitle || 'Видео'}"
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                  style="border-radius: 8px;">
                </iframe>
              </div>
            ` : ''}
          </div>
        `
        marker.bindPopup(popupContent)
      } else {
        marker.bindPopup('<div style="text-align: center; color: #666;">Эта локация ещё не открыта</div>')
      }
      
      // Обработчик клика для открытия галереи
      if (isOpen && p.photos && p.photos.length > 0) {
        marker.on('click', () => {
          setGalleryPhotos(p.photos || [])
          setGalleryTitle(p.title)
          setIsGalleryOpen(true)
        })
      }
    })

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [filteredPlaces, botProgressUpdateTrigger, selectedTourId])

  // Автоматическое перемещение карты на только что разблокированную точку
  useEffect(() => {
    if (mapRef.current && filteredPlaces.length > 0) {
      // Получаем актуальный прогресс бота для текущего тура
      const botProgressKey = `${selectedTourId}-botProgress`
      const savedBotProgress = localStorage.getItem(botProgressKey)
      let currentBotProgress = null
      
      if (savedBotProgress) {
        try {
          currentBotProgress = JSON.parse(savedBotProgress)
        } catch (e) {
          console.error('Error parsing bot progress:', e)
        }
      }
      
      if (currentBotProgress?.unlockedMarkers?.length > 0) {
        // Находим только что разблокированную точку
        const lastUnlockedId = currentBotProgress.unlockedMarkers[currentBotProgress.unlockedMarkers.length - 1]
        const lastUnlockedPlace = filteredPlaces.find(p => p.id === lastUnlockedId)
        
        if (lastUnlockedPlace) {
          // Плавно перемещаем карту к новой точке
          mapRef.current.panTo([lastUnlockedPlace.lat, lastUnlockedPlace.lng], {
            animate: true,
            duration: 1.5
          })
        }
      }
    }
  }, [selectedTourId, filteredPlaces, botProgressUpdateTrigger])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !carPosition) return

    if (!carMarkerRef.current) {
      carMarkerRef.current = L.marker([carPosition.lat, carPosition.lng], { icon: carIcon }).addTo(map)
    } else {
      carMarkerRef.current.setLatLng([carPosition.lat, carPosition.lng])
    }

    if (followCar) {
      map.panTo([carPosition.lat, carPosition.lng], { animate: true })
    }
  }, [carPosition, followCar])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function resetProgress() {
    const progressKey = `questProgress-${selectedTourId}`
    localStorage.removeItem(progressKey)
    window.location.reload()
  }

  return (
    <div className="mapPage">
      <div className="mapPage__topbar">
        <button className="mapPage__back" onClick={() => navigate('/')} disabled={isDriving}>
          <span className="mapPage__back-icon">←</span>
          <span>Назад</span>
        </button>

        <div className="mapPage__title">
          <span className="mapPage__title-icon">🗺️</span>
          <span>Карта</span>
        </div>

        <div className="mapPage__actions">
          <button className="mapPage__reset" onClick={resetProgress} title="Сбросить прогресс">
            🔄
          </button>
          <button className="mapPage__toggle" onClick={() => setFollowCar((v) => !v)} disabled={!carPosition}>
            {followCar ? 'Следить' : 'Не следить'}
          </button>
        </div>
      </div>

      <div className="mapPage__map">
        <div ref={mapContainerRef} className="mapPage__leaflet" />

        {isDriving ? (
          <div className="mapPage__overlay">
            <div className="mapPage__overlayCard">
              <div className="mapPage__overlayIcon">🚗</div>
              <div className="mapPage__overlayText">Едем к локации…</div>
              <div className="mapPage__overlaySub">Не закрывай приложение</div>
              <div className="mapPage__progressBar">
                <div className="mapPage__progressBarFill" style={{ animationDuration: '3s' }} />
              </div>
            </div>
          </div>
        ) : null}

        {!isDriving ? (
          <div className="mapPage__sheet">
            <div className="mapPage__sheetHeader">
              <div className="mapPage__sheetIcon">📍</div>
              <div className="mapPage__sheetTitle">Доступная локация</div>
            </div>
            <div className="mapPage__sheetText">Нажми на первую метку на карте — поедем туда на машинке.</div>
          </div>
        ) : null}
      </div>

      <Chatbot />
      <PhotoGallery
        photos={galleryPhotos}
        title={galleryTitle}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  )
}
