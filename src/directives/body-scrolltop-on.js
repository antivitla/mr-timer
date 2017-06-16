import bus from '@/event-bus'

let scrollTopNiceTimeout

function scrollTopNice () {
  clearTimeout(scrollTopNiceTimeout)
  let top = 0.8 * Math.abs(document.body.getBoundingClientRect().top)
  if (top < 5) {
    top = 0
    return
  } else {
    document.body.scrollTop = top
    scrollTopNiceTimeout = setTimeout(() => {
      scrollTopNice()
    }, 20)
  }
}

export default {
  bind (element, { value }) {
    if (Array.isArray(value)) {
      value.forEach(event => {
        bus.$on(event, scrollTopNice)
      })
    }
  },

  unbind (element, { value }) {
    if (Array.isArray(value)) {
      value.forEach(event => {
        bus.$off(event, scrollTopNice)
      })
    }
  }
}
