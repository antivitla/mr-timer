// import Petrov from '@/backend/petrov'
// import Mitaba from '@/backend/mitaba'
// import Local from '@/backend/local'

// const backend = {
//   local: Local,
//   mitaba: Mitaba,
//   petrov: Petrov
// }

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
    console.log('set backend:', state.backend)
  }
}

const actions = {
  loadEntries (context, payload) {
    const backend = context.getters.backend
    console.log('load entries:', backend)
    // We need to cancel previous pending requests
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
