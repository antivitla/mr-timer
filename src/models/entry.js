import moment from 'moment'
import funny from 'mr-funny'
import funnyTemplates from '../funny/templates'

const locale = 'ru'

const formats = [
  moment.ISO_8601,
  'DD.MM.YYYY HH:mm',
  'DD-MM-YYYY HH:mm',
  'YYYY.MM.DD',
  'YYYY-MM-DD',
  'DD-MM-YYYY',
  'DD.MM.YYYY'
]

function parseTime (time) {
  let validTime
  switch (typeof start) {
    case 'string':
      validTime = moment(time, formats)
      break
    case 'number':
    default:
      validTime = moment(time)
  }
  if (!validTime.isValid()) {
    return new Date().getTime()
  }
  return validTime.valueOf()
}

function parseDetails (details) {
  const validDetails = details
    .map(item => {
      if (typeof item === 'function') {
        return item().toString()
      } else {
        return item
      }
    })
    .filter(item => item)
    .map(item => item.toString())
    .filter(item => item)
  if (!validDetails.length) {
    validDetails
      .push(funny.phrase(funnyTemplates[locale].base))
  }
  return validDetails
}

export default class Entry {
  constructor ({
    start = new Date().getTime(),
    stop = new Date().getTime(),
    details = [funny.phrase(
      funnyTemplates[locale].base)]
  } = {}) {
    this.start = parseTime(start)
    this.stop = parseTime(stop)
    this.details = parseDetails(details)
  }

  duration () {
    return this.stop - this.start
  }

  uid () {
    return this.details.join('/') + this.start
  }
}
