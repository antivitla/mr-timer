import Entry from '@/models/entry'
import Petrov from '@/petrov'
import sortedIndexBy from 'lodash/sortedIndexBy'
// import async from 'async'
import appName from './app-name'
import { extractEntries, parentOfDifferentType } from '@/utils/group'
import bus from '@/event-bus'
// import taffydb from 'taffydb'
import { taskDelimiter } from '@/store/ui'

export const Storage = ({
  entries: [],
  all: [],
  context: null,
  period: null
  // db: taffydb.taffy()
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
      item => -item.start)
    Storage.entries.splice(id, 0, payload.entry)
    // all
    const found = Storage.all.find(entry => {
      return entry.uid() === payload.entry.uid()
    })
    if (found) {
      found.start = payload.entry.start
      found.stop = payload.entry.stop
      found.details = payload.entry.details.slice(0)
      found._uid = payload.entry._uid
    } else {
      const allid = sortedIndexBy(
        Storage.all,
        payload.entry,
        item => -item.start)
      Storage.all.splice(allid, 0, payload.entry)
    }
  },

  removeEntry (state, payload) {
    let id = Storage.entries.indexOf(payload.entry)
    if (id < 0) {
      id = Storage.entries.findIndex(entry => {
        return entry.uid() === payload.entry.uid()
      })
    }
    if (id > -1) {
      Storage.entries.splice(id, 1)
    }
    // all
    let allid = Storage.all.indexOf(payload.entry)
    if (allid < 0) {
      allid = Storage.all.findIndex(entry => {
        return entry.uid() === payload.entry.uid()
      })
    }
    if (allid > -1) {
      Storage.all.splice(allid, 1)
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

// let lockedBatchOperations = false

export const actions = ({
  loadEntries ({ state, commit, getters, dispatch }, payload) {
    // Грузиться с удалённого аккаунта?
    if (getters['userKey'] !== 'local') {
      // Storage.db.store('titamota-entries-' + getters['userKey'])
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
      // Storage.db.store('titamota-entries-local')
      // const entries = Storage.db().get()
      let entries = []
      try {
        const key = state.localStorageKey + '-local'
        const saved = localStorage[key]
        if (saved) {
          entries = JSON.parse(localStorage[key]).entries
        }
      } catch (error) {
        console.warn(error)
      }
      if (entries.length) {
        dispatch('batchAddEntries', {
          entries,
          context: payload ? payload.context : null
        })
      }
    }
  },

  saveEntries ({ state, getters }) {
    let key = state.localStorageKey + '-' + getters['userKey']
    if (getters['userKey'] !== 'local') {
      Petrov.put(getters['userKey'], {
        entries: Storage.all
      })
    }
    const raw = JSON.stringify({
      entries: Storage.all
    })
    localStorage.setItem(key, raw)
  },

  createEntry (context, payload) {
    const entry = new Entry(Object.assign(payload.entry))
    context.commit('addEntry', { entry })
    // Storage.db.insert(Object.assign({}, entry))
    context.dispatch('saveEntries')
  },

  updateEntry (context, payload) {
    const updatedEntry = new Entry(Object.assign(
        {},
        payload.entry,
        payload.update))
    context.commit('removeEntry', {
      entry: payload.entry
    })
    context.commit('addEntry', {
      entry: updatedEntry
    })
    bus.$emit('update-entry', {
      entry: payload.entry,
      updatedEntry
    })
    // Storage
    //   .db({ _uid: payload.entry._uid })
    //   .update(payload.update)
    context.dispatch('saveEntries')
    return updatedEntry
  },

  removeEntry (context, payload) {
    context.commit('removeEntry', payload)
    // Storage
    //   .db({ _uid: payload.entry._uid })
    //   .remove()
    context.dispatch('saveEntries')
  },

  batchUpdateEntries (context, payload) {
    // if (!lockedBatchOperations) {
    //   lockedBatchOperations = true
    //   async.eachSeries(payload.entries, (entry, next) => {
    //     // Переименование
    //     let details = entry.details.slice(0)
    //     if (payload.update.details) {
    //       let source = payload.update.details
    //         .source.join(taskDelimiter)
    //       let target = payload.update.details
    //         .target.join(taskDelimiter)
    //       details = entry.details
    //         .join(taskDelimiter)
    //         .replace(new RegExp('^' + source), target)
    //         .split(taskDelimiter)
    //         .filter(d => d)
    //         .map(d => d.trim())
    //         .filter(d => d)
    //     }
    //     // Изменение длительностей
    //     let stop = entry.stop
    //     if (payload.update.stop) {
    //       if (payload.update.stop.add) {
    //         stop = entry.stop + payload.update.stop.add
    //       }
    //     }
    //     context.commit('removeEntry', { entry })
    //     context.commit('addEntry', {
    //       entry: new Entry({
    //         start: entry.start,
    //         stop,
    //         details,
    //         _uid: entry._uid
    //       })
    //     })
    //     // // Sync local
    //     // Storage
    //     //   .db({ _uid: entry._uid })
    //     //   .update({ stop, details })
    //     // Next
    //     setTimeout(next, 5)
    //   }, error => {
    //     if (error) {
    //       console.warn(error)
    //     }
    //     lockedBatchOperations = false
    //     bus.$emit('batch-update-entries', payload)
    //     context.dispatch('saveEntries')
    //   })
    // }

    payload.entries.forEach(entry => {
      // Переименование
      let details = entry.details.slice(0)
      if (payload.update.details) {
        let source = payload.update.details
          .source.join(taskDelimiter)
        let target = payload.update.details
          .target.join(taskDelimiter)
        details = entry.details
          .join(taskDelimiter)
          .replace(new RegExp('^' + source), target)
          .split(taskDelimiter)
          .filter(d => d)
          .map(d => d.trim())
          .filter(d => d)
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
          details,
          _uid: entry._uid
        })
      })
    })
    bus.$emit('batch-update-entries', payload)
    context.dispatch('saveEntries')
  },

  batchRemoveEntries (context, payload) {
    // if (!lockedBatchOperations) {
    //   lockedBatchOperations = true
    //   async.eachSeries(payload.entries, (entry, next) => {
    //     context.commit('removeEntry', { entry })
    //     // // Sync local
    //     // Storage
    //     //   .db({ _uid: entry._uid })
    //     //   .remove()
    //     // Next
    //     setTimeout(next, 5)
    //   }, error => {
    //     if (error) {
    //       console.warn(error)
    //     }
    //     lockedBatchOperations = false
    //     context.dispatch('saveEntries')
    //   })
    // }
    payload.entries.forEach(item => {
      const entry = item instanceof Entry ? item : new Entry(item)
      context.commit('removeEntry', { entry })
    })
    context.dispatch('saveEntries')
  },

  batchAddEntries (context, payload) {
    // if (!lockedBatchOperations) {
    //   lockedBatchOperations = true
    //   async.eachSeries(payload.entries, (item, next) => {
    //     const entry = item instanceof Entry ? item : new Entry(item)
    //     context.commit('addEntry', { entry })
    //     setTimeout(next, 5)
    //   }, error => {
    //     if (error) {
    //       console.warn(error)
    //     }
    //     lockedBatchOperations = false
    //     context.dispatch('saveEntries')
    //   })
    // }

    payload.entries.forEach(item => {
      const entry = item instanceof Entry ? item : new Entry(item)
      context.commit('addEntry', { entry })
    })
    context.dispatch('saveEntries')
  },

  importEntries (context, payload) {
    let entries = []
    // JSON
    if (payload.format === 'json') {
      let raw
      try {
        raw = JSON.parse(payload.raw)
      } catch (error) {
        console.warn(error)
      }
      if (Array.isArray(raw)) {
        entries = raw
      } else if (raw.entries && raw.entries.length) {
        entries = raw.entries
      } else {
        console.log('Какой-то непонятный json')
      }
    }

    // Create imported entries
    if (entries.length) {
      context.dispatch('batchAddEntries', {
        entries
      })
    }
    // if (entries.length && !lockedBatchOperations) {
    //   if (payload.replace) {
    //     Storage.db().remove()
    //     context.commit('clearEntries')
    //   }
    //   lockedBatchOperations = true
    //   async.eachSeries(entries, (entry, next) => {
    //     context.dispatch('createEntry', { entry })
    //     setTimeout(next, 5)
    //   }, error => {
    //     if (error) {
    //       console.warn(error)
    //     }
    //     lockedBatchOperations = false
    //   })
    // }
  },

  setContext (context, payload) {
    bus.$emit('set-context', payload)
    context.commit('clearEntries')
    context.commit('setContext', payload)
    const entries = extractEntries(payload.context)
    context.dispatch('batchAddEntries', { entries })
  },

  clearContext (context) {
    bus.$emit('clear-context')
    context.commit('clearEntries')
    context.commit('clearContext')
    context.dispatch('batchAddEntries', {
      entries: Storage.all
    })
  }
})

export default {
  state,
  getters,
  mutations,
  actions
}
