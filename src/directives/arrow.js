function refreshArrow (element, selector) {
  const target = document.querySelector(selector)
  if (target) {
    const targetRect = target.getBoundingClientRect()
    const sourceRect = element.getBoundingClientRect()
    const dx = targetRect.left - sourceRect.left - sourceRect.width
    const dy = targetRect.top - sourceRect.top + targetRect.height
    const point = `${dx},${dy}`
    const cpoint = `${dx / 2 + dx / 4},${dy / 2 - dy / 2}`
    const path = `q ${cpoint} ${point}`
    const arrow = element.querySelector('.arrow')
    const start = 'M ' + (element.getAttribute('offset') || '5,7')
    arrow.setAttribute('d', `${start} ${path}`)
  } else {
    element.classList.remove('active')
  }
}

function toggleActive (element) {
  if (element.classList.contains('active')) {
    element.classList.remove('active')
  } else {
    element.classList.add('active')
  }
}

function handleMouseEnter (selector) {
  refreshArrow(this, selector)
  const targetExists = document.querySelector(selector)
  if (targetExists) {
    toggleActive(this)
  }
}

function handleResize (selector) {
  refreshArrow(this, selector)
}

export default {
  bind (element, { value }) {
    element.handleMouseEnter = handleMouseEnter.bind(element, value)
    element.handleResize = handleResize.bind(element, value)
    element
      .querySelector('.text')
      .addEventListener('mouseenter', element.handleMouseEnter)
    window
      .addEventListener('resize', element.handleResize)
  },

  unbind (element) {
    element
      .querySelector('.text')
      .removeEventListener('mouseenter', element.handleMouseEnter)
    window
      .removeEventListener('resize', element.handleResize)
  }
}
