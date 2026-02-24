import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const update = req.body

  // Проверяем, что это сообщение от пользователя
  if (!update.message && !update.callback_query) {
    return res.status(200).json({ ok: true })
  }

  const botToken = '8113835814:AAE4AQ4-_iWUEydJoxl7Avxu0nd3c0vjAcw'

  try {
    // Обрабатываем callback queries от кнопок
    if (update.callback_query) {
      const callbackQuery = update.callback_query
      const chatId = callbackQuery.message.chat.id
      const data = callbackQuery.data

      // Отвечаем на callback query
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
        })
      })

      let responseText = ''

      if (data === 'tour_info_sapieha') {
        responseText = `📖 **Тур "Печать Сапег"**\n\n🏰 Исследуйте 7 исторических мест Гольшан и окрестностей!\n\n🎯 **Задачи:**\n• Разгадывать поэтические загадки\n• Собирать фрагменты древней печати\n• Открывать новые локации постепенно\n\n🗺️ **Маршрут:** Гольшаны → Деревня → Руины → Монастырь\n\n🏆 **Цель:** Собрать все 6 фрагментов печати и раскрыть тайну!`
      } else if (data === 'tour_info_oshmyany') {
        responseText = `🏛️ **Тур "Ошмяны"**\n\n🏘️ Погрузитесь в атмосферу древнего города Ошмяны!\n\n🎯 **Задачи:**\n• Открывать тайны исторических мест\n• Исследовать архитектурные шедевры\n• Проходить увлекательные испытания\n\n🗺️ **Локации:** Костёл Св. Михаила → Синагога → Руины францисканцев → Центральная площадь\n\n🏆 **Цель:** Раскрыть 7 тайн Ошмян и стать настоящим знатоком истории!`
      } else if (data === 'back_to_main') {
        // Возвращаемся к главному меню
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: '🏰 Добро пожаловать в квест "Ошмянские тайны"!\n\nВыберите тур и отправляйтесь в путешествие по историческим местам!',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🗺️ Открыть квест',
                    url: 'https://kvestbook.vercel.app/'
                  }
                ],
                [
                  {
                    text: '📖 О туре "Печать Сапег"',
                    callback_data: 'tour_info_sapieha'
                  },
                  {
                    text: '🏛️ О туре "Ошмяны"',
                    callback_data: 'tour_info_oshmyany'
                  }
                ]
              ]
            }
          })
        })
        return res.status(200).json({ ok: true })
      }

      if (responseText) {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: responseText,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🎮 Начать этот тур',
                    url: data === 'tour_info_sapieha'
                      ? 'https://kvestbook.vercel.app/?tour=sapieha-seal'
                      : 'https://kvestbook.vercel.app/?tour=oshmyany-city'
                  }
                ],
                [
                  {
                    text: '⬅️ Назад к меню',
                    callback_data: 'back_to_main'
                  }
                ]
              ]
            }
          })
        })
      }

      return res.status(200).json({ ok: true })
    }

    // Обрабатываем обычные сообщения
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id

      // Отправляем сообщение с кнопками
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: '🏰 Добро пожаловать в квест "Ошмянские тайны"!\n\nВыберите тур и отправляйтесь в путешествие по историческим местам!',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🗺️ Открыть квест',
                  url: 'https://kvestbook.vercel.app/'
                }
              ],
              [
                {
                  text: '📖 О туре "Печать Сапег"',
                  callback_data: 'tour_info_sapieha'
                },
                {
                  text: '🏛️ О туре "Ошмяны"',
                  callback_data: 'tour_info_oshmyany'
                }
              ]
            ]
          }
        })
      })

      return res.status(200).json({ ok: true })
    }

  } catch (error) {
    console.error('Error handling webhook:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }

  return res.status(200).json({ ok: true })
}
