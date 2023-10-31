import { describe, it } from 'mocha'
import { sendMessage } from './index'
import escapeMarkdownV2 from './utils/escapeMarkdownV2'

describe('bot', () => {
  it('can send message', async () => {
    const botToken = process.env.BOT_TOKEN || undefined
    const chatId = process.env.CHAT_ID || undefined

    if (!botToken || !chatId) return

    try {
      await sendMessage(escapeMarkdownV2('Hello, world!'), {
        botToken,
        chatId,
      })
    }
    catch (err) {
      console.error(err)
    }
  })
})
