import Group from '@/models/group'
import Day from '@/models/day'
import Task from '@/models/task'

// Format to YYYY-MM-DD
function format (ms) {
  const d = new Date(ms)
  return d.getFullYear() + '-' +
    ('0' + (d.getMonth() + 1)).slice(-2) + '-' +
    ('0' + d.getDate()).slice(-2)
}

// Singleton to keep days tree
export const Days = (new Group({
  resolvePath: entry => {
    return [format(entry.start)]
      .concat(entry.details)
  },
  constructors: [Day, Task],
  name: 'days'
}))

export function DaysPlugin (store) {
  const actions = {
    addEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Days.addEntry(entry)
      })
    },
    removeEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Days.removeEntry(entry)
      })
    },
    clearEntries () {
      Days.children = []
    }
  }
  return store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation)
  })
}
