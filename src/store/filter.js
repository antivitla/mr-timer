const state = {
  filter: []
}

const getters = {
  isFilter: state => Boolean(state.filter.length),
  filter: state => state.filter
}

const mutations = {
  setFilter (state, payload) {
    state.filter = payload.filter.filter(f => f.trim()).filter(f => f)
  },
  clearFilter (state) {
    state.filter = []
  }
}

export default {
  state,
  getters,
  mutations
}
