import * as core from '@actions/core'
import * as github from '@actions/github'
import ansiStyles from 'ansi-styles'
import { sendMessage } from './core/sendMessage.js'
import { compose } from './utils/compose.js'
import { getContext } from './utils/context.js'
import { getInputs } from './utils/inputs.js'

async function main() {
  const context = getContext()
  const inputs = getInputs()
  const message = compose(context, inputs)

  core.info('Sending message via Telegram API:')
  core.info(JSON.stringify(message, undefined, 2))

  try {
    core.info('Sending message to Telegram...')
    core.debug(`context=${JSON.stringify(github.context, undefined, 2)}`)
    core.debug(`payload=${JSON.stringify(message, undefined, 2)}`)

    const res = await sendMessage(message, { botToken: inputs.botToken, chatId: inputs.chatId })

    core.info(`Sending message to Telegram... ${ansiStyles.green}OK${ansiStyles.reset}: response=${res}`)
  }
  catch (err) {
    core.error(`Failed to send message to Telegram: ${err}`)

    core.setFailed(`Action failed with error from Telegram API: ${err}`)
  }
}

main()
