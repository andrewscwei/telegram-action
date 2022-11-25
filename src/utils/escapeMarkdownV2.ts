export default function escapeMarkdownV2(str: string): string {
  let ret = str
  ret = ret.replace(/-/g, '\\-')
  ret = ret.replace(/\./g, '\\.')
  ret = ret.replace(/\|/g, '\\|')
  ret = ret.replace(/>/g, '\\>')
  ret = ret.replace(/\(/g, '\\(')
  ret = ret.replace(/\)/g, '\\)')

  return ret
}
