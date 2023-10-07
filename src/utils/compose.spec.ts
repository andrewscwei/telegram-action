import { assert } from 'chai'
import { describe, it } from 'mocha'
import { compose, composeActions, composeBody } from './compose'
import { getContext } from './context'
import { getInputs } from './inputs'

describe('compose', () => {
  const mockContext = getContext({
    actor: 'foo',
    ref: 'foo',
    repo: 'foo',
    runId: 'foo',
    sha: 'foo',
    workflow: 'foo',
  })

  const mockSuccessInputs = getInputs({
    prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
    isSuccess: true,
    botToken: 'foo',
    chatId: 'foo',
    action: { label: 'bar', url: 'baz' },
  })

  const mockFailureInputs = getInputs({
    prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
    isSuccess: false,
    botToken: 'foo',
    chatId: 'foo',
    action: { label: 'bar', url: 'baz' },
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
