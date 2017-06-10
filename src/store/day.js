import Group from '@/models/group'
import { Task } from './task'

// Name should be in YYYY-MM-DD format
function parseStartMoment (name) {
  const yy = name.substr(0, 4) * 1
  const mm = name.substr(5, 7) * 1
  const dd = name.substr(-2) * 1
  const d = new Date()
  d.setYear(yy)
  d.setMonth(mm)
  d.setDate(dd)
  return d.getTime()
}

export class Day extends Group {
  constructor (obj) {
    super(obj)
    this.start = parseStartMoment(obj.name)
  }

  type () {
    return 'day'
  }

  lastUpdated () {
    return this.start
  }
}

export function DayPlugin (store) {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntry') {
      store.commit('addDayEntry', mutation.payload)
    }
    if (mutation.type === 'removeEntry') {
      // remove entry from days
      console.log('days remove')
    }
  })
}

// Format to YYYY-MM-DD
function format (ms) {
  const d = new Date(ms)
  return d.getYear() + '-' +
    ('0' + d.getMonth()).slice(-2) + '-' +
    ('0' + d.getDate()).slice(-2)
}

export const DayGroupStore = {
  state: {
    group: new Group({
      resolvePath: entry => {
        return [format(entry.start)]
          .concat(entry.details)
      },
      constructors: [Day, Task],
      name: 'days'
    })
  },

  mutations: {
    addDayEntry (state, payload) {
      state.group.addEntry(payload.entry)
    }
  }
}
