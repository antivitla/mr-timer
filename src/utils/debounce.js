export default function debounce () {
  let debounceTimeout
  return function (f, delay) {
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(f, delay)
  }
}
