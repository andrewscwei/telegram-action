import { assert } from 'chai'
import { describe, it } from 'mocha'

import { compose, composeActions, composeBody } from './compose.js'
import { getContext } from './context.js'
import { getInputs } from './inputs.js'

describe('compose', () => {
  const mockContext = getContext({
    ref: 'foo',
    actor: 'foo',
    commitMessage: 'foo',
    eventName: 'push',
    repo: 'foo',
    runId: 'foo',
    sha: 'foo',
    workflow: 'foo',
  })

  const mockSuccessInputs = getInputs({
    action: { label: 'bar', url: 'baz' },
    botToken: 'foo',
    chatId: 'foo',
    prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
    isSuccess: true,
  })

  const mockFailureInputs = getInputs({
    action: { label: 'bar', url: 'baz' },
    botToken: 'foo',
    chatId: 'foo',
    prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
    isSuccess: false,
  })

  it('can compose body', () => {
    assert.ok(composeBody(mockContext, mockSuccessInputs))
    assert.ok(composeBody(mockContext, mockFailureInputs))
  })

  it('can compose actions', () => {
    assert.ok(composeActions(mockContext, mockSuccessInputs))
    assert.ok(composeActions(mockContext, mockFailureInputs))
  })

  it('can compose full message', () => {
    const message = compose(mockContext, mockSuccessInputs)
    assert.ok(message)
  })
})
