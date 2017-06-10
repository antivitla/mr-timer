import Group from '@/models/group'
import { Task } from './task'

// Name should be in YYYY-MM format
function parseStart (name) {
  const yy = name.substr(0, 4) * 1
  const mm = name.substr(-2) * 1
  const d = new Date()
  d.setYear(yy)
  d.setMonth(mm)
  return d.getTime()
}

export class Month extends Group {
  constructor (obj) {
    super(obj)
    this.start = parseStart(obj.name)
  }

  type () {
    return 'month'
  }

  lastUpdated () {
    return this.start
  }
}

export function MonthPlugin (store) {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntry') {
      store.commit('addMonthEntry', mutation.payload)
    }
  })
}

// Format to YYYY-MM
function format (ms) {
  const d = new Date(ms)
  return d.getYear() + '-' + ('0' + d.getMonth()).slice(-2)
}

export const MonthGroupStore = {
  state: {
    group: new Group({
      resolvePath: entry => {
        return [format(entry.start)]
          .concat(entry.details)
      },
      constructors: [Month, Task],
      name: 'months'
    })
  },

  mutations: {
    addMonthEntry (state, payload) {
      state.group.addEntry(payload.entry)
    }
  }
}
