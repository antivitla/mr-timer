import Entry from '@/models/entry'
import Petrov from '@/petrov'
import { insertSorted } from '@/utils/sorted'
import async from 'async'

const state = {
  entries: [],
  activeEntry: null
}

const getters = {
  storageEntriesCount: state => state.entries.length,
  storageEntries: state => state.entries
}

const mutations = {
  addEntry (state, payload) {
    const entry = new Entry(payload.entry)
    return insertSorted({
      child: entry,
      children: state.entries,
      compare: (a, b) => a.start - b.start,
      dir: 1
    })
  },
  removeEntry (state, payload) {
    const id = state.entries.indexOf(payload.entry)
    if (id > -1) {
      state.entries.splice(id, 1)
      return id
    }
  },
  updateEntry (state, payload) {
    // Merge update
    // commit remove
    // commit add
  },
  clearEntries (state) {
    state.entries = []
  }
}

let addEntryTimeout

const actions = {
  loadEntries ({ state, commit, rootState }) {
    // Очищаем предыдущий запрос
    clearTimeout(addEntryTimeout)
    // Грузиться с удалённого аккаунта?
    if (rootState.user.key !== 'local') {
      Petrov.get(rootState.user.key)
        .catch(() => {
          // Если не найден аккаунт, создаём его
          return Petrov.post(rootState.user.key)
        })
        .then((res) => {
          // Теперь точно есть аккаунт...
          commit('setUserMode', { mode: res.mode })
          commit('setUserGuestKey', { guestKey: res.guest_code })
          // ...хоть с данными, хоть без
          if (res.data && res.data.trim()) {
            let entries
            try {
              entries = JSON.parse(res.data).entries
            } catch (error) {
              throw new Error('Error parsing remote data ' + error)
            }
            async.eachSeries(entries, (entry, next) => {
              commit('addEntry', { entry })
              addEntryTimeout = setTimeout(next, 20)
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      // Или грузиться локально?
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
