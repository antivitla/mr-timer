const state = {
  focus: 'details',
  edit: null,
  id: null,
  isEditing: false
}

const getters = {
  isEditingTask: state => state.isEditing,
  editingTaskId: state => state.id,
  editingTaskFields: state => state.edit,
  editingFocus: state => state.focus
}

const mutations = {
  startTaskEditing (state, payload) {
    state.focus = payload.focus
    state.edit = payload.edit
    state.id = payload.id
    state.isEditing = true
  },
  cancelTaskEditing (state, payload) {
    state.isEditing = false
  },
  stopTaskEditing (state) {
    state.isEditing = false
    state.edit = null
    state.id = null
    state.focus = 'details'
  }
}

export default {
  state,
  getters,
  mutations
}
