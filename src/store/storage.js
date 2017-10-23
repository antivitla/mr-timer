import Petrov from '@/backend/petrov'
import Mitaba from '@/backend/mitaba'
import Local from '@/backend/local'
import lastPromise from '@/utils/last-promise'

const driver = {
  local: Local,
  mitaba: Mitaba,
  petrov: Petrov
}

export const Storage = ({
  entries: []
})

const state = {
  backend: 'local'
}

const getters = {
  backend: state => state.backend
}

const mutations = {
  setBackend (state, payload) {
    state.backend = payload.backend
  }
}

const actions = {
  loadEntries (context, payload) {
    const backend = driver[context.getters.backend]
    console.log('load entries:', backend)
    // We need to cancel previous pending requests
    return lastPromise({
      type: 'loadEntries',
      promise: backend.getEntries(payload)
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
