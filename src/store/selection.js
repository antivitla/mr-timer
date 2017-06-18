const state = {
  entries: []
}

const getters = {
  selectionEntries: state => state.entries
}

const mutations = {
  selectionAdd (state, payload) {
    if (state.entries.indexOf(payload.entry) < 0) {
      state.entries.push(payload.entry)
    }
  },

  selectionRemove (state, payload) {
    const id = state.entries.indexOf(payload.entry)
    if (id > -1) {
      state.entries.splice(id, 1)
    }
  },

  selectionClear (state, payload) {
    state.entries = []
  }
}

export default {
  state,
  getters,
  mutations
}
