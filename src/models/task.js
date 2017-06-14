import Group from './group'

export default class Task extends Group {
  constructor (obj) {
    super(obj)
    this.type = 'task'
  }

  details () {
    let parent = this
    let details = []
    while (parent) {
      if (parent.type === 'task') {
        details.unshift(parent.name)
      }
      parent = parent.parent
    }
    return details
  }
}
