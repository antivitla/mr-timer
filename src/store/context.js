const state = {
  context: []
}

const getters = {
  context: state => state.context,
  isContext: state => Boolean(state.context.length)
}

const mutations = {
  setContext (state, payload) {
    state.context = payload.context.map(i => i.trim()).filter(i => i)
  },
  appendContext (state, payload) {
    state.context = state.context.concat(payload.context)
  },
  clearContext (state) {
    state.context = []
  }
}

export default {
  state,
  getters,
  mutations
}
