import { useState, useEffect, useRef } from 'react'
import '../styles/chatbot.css'
import { getTourById, getDefaultTour } from '../data/tours'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  type?: 'riddle' | 'hint' | 'success' | 'error'
  displayedText?: string
  isTyping?: boolean
}

interface QuestStage {
  id: number
  location: string
  riddle: string
  answer: string
  hint: string
  coordinates: { lat: number, lng: number }
}

const questStages: QuestStage[] = [
  {
    id: 1,
    location: 'Гольшанский замок',
    riddle: `В замке древнем, где эхо гремит,
О славе рода, что кровь пролил,
Найди зверя, что стрелы таит,
Что прячет он в древней стене?`,
    answer: '2',
    hint: 'Герб находится на сохранившихся стенах замка. Ищите хитрого зверя с луком и стрелой. Сосчитайте линии на стреле — ответ однозначное число.',
    coordinates: { lat: 54.2515, lng: 26.0203 }
  },
  {
    id: 2,
    location: 'Костёл Св. Иоанна (Гольшаны)',
    riddle: `В храме старом, где тени стонут,
О деве, что в стене застыла,
Найди призрака, что ночью бродит,
Чей образ в легендах живёт.`,
    answer: 'белая дама',
    hint: 'Ищите памятную табличку около костёла. Легенда о призраке в белом. Имя женщины, замурованной в стене.',
    coordinates: { lat: 54.2569, lng: 26.0100 }
  },
  {
    id: 3,
    location: 'Дуга Струве (Тюпишки)',
    riddle: `Не храм, не замок — камень один,
Хранит он меру мира земного.
Ученый мерил Земли глубины,
Что отмечает сей древний знак?`,
    answer: 'измерение земли',
    hint: 'Найдите информационную табличку на пункте. Это геодезическая сеть XIX века. Цель — определить форму и размеры Земли.',
    coordinates: { lat: 54.2920, lng: 26.0460 }
  },
  {
    id: 4,
    location: 'Костёл в Жупранах',
    riddle: `Здесь спит поэт, чей голос звучит,
Он звал беречь родную речь нашу.
Найди могилу, где слово горит,
Что в ней таит мудрость веков?`,
    answer: '6',
    hint: 'Ищите могилу на местном кладбище. Прочитайте его знаменитую цитату. Посчитайте слова в первой части фразы.',
    coordinates: { lat: 54.4709, lng: 26.0862 }
  },
  {
    id: 5,
    location: 'Руины в Ошмянах',
    riddle: `В руинах старых, где камень трещит,
Узор стрельчатый ввысь летит.
Найди ту форму, что к небу рвётся,
Орден францисканцев здесь когда-то витали!`,
    answer: 'стрельчатая',
    hint: 'Осмотрите сохранившиеся арки внимательно. Ищите готические элементы в руинах. Форма арки, устремленной вверх.',
    coordinates: { lat: 54.4259, lng: 25.9564 }
  },
  {
    id: 6,
    location: 'Монастырь в Борунах',
    riddle: `В монастыре, где икона сияет,
Люди приходят печаль развеять.
Найди ту Деву, что раны лечит,
Какой же лик здесь сердца греет?`,
    answer: 'утешительница',
    hint: 'Спросите у смотрителя монастыря. Икона Божьей Матери, помогающая скорбящим. Её название — часть имени иконы.',
    coordinates: { lat: 54.3164, lng: 26.1391 }
  }
]

const questStagesOshmyany: QuestStage[] = [
  {
    id: 1,
    location: 'Центральная площадь',
    riddle: `На площади — следы былых времён,
Но в шуме дней один фасад хранён.
Найди дом, что на старом снимке есть,
И на втором его ярусе — окон счесть.`,
    answer: '8',
    hint: 'Нужен дом, который узнаётся и на архивном фото, и сегодня. Считай окна именно на 2-м этаже (обычно одинаковые проёмы).',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 2,
    location: 'Костёл Святого Михаила',
    riddle: `Две башни держат небо над землёй,
В них ярусы стоят стеной.
Взгляни на каждую, не спеши считать:
Сколь уровней вверх она умеет держать?`,
    answer: '3',
    hint: 'Считай ярусы (визуальные «уровни» башни): отделяются карнизами/поясками. Нужна цифра для одной башни (они одинаковые).',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 3,
    location: 'Православная церковь',
    riddle: `Через дорогу — иной язык небес,
Купола как свечи, молчаливый лес.
Не имя нужно — лишь счёт без суеты:
Сколько «луковиц» над крышей видишь ты?`,
    answer: '5',
    hint: 'Считай именно купола-луковицы на крыше (не кресты и не маленькие декоративные элементы).',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 4,
    location: 'Краеведческий музей',
    riddle: `Здесь слова — как ключи, а память — как сталь,
Но строка поэта скрывает печаль.
Продолжи завет — и не ошибись:
«Не пакідайце ж мовы нашай беларускай, каб не…»`,
    answer: 'умерлі',
    hint: 'Это цитата Франтишка Богушевича. Нужное слово — одно, по-белорусски.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 5,
    location: 'Ошмянская синагога',
    riddle: `Под сводами памяти — узор и круговерть,
Знаки встают в ряд, как древняя тетрадь.
Скажи мне число — без лишних слов:
Сколько созвездий-символов держит её потолок?`,
    answer: '12',
    hint: 'Речь про знаки зодиака (их классическое количество). Если есть стенд/роспись — сверяйся с ним.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 6,
    location: 'Старый городской парк',
    riddle: `Тут слышен шёпот воды меж ветвей,
И тень фонаря укажет путь скорей.
Скажи не «где», а «как зовут» струю:
Имя реки у парка — назови её.`,
    answer: 'ошмянка',
    hint: 'Название реки можно увидеть на табличках/картах или спросить у местных. Пиши без кавычек.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 7,
    location: 'Руины францисканцев',
    riddle: `В камне — дыхание, в пустоте — ответ,
Здесь век говорит, но не шепчет — звенит.
Собери ключи и замок запри:
Какое слово хранит здесь «алтарный» щит?`,
    answer: 'печать',
    hint: 'Это финальное слово-пароль. Оно связано с сюжетом квеста и тем, что ты собираешь по частям.',
    coordinates: { lat: 54.4259, lng: 25.9564 }
  }
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStage, setCurrentStage] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [questStarted, setQuestStarted] = useState(false)
  const [collectedCode, setCollectedCode] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const savedName = localStorage.getItem('userName')

    const selectedTour = localStorage.getItem('selectedTour')
    if (!selectedTour) return
    if (selectedTour !== 'sapieha-seal' && selectedTour !== 'oshmyany-city') return

    const raw = localStorage.getItem(`${selectedTour}-botProgress`)
    if (!raw) {
      // Если прогресса нет, отправляем приветствие с вопросом готовности
      const welcomeText = savedName
        ? `👋 Привет, ${savedName}! Добро пожаловать в квест «Ошмянские тайны»!\n\nГотов(а) начать приключение и раскрыть тайны древнего города?`
        : '👋 Привет! Добро пожаловать в квест «Ошмянские тайны»!\n\nГотов(а) начать приключение и раскрыть тайны древнего города?'

      const welcomeMessage: Message = {
        id: `welcome-${Date.now()}`,
        text: welcomeText,
        isBot: true,
        timestamp: new Date(),
        displayedText: welcomeText,
        isTyping: false,
      }
      setMessages([welcomeMessage])
      return
    }

    try {
      const saved = JSON.parse(raw) as {
        currentStage?: number
        collectedCode?: string[]
      }

      const restoredStage = typeof saved.currentStage === 'number' ? saved.currentStage : 0
      const restoredCode = Array.isArray(saved.collectedCode) ? saved.collectedCode : []

      if (restoredStage >= 1) {
        setQuestStarted(true)
        setCurrentStage(restoredStage)
        setCollectedCode(restoredCode)

        const restoreText = restoredStage <= (selectedTour === 'sapieha-seal' ? questStages.length : questStagesOshmyany.length)
          ? `🔁 ${savedName ? `Привет, ${savedName}!` : 'Привет!'} Я нашёл твой прогресс и готов продолжать с этапа ${restoredStage}. Нажми «Я на месте», когда будешь у текущей локации.`
          : `🏁 ${savedName ? `Привет, ${savedName}!` : 'Привет!'} Похоже, этот тур уже завершён. Хочешь пройти ещё раз — нажми «Начать квест». `

        const restoreMessage: Message = {
          id: `restore-${Date.now()}`,
          text: restoreText,
          isBot: true,
          timestamp: new Date(),
          displayedText: restoreText,
          isTyping: false,
        }
        setMessages([restoreMessage])
      }
    } catch {
      return
    }
  }, [])

  const addMessage = (text: string, isBot: boolean = true, type?: Message['type']) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isBot,
      timestamp: new Date(),
      type,
      displayedText: '',
      isTyping: true
    }
    setMessages(prev => [...prev, message])
    
    // Начинаем печатать текст
    let currentIndex = 0
    const typingSpeed = 50 // миллисекунд на символ
    
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, displayedText: text.slice(0, currentIndex + 1) }
              : msg
          )
        )
        currentIndex++
        setTimeout(typeNextChar, typingSpeed)
      } else {
        // Завершаем печать
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, isTyping: false }
              : msg
          )
        )
      }
    }
    
    setTimeout(typeNextChar, 300) // Небольшая задержка перед началом печати
  }

  const startQuest = () => {
    setQuestStarted(true)
    setCurrentStage(1)
    
    const selectedTour = localStorage.getItem('selectedTour')
    const isSapiegaTour = selectedTour === 'sapieha-seal'

    const tour = getTourById(selectedTour || '') || getDefaultTour()
    const tourPlaceOrder = tour.places
    
    // Инициализируем прогресс бота
    const initialBotProgress = {
      currentStage: 1,
      collectedCode: [],
      unlockedMarkers: [tourPlaceOrder[0]]
    }
    localStorage.setItem(`${selectedTour}-botProgress`, JSON.stringify(initialBotProgress))
    
    // Отправляем событие для обновления карты
    window.dispatchEvent(new CustomEvent('botProgressUpdated'))
    
    const introText = isSapiegaTour 
      ? `🏰 Приветствую, искатель! Ты на землях Ошмянщины. Здесь история застыла в камне, а призраки прошлого охраняют свои тайны.

Твоя цель — собрать 6 фрагментов Печати Сапег. Только тогда ты познаешь истину этого края.

Первая точка — резиденция "Черного замка". Отправляйся в Гольшаны. Как будешь на месте, нажми "Я на месте".`
      : `🏛️ Добро пожаловать в квест «Печать Ошмянского магистрата»!

Ты — молодой архивариус: в старых бумагах ты нашёл карту XVII века. На ней говорится, что городская печать, дарующая «право на процветание», была спрятана во времена войн.

Твоя цель — собрать 7 цифровых ключей. Каждый ключ откроет следующую точку.

Первая точка — Центральная площадь. Как будешь на месте, нажми "Я на месте".`
    
    addMessage(introText)

    setCurrentStage(1)
  }

  const checkLocation = () => {
    // Убираем проверку геолокации - если нажали "Я на месте", значит человек на месте
    const selectedTour = localStorage.getItem('selectedTour')
    const isSapiegaTour = selectedTour === 'sapieha-seal'
    const currentStages = isSapiegaTour ? questStages : questStagesOshmyany
    const targetStage = currentStages[currentStage - 1]
    const fullMessage = `✅ Отлично! Ты на месте. Вот твоя загадка:

${targetStage.riddle}`
    addMessage(fullMessage, true, 'riddle')
  }

  const checkAnswer = () => {
    if (!userInput.trim()) return

    const selectedTour = localStorage.getItem('selectedTour')
    const isSapiegaTour = selectedTour === 'sapieha-seal'
    const currentStages = isSapiegaTour ? questStages : questStagesOshmyany
    const targetStage = currentStages[currentStage - 1]
    const normalizedUserAnswer = userInput.trim().toLowerCase()
    const normalizedCorrectAnswer = targetStage.answer.toLowerCase()

    const isOshmyanyMuseumStage = !isSapiegaTour && currentStage === 4
    const isOshmyanyMuseumAnswerOk =
      isOshmyanyMuseumStage && (normalizedUserAnswer === 'умерлі' || normalizedUserAnswer === 'умерли')

    if (normalizedUserAnswer === normalizedCorrectAnswer || isOshmyanyMuseumAnswerOk) {
      // Генерируем кодовый фрагмент
      const codeFragment = isSapiegaTour
        ? (currentStage === 1 ? '2' :
           currentStage === 2 ? 'С' :
           currentStage === 3 ? '3' :
           currentStage === 4 ? '8' :
           currentStage === 5 ? 'Арка' :
           currentStage === 6 ? 'Утешительница' : '')
        : (currentStage === 1 ? 'Ключ-1' :
           currentStage === 2 ? 'Ключ-2' :
           currentStage === 3 ? 'Ключ-3' :
           currentStage === 4 ? 'Ключ-4' :
           currentStage === 5 ? 'Ключ-5' :
           currentStage === 6 ? 'Ключ-6' :
           currentStage === 7 ? 'Ключ-7' : '')

      const nextCollectedCode = [...collectedCode, codeFragment]
      setCollectedCode(nextCollectedCode)

      const fragmentMessage = isSapiegaTour 
        ? (currentStage === 1 ? `Первая цифра кода — ${codeFragment}` :
           currentStage === 2 ? `Запомни первую букву — ${codeFragment}` :
           currentStage === 6 ? `Последнее слово — ${codeFragment}` :
           `Фрагмент кода: ${codeFragment}`)
        : `Цифровой ключ получен: ${codeFragment}`

      addMessage(`🎉 Верно! ${fragmentMessage}`, true, 'success')

      const totalStages = isSapiegaTour ? questStages.length : questStagesOshmyany.length
      if (currentStage < totalStages) {
        setTimeout(() => {
          const nextStage = currentStages[currentStage]
          addMessage(`Отлично! Теперь отправляйся к следующей точке: ${nextStage.location}. Как будешь на месте, нажми "Я на месте".`)
          setCurrentStage(currentStage + 1)
          
          // Сохраняем прогресс бота для синхронизации с маркерами
          const tour = getTourById(selectedTour || '') || getDefaultTour()
          const tourPlaceOrder = tour.places

          const botProgress = {
            currentStage: currentStage + 1,
            collectedCode: nextCollectedCode,
            unlockedMarkers: tourPlaceOrder.slice(0, currentStage + 1),
            newlyUnlocked: tourPlaceOrder[currentStage] || null,
          }
          localStorage.setItem(`${selectedTour}-botProgress`, JSON.stringify(botProgress))
          
          // Отправляем событие для обновления карты
          window.dispatchEvent(new CustomEvent('botProgressUpdated'))
        }, 2000)
      } else {
        // Quest completed
        const finalCode = nextCollectedCode.join('-')
        const completionMessage = isSapiegaTour 
          ? `🏆 ПОЗДРАВЛЯЮ! Печать Сапег восстановлена!

Твой итоговый код: ${finalCode}

Ты прошел путь настоящего краеведа. Покажи этот код организатору квеста, чтобы получить свой заслуженный артефакт! 🎁`
          : `🏆 ПОЗДРАВЛЯЮ! Печать Ошмянского магистрата восстановлена!

Твои ключи: ${finalCode}

Ты собрал(а) 7 цифровых ключей и открыл(а) финальную тайну города. Покажи этот код организатору квеста! 🎁`
        
        addMessage(completionMessage, true, 'success')
        
        // Сохраняем финальный прогресс
        const botProgress = {
          currentStage: totalStages + 1,
          collectedCode: nextCollectedCode,
          unlockedMarkers: (getTourById(selectedTour || '') || getDefaultTour()).places,
          newlyUnlocked: null,
        }
        localStorage.setItem(`${selectedTour}-botProgress`, JSON.stringify(botProgress))
      }
    } else {
      addMessage('❌ Неправильно. Попробуй ещё раз или запроси подсказку.', true, 'error')
    }

    setUserInput('')
  }

  const giveHint = () => {
    const selectedTour = localStorage.getItem('selectedTour')
    const isSapiegaTour = selectedTour === 'sapieha-seal'
    const currentStages = isSapiegaTour ? questStages : questStagesOshmyany
    const targetStage = currentStages[currentStage - 1]
    addMessage(`💡 Подсказка: ${targetStage.hint}`, true, 'hint')
  }

  // Only show chatbot for the supported tours
  const selectedTour = localStorage.getItem('selectedTour')
  if (selectedTour !== 'sapieha-seal' && selectedTour !== 'oshmyany-city') {
    return null
  }

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть чат-бот помощник"
      >
        🤖
      </button>

      {/* Chatbot window */}
      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <span className="chatbot-avatar-icon">🏰</span>
              <span className="chatbot-avatar-bot">🤖</span>
            </div>
            <span className="chatbot-title">Ошмянский Артефакт</span>
            <button
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="Закрыть чат-бот"
            >
              ✕
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot-message ${message.isBot ? 'chatbot-message--bot' : 'chatbot-message--user'} ${
                  message.type ? `chatbot-message--${message.type}` : ''
                }`}
              >
                <div className="chatbot-message-content">
                  {(message.displayedText || message.text).split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < (message.displayedText || message.text).split('\n').length - 1 && <br />}
                    </span>
                  ))}
                  {message.isTyping && <span className="chatbot-cursor">|</span>}
                </div>
                <div className="chatbot-message-time">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {!questStarted ? (
            <div className="chatbot-actions">
              <button className="chatbot-button chatbot-button--primary" onClick={startQuest}>
                🚀 Начать квест
              </button>
            </div>
          ) : currentStage <= questStages.length ? (
            <div className="chatbot-actions">
              {currentStage > 0 && currentStage <= questStages.length && (
                <>
                  <button className="chatbot-button" onClick={checkLocation}>
                    📍 Я на месте
                  </button>
                  <button className="chatbot-button chatbot-button--secondary" onClick={giveHint}>
                    💡 Подсказка
                  </button>
                </>
              )}
            </div>
          ) : null}

          {questStarted && currentStage > 0 && currentStage <= questStages.length && (
            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Введи ответ..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <button className="chatbot-send" onClick={checkAnswer}>
                Отправить
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
