import { freezeElement, meltElement } from '@/utils/freeze-element'
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
  currentModal: null,
  settings: {
    profile: true,
    authorization: true,
    reports: true,
    displayOptions: true,
    l10n: true,
    migration: false,
    exportImport: false,
    restoreAppState: false
  },
  sidebar: false,
  fullWidth: false,
  taskDelimiter
}

const getters = {
  currentView: state => state.currentView,
  currentModal: state => state.currentModal,
  views: state => state.views,
  availableViewsAsOptions: state => {
    return Object
      .keys(state.views)
      .filter(view => state.views[view])
      .map(view => ({ value: view, label: `view.${view}` }))
  },
  settings: state => state.settings,
  sidebarActive: state => state.sidebar,
  taskDelimiter: state => state.taskDelimiter,
  fullWidth: state => state.fullWidth
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
  openModal (state, payload) {
    state.currentModal = payload.modal
  },
  closeModal (state) {
    state.currentModal = null
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
  },
  setFullWidth (state, payload) {
    state.fullWidth = payload.fullWidth
  }
}

const actions = {
  openModal (context, payload) {
    context.commit('openModal', payload)
    freezeElement(document.body)
  },
  closeModal (context) {
    context.commit('closeModal')
    meltElement(document.body)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
