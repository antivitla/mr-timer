import bus from '@/event-bus'

export function AuthPlugin (store) {
  const actions = {
    setAuthorized () {
      store.dispatch('getProfile')
      store.dispatch('getEntries')
      store.commit('closeSidebar')
      bus.$emit('scroll-top')
    },
    setNotAuthorized () {
      store.commit('clearUser')
      store.dispatch('getEntries')
      store.commit('closeSidebar')
      bus.$emit('scroll-top')
    }
  }
  return store.subscribe(mutation => {
    actions[mutation.type] && actions[mutation.type]()
  })
}
