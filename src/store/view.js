import capitalize from '@/utils/capitalize'
import bus from '@/event-bus'

const getters = {
  currentViewPagination (state, getters) {
    let getter = `pagination${capitalize(getters.currentView)}`
    if (getters.currentView === 'storage') {
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

const actions = {
  changeCurrentViewLimit (context, payload) {
    const view = context.getters.currentView
    const limit = payload.limit
    let setPagination = `set${capitalize(view)}Pagination`
    if (view === 'storage') {
      setPagination = 'setEntriesPagination'
    }
    context.commit(setPagination, { limit })
    context.dispatch('getEntries', { params: context.getters.currentViewParams })
    bus.$emit('scroll-top')
  },
  changeCurrentViewOffset (context, payload) {
    const view = context.getters.currentView
    const offset = payload.offset
    let setPagination = `set${capitalize(view)}Pagination`
    if (view === 'storage') {
      setPagination = 'setEntriesPagination'
    }
    context.commit(setPagination, { offset })
    context.dispatch('getEntries', { params: context.getters.currentViewParams })
    bus.$emit('scroll-top')
  }
}

export default {
  getters,
  actions
}
