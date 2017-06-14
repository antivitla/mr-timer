let spinnerTimeout

export function setTimerSpinner (x, y) {
  removeTimerSpinner()
  let div = document.createElement('div')
  div.classList.add('long-click')
  div.innerHTML = '<div class="mask"><div class="spinner"></div></div><div class="spinner-clone"></div>'
  div.style = `left: ${x}px; top: ${y}px;`
  document.body.appendChild(div)
}

export function removeTimerSpinner () {
  clearTimeout(spinnerTimeout)
  const timers = document.querySelectorAll('.long-click')
  timers.forEach(timer => {
    timer.remove()
  })
}

function handleMouseDown (data, event) {
  // Set spinner timeout
  spinnerTimeout = setTimeout(() => {
    setTimerSpinner(event.clientX, event.clientY)
  }, data.spinnerDelay)
  // Set reaction timeout
  data.timeout = setTimeout(() => {
    data.ready = true
  }, data.delay)
}

function handleMouseUp (data, event) {
  removeTimerSpinner()
  if (data.ready) {
    this.dispatchEvent(new CustomEvent('long-click'))
  }
  clearTimeout(data.timeout)
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
      delay: 500,
      timeout: null,
      spinnerDelay: 125,
      spinnerTimeout: null
    }
    element.handleMouseDown = handleMouseDown.bind(element, data)
    element.handleMouseUp = handleMouseUp.bind(element, data)
    element.handleClick = handleClick.bind(element, data)
    element.addEventListener('mousedown', element.handleMouseDown)
    element.addEventListener('mouseup', element.handleMouseUp)
    element.addEventListener('click', element.handleClick)
    document.addEventListener('mouseup', removeTimerSpinner)
  },

  unbind (element) {
    element.removeEventListener('mousedown', element.handleMouseDown)
    element.removeEventListener('mouseup', element.handleMouseUp)
    element.removeEventListener('click', element.handleClick)
    document.removeEventListener('mouseup', removeTimerSpinner)
  }
}

