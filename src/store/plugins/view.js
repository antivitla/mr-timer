import bus from '@/event-bus'

function isViewWithEntries (view) {
  return ['storage', 'days', 'months', 'years', 'tasks'].indexOf(view) >= 0
}

export function ViewPlugin (store) {
  const actions = {
    setCurrentView (mutation) {
      if (mutation.payload.view !== 'storage') {
        store.commit('clearSelected')
        store.commit('clearFilter')
        store.commit('clearPagination')
      }
      if (isViewWithEntries(mutation.payload.view)) {
        store.dispatch('getEntries')
        bus.$emit('scroll-top')
      }
    },
    setAuthorized () {
      store.commit('setBackend', { backend: 'mitaba' })
      store.commit('clearContext')
      store.commit('clearSelected')
      store.commit('clearFilter')
      store.commit('clearPagination')
    },
    setNotAuthorized () {
      store.commit('setBackend', { backend: 'local' })
      store.commit('clearContext')
      store.commit('clearSelected')
      store.commit('clearFilter')
      store.commit('clearPagination')
    },
    setFilter (mutation) {
      store.dispatch('getEntries', {
        params: {
          limit: store.getters.paginationEntries.limit,
          offset: 0,
          filter: mutation.payload.filter.map(f => f.trim()).filter(f => f)
        }
      })
      bus.$emit('scroll-top')
    }
  }
  return store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation)
  })
}
