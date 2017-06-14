export default function pluralize (q, words) {
  const dd = q % 100
  const d = q % 10
  if (dd > 10 && dd < 20) {
    return words.many
  } else {
    let w = words.many
    if (d === 0) {
      w = words.zero
    } else if (d === 1) {
      w = words.one
    } else if (d > 1 && d < 5) {
      w = words.few
    }
    return w
  }
}
