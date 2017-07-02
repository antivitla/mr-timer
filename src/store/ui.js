const state = {
  view: {
    current: 'tasks',
    available: {
      help: true,
      tasks: true,
      months: true,
      days: true,
      history: true
    }
  },
  recent: {
    tasks: 2,
    months: 2,
    days: 2
  },
  sidebar: false,
  modal: null
}

const getters = {
  currentView: state => state.view.current,
  sidebarActive: state => state.sidebar,
  modalActive: state => state.modal,
  viewsAvailable: state => state.view.available
}

const mutations = {
  setCurrentView (state, payload) {
    state.view.current = payload.view
  },
  toggleSidebar (state, payload) {
    state.sidebar = !state.sidebar
  },
  closeSidebar (state) {
    state.sidebar = false
  },
  openModal (state, payload) {
    state.modal = payload.modal
  },
  closeModal (state) {
    state.modal = null
  },
  toggleAvailableView (state, payload) {
    state.view
      .available[payload.view] = !state.view
        .available[payload.view]
  }
}

export default {
  state,
  getters,
  mutations
}
