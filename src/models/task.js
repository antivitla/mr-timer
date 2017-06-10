import Group from './group'

export default class Task extends Group {
  constructor (obj) {
    super(obj)
    this.type = 'task'
  }
}
