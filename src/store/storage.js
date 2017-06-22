import Entry from '@/models/entry'
import Petrov from '@/petrov'
import sortedIndexBy from 'lodash/sortedIndexBy'
import async from 'async'
import appName from './app-name'
import { extractEntries, parentOfDifferentType } from '@/utils/group'

export const Storage = ({
  entries: [],
  context: null,
  period: null,
  project: null,
  client: null,
  phase: null
})

const state = {
  localStorageKey: appName + '-entries'
}

const getters = {
  storageContext: () => Storage.context
}

export const mutations = {
  addEntry (state, payload) {
    const id = sortedIndexBy(
      Storage.entries,
      payload.entry,
      item => -item.stop)
    Storage.entries.splice(id, 0, payload.entry)
  },

  removeEntry (state, payload) {
    const id = Storage.entries.indexOf(payload.entry)
    if (id > -1) {
      Storage.entries.splice(id, 1)
    }
  },

  clearEntries (state, payload) {
    Storage.entries = []
  },

  setContext (state, payload) {
    Storage.context = payload.context
    const t = payload.context.type
    if (t === 'month' || t === 'day' || t === 'year') {
      Storage.period = {
        type: payload.context.type,
        value: payload.context.start
      }
    } else {
      const parent = parentOfDifferentType(payload.context)
      if (parent) {
        const t = parent.type
        if (t === 'month' || t === 'day' || t === 'year') {
          Storage.period = {
            type: parent.type,
            value: parent.start
          }
        }
      } else {
        Storage.period = null
      }
    }
  },

  clearContext (state) {
    Storage.context = null
    Storage.period = null
  }
}

// function withinContext (entry, context) {
//   // console.log(entry, context)
//   return true
// }

let lockedBatchOperations = false

export const actions = ({
  loadEntries ({ state, commit, getters, dispatch }, payload) {
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
            dispatch('batchAddEntries', {
              entries,
              context: payload ? payload.context : null
            })
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
        dispatch('batchAddEntries', {
          entries,
          context: payload ? payload.context : null
        })
      }
    }
  },

  saveEntries ({ state, getters }) {
    // const raw = JSON.stringify({
    //   entries: Storage.entries,
    //   context: cloneWithourParents(Storage.context)
    // })
    // let key = state.localStorageKey
    // if (getters['userKey'] !== 'local') {
    //   key = key + '-' + getters['userKey']
    //   // Save remote
    //   Petrov.put(getters['userKey'], {
    //     entries: Storage.entries,
    //     context: Storage.context
    //   })
    // }
    // localStorage.setItem(key, raw)
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
  },

  batchUpdateEntries (context, payload) {
    if (!lockedBatchOperations) {
      lockedBatchOperations = true
      async.eachSeries(payload.entries, (entry, next) => {
        // Переименование
        let details = entry.details.slice(0)
        if (payload.update.details) {
          const source = payload.update.details.source.join('/')
          const target = payload.update.details.target.join('/')
          details = entry.details.join('/')
            .replace(new RegExp('^' + source), target)
            .split('/')
            .map(d => d.trim())
        }
        // Изменение длительностей
        let stop = entry.stop
        if (payload.update.stop) {
          if (payload.update.stop.add) {
            stop = entry.stop + payload.update.stop.add
          }
        }
        context.commit('removeEntry', { entry })
        context.commit('addEntry', {
          entry: new Entry({
            start: entry.start,
            stop,
            details
          })
        })
        setTimeout(next, 5)
      }, error => {
        if (error) {
          console.warn(error)
        }
        lockedBatchOperations = false
        context.dispatch('saveEntries')
      })
    }
  },

  batchRemoveEntries (context, payload) {
    if (!lockedBatchOperations) {
      lockedBatchOperations = true
      async.eachSeries(payload.entries, (entry, next) => {
        context.commit('removeEntry', { entry })
        setTimeout(next, 5)
      }, error => {
        if (error) {
          console.warn(error)
        }
        lockedBatchOperations = false
        context.dispatch('saveEntries')
      })
    }
  },

  batchAddEntries (context, payload) {
    if (!lockedBatchOperations) {
      lockedBatchOperations = true
      async.eachSeries(payload.entries, (item, next) => {
        const entry = item instanceof Entry ? item : new Entry(item)
        context.commit('addEntry', { entry })
        setTimeout(next, 5)
      }, error => {
        if (error) {
          console.warn(error)
        }
        lockedBatchOperations = false
        // context.dispatch('saveEntries')
      })
    }
  },

  setContext (context, payload) {
    context.commit('clearEntries')
    context.commit('setContext', payload)
    const entries = extractEntries(payload.context)
    context.dispatch('batchAddEntries', { entries })
  },

  clearContext (context) {
    context.commit('clearEntries')
    context.commit('clearContext')
    context.dispatch('loadEntries')
  }
})

export default {
  state,
  getters,
  mutations,
  actions
}
