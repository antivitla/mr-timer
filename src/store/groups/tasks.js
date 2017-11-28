import Group from '@/models/group'
import Task from '@/models/task'

// Singleton to keep task tree
export const Tasks = (new Group({
  resolvePath (entry) {
    return entry.details.slice(0)
  },
  constructors: [Task],
  name: 'tasks'
}))

export function TasksPlugin (store) {
  const actions = {
    addEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Tasks.addEntry(entry)
      })
    },
    removeEntries (mutation) {
      mutation.payload.entries.forEach(entry => {
        Tasks.removeEntry(entry)
      })
    },
    clearEntries () {
      Tasks.children = []
    }
  }
  return store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation)
  })
}
