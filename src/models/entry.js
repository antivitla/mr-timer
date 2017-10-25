import funny from 'mr-funny'
import funnyTemplates from '../funny/templates'
import uuid from 'uuid/v1'

const locale = 'ru'

function parseDetails (details) {
  if (!details || !details.length) {
    return [funny.phrase(funnyTemplates[locale].base)]
  } else {
    const d = details.slice(0)
      .filter(item => item)
      .filter(item => item.trim())
    if (!d.length) {
      return [funny.phrase(funnyTemplates[locale].base)]
    } else {
      return d
    }
  }
}

export default class Entry {
  constructor ({
    start = new Date().getTime(),
    stop = new Date().getTime(),
    details = [funny.phrase(funnyTemplates[locale].base)],
    id = uuid()
  } = {}) {
    this.start = new Date(start).getTime()
    this.stop = new Date(stop).getTime()
    this.details = parseDetails(details)
    this.id = id
  }

  duration () {
    return this.stop - this.start
  }

  serialize () {
    return {
      id: this.id,
      start: new Date(this.start).toISOString(),
      stop: new Date(this.stop).toISOString(),
      details: this.details.slice(0)
    }
  }
}
