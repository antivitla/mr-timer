import pluralize from './pluralize'

export function durationHH (ms) {
  let hh = 0
  if (ms >= 3600000) {
    hh = parseInt(ms / 3600000, 10)
  }
  if (hh < 10) {
    hh = ('0' + hh).substr(-2)
  }
  return hh
}

export function durationMMfraction (ms) {
  let mm = parseInt((ms % 3600000) / 60000, 10)
  if (mm < 10) {
    mm = ('0' + mm).substr(-2)
  }
  return mm
}

export function durationSSfraction (ms) {
  let ss = parseInt((ms % 60000) / 1000, 10)
  if (ss < 10) {
    ss = ('0' + ss).substr(-2)
  }
  return ss
}

export function durationMSfraction (ms) {
  let mls = ms % 1000
  if (mls < 100) {
    mls = ('00' + mls).substr(-3)
  }
  return mls
}

export function durationHHMM (ms) {
  let hh = 0
  if (ms >= 3600000) {
    hh = parseInt(ms / 3600000, 10)
  }
  if (hh < 10) {
    hh = ('0' + hh).substr(-2)
  }
  let mm = parseInt((ms % 3600000) / 60000, 10)
  if (mm < 10) {
    mm = ('0' + mm).substr(-2)
  }
  return hh + ':' + mm
}

export function durationHHMMSS (ms) {
  let hh = 0
  if (ms >= 3600000) {
    hh = parseInt(ms / 3600000, 10)
  }
  if (hh < 10) {
    hh = ('0' + hh).substr(-2)
  }
  let mm = parseInt((ms % 3600000) / 60000, 10)
  if (mm < 10) {
    mm = ('0' + mm).substr(-2)
  }
  let ss = parseInt((ms % 60000) / 1000, 10)
  if (ss < 10) {
    ss = ('0' + ss).substr(-2)
  }
  return hh + ':' + mm + ':' + ss
}

export function durationHuman (d, hrWords, minWord, secWord) {
  let hh = 0
  if (d >= 3600000) {
    hh = parseInt(d / 3600000, 10)
  }
  const mm = parseInt((d % 3600000) / 60000, 10)
  const ss = parseInt((d % 60000) / 1000, 10)
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
  return (H + ' ' + M + ' ' + S).replace('  ', ' ').trim()
}

export function timeHH (d) {
  let h = d.getHours()
  if (h < 10) {
    h = ('0' + h).substr(-2)
  }
  return h
}

export function timeHHMM (d) {
  let hh = d.getHours()
  if (hh < 10) {
    hh = ('0' + hh).substr(-2)
  }
  let mm = d.getMinutes()
  if (mm < 10) {
    mm = ('0' + mm).substr(-2)
  }
  return hh + ':' + mm
}

export function timeDDMMYYYY (d) {
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
}

export function timeYYYYMMDD (d) {
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
}
