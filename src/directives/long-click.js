
let spinnerTimeoutId

document.addEventListener('mouseup', function () {
  removeTimerSpinner()
})

export function setTimerSpinner (x, y) {
  removeTimerSpinner()
  let div = document.createElement('div')
  div.classList.add('long-click')
  div.innerHTML = '<div class="mask"><div class="spinner"></div></div><div class="spinner-clone"></div>'
  div.style = `left: ${x}px; top: ${y}px;`
  document.body.appendChild(div)
}

export function removeTimerSpinner (data) {
  clearTimeout(spinnerTimeoutId)
  const timers = document.querySelectorAll('.long-click')
  timers.forEach(timer => {
    timer.remove()
  })
}

function handleMouseDown (data, event) {
  setTimerSpinner(event.clientX, event.clientY)
  spinnerTimeoutId = setTimeout(() => {
    data.ready = true
  }, data.delay)
}

function handleMouseUp (data, event) {
  removeTimerSpinner(data)
  if (data.ready) {
    this.dispatchEvent(new CustomEvent('long-click'))
    event.preventDefault()
    event.stopImmediatePropagation()
    event.stopPropagation()
  }
}

function handleClick (data, event) {
  if (!data.ready) {
    this.dispatchEvent(new CustomEvent('normal-click'))
  }
  data.ready = false
}

export default {
  bind (element, { value }, vnode) {
    const data = {
      ready: false,
      delay: 375
    }
    data.delay = value
    element.handleMouseDown = handleMouseDown.bind(element, data)
    element.handleMouseUp = handleMouseUp.bind(element, data)
    element.handleClick = handleClick.bind(element, data)
    element.addEventListener('mousedown', element.handleMouseDown)
    element.addEventListener('mouseup', element.handleMouseUp)
    element.addEventListener('click', element.handleClick)
  },

  unbind (element) {
    element.removeEventListener('mousedown', element.handleMouseDown)
    element.removeEventListener('mouseup', element.handleMouseUp)
    element.removeEventListener('click', element.handleClick)
  }
}
