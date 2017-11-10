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
    const limit = payload.limit
    if (context.getters.currentViewPagination.limit === limit) {
      return
    }
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
    if (context.getters.currentViewPagination.offset === offset) {
      return
    }
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
  getters,
  actions
}
