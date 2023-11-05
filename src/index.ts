import * as core from '@actions/core'
import { compose } from './utils/compose'
import { getContext } from './utils/context'
import { getInputs } from './utils/inputs'
import { sendMessage } from './core/sendMessage'

async function main() {
  const context = getContext()
  const inputs = getInputs()
  const message = compose(context, inputs)

  core.info('Sending message via Telegram API:')
  core.info(JSON.stringify(message, undefined, 2))

  return sendMessage(message, { botToken: inputs.botToken, chatId: inputs.chatId })
}

main()
  .then(res => {
    core.info(`Telegram API response: ${res}`)
    core.setOutput('response', res)
  })
  .catch(err => {
    core.setFailed(`Telegram API error: ${err.message}`)
  })
