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
  clearContext (state) {
    state.context = []
  },
  upContext (state) {
    state.context.pop()
  },
  downContext (state, payload) {
    state.context = state.context.concat(payload.context)
  }
}

const actions = {
  setContextAndGetEntries (context, payload) {
    context.commit('setContext', { context: payload.context })
    return context.dispatch('getEntries', { params: payload.getParams })
  },
  downContextAndGetEntries (context, payload) {
    context.commit('downContext', { context: payload.context })
    return context.dispatch('getEntries', { params: payload.getParams })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
