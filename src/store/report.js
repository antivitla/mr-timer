const state = {
  format: 'markdown',
  data: []
}

const getters = {
  reportFormat: state => state.format
}

const mutations = {
  setReportFormat (state, payload) {
    state.format = payload.format
  }
}

export default {
  state,
  getters,
  mutations
}
