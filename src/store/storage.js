import Entry from '@/models/entry'
import Petrov from '@/petrov'
import { insertSorted } from '@/utils/sorted'
import async from 'async'
import appName from './app-name'

export const Storage = ({
  entries: []
})

const state = {
  localStorageKey: appName + '-entries'
}

export const mutations = {
  addEntry (state, payload) {
    return insertSorted({
      child: payload.entry,
      children: Storage.entries,
      compare: (a, b) => a.start - b.start,
      dir: 1
    })
  },

  removeEntry (state, payload) {
    const id = Storage.entries.indexOf(payload.entry)
    if (id > -1) {
      Storage.entries.splice(id, 1)
    }
  },

  clearEntries (state, payload) {
    Storage.entries = []
  }
}

let addEntryTimeout

function delayedAddEntries (entries, commit) {
  async.eachSeries(entries, (entry, next) => {
    commit('addEntry', {
      entry: new Entry(entry)
    })
    addEntryTimeout = setTimeout(next, 5)
  }, error => {
    if (error) {
      console.warn(error)
    }
  })
}

export const actions = ({
  loadEntries ({ state, commit, getters }) {
    // Очищаем предыдущий запрос
    clearTimeout(addEntryTimeout)
    // Грузиться с удалённого аккаунта?
    if (getters['userKey'] !== 'local') {
      Petrov.get(getters['userKey'])
        .catch(() => {
          // Если не найден аккаунт, создаём его
          return Petrov.post(getters['userKey'])
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
            // Добавляем записи с задержкой
            delayedAddEntries(entries, commit)
          }
        })
        .catch(error => {
          console.error(error)
        })
    } else {
      // Или грузиться локально?
      let entries = []
      const key = state.localStorageKey
      const raw = localStorage.getItem(key) ||
        localStorage.getItem('Timerwood-Log')
      if (raw) {
        try {
          entries = JSON.parse(raw).entries
        } catch (error) {
          console.warn('Error parsing localStorage', error)
        }
        // Добавляем записи с задержкой
        delayedAddEntries(entries, commit)
      }
    }
  },

  saveEntries ({ state, getters }) {
    const raw = JSON.stringify({
      entries: Storage.entries
    })
    let key = state.localStorageKey
    if (getters['userKey'] !== 'local') {
      key = key + '-' + getters['userKey']
    }
    localStorage.setItem(key, raw)
  },

  addEntry (context, payload) {
    context.commit('addEntry', payload)
    context.dispatch('saveEntries')
  },

  removeEntry (context, payload) {
    context.commit('removeEntry', payload)
    context.dispatch('saveEntries')
  },

  updateEntry (context, payload) {
    const updatedEntry = new Entry(
      Object.assign({}, payload.entry, payload.update))
    context.commit('removeEntry', {
      entry: payload.entry
    })
    context.commit('addEntry', {
      entry: updatedEntry
    })
    context.dispatch('saveEntries')
    return updatedEntry
  }
})

export default {
  state,
  mutations,
  actions
}
