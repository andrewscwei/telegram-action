import axios from 'axios'

export async function sendMessage(message: string, { botToken = '', chatId = '' } = {}) {
  const webhookUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

  return axios.get(webhookUrl, {
    params: {
      'chat_id': chatId,
      'text': message,
      'parse_mode': 'MarkdownV2',
      'disable_web_page_preview': true,
    },
  })
    .then(res => {
      switch (res.status) {
        case 200:
          return res.data
        default:
          throw new Error(res.data)
      }
    })
}
