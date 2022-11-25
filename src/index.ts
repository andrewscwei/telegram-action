import * as core from '@actions/core'
import axios from 'axios'
import { compose } from './utils/compose'
import { getContext } from './utils/context'
import { getInputs } from './utils/inputs'

async function main() {
  const context = getContext()
  const inputs = getInputs()
  const message = compose(context, inputs)
  const webhookUrl = `https://api.telegram.org/bot${inputs.botToken}/sendMessage`

  core.info('Sending message via Telegram API:')
  core.info(JSON.stringify(message, undefined, 2))

  return axios.get(webhookUrl, {
    params: {
      'chat_id': inputs.chatId,
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

main()
  .then(res => {
    core.info(`Telegram API response: ${res}`)
    core.setOutput('response', res)
  })
  .catch(err => {
    core.setFailed(`Telegram API error: ${err.message}`)
  })
