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

  setEntries (state, payload) {
    payload.entries.forEach(entry => {
      insertSorted({
        child: entry,
        children: Storage.entries,
        compare: (a, b) => a.start - b.start,
        dir: 1
      })
    })
  },

  clearEntries () {
    // storage.entries = []
  }
}

/*

backend -> storage
  getEntries
  postEntries
  patchEntries
  deleteEntries

storage -> api
  getEntries(params) => [entries]
  postEntries([entries]) => [created entries with id]
  patchEntries([entries]) => 200
  deleteEntries([entries]) => 200

*/

const actions = {
  getEntries (context, payload) {
    const backend = driver[context.getters.backend]
    return lastPromise({
      type: 'getEntries',
      promise: backend.getEntries(payload)
    })
    .then(response => {
      context.commit('clearEntries')
      context.commit('setEntries', response)
      return response.entries
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
