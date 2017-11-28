export const Selected = {
  entries: []
}

const mutations = {
  addSelected (state, payload) {
    if (Selected.entries.findIndex(entry => entry.id === payload.entry.id) < 0) {
      Selected.entries.push(payload.entry)
    }
  },
  removeSelected (state, payload) {
    const id = Selected.entries.findIndex(entry => entry.id === payload.entry.id)
    if (id > -1) {
      Selected.entries.splice(id, 1)
    }
  },
  clearSelected (state, payload) {
    Selected.entries = []
  }
}

export default {
  mutations
}
