import Group from './group'

// Name should be in YYYY-MM format
function parseStart (name) {
  const yy = name.substr(0, 4) * 1
  const mm = name.substr(-2) * 1
  const d = new Date()
  d.setYear(yy)
  d.setMonth(mm)
  return d.getTime()
}

export const parseMonthFormat = parseStart

export default class Month extends Group {
  constructor (obj) {
    super(obj)
    this.start = parseStart(obj.name)
    this.name = obj.name
    this.type = 'month'
  }

  lastUpdated () {
    return this.start
  }
}
