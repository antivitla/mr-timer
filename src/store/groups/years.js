import Group from '@/models/group'
import Task from '@/models/task'
import Year from '@/models/year'

// Format to YYYY
function format (ms) {
  const d = new Date(ms)
  return d.getFullYear() + ''
}

// Singleton to keep months tree
export const Years = (new Group({
  resolvePath: entry => {
    return [format(entry.start)]
      .concat(entry.details)
  },
  constructors: [Year, Task],
  name: 'years'
}))

export function YearsPlugin (store) {
  const actions = {
    addEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Years.addEntry(entry)
      })
    },
    removeEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Years.removeEntry(entry)
      })
    },
    clearEntries () {
      Years.children = []
    }
  }
  return store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation)
  })
}
