import Group from './group'

// Name should be in YYYY-MM-DD format
function parseStartMoment (name) {
  const yy = name.substr(0, 4) * 1
  const mm = (name.substr(5, 2) * 1) - 1
  const dd = name.substr(-2) * 1
  const d = new Date()
  d.setYear(yy)
  d.setMonth(mm)
  d.setDate(dd)
  return d.getTime()
}

export const parseDayFormat = parseStartMoment

export default class Day extends Group {
  constructor (obj) {
    super(obj)
    this.start = parseStartMoment(obj.name)
    this.type = 'day'
  }

  lastUpdated () {
    return this.start
  }
}
