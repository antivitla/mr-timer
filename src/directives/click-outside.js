function handleGlobalClick (callback, event) {
  if (event.target !== this && !this.contains(event.target)) {
    callback()
  }
}

export default {
  bind (element, { value }) {
    element.handleGlobalClick = handleGlobalClick.bind(element, value)
    document.addEventListener('click', element.handleGlobalClick)
  },

  unbind (element) {
    document.removeEventListener('click', element.handleGlobalClick)
  }
}
