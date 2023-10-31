export default function escapeMarkdownV2(str: string): string {
  return str.replace(/([-_.!|>()+#=*~{}`[\]])/g, '\\$1')
}
