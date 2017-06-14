export default function focusAndSelect (element, start, stop) {
  setTimeout(() => {
    element.focus()
    element.setSelectionRange(start, stop)
  }, 10)
}
