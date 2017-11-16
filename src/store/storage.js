import Entry from '@/models/entry'
import Mitaba from '@/backend/mitaba'
import Local from '@/backend/local'
import lastPromise from '@/utils/last-promise'
import { insertSorted } from '@/utils/sorted'
import { taskDelimiter } from '@/store/ui'
import bus from '@/event-bus'
// import capitalize from '@/utils/capitalize'

function removeContext (entries, context) {
  if (!context.length) {
    return entries.map(entry => new Entry(entry))
  }
  return entries.map(entry => {
    const reg = new RegExp(`^${context.join(taskDelimiter)}`)
    const details = entry.details.join(taskDelimiter)
      .replace(reg, '')
      .split(taskDelimiter)
      .map(d => d.trim())
      .filter(d => d)
    return new Entry(Object.assign({}, entry, { details }))
  })
}

function addContext (entries, context) {
  if (!context.length) {
    return entries.map(entry => new Entry(entry))
  }
  return entries.map(entry => {
    const details = context.concat(entry.details).slice(0)
    return new Entry(Object.assign({}, entry, { details }))
  })
}

export const driver = {
  local: Local,
  mitaba: Mitaba
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
    const params = Object.assign({}, payload && payload.params)
    // Выбираем сервер
    const backend = driver[context.getters.backend]
    // Если у нас есть контекст,
    // подпихиваем соотв. параметры
    if (context.getters.isContext) {
      params.context = context.getters.context.slice(0)
    }
    // Отсылаем событие для прелоадера
    bus.$emit('get-entries-pending')
    // Делаем, собственно, запрос
    return lastPromise({
      type: 'getEntries',
      promise: backend.getEntries({ params })
    })
    .then(response => {
      const entries = removeContext(response.entries, context.getters.context)
      // Запоминаем контекст
      if (response.context) {
        context.commit('setContext', { context: response.context })
      }
      // Запоминаем паджинацию
      if (response.pagination) {
        const pagination = response.pagination
        if (!pagination.group) {
          pagination.group = 'storage'
        }
        context.commit('setPagination', pagination)
      }
      // Показываем записи
      context.commit('clearEntries')
      context.commit('addEntries', { entries })
      bus.$emit('get-entries-complete')
      return entries
    }).catch(error => {
      if (error.response) {
        const content = `Get entries: ${error.response.statusText}`
        bus.$emit('toast', { content, type: 'error' })
        if (error.response.status === 404) {
          context.commit('clearEntries')
          context.commit('clearPagination')
          bus.$emit('get-entries-complete')
        }
      }
    })
  },
  postEntries (context, payload) {
    const postEntries = addContext(payload.entries, context.getters.context)
    return driver[context.getters.backend]
      .postEntries(postEntries.map(entry => entry.serialize()))
      .then(entries => {
        const postedEntries = removeContext(entries, context.getters.context)
        context.commit('addEntries', { entries: postedEntries })
        return postedEntries
      })
  },
  patchEntries (context, payload) {
    // Изменяем записи сразу же, не дожидаясь ответа сервера
    context.commit('removeEntries', { entries: payload.remove })
    context.commit('addEntries', { entries: payload.add })
    // Если бы контекст, добавляем его
    const entries = addContext(payload.add, context.getters.context)
    // Отправляем на сервер
    return driver[context.getters.backend]
      .patchEntries(entries.map(entry => entry.serialize()))
      .then(entries => removeContext(entries, context.getters.context))
  },
  deleteEntries (context, payload) {
    context.commit('removeEntries', payload)
    return driver[context.getters.backend]
      .deleteEntries(payload.entries.map(entry => ({ id: entry.id })))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
