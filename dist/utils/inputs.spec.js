import { assert } from 'chai';
import { describe, it } from 'mocha';
import { getBooleanInput, getInputs, getStringInput } from './inputs.js';
describe('inputs', () => {
    it('throws when getting nonexistent string inputs without default value', () => {
        assert.throws(() => getStringInput('foo'));
    });
    it('can get string inputs with default values', () => {
        assert.equal(getStringInput('foo', 'foo'), 'foo');
        assert.equal(getStringInput('foo', ''), '');
    });
    it('throws when getting nonexistent boolean inputs without default value', () => {
        assert.throws(() => getBooleanInput('foo'));
    });
    it('can get boolean inputs with default values', () => {
        assert.isTrue(getBooleanInput('foo', true));
        assert.isFalse(getBooleanInput('foo', false));
    });
    it('throws when getting all inputs without any custom values', () => {
        assert.throws(() => getInputs());
    });
    it('throws when inputs has either action-label or action-url defined but not both', () => {
        assert.throws(() => getInputs({
            action: { label: 'bar' },
            botToken: 'foo',
            chatId: 'foo',
            prefixes: { failure: 'baz', success: 'bar' },
            isSuccess: true,
        }));
    });
    it('can get all inputs with custom values', () => {
        assert.deepEqual(getInputs({
            botToken: 'foo',
            chatId: 'foo',
        }), {
            botToken: 'foo',
            chatId: 'foo',
            prefixes: { cancelled: '🫥', failure: '😱', success: '🤖' },
            isCancelled: false,
            isSuccess: false,
        });
        assert.deepEqual(getInputs({
            action: { label: 'bar', url: 'baz' },
            botToken: 'foo',
            chatId: 'foo',
            prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
            isSuccess: true,
        }), {
            action: { label: 'bar', url: 'baz' },
            botToken: 'foo',
            chatId: 'foo',
            prefixes: { cancelled: 'qux', failure: 'baz', success: 'bar' },
            isCancelled: false,
            isSuccess: true,
        });
    });
});
