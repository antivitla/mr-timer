let scrollTopNiceTimeout

export default function scrollTopNice (parent, child) {
  clearTimeout(scrollTopNiceTimeout)
  let top = 0.8 * Math.abs(child.getBoundingClientRect().top)
  if (top > 20) {
    parent.scrollTop = top
    scrollTopNiceTimeout = setTimeout(() => {
      scrollTopNice(parent, child)
    }, 20)
  } else {
    parent.scrollTop = 0
  }
}
