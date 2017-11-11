import capitalize from '@/utils/capitalize'
import bus from '@/event-bus'

export const taskDelimiter = ' / '

const state = {
  views: {
    help: true,
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
  taskDelimiter: state => state.taskDelimiter,
  currentViewPagination (state, getters) {
    let getter = `pagination${capitalize(state.currentView)}`
    if (state.currentView === 'storage') {
      getter = 'paginationEntries'
    }
    return getters[getter]
  },
  currentViewParams (state, getters) {
    const params = {
      limit: getters.currentViewPagination.limit,
      offset: getters.currentViewPagination.offset
    }
    if (getters.currentView === 'storage') {
      params.filter = getters.filter.slice(0)
    } else {
      params.last = getters.currentView
    }
    return params
  }
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

const actions = {
  changeCurrentViewLimit (context, payload) {
    const limit = payload.limit
    const view = context.getters.currentView
    let setPagination = `set${capitalize(view)}Pagination`
    if (view === 'storage') {
      setPagination = 'setEntriesPagination'
    }
    context.commit(setPagination, { limit })
    context.dispatch('getEntries')
    bus.$emit('scroll-top')
  },
  changeCurrentViewOffset (context, payload) {
    const offset = payload.offset
    const view = context.getters.currentView
    let setPagination = `set${capitalize(view)}Pagination`
    if (view === 'storage') {
      setPagination = 'setEntriesPagination'
    }
    context.commit(setPagination, { offset })
    context.dispatch('getEntries')
    bus.$emit('scroll-top')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
