export const taskDelimiter = ' / '

const state = {
  views: {
    tasks: true,
    years: true,
    months: true,
    days: true,
    storage: true
  },
  currentView: 'tasks',
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
  currentView: state => state.currentView,
  views: state => state.views,
  availableViewsAsOptions: state => {
    return Object
      .keys(state.views)
      .filter(view => state.views[view])
      .map(view => ({ value: view, label: `view.${view}` }))
  },
  settings: state => state.settings,
  sidebarActive: state => state.sidebar,
  modalActive: state => state.modal,
  taskDelimiter: state => state.taskDelimiter
}

const mutations = {
  setCurrentView (state, payload) {
    state.currentView = payload.view
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
    state.views[payload.view] = !state.views[payload.view]
  },
  toggleAvailableSettings (state, payload) {
    state.settings[payload.setting] = !state.settings[payload.setting]
  },
  setAvailableViews (state, payload) {
    Object.assign(state.views, payload)
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
