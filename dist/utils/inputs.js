import * as core from '@actions/core';
export function getStringInput(id, defaultValue) {
    try {
        const input = core.getInput(id, { required: true, trimWhitespace: true });
        return input;
    }
    catch (err) {
        if (defaultValue !== undefined)
            return defaultValue;
        throw Error(`Required string input with ID <${id}> is not provided`, { cause: err });
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
        throw Error(`Required boolean input with ID <${id}> is not provided`, { cause: err });
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
    const actionLabel = mock?.action?.label ?? getStringInput('action-label', 'Open');
    const actionUrl = mock?.action?.url ?? getStringInput('action-url', '');
    const hasAction = isSuccess && actionUrl !== '';
    return {
        botToken,
        chatId,
        prefixes: {
            cancelled: cancelledPrefix,
            failure: failurePrefix,
            success: successPrefix,
        },
        isCancelled,
        isSuccess,
        ...hasAction ? {
            action: {
                label: actionLabel,
                url: actionUrl,
            },
        } : {},
    };
}
