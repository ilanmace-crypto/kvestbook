import { Navigate, Route, Routes } from 'react-router-dom'

import HomePage from './pages/HomePage'
import TourSelectionPage from './pages/TourSelectionPage'
import MapPage from './pages/MapPage'
import PlacePage from './pages/PlacePage'

import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tours" element={<TourSelectionPage />} />
      <Route path="/map" element={<MapPage />} />
      <Route path="/place/:id" element={<PlacePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
