export const Selektion = {
  entries: []
}

const mutations = {
  selectionAdd (state, payload) {
    if (Selektion.entries.indexOf(payload.entry) < 0) {
      Selektion.entries.push(payload.entry)
    }
  },

  selectionRemove (state, payload) {
    const id = Selektion.entries.indexOf(payload.entry)
    if (id > -1) {
      Selektion.entries.splice(id, 1)
    }
  },

  selectionClear (state, payload) {
    Selektion.entries = []
  }
}

export default {
  // state,
  // getters,
  mutations
}
