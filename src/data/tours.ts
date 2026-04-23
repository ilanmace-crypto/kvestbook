export type Tour = {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'easy' | 'medium' | 'hard'
  places: string[] // IDs мест из places.ts
  image?: string
}

export const tours: Tour[] = [
  {
    id: 'oshmyany-city',
    title: 'Печать Ошмянского магистрата',
    description: 'Квест-игра по историческому центру Ошмян. Собери 7 цифровых ключей, чтобы восстановить печать магистрата и открыть финальную тайну города.',
    duration: '2-3 часа',
    difficulty: 'easy',
    places: ['5', '1', '6', '7', '3', '8', '4'], // Оптимизированное кольцо по городу
    image: '🏛️'
  },
  {
    id: 'sapieha-seal',
    title: 'Печать Сапег: В поисках Ошмянского артефакта',
    description: 'Ошмянский район — край легенд, призраков и старинной архитектуры. Квест-игра в поисках "Золотого ключа Ошмянщины", который открывает путь к истинному пониманию истории края.',
    duration: '4-6 часов',
    difficulty: 'hard',
    places: ['9', '10', '11', '12', '13', '14'], // Гольшанский замок, Костёл в Гольшанах, Дуга Струве, Костёл в Жупранах, Руины в Ошмянах, Монастырь в Борунах
    image: '🏰'
  }
]

export const getTourById = (id: string): Tour | undefined => {
  return tours.find(tour => tour.id === id)
}

export const getDefaultTour = (): Tour => tours[0]
