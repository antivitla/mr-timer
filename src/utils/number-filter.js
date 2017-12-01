export default function numberFilter (n) {
  if (n === undefined) {
    return ''
  }
  let s = String(parseInt(n, 10)).split('').reverse()
  let level = 1
  while (level * 3 < s.length) {
    s.splice(level * 3, 0, ' ')
    level = level + 1
  }
  return s.reverse().join('').trim()
}
