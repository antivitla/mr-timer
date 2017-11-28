function handleClick (selector) {
  const elements = document.querySelectorAll(`${selector} input`)
  if (elements.length) {
    elements.forEach(e => {
      e.click()
    })
  }
}

export default {
  bind (element, { value }) {
    element.handleClick = handleClick.bind(element, value)
    element.addEventListener('click', element.handleClick)
  },

  unbind (element) {
    element.removeEventListener('click', element.handleClick)
  }
}
