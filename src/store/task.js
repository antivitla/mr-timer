import Group from '@/models/group'

export class Task extends Group {
  type () {
    return 'task'
  }
}

export function TaskPlugin (store) {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'addEntry') {
      store.commit('addTaskEntry', mutation.payload)
    }
  })
}

export const TaskGroupStore = {
  state: {
    group: new Group({
      resolvePath: entry => {
        return entry.details.slice(0)
      },
      constructors: [Task],
      name: 'tasks'
    })
  },

  mutations: {
    addTaskEntry (state, payload) {
      state.group.addEntry(payload.entry)
    }
  }
}
