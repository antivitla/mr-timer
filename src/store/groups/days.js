import Group from '@/models/group'
import Day from '@/models/day'
import Task from '@/models/task'

// Format to YYYY-MM-DD
function format (ms) {
  const d = new Date(ms)
  return d.getFullYear() + '-' +
    ('0' + d.getMonth()).slice(-2) + '-' +
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
        Days.addEntry(entry)
      })
    }
    if (mutation.type === 'removeEntries') {
      mutation.payload.entries.forEach(entry => {
        Days.removeEntry(entry)
      })
    }
    if (mutation.type === 'clearEntries') {
      Days.children = []
    }
  })
}
