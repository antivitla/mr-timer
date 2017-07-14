import Group from './group'

// Name should be in YYYY format
function parseStart (name) {
  const d = new Date()
  d.setFullYear(parseInt(name, 10))
  return d.getTime()
}

export default class Year extends Group {
  constructor (obj) {
    super(obj)
    this.start = parseStart(obj.name)
    this.name = obj.name
    this.type = 'year'
  }

  lastUpdated () {
    return this.start
  }
}
