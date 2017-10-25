export const Selected = {
  entries: []
}

const mutations = {
  selectedAdd (state, payload) {
    if (Selected.entries.indexOf(payload.entry) < 0) {
      Selected.entries.push(payload.entry)
    }
  },

  selectedRemove (state, payload) {
    const id = Selected.entries.indexOf(payload.entry)
    if (id > -1) {
      Selected.entries.splice(id, 1)
    }
  },

  selectedClear (state, payload) {
    Selected.entries = []
  }
}

export default {
  mutations
}
