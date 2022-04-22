"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = exports.composeActions = exports.composeFooter = exports.composeBody = exports.composeStatus = void 0;
const lodash_1 = __importDefault(require("lodash"));
const escapeMarkdownV2_1 = __importDefault(require("./escapeMarkdownV2"));
function prefix(value) {
    if (lodash_1.default.isEmpty(value))
        return '';
    return `${value} `;
}
function composeStatus(context, inputs) {
    var _a;
    let statusStr = '';
    if (inputs.isSuccess) {
        statusStr += `${prefix(inputs.prefixes.success)}*BUILD PASSED*`;
    }
    else {
        statusStr += `${prefix(inputs.prefixes.failure)}*BUILD FAILED*`;
    }
    const matches = `${context.ref}`.match(/^refs\/[^/]+\/(.*)$/);
    const refName = (_a = matches === null || matches === void 0 ? void 0 : matches[1]) !== null && _a !== void 0 ? _a : context.ref;
    const repoUrl = `https://github.com/${context.repo}`;
    const repoStr = `[${(0, escapeMarkdownV2_1.default)(context.repo)}](${repoUrl})`;
    const refStr = `[\\(${(0, escapeMarkdownV2_1.default)(refName)}\\)](${repoUrl}/tree/${refName})`;
    statusStr += ` in ${repoStr} ${refStr}`;
    return statusStr;
}
exports.composeStatus = composeStatus;
function composeBody(context, inputs) {
    var _a;
    const repoUrl = `https://github.com/${context.repo}`;
    const shaStr = `[\\[${context.sha.substring(0, 7)}\\]](${repoUrl}/commit/${context.sha})`;
    return `${shaStr} ${(0, escapeMarkdownV2_1.default)((_a = context.commitMessage) !== null && _a !== void 0 ? _a : '')}`;
}
exports.composeBody = composeBody;
function composeFooter(context, inputs) {
    const actorLink = `[@${(0, escapeMarkdownV2_1.default)(context.actor)}](https://github.com/${context.actor})`;
    const workflowStr = `[${context.workflow}](https://github.com/${context.repo}/actions?query=workflow%3A${context.workflow})`;
    return `${actorLink} using workflow ${workflowStr}`;
}
exports.composeFooter = composeFooter;
function composeActions(context, inputs) {
    const repoUrl = `https://github.com/${context.repo}`;
    const jobUrl = `${repoUrl}/actions/runs/${context.runId}`;
    const buttons = [];
    buttons.push(`[View job](${jobUrl})`);
    if (inputs.isSuccess && inputs.action) {
        buttons.push(`[*${(0, escapeMarkdownV2_1.default)(inputs.action.label)}*](${inputs.action.url})`);
    }
    return buttons.join(' ');
}
exports.composeActions = composeActions;
function compose(context, inputs) {
    let ret = '';
    ret += composeStatus(context, inputs);
    ret += '\n';
    ret += composeBody(context, inputs);
    ret += '\n';
    ret += composeFooter(context, inputs);
    ret += '\n';
    ret += '\n';
    ret += composeActions(context, inputs);
    return ret;
}
exports.compose = compose;
