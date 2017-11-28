/** http://eslint.org/docs/rules/prefer-promise-reject-errors */

import Entry from '@/models/entry'
import Petrov from '@/petrov'
import sortedIndexBy from 'lodash/sortedIndexBy'
import bus from '@/event-bus'
import { appName } from './app-info'
import { taskDelimiter } from '@/store/ui'

export const Storage = ({
  entries: [],
  all: []
})

const state = {
  localStorageKey: appName + '-entries'
}

const getters = {
  //
}

export const mutations = {
  addEntry (state, payload) {
    // current (context) entries
    const id = sortedIndexBy(
      Storage.entries,
      payload.entry,
      item => -item.start)
    Storage.entries.splice(id, 0, payload.entry)

    // all entries
    const found = Storage.all.find(entry => {
      return entry.id === payload.entry.id
    })
    if (found) {
      found.start = payload.entry.start
      found.stop = payload.entry.stop
      found.details = payload.entry.details.slice(0)
      found.id = payload.entry.id
    } else {
      const allid = sortedIndexBy(
        Storage.all,
        payload.entry,
        item => -item.start)
      Storage.all.splice(allid, 0, payload.entry)
    }
  },

  removeEntry (state, payload) {
    // current (context) entries
    let id = Storage.entries.indexOf(payload.entry)
    if (id < 0) {
      id = Storage.entries.findIndex(entry => {
        return entry.id === payload.entry.id
      })
    }
    if (id > -1) {
      Storage.entries.splice(id, 1)
    }

    // all entries
    let allid = Storage.all.indexOf(payload.entry)
    if (allid < 0) {
      allid = Storage.all.findIndex(entry => {
        return entry.id === payload.entry.id
      })
    }
    if (allid > -1) {
      Storage.all.splice(allid, 1)
    }
  },

  clearEntries (state, payload) {
    Storage.entries = []
  }
}

export const actions = ({
  getEntries (context, payload) {
    return new Promise((resolve, reject) => {
      // Грузиться с удалённого аккаунта?
      if (context.getters['userKey'] !== 'local') {
        Petrov.get(context.getters['userKey'])
          .catch(() => {
            // Если на найден аккаунт, создаём его
            return Petrov.post(context.getters['userKey'])
          })
          .then(res => {
            // Теперь точно есть аккаунт
            context.commit('setUserMode', {
              mode: res.mode
            })
            context.commit('setUserGuestKey', {
              guestKey: res.guest_code
            })
            // ...хоть с данными хоть без
            let entries = []
            if (res.data && res.data.trim()) {
              try {
                entries = JSON.parse(res.data).entries
                  .map(e => new Entry(e))
              } catch (error) {
                throw new Error('Error parsing remote data ' + error)
              }
            }
            resolve({ entries })
          })
          .catch(error => {
            reject(error)
          })
      } else {
        // Или грузиться локально?
        let entries = []
        try {
          const key = context.state.localStorageKey + '-local'
          const saved = localStorage[key]
          if (saved) {
            entries = JSON.parse(localStorage[key]).entries
              .map(e => new Entry(e))
          }
        } catch (error) {
          reject(error)
        }
        resolve({ entries })
      }
    })
  },

  loadEntries (context, payload) {
    bus.$emit('load-entries-start')
    return context.dispatch('getEntries')
      .then(res => {
        context.dispatch('batchAddEntries', {
          entries: res.entries,
          context: payload ? payload.context : null
        })
        .then(() => {
          bus.$emit('load-entries-done')
        })
      })
  },

  saveEntries (context) {
    return new Promise((resolve, reject) => {
      // local save
      const lskey = context.state.localStorageKey
      const ukey = context.getters['userKey']
      const key = `${lskey}-${ukey}`
      const raw = JSON.stringify({
        entries: Storage.all
      })
      localStorage.setItem(key, raw)
      // remote save
      if (context.getters['userKey'] !== 'local') {
        Petrov.put(context.getters['userKey'], {
          entries: Storage.all
        })
        .then(() => {
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      } else {
        resolve()
      }
    })
  },

  createEntry (context, payload) {
    const entry = new Entry(Object.assign(payload.entry))
    context.commit('addEntry', { entry })
    return context.dispatch('saveEntries')
  },

  updateEntry (context, payload) {
    return new Promise((resolve, reject) => {
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
      context
        .dispatch('saveEntries')
        .then(() => {
          resolve(updatedEntry)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  removeEntry (context, payload) {
    context.commit('removeEntry', payload)
    return context.dispatch('saveEntries')
  },

  batchUpdateEntries (context, payload) {
    bus.$emit('batch-thinking-start')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
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
              id: entry.id
            })
          })
        })
        context
          .dispatch('saveEntries')
          .then(() => {
            bus.$emit('batch-update-entries', payload)
            bus.$emit('batch-thinking-done')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      }, 10)
    })
  },

  batchRemoveEntries (context, payload) {
    bus.$emit('batch-thinking-start')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        payload.entries.forEach(item => {
          const entry = item instanceof Entry ? item : new Entry(item)
          context.commit('removeEntry', { entry })
        })
        context
          .dispatch('saveEntries')
          .then(() => {
            bus.$emit('batch-thinking-done')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      }, 10)
    })
  },

  batchAddEntries (context, payload) {
    bus.$emit('batch-thinking-start')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        payload.entries.forEach(item => {
          const entry = item instanceof Entry ? item : new Entry(item)
          context.commit('addEntry', { entry })
        })
        context
          .dispatch('saveEntries')
          .then(() => {
            bus.$emit('batch-thinking-done')
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      }, 10)
    })
  },

  importEntries (context, payload) {
    return new Promise((resolve, reject) => {
      let entries = []
      // JSON
      if (payload.format === 'json') {
        let raw
        try {
          raw = JSON.parse(payload.raw)
        } catch (error) {
          console.warn(error)
          reject(new Error('Bad format in: ' + payload.raw))
        }
        if (Array.isArray(raw)) {
          entries = raw
        } else if (raw.entries && raw.entries.length) {
          entries = raw.entries
        } else {
          console.log('Какой-то непонятный json')
          reject(new Error('Wrong json object in: ' + payload.raw))
        }
      }

      // Create imported entries
      if (entries.length) {
        context
          .dispatch('batchAddEntries', { entries })
          .then(() => {
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      } else {
        reject(new Error('Empty import in: ' + payload.raw))
      }
    })
  }
})

export default {
  state,
  getters,
  mutations,
  actions
}
