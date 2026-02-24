import coordinates from './coordinates.json'

export type Place = {
  id: string
  title: string
  description: string
  videoUrl?: string
  videoTitle?: string
  photos?: string[]
  tasks: {
    id: string
    question: string
    answer: string
    hints: string[]
  }[]
  lat: number
  lng: number
}

export const START_POINT = coordinates.startPoint

export const places: Place[] = [
  {
    id: '1',
    title: 'Костёл Святого Михаила',
    description: 'Главный католический храм Ошмян, построенный в начале XX века. Его башни видны из многих точек города. Внимательно осмотри фасад и найди табличку у входа.',
    tasks: [
      {
        id: '1-1',
        question: 'В храме высоком, где башни горят,\nГод окончания найди на вратах.\nКогда был построен сей дивный храм,\nВ каком столетье возник его облик?',
        answer: '1906',
        hints: ['Посмотри на бронзовую табличку справа от входа', 'Там написан год — 1906', 'Это начало XX века'],
      },
    ],
    videoUrl: coordinates.locations[0].videoUrl,
    videoTitle: coordinates.locations[0].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    lat: coordinates.locations[0].lat,
    lng: coordinates.locations[0].lng,
  },
  {
    id: '3',
    title: 'Ошмянская синагога',
    description: coordinates.locations[1].description,
    videoUrl: coordinates.locations[1].videoUrl,
    videoTitle: coordinates.locations[1].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '3-1',
        question: 'В доме молитвы, где окна блестят,\nШесть окон фасад украшают собой.\nКогда возвели этот храм для молитв,\nВ каком веке он был построен людьми?',
        answer: '19',
        hints: ['Ищи на информационном стенде', 'Это не XX век', 'Ответ — однозначное число'],
      },
    ],
    lat: coordinates.locations[1].lat,
    lng: coordinates.locations[1].lng,
  },
  {
    id: '4',
    title: 'Руины костёл Пресвятой Девы Марии и монастырь францисканцев',
    description: 'Руины костёла Пресвятой Девы Марии и монастыря францисканцев. Важный исторический памятник, свидетельствующий о богатой религиозной истории Ошмян. Монастырь был основан в XVII веке и долгое время служил духовным центром города.',
    videoUrl: coordinates.locations[2].videoUrl,
    videoTitle: coordinates.locations[2].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c2a6?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '4-1',
        question: 'В руинах древних, где францисканцы жили,\nОрден святой здесь основал свой приют.\nКогда появился монастырь сей святой,\nВ каком столетье он встал на земле?',
        answer: '17',
        hints: ['Ищи на исторической табличке', 'Монастырь древний', 'Ответ — однозначное число'],
      },
    ],
    lat: coordinates.locations[2].lat,
    lng: coordinates.locations[2].lng,
  },
  {
    id: '5',
    title: 'Центральная площадь',
    description: coordinates.locations[3].description,
    videoUrl: coordinates.locations[3].videoUrl,
    videoTitle: coordinates.locations[3].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '5-1',
        question: 'На площади главной, где памятник стоит,\nГранитные фигуры основателей ждут.\nКогда впервые город был упомянут,\nВ каком году встал он на карты земли?',
        answer: '1387',
        hints: ['Ищи на постаменте', 'Город впервые упомянут в XIV веке', 'Ответ — четырёхзначное число'],
      },
    ],
    lat: coordinates.locations[3].lat,
    lng: coordinates.locations[3].lng,
  },
  {
    id: '6',
    title: 'Православная церковь',
    description: coordinates.locations[4].description,
    videoUrl: coordinates.locations[4].videoUrl,
    videoTitle: coordinates.locations[4].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '6-1',
        question: 'В храме православном, где купола горят,\nКолокольня рядом возвышается гордо.\nСколько куполов венчают сей храм,\nСколько золотых глав сияют в вышине?',
        answer: '5',
        hints: ['Посмотри на крышу', 'Куполов видно несколько', 'Ответ — однозначное число'],
      },
    ],
    lat: coordinates.locations[4].lat,
    lng: coordinates.locations[4].lng,
  },
  {
    id: '7',
    title: 'Ошмянский краеведческий музей',
    description: coordinates.locations[5].description,
    videoUrl: coordinates.locations[5].videoUrl,
    videoTitle: coordinates.locations[5].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '7-1',
        question: 'В доме истории, где память жива,\nДва этажа знаний, экспозиций полно.\nКогда был основан музей этот славный,\nВ каком году двери свои он открыл?',
        answer: '1968',
        hints: ['Ищи на табличке у входа', 'Это XX век', 'Ответ — четырёхзначное число'],
      },
    ],
    lat: coordinates.locations[5].lat,
    lng: coordinates.locations[5].lng,
  },
  {
    id: '8',
    title: 'Старый городской парк',
    description: coordinates.locations[6].description,
    videoUrl: coordinates.locations[6].videoUrl,
    videoTitle: coordinates.locations[6].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '8-1',
        question: 'В парке старинном, где деревья шумят,\nЧетыре аллеи сходятся в круг.\nКакое дерево — символ сего места,\nЧто здесь растёт, символизируя покой?',
        answer: 'берёза',
        hints: ['Ищи на информационном стенде', 'Это лиственное дерево', 'Ответ — название дерева'],
      },
    ],
    lat: coordinates.locations[6].lat,
    lng: coordinates.locations[6].lng,
  },
  {
    id: '9',
    title: 'Гольшанский замок',
    description: coordinates.locations[7].description,
    videoUrl: coordinates.locations[7].videoUrl,
    videoTitle: coordinates.locations[7].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1520637836862-4d197d17c2a6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '9-1',
        question: 'В замке древнем, где эхо гремит,\nО славе рода, что кровь пролил,\nНайди зверя, что стрелы таит,\nЧто прячет он в древней стене?',
        answer: '2',
        hints: ['Герб находится на сохранившихся стенах замка', 'Ищите хитрого зверя с луком и стрелой', 'Сосчитайте линии на стреле — ответ однозначное число'],
      },
    ],
    lat: coordinates.locations[7].lat,
    lng: coordinates.locations[7].lng,
  },
  {
    id: '10',
    title: 'Костёл Святого Иоанна Крестителя',
    description: coordinates.locations[8].description,
    videoUrl: coordinates.locations[8].videoUrl,
    videoTitle: coordinates.locations[8].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '10-1',
        question: 'В храме старом, где тени стонут,\nО деве, что в стене застыла,\nНайди призрака, что ночью бродит,\nБелая Дама — тайна жива!',
        answer: 'белая дама',
        hints: ['Ищите памятную табличку около костёла', 'Легенда о призраке в белом', 'Имя женщины, замурованной в стене'],
      },
    ],
    lat: coordinates.locations[8].lat,
    lng: coordinates.locations[8].lng,
  },
  {
    id: '11',
    title: 'Дуга Струве (пункт Тюпишки)',
    description: coordinates.locations[9].description,
    videoUrl: coordinates.locations[9].videoUrl,
    videoTitle: coordinates.locations[9].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '11-1',
        question: 'Не храм, не замок — камень один,\nХранит он меру мира земного.\nУченый мерил Земли глубины,\nНайди отметку — тайна готова!',
        answer: 'измерение земли',
        hints: ['Найдите информационную табличку на пункте', 'Это геодезическая сеть XIX века', 'Цель — определить форму и размеры Земли'],
      },
    ],
    lat: coordinates.locations[9].lat,
    lng: coordinates.locations[9].lng,
  },
  {
    id: '12',
    title: 'Костёл Святых Петра и Павла (Жупраны)',
    description: coordinates.locations[10].description,
    videoUrl: coordinates.locations[10].videoUrl,
    videoTitle: coordinates.locations[10].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '12-1',
        question: 'Здесь спит поэт, чей голос звучит,\nОн звал беречь родную речь нашу.\nНайди могилу, где слово горит,\nСчитай слоги — и тайна ваша!',
        answer: '6',
        hints: ['Ищите могилу на местном кладбище', 'Прочитайте его знаменитую цитату', 'Посчитайте слова в первой части фразы'],
      },
    ],
    lat: coordinates.locations[10].lat,
    lng: coordinates.locations[10].lng,
  },
  {
    id: '13',
    title: 'Руины костёла францисканцев (Ошмяны)',
    description: coordinates.locations[11].description,
    videoUrl: coordinates.locations[11].videoUrl,
    videoTitle: coordinates.locations[11].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c2a6?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '13-1',
        question: 'В руинах старых, где камень трещит,\nУзор стрельчатый ввысь летит.\nНайди ту арку, что небо пронзает,\nФранцисканцы здесь когда-то витали!',
        answer: 'стрельчатая',
        hints: ['Осмотрите сохранившиеся арки внимательно', 'Ищите готические элементы в руинах', 'Форма арки, устремленной вверх'],
      },
    ],
    lat: coordinates.locations[11].lat,
    lng: coordinates.locations[11].lng,
  },
  {
    id: '14',
    title: 'Монастырь базилиан (Боруны)',
    description: coordinates.locations[12].description,
    videoUrl: coordinates.locations[12].videoUrl,
    videoTitle: coordinates.locations[12].videoTitle,
    photos: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
    ],
    tasks: [
      {
        id: '14-1',
        question: 'В монастыре, где икона сияет,\nЛюди приходят печаль развеять.\nНайди ту Деву, что раны лечит,\nУтешительница — имя её звучит!',
        answer: 'утешительница',
        hints: ['Спросите у смотрителя монастыря', 'Икона Божьей Матери, помогающая скорбящим', 'Её название — часть имени иконы'],
      },
    ],
    lat: coordinates.locations[12].lat,
    lng: coordinates.locations[12].lng,
  },
]
