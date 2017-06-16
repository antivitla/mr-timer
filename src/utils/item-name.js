import moment from 'moment'
import capitalize from 'lodash/capitalize'

export default {
  month (item, locale) {
    const d = moment(item.start)
    let label = capitalize(d.format('MMMM YYYY'))
    if (d.year() === (new Date()).getFullYear()) {
      label = label.split(' ')[0]
    }
    return label
  },

  day (item, locale) {
    const d = moment(item.start)
    let label = d.format('LL')
    if (locale === 'ru') {
      label = label.replace('г.', '').trim()
    }
    if (d.year() === (new Date()).getFullYear()) {
      label = label.split(' ').slice(0, 2).join(' ')
      if (locale === 'en') {
        label = label.replace(',', '')
      }
    }
    return label
  },

  task (item) {
    return item.name
  },

  year (item) {
    return item.name
  }
}
