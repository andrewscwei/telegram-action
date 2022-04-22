"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function escapeMarkdownV2(str) {
    let ret = str;
    ret = ret.replace(/-/g, '\\-');
    ret = ret.replace(/\./g, '\\.');
    ret = ret.replace(/\|/g, '\\|');
    ret = ret.replace(/\>/g, '\\>');
    ret = ret.replace(/\(/g, '\\(');
    ret = ret.replace(/\)/g, '\\)');
    return ret;
}
exports.default = escapeMarkdownV2;
