export function freezeElement (el) {
  const scroll = document.body.getBoundingClientRect().top
  el.setAttribute('scroll', scroll)
  el.classList.add('freezed')
  el.style.top = scroll + 'px'
}

export function meltElement (el) {
  const scroll = parseInt(el.getAttribute('scroll'), 10)
  el.style.top = null
  el.classList.remove('freezed')
  if (scroll) {
    document.body.scrollTop = -1 * scroll
    document.documentElement.scrollTop = -1 * scroll
  }
}
