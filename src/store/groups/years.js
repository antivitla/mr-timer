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
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntries') {
      // let resolvePath
      // if (store.getters['contextDetails']) {
      //   let contextRootPath = store.getters['contextDetails']
      //   resolvePath = function (entry) {
      //     return [format(entry.start)]
      //       .concat(entry.details.slice(contextRootPath.length))
      //   }
      // }
      mutation.payload.entries.forEach(entry => {
        Years.addEntry(entry)
      })
    }
    if (mutation.type === 'removeEntries') {
      mutation.payload.entries.forEach(entry => {
        Years.removeEntry(entry)
      })
    }
    if (mutation.type === 'clearEntries') {
      Years.children = []
    }
  })
}
