export default function (q, digits) {
  return ('0'.repeat(digits) + q).trim().slice(-1 * digits)
}
