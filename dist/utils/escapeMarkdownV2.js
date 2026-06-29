export function escapeMarkdownV2(str) {
    return str.replace(/([-_.!|>()+#=*~{}`[\]])/g, '\\$1');
}
