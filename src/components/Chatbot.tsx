import { useState, useEffect, useRef } from 'react'
import '../styles/chatbot.css'

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
    location: 'Костёл Святого Михаила',
    riddle: `В храме высоком, где башни горят,
Год окончания найди на вратах.
Когда был построен сей дивный храм,
В каком столетье возник его облик?`,
    answer: '1906',
    hint: 'Посмотри на бронзовую табличку справа от входа. Там написан год — 1906. Это начало XX века.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 2,
    location: 'Ошмянская синагога',
    riddle: `В доме молитвы, где окна блестят,
Шесть окон фасад украшают собой.
Когда возвели этот храм для молитв,
В каком веке он был построен людьми?`,
    answer: '19',
    hint: 'Ищи на информационном стенде. Это не XX век. Ответ — однозначное число.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 3,
    location: 'Руины францисканцев',
    riddle: `В руинах древних, где францисканцы жили,
Орден святой здесь основал свой приют.
Когда появился монастырь сей святой,
В каком столетье он встал на земле?`,
    answer: '17',
    hint: 'Ищи на исторической табличке. Монастырь древний. Ответ — однозначное число.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 4,
    location: 'Центральная площадь',
    riddle: `На площади главной, где памятник стоит,
Гранитные фигуры основателей ждут.
Когда впервые город был упомянут,
В каком году встал он на карты земли?`,
    answer: '1387',
    hint: 'Ищи на постаменте. Город впервые упомянут в XIV веке. Ответ — четырёхзначное число.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 5,
    location: 'Православная церковь',
    riddle: `В храме православном, где купола горят,
Колокольня рядом возвышается гордо.
Сколько куполов венчают сей храм,
Сколько золотых глав сияют в вышине?`,
    answer: '5',
    hint: 'Посмотри на крышу. Куполов видно несколько. Ответ — однозначное число.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 6,
    location: 'Краеведческий музей',
    riddle: `В доме истории, где память жива,
Два этажа знаний, экспозиций полно.
Когда был основан музей этот славный,
В каком году двери свои он открыл?`,
    answer: '1968',
    hint: 'Ищи на табличке у входа. Это XX век. Ответ — четырёхзначное число.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
  },
  {
    id: 7,
    location: 'Старый городской парк',
    riddle: `В парке старинном, где деревья шумят,
Четыре аллеи сходятся в круг.
Какое дерево — символ сего места,
Что здесь растёт, символизируя покой?`,
    answer: 'берёза',
    hint: 'Ищи на информационном стенде. Это лиственное дерево. Ответ — название дерева.',
    coordinates: { lat: 54.4149, lng: 25.9333 }
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
    
    // Инициализируем прогресс бота
    const initialBotProgress = {
      currentStage: 1,
      collectedCode: [],
      unlockedMarkers: isSapiegaTour ? ['9'] : ['1'] // Первая локация зависит от тура
    }
    localStorage.setItem(`${selectedTour}-botProgress`, JSON.stringify(initialBotProgress))
    
    // Отправляем событие для обновления карты
    window.dispatchEvent(new CustomEvent('botProgressUpdated'))
    
    const introText = isSapiegaTour 
      ? `🏰 Приветствую, искатель! Ты на землях Ошмянщины. Здесь история застыла в камне, а призраки прошлого охраняют свои тайны.

Твоя цель — собрать 6 фрагментов Печати Сапег. Только тогда ты познаешь истину этого края.

Первая точка — резиденция "Черного замка". Отправляйся в Гольшаны. Как будешь на месте, нажми "Я на месте".`
      : `🏛️ Добро пожаловать в тур по Ошмянам! Ты отправишься в путешествие по историческому центру города.

Твоя цель — открыть 7 тайн Ошмян. Каждая локация хранит частичку истории.

Первая точка — величественный Костёл Святого Михаила. Отправляйся к нему. Как будешь на месте, нажми "Я на месте".`
    
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

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      // Генерируем кодовый фрагмент в зависимости от тура и этапа
      const codeFragment = isSapiegaTour 
        ? (currentStage === 1 ? '2' :
           currentStage === 2 ? 'С' :
           currentStage === 3 ? '3' :
           currentStage === 4 ? '8' :
           currentStage === 5 ? 'Арка' :
           currentStage === 6 ? 'Утешительница' : '')
        : (currentStage === 1 ? '1906' :
           currentStage === 2 ? '19' :
           currentStage === 3 ? '17' :
           currentStage === 4 ? '1387' :
           currentStage === 5 ? '5' :
           currentStage === 6 ? '1968' :
           currentStage === 7 ? 'берёза' : '')

      setCollectedCode(prev => [...prev, codeFragment])

      const fragmentMessage = isSapiegaTour 
        ? (currentStage === 1 ? `Первая цифра кода — ${codeFragment}` :
           currentStage === 2 ? `Запомни первую букву — ${codeFragment}` :
           currentStage === 6 ? `Последнее слово — ${codeFragment}` :
           `Фрагмент кода: ${codeFragment}`)
        : `Фрагмент истории: ${codeFragment}`

      addMessage(`🎉 Верно! ${fragmentMessage}`, true, 'success')

      const totalStages = isSapiegaTour ? questStages.length : questStagesOshmyany.length
      if (currentStage < totalStages) {
        setTimeout(() => {
          const nextStage = currentStages[currentStage]
          addMessage(`Отлично! Теперь отправляйся к следующей точке: ${nextStage.location}. Как будешь на месте, нажми "Я на месте".`)
          setCurrentStage(currentStage + 1)
          
          // Сохраняем прогресс бота для синхронизации с маркерами
          const botProgress = {
            currentStage: currentStage + 1,
            collectedCode,
            unlockedMarkers: isSapiegaTour 
              ? Array.from({ length: currentStage + 1 }, (_, i) => (9 + i).toString())
              : Array.from({ length: currentStage + 1 }, (_, i) => (1 + i).toString())
          }
          localStorage.setItem(`${selectedTour}-botProgress`, JSON.stringify(botProgress))
          
          // Отправляем событие для обновления карты
          window.dispatchEvent(new CustomEvent('botProgressUpdated'))
        }, 2000)
      } else {
        // Quest completed
        const finalCode = collectedCode.join('-')
        const completionMessage = isSapiegaTour 
          ? `🏆 ПОЗДРАВЛЯЮ! Печать Сапег восстановлена!

Твой итоговый код: ${finalCode}

Ты прошел путь настоящего краеведа. Покажи этот код организатору квеста, чтобы получить свой заслуженный артефакт! 🎁`
          : `🏆 ПОЗДРАВЛЯЮ! Ты открыл все тайны Ошмян!

Твоя коллекция знаний: ${finalCode}

Ты стал настоящим знатоком истории Ошмян. Покажи эту информацию организатору квеста! 🎁`
        
        addMessage(completionMessage, true, 'success')
        
        // Сохраняем финальный прогресс
        const botProgress = {
          currentStage: totalStages + 1,
          collectedCode,
          unlockedMarkers: isSapiegaTour 
            ? Array.from({ length: questStages.length }, (_, i) => (9 + i).toString())
            : Array.from({ length: questStagesOshmyany.length }, (_, i) => (1 + i).toString())
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
