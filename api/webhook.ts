import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const update = req.body

  // Проверяем, что это сообщение от пользователя
  if (!update.message || !update.message.chat || !update.message.text) {
    return res.status(200).json({ ok: true })
  }

  const chatId = update.message.chat.id
  const botToken = '8113835814:AAE4AQ4-_iWUEydJoxl7Avxu0nd3c0vjAcw'

  try {
    // Отправляем сообщение с кнопкой
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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

    const result = await response.json()

    if (!result.ok) {
      console.error('Telegram API error:', result)
      return res.status(500).json({ error: 'Failed to send message' })
    }

    return res.status(200).json({ ok: true })

  } catch (error) {
    console.error('Error handling webhook:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
