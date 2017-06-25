const state = {
  currentView: 'tasks',
  recent: {
    tasks: 2,
    months: 2,
    days: 2
  },
  sidebar: false
}

const getters = {
  currentView: state => state.currentView,
  sidebarActive: state => state.sidebar
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
  }
}

export default {
  state,
  getters,
  mutations
}
