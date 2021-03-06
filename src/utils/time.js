function safeDate (arg) {
  if (arg && parseInt(arg, 10)) {
    return new Date(parseInt(arg, 10))
  } else {
    return new Date()
  }
}

const months = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  ru: ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сент', 'окт', 'нояб', 'дек']
}

const timeFormat = {
  'HH': function (ms) {
    let h = new Date(ms).getHours()
    if (h < 10) {
      h = ('0' + h).substr(-2)
    }
    return h
  },

  'HH:mm': function (ms) {
    const d = new Date(ms)
    let hh = d.getHours()
    if (hh < 10) {
      hh = ('0' + hh).substr(-2)
    }
    let mm = d.getMinutes()
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    return hh + ':' + mm
  },

  'DD.MM.YYYY': function (ms) {
    const d = new Date(ms)
    let dd = d.getDate()
    if (dd < 10) {
      dd = ('0' + dd).substr(-2)
    }
    let mm = d.getMonth() + 1
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    const yy = d.getFullYear()
    return dd + '.' + mm + '.' + yy
  },

  'D MMM YYYY': function (ms, locale) {
    const t = new Date(ms)
    const d = t.getDate()
    console.log(locale)
    const mmm = months[locale || 'en'][t.getMonth()]
    const yyyy = t.getFullYear()
    if (locale === 'en') {
      return mmm + ' ' + d + ', ' + yyyy
    } else {
      return d + ' ' + mmm + ' ' + yyyy
    }
  },

  'YYYY.MM.DD': function (ms) {
    const d = new Date(ms)
    let dd = d.getDate()
    if (dd < 10) {
      dd = ('0' + dd).substr(-2)
    }
    let mm = d.getMonth() + 1
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    const yy = d.getFullYear()
    return yy + '.' + mm + '.' + dd
  },

  'YYYY-MM-DD': function (ms) {
    const d = new Date(ms)
    let dd = d.getDate()
    if (dd < 10) {
      dd = ('0' + dd).substr(-2)
    }
    let mm = d.getMonth() + 1
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    const yy = d.getFullYear()
    return yy + '-' + mm + '-' + dd
  },

  'YYYY-MM-01': function (ms) {
    const d = new Date(ms)
    let mm = d.getMonth() + 1
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    const yy = d.getFullYear()
    return yy + '-' + mm + '-01'
  },

  'YYYY-01-01': function (ms) {
    const d = new Date(ms)
    const yy = d.getFullYear()
    return yy + '-01-01'
  }
}

export function time (ms) {
  return {
    format (f, locale) {
      return timeFormat[f](ms, locale)
    }
  }
}

export const timeEditable = {
  stringify (ms, at) {
    const d = safeDate(ms)
    const dd = ('0' + d.getDate()).slice(-2)
    const mm = ('0' + (d.getMonth() + 1)).slice(-2)
    const yy = d.getFullYear()
    const hh = ('0' + d.getHours()).slice(-2)
    const min = ('0' + d.getMinutes()).slice(-2)
    return dd + '.' + mm + '.' + yy + ' ' + at + ' ' + hh + ':' + min
  },

  parse (str) {
    const r = /(\d{1,2})\.(\d{1,2})\.(\d{4}).*?(\d{1,2}):(\d{1,2})/
    const match = str.match(r) ? str.match(r).map(n => parseInt(n)) : null
    if (match) {
      const d = new Date()
      d.setDate(match[1])
      d.setMonth(match[2] - 1)
      d.setFullYear(match[3])
      d.setHours(match[4])
      d.setMinutes(match[5])
      return d.getTime()
    }
    return parseInt(str, 10)
  }
}
