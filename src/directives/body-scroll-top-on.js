import bus from '@/event-bus'

let scrollTopNiceTimeout

function scrollTopNice () {
  clearTimeout(scrollTopNiceTimeout)
  let top = 0.8 * Math.abs(document.body.getBoundingClientRect().top)
  if (top > 5) {
    document.body.scrollTop = top
    document.documentElement.scrollTop = top
    scrollTopNiceTimeout = setTimeout(() => {
      scrollTopNice()
    }, 20)
  } else {
    document.body.scrollTop = 0
  }
}

export default {
  bind (element, { value }) {
    if (Array.isArray(value)) {
      value.forEach(event => {
        bus.$on(event, scrollTopNice)
      })
    } else {
      bus.$on(value, scrollTopNice)
    }
  },

  unbind (element, { value }) {
    if (Array.isArray(value)) {
      value.forEach(event => {
        bus.$off(event, scrollTopNice)
      })
    } else {
      bus.$off(value, scrollTopNice)
    }
  }
}
