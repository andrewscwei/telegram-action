import _ from 'lodash'
import { Context } from './context'
import { Inputs } from './inputs'

function prefix(value?: string) {
  if (_.isEmpty(value)) return ''
  return `${value} `
}

export function composeStatus(context: Context, inputs: Inputs) {
  let statusStr = ''

  if (inputs.isSuccess) {
    statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`
  }
  else {
    statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`
  }

  const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
  const refName = matches?.[1] ?? context.ref
  const repoUrl = `https://github.com/${context.repo}`
  const repoStr = `<${repoUrl}|${context.repo}>`
  const refStr = `<${repoUrl}/tree/${refName}|${refName}>`

  statusStr += ` in ${repoStr} \`${refStr}\``

  return statusStr
}

export function composeBody(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const shaStr = `\`<${repoUrl}/commit/${context.sha}|${context.sha.substring(0, 7)}>\``

  return `${shaStr} ${context.commitMessage}`
}

export function composeFooter(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const actorLink = `<https://github.com/${context.actor}|${context.actor}>`
  const workflowStr = `*<${repoUrl}/actions?query=workflow%3A${context.workflow}|${context.workflow}>*`

  return`${actorLink} using workflow ${workflowStr}`
}

export function composeActions(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const jobUrl = `${repoUrl}/actions/runs/${context.runId}`
  const buttons = []

  buttons.push(`[View job](${jobUrl})`)

  if (inputs.isSuccess && inputs.action) {
    buttons.push(`[${inputs.action.label}](${inputs.action.url})`)
  }

  return buttons.join(' ')
}

export function compose(context: Context, inputs: Inputs) {
  let ret = ``
  ret += composeStatus(context, inputs)
  ret += '\n'
  ret += composeBody(context, inputs)
  ret += '\n'
  ret += composeFooter(context, inputs)
  ret += '\n'
  ret += composeActions(context, inputs)

  return ret
}
