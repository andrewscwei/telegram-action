import { escapeMarkdownV2 } from './escapeMarkdownV2.js';
export function compose(context, inputs) {
    const body = composeBody(context, inputs);
    let ret = '';
    ret += composeStatus(context, inputs);
    ret += '\n';
    if (body) {
        ret += body;
        ret += '\n';
    }
    ret += composeFooter(context, inputs);
    ret += '\n';
    ret += '\n';
    ret += composeActions(context, inputs);
    return ret;
}
export function composeTitle(context, inputs) {
    let label;
    switch (true) {
        case context.eventName === 'schedule':
            label = 'CRON';
            break;
        case context.ref.startsWith('refs/pull/'):
            label = 'CHECK';
            break;
        default:
            label = 'BUILD';
    }
    switch (true) {
        case inputs.isCancelled: {
            let prefix = inputs.prefixes.cancelled ?? '';
            if (prefix)
                prefix += ' ';
            return `${prefix}${label} CANCELLED`;
        }
        case inputs.isSuccess: {
            let prefix = inputs.prefixes.success ?? '';
            if (prefix)
                prefix += ' ';
            return `${prefix}${label} PASSED`;
        }
        default: {
            let prefix = inputs.prefixes.failure ?? '';
            if (prefix)
                prefix += ' ';
            return `${prefix}${label} FAILED`;
        }
    }
}
export function composeBody(context, inputs) {
    if (!context.commitMessage)
        return '';
    const repoURL = `https://github.com/${context.repo}`;
    let shaStr;
    if (context.ref.startsWith('refs/pull/')) {
        const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/);
        const prNumber = matches?.[1] ?? context.ref;
        shaStr = `[\\[${context.sha.substring(0, 7)}\\]](${repoURL}/pull/${prNumber}/commits/${context.sha})`;
    }
    else {
        shaStr = `[\\[${context.sha.substring(0, 7)}\\]](${repoURL}/commit/${context.sha})`;
    }
    return `${shaStr} ${escapeMarkdownV2(context.commitMessage)}`;
}
export function composeStatus(context, inputs) {
    let statusStr = `*${composeTitle(context, inputs)}*`;
    const repoURL = `https://github.com/${context.repo}`;
    const repoStr = `[${escapeMarkdownV2(context.repo)}](${repoURL})`;
    if (context.ref.startsWith('refs/pull/')) {
        const matches = `${context.ref}`.match(/^refs\/pull\/([^/]+)\/.*$/);
        const prNumber = matches?.[1] ?? context.ref;
        const refStr = `[\\(${escapeMarkdownV2(`pr-#${prNumber}`)}\\)](${repoURL}/pull/${prNumber})`;
        statusStr += ` in ${repoStr} ${refStr}`;
    }
    else {
        const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
        const refName = matches?.[1] ?? context.ref;
        const refStr = `[\\(${escapeMarkdownV2(refName)}\\)](${repoURL}/tree/${refName})`;
        statusStr += ` in ${repoStr} ${refStr}`;
    }
    return statusStr;
}
export function composeFooter(context, inputs) {
    const actorLink = `[@${escapeMarkdownV2(context.actor)}](${getActorLinkURL(context)})`;
    const workflowStr = `_${escapeMarkdownV2(context.workflow)}_`;
    return `${actorLink} using workflow ${workflowStr}`;
}
export function composeActions(context, inputs) {
    const repoURL = `https://github.com/${context.repo}`;
    const jobURL = `${repoURL}/actions/runs/${context.runId}`;
    const buttons = [];
    buttons.push(`[View Job](${jobURL})`);
    if (inputs.isSuccess && inputs.action) {
        buttons.push(`[*${escapeMarkdownV2(inputs.action.label)}*](${inputs.action.url})`);
    }
    return buttons.join(' ');
}
function getActorLinkURL(context) {
    const botMatch = context.actor.match(/^(.+)\[bot\]$/);
    if (botMatch) {
        return `https://github.com/apps/${botMatch[1]}`;
    }
    else {
        return `https://github.com/${context.actor}`;
    }
}
