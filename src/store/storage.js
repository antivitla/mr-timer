import Entry from '@/models/entry'
import Petrov from '@/backend/petrov'
import Mitaba from '@/backend/mitaba'
import Local from '@/backend/local'
import lastPromise from '@/utils/last-promise'
import { insertSorted } from '@/utils/sorted'

const driver = {
  local: Local,
  mitaba: Mitaba,
  petrov: Petrov
}

export const Storage = {
  entries: []
}

const state = {
  backend: 'local'
}

const getters = {
  backend: state => state.backend
}

const mutations = {
  setBackend (state, payload) {
    state.backend = payload.backend
  },

  addEntries (state, payload) {
    payload.entries.forEach(entry => {
      insertSorted({
        child: entry,
        children: Storage.entries,
        compare: (a, b) => a.start - b.start,
        dir: 1
      })
    })
  },

  removeEntries (state, payload) {
    payload.entries.forEach(entry => {
      let id = Storage.entries.indexOf(entry)
      // Попробуем найти по id
      if (id < 0) {
        id = Storage.entries.findIndex(entry2 => {
          return entry.id === entry2.id
        })
      }
      if (id > -1) {
        Storage.entries.splice(id, 1)
      }
    })
  },

  clearEntries () {
    Storage.entries = []
  }
}

const actions = {
  getEntries (context, payload) {
    // Лезем на сервер
    const backend = driver[context.getters.backend]
    // Делаем, собственно, запрос
    return lastPromise({
      type: 'getEntries',
      promise: backend.getEntries(payload)
    })
    .then(response => {
      // Создаём итемы
      const entries = response.entries.map(e => new Entry(e))
      // Запоминаем паджинацию
      if (response.pagination) {
        if (!response.pagination.group) {
          context.commit('setEntriesPagination', response.pagination)
        } else {
          context.commit('setGroupPagination', response.pagination)
        }
      }
      context.commit('clearEntries')
      // Запоминаем
      context.commit('addEntries', { entries })
      return entries
    }).catch(error => {
      if (error.response.status === 404) {
        context.commit('clearEntries')
        context.commit('clearPagination')
      }
    })
  },

  postEntries (context, payload) {
    return driver[context.getters.backend]
      .postEntries(payload.entries.map(entry => entry.serialize()))
      .then(entries => {
        context.commit('addEntries', { entries })
        return entries
      })
  },

  patchEntries (context, payload) {
    // Изменяем записи сразу же, не дожидаясь ответа сервера
    context.commit('removeEntries', { entries: payload.remove })
    context.commit('addEntries', { entries: payload.add })
    // Отправляем на сервер
    return driver[context.getters.backend]
      .patchEntries(payload.add.map(entry => entry.serialize()))
  },

  deleteEntries (context, payload) {
    context.commit('removeEntries', payload)
    return driver[context.getters.backend]
      .deleteEntries(payload.entries.map(entry => ({ id: entry.id })))
  },

  deleteAndGetEntries (context, payload) {
    context.commit('removeEntries', { entries: payload.deleteEntries })
    return context
      .dispatch('deleteEntries', { entries: payload.deleteEntries })
      .then(() => context.dispatch('getEntries', { params: payload.getParams }))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
