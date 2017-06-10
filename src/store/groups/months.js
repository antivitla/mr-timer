import Group from '@/models/group'
import Task from '@/models/task'
import Month from '@/models/month'

// Format to YYYY-MM
function format (ms) {
  const d = new Date(ms)
  return d.getFullYear() + '-' + ('0' + d.getMonth()).slice(-2)
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
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntry') {
      Months.addEntry(mutation.payload.entry)
    }
    if (mutation.type === 'clearEntries') {
      Months.children = []
    }
  })
}
