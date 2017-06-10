import Entry from '@/models/entry'
import Petrov from '@/petrov'
import { insertSorted } from '@/utils/sorted'
import async from 'async'

export const Storage = ({
  entries: []
})

export const mutations = {
  addEntry (state, payload) {
    return insertSorted({
      child: payload.entry,
      children: Storage.entries,
      compare: (a, b) => a.start - b.start,
      dir: 1
    })
  },

  clearEntries (state, payload) {
    Storage.entries = []
  }
}

let addEntryTimeout

export const actions = ({
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
              commit('addEntry', { entry: new Entry(entry) })
              addEntryTimeout = setTimeout(next, 5)
            }, error => {
              if (error) {
                console.warn(error)
              }
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
})

export default {
  mutations,
  actions
}
