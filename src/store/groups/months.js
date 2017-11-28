import Group from '@/models/group'
import Task from '@/models/task'
import Month from '@/models/month'

// Format to YYYY-MM
function format (ms) {
  const d = new Date(ms)
  return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2)
}

// Singleton to keep months tree
export const Months = (new Group({
  resolvePath: entry => {
    return [format(entry.start)]
      .concat(entry.details)
  },
  constructors: [Month, Task],
  name: 'months'
}))

export function MonthsPlugin (store) {
  const actions = {
    addEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Months.addEntry(entry)
      })
    },
    removeEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Months.removeEntry(entry)
      })
    },
    clearEntries () {
      Months.children = []
    }
  }
  return store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation)
  })
}
