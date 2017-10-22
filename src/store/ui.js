export const taskDelimiter = ' / '

const state = {
  view: {
    current: 'tasks',
    available: {
      help: true,
      tasks: true,
      years: true,
      months: true,
      days: true,
      storage: true
    }
  },
  settings: {
    profile: true,
    authorization: true,
    l10n: true,
    migration: false,
    exportImport: false
  },
  sidebar: false,
  modal: null,
  taskDelimiter
}

const getters = {
  currentView: state => state.view.current,
  sidebarActive: state => state.sidebar,
  modalActive: state => state.modal,
  viewsAvailable: state => state.view.available,
  settingsAvailable: state => state.settings,
  taskDelimiter: state => state.taskDelimiter
}

const mutations = {
  setCurrentView (state, payload) {
    state.view.current = payload.view
  },
  toggleSidebar (state, payload) {
    state.sidebar = !state.sidebar
  },
  openSidebar (state) {
    state.sidebar = true
  },
  closeSidebar (state) {
    state.sidebar = false
  },
  toggleModal (state) {
    state.modal = !state.modal
  },
  openModal (state, payload) {
    state.modal = payload.modal
  },
  closeModal (state) {
    state.modal = null
  },
  toggleAvailableViews (state, payload) {
    state.view.available[payload.view] = !state.view.available[payload.view]
  },
  toggleAvailableSettings (state, payload) {
    state.settings[payload.setting] = !state.settings[payload.setting]
  },
  setAvailableViews (state, payload) {
    Object.assign(state.view.available, payload)
  },
  setAvailableSettings (state, payload) {
    Object.assign(state.settings, payload)
  }
}

export default {
  state,
  getters,
  mutations
}
