const faviconType = {
  'default': require('assets/images/favicon.png'),
  'recording': require('assets/images/favicon-recording.png'),
  'recording-ping': require('assets/images/favicon-recording-ping.png')
}

let currentFaviconType
let faviconPingingId

function changeFavicon (url) {
  console.log('change url', url)
  const newLink = document.createElement('link')
  newLink.id = 'favicon'
  newLink.rel = 'shortcut icon'
  newLink.href = url
  const oldLink = document.querySelector('link#favicon')
  if (oldLink) {
    oldLink.remove()
  }
  document.head.appendChild(newLink)
}

export function setFaviconType (type) {
  currentFaviconType = type
  console.log('setting favicon to', type)
  changeFavicon(faviconType[type])
}

export function startFaviconPinging () {
  clearTimeout(faviconPingingId)
  faviconPingingId = setTimeout(() => {
    setFaviconType(currentFaviconType !== 'recording-ping' ? 'recording-ping' : 'recording')
    startFaviconPinging()
  }, currentFaviconType !== 'recording-ping' ? 875 : 1000)
}

export function stopFaviconPinging () {
  clearTimeout(faviconPingingId)
  faviconPingingId = null
  setFaviconType('default')
}
