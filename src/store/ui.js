const state = {
  currentView: 'tasks',
  recent: {
    tasks: 2,
    months: 2,
    days: 2
  },
  sidebar: false,
  modal: null
}

const getters = {
  currentView: state => state.currentView,
  sidebarActive: state => state.sidebar,
  modalActive: state => state.modal
}

const mutations = {
  setCurrentView (state, payload) {
    state.currentView = payload.view
  },
  toggleSidebar (state, payload) {
    state.sidebar = !state.sidebar
  },
  closeSidebar (state) {
    state.sidebar = false
  },
  openModal (state, payload) {
    console.log(state, payload)
    state.modal = payload.modal
  },
  closeModal (state) {
    state.modal = null
  }
}

export default {
  state,
  getters,
  mutations
}
