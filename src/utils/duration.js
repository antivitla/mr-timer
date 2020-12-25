import pluralize from './pluralize'

const durationFormat = {
  'HH': function (ms) {
    const time = Math.abs(ms)
    const negative = ms < 0
    let hh = 0
    if (time >= 3600000) {
      hh = parseInt(time / 3600000, 10)
    }
    if (hh < 10) {
      hh = ('0' + hh).substr(-2)
    }
    return (negative ? '-' : '') + hh
  },

  'HH:mm': function (ms) {
    const time = Math.abs(ms)
    const negative = ms < 0
    let hh = 0
    if (time >= 3600000) {
      hh = parseInt(time / 3600000, 10)
    }
    if (hh < 10) {
      hh = ('0' + hh).substr(-2)
    }
    let mm = parseInt((time % 3600000) / 60000, 10)
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    return (negative ? '-' : '') + hh + ':' + mm
  },

  'H:mm': function (ms) {
    const time = Math.abs(ms)
    const negative = ms < 0
    let hh = 0
    if (time >= 3600000) {
      hh = parseInt(time / 3600000, 10)
    }
    let mm = parseInt((time % 3600000) / 60000, 10)
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    return (negative ? '-' : '') + hh + ':' + mm
  },

  'HH:mm:ss': function (ms) {
    const time = Math.abs(ms)
    const negative = ms < 0
    let hh = 0
    if (time >= 3600000) {
      hh = parseInt(time / 3600000, 10)
    }
    if (hh < 10) {
      hh = ('0' + hh).substr(-2)
    }
    let mm = parseInt((time % 3600000) / 60000, 10)
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    let ss = parseInt((time % 60000) / 1000, 10)
    if (ss < 10) {
      ss = ('0' + ss).substr(-2)
    }
    return (negative ? '-' : '') + hh + ':' + mm + ':' + ss
  },

  'H:mm:ss': function (ms) {
    const time = Math.abs(ms)
    const negative = ms < 0
    let hh = 0
    if (time >= 3600000) {
      hh = parseInt(time / 3600000, 10)
    }
    let mm = parseInt((time % 3600000) / 60000, 10)
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    let ss = parseInt((time % 60000) / 1000, 10)
    if (ss < 10) {
      ss = ('0' + ss).substr(-2)
    }
    return (negative ? '-' : '') + hh + ':' + mm + ':' + ss
  }
}

export function duration (ms) {
  return {
    format (f) {
      return durationFormat[f](ms)
    }
  }
}

const fractionFormat = {
  'mm': function (ms) {
    let mm = parseInt((ms % 3600000) / 60000, 10)
    if (mm < 10) {
      mm = ('0' + mm).substr(-2)
    }
    return mm
  },

  'ss': function (ms) {
    let ss = parseInt((ms % 60000) / 1000, 10)
    if (ss < 10) {
      ss = ('0' + ss).substr(-2)
    }
    return ss
  },

  'ms': function (ms) {
    let mls = ms % 1000
    if (mls < 100) {
      mls = ('00' + mls).substr(-3)
    }
    return mls
  }
}

export function durationFraction (ms) {
  return {
    format (f) {
      return fractionFormat[f](ms)
    }
  }
}

// 2 часа 30 мин
export function durationHuman (d, hrWords, minWord, secWord) {
  const time = Math.abs(d)
  const negative = d < 0
  let hh = 0
  if (time >= 3600000) {
    hh = parseInt(time / 3600000, 10)
  }
  const mm = parseInt((time % 3600000) / 60000, 10)
  const ss = parseInt((time % 60000) / 1000, 10)
  let H = ''
  if (hh) {
    H = hh + ' ' + pluralize(hh, hrWords)
  }
  let M = ''
  if (mm) {
    M = mm + ' ' + minWord
  }
  let S = ''
  if (ss && mm < 1) {
    S = ss + ' ' + secWord
  }
  return (negative ? '-' : '') + (H + ' ' + M + ' ' + S).replace('  ', ' ').trim()
}

// 100h 20m
export const durationEditable = {
  stringify (d, locale) {
    const time = Math.abs(d)
    const negative = d < 0
    let hh = 0
    if (time >= 3600000) {
      hh = parseInt(time / 3600000, 10)
    }
    const mm = parseInt((time % 3600000) / 60000, 10)
    let H = ''
    if (hh) {
      H = hh + (locale === 'en' ? 'h' : 'ч')
    }
    const M = mm + (locale === 'en' ? 'm' : 'м')
    return (negative ? '-' : '') + (H + ' ' + M).replace('  ', ' ').trim()
  },

  parse (str) {
    let h = 0
    let m = 0
    const negative = str.trim().match(/^-/)
    if (str.match(/\d+:\d+/)) {
      h = parseInt(str.split(':')[0], 10)
      m = parseInt(str.split(':')[1], 10)
    } else if (str.match(/\d+\.\d+/)) {
      h = parseInt(str.split('.')[0], 10)
      m = parseInt(str.split('.')[1], 10)
    } else if (str.match(/\d+(h|ч)/) || str.match(/\d+(m|м)/)) {
      if (str.match(/\d+(h|ч)/)) {
        h = parseInt(str.match(/\d+h/)[0], 10)
      }
      if (str.match(/\d+(m|м)/)) {
        m = parseInt(str.match(/\d+(m|м)/)[0], 10)
      }
    } else {
      return str ? parseInt(str, 10) * 60000 : 0
    }
    return ((h * 3600000) + (m * 60000)) * (negative ? -1 : 1)
  }
}
