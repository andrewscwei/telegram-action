import { type Context } from './context.js'
import { escapeMarkdownV2 } from './escapeMarkdownV2.js'
import { type Inputs } from './inputs.js'

function prefix(value?: string) {
  if (value === undefined || value === null || value === '') return ''

  return `${value} `
}

export function composeStatus(context: Context, inputs: Inputs) {
  let statusStr = ''

  if (inputs.isCancelled) {
    statusStr += `${prefix(inputs.prefixes.cancelled)}*BUILD CANCELLED*`
  }
  else if (inputs.isSuccess) {
    statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`
  }
  else {
    statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`
  }

  const repoUrl = `https://github.com/${context.repo}`
  const repoStr = `[${escapeMarkdownV2(context.repo)}](${repoUrl})`

  if (context.ref.startsWith('refs/pull/')) {
    const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/)
    const prNumber = matches?.[1] ?? context.ref
    const refStr = `[\\(${escapeMarkdownV2(`pr-#${prNumber}`)}\\)](${repoUrl}/pull/${prNumber})`

    statusStr += ` in ${repoStr} ${refStr}`
  }
  else {
    const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/)
    const refName = matches?.[1] ?? context.ref
    const refStr = `[\\(${escapeMarkdownV2(refName)}\\)](${repoUrl}/tree/${refName})`

    statusStr += ` in ${repoStr} ${refStr}`
  }

  return statusStr
}

export function composeBody(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  let shaStr

  if (context.ref.startsWith('refs/pull/')) {
    const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/)
    const prNumber = matches?.[1] ?? context.ref

    shaStr = `[\\[${context.sha.substring(0, 7)}\\]](${repoUrl}/pull/${prNumber}/commits/${context.sha})`
  }
  else {
    shaStr = `[\\[${context.sha.substring(0, 7)}\\]](${repoUrl}/commit/${context.sha})`
  }

  return `${shaStr} ${escapeMarkdownV2(context.commitMessage ?? '')}`
}

export function composeFooter(context: Context, inputs: Inputs) {
  const actorLink = `[@${escapeMarkdownV2(context.actor)}](https://github.com/${context.actor})`
  const workflowStr = `_${escapeMarkdownV2(context.workflow)}_`

  return `${actorLink} using workflow ${workflowStr}`
}

export function composeActions(context: Context, inputs: Inputs) {
  const repoUrl = `https://github.com/${context.repo}`
  const jobUrl = `${repoUrl}/actions/runs/${context.runId}`
  const buttons = []

  buttons.push(`[View job](${jobUrl})`)

  if (inputs.isSuccess && inputs.action) {
    buttons.push(`[*${escapeMarkdownV2(inputs.action.label)}*](${inputs.action.url})`)
  }

  return buttons.join(' ')
}

export function compose(context: Context, inputs: Inputs) {
  let ret = ''
  ret += composeStatus(context, inputs)
  ret += '\n'
  ret += composeBody(context, inputs)
  ret += '\n'
  ret += composeFooter(context, inputs)
  ret += '\n'
  ret += '\n'
  ret += composeActions(context, inputs)

  return ret
}
