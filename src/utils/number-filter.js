export default function numberFilter (n) {
  if (n === undefined) {
    return ''
  }
  let part = '' + n
  let result = ''
  while (part.length) {
    result = ' ' + part.substr(-3) + result
    part = part.slice(0, -3)
  }
  return result.trim().replace('- ', '-')
}
