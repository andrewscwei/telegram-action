import * as core from '@actions/core'
import assert from 'assert'

export type Inputs = {
  prefixes: {
    success: string
    failure: string
  }
  botToken: string
  chatId: string
  isSuccess: boolean
  action?: {
    label: string
    url: string
  }
}

export function getStringInput(id: string, defaultValue?: string): string {
  try {
    const input = core.getInput(id, { required: true, trimWhitespace: true })
    return input
  }
  catch (err) {
    if (defaultValue !== undefined) return defaultValue
    throw Error(`Required string input with ID <${id}> is not provided`)
  }
}

export function getBooleanInput(id: string, defaultValue?: boolean): boolean {
  try {
    const input = core.getBooleanInput(id, { required: true })
    return input
  }
  catch (err) {
    if (defaultValue !== undefined) return defaultValue
    throw Error(`Required boolean input with ID <${id}> is not provided`)
  }
}

export function getInputs(values?: Partial<Inputs>): Inputs {
  const successPrefix = values?.prefixes?.success ?? getStringInput('success-prefix', '🤖')
  const failurePrefix = values?.prefixes?.failure ?? getStringInput('failure-prefix', '😱')
  const botToken = values?.botToken ?? getStringInput('bot-token')
  const chatId = values?.chatId ?? getStringInput('chat-id')
  const isSuccess = values?.isSuccess ?? getBooleanInput('success', false)
  const actionLabel = values?.action?.label ?? getStringInput('action-label', '')
  const actionUrl = values?.action?.url ?? getStringInput('action-url', '')
  const hasAction = actionLabel !== '' && actionUrl !== ''
  const hasNoAction = actionLabel === '' && actionUrl === ''

  assert(hasAction || hasNoAction, Error('Both <action-label> and <action-url> inputs must be provided'))

  return {
    prefixes: {
      success: successPrefix,
      failure: failurePrefix,
    },
    botToken,
    chatId,
    isSuccess,
    ...hasAction ? {
      action: {
        label: actionLabel,
        url: actionUrl,
      },
    } : {},
  }
}
