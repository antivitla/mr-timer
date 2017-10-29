const state = {
  count: undefined,
  limit: 100,
  offset: 0
}

const mutations = {
  setPaginationCount (state, payload) {
    state.count = payload.count
  }
}

export default {
  state,
  mutations
}
