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
        Months.addEntry(entry)
      })
    }
    if (mutation.type === 'removeEntries') {
      mutation.payload.entries.forEach(entry => {
        Months.removeEntry(entry)
      })
    }
    if (mutation.type === 'clearEntries') {
      Months.children = []
    }
  })
}
