import { assert } from 'chai'
import { describe, it } from 'mocha'
import { getBooleanInput, getInputs, getStringInput } from './inputs'

describe('inputs', () => {
  it('throws when getting nonexistent string inputs without default value', () => {
    assert.throws(() => getStringInput('foo'))
  })

  it('can get string inputs with default values', () => {
    assert.equal(getStringInput('foo', 'foo'), 'foo')
    assert.equal(getStringInput('foo', ''), '')
  })

  it('throws when getting nonexistent boolean inputs without default value', () => {
    assert.throws(() => getBooleanInput('foo'))
  })

  it('can get boolean inputs with default values', () => {
    assert.isTrue(getBooleanInput('foo', true))
    assert.isFalse(getBooleanInput('foo', false))
  })

  it('throws when getting all inputs without any custom values', () => {
    assert.throws(() => getInputs())
  })

  it('throws when inputs has either action-label or action-url defined but not both', () => {
    assert.throws(() => getInputs({
      prefixes: { success: 'bar', failure: 'baz' },
      isSuccess: true,
      botToken: 'foo',
      chatId: 'foo',
      action: { label: 'bar' },
    } as any))
  })

  it('can get all inputs with custom values', () => {
    assert.deepEqual(getInputs({
      botToken: 'foo',
      chatId: 'foo',
    }), {
      prefixes: { success: '🤖', failure: '😱', cancelled: '🫥' },
      botToken: 'foo',
      chatId: 'foo',
      isSuccess: false,
    })

    assert.deepEqual(getInputs({
      prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
      isSuccess: true,
      botToken: 'foo',
      chatId: 'foo',
      action: { label: 'bar', url: 'baz' },
    }), {
      prefixes: { success: 'bar', failure: 'baz', cancelled: 'qux' },
      botToken: 'foo',
      chatId: 'foo',
      isSuccess: true,
      action: { label: 'bar', url: 'baz' },
    })
  })
})
