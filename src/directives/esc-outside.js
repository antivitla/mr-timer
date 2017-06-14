function handleGlobalEsc (callback, event) {
  if (event.keyCode === 27) {
    callback()
  }
}

export default {
  bind (element, { value }) {
    element.handleGlobalEsc = handleGlobalEsc.bind(element, value)
    document.addEventListener('keyup', element.handleGlobalEsc)
  },

  unbind (element) {
    document.removeEventListener('keyup', element.handleGlobalEsc)
  }
}
