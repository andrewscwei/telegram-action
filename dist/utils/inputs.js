import * as core from '@actions/core';
import assert from 'assert';
export function getStringInput(id, defaultValue) {
    try {
        const input = core.getInput(id, { required: true, trimWhitespace: true });
        return input;
    }
    catch (err) {
        if (defaultValue !== undefined)
            return defaultValue;
        throw Error(`Required string input with ID <${id}> is not provided`);
    }
}
export function getBooleanInput(id, defaultValue) {
    try {
        const input = core.getBooleanInput(id, { required: true });
        return input;
    }
    catch (err) {
        if (defaultValue !== undefined)
            return defaultValue;
        throw Error(`Required boolean input with ID <${id}> is not provided`);
    }
}
export function getInputs(mock) {
    const successPrefix = mock?.prefixes?.success ?? getStringInput('success-prefix', '🤖');
    const failurePrefix = mock?.prefixes?.failure ?? getStringInput('failure-prefix', '😱');
    const cancelledPrefix = mock?.prefixes?.cancelled ?? getStringInput('cancelled-prefix', '🫥');
    const botToken = mock?.botToken ?? getStringInput('bot-token');
    const chatId = mock?.chatId ?? getStringInput('chat-id');
    const isSuccess = mock?.isSuccess ?? getBooleanInput('success', false);
    const isCancelled = mock?.isCancelled ?? getBooleanInput('cancelled', false);
    const actionLabel = mock?.action?.label ?? getStringInput('action-label', '');
    const actionUrl = mock?.action?.url ?? getStringInput('action-url', '');
    const hasAction = isSuccess && actionLabel !== '' && actionUrl !== '';
    const hasNoAction = !isSuccess || actionLabel === '' && actionUrl === '';
    assert(hasAction || hasNoAction, Error('Both <action-label> and <action-url> inputs must be provided'));
    return {
        prefixes: {
            success: successPrefix,
            failure: failurePrefix,
            cancelled: cancelledPrefix,
        },
        botToken,
        chatId,
        isSuccess,
        isCancelled,
        ...hasAction ? {
            action: {
                label: actionLabel,
                url: actionUrl,
            },
        } : {},
    };
}
