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
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntry') {
      Tasks.addEntry(mutation.payload.entry)
    }
    if (mutation.type === 'removeEntry') {
      Tasks.removeEntry(mutation.payload.entry)
    }
    if (mutation.type === 'clearEntries') {
      Tasks.children = []
    }
  })
}
