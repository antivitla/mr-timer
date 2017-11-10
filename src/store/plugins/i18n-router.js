import router from '@/router'

export function i18nRouterPlugin (store) {
  const actions = {
    activateLocale (mutation) {
      const name = router.currentRoute.name
      const query = Object.assign({}, router.currentRoute.query, {
        locale: mutation.payload.locale
      })
      router.push({ name, query })
    },
    activateCurrency (mutation) {
      const name = router.currentRoute.name
      const query = Object.assign({}, router.currentRoute.query, {
        currency: mutation.payload.currency
      })
      router.push({ name, query })
    }
  }
  return store.subscribeAction(mutation => {
    actions[mutation.type] && actions[mutation.type](mutation)
  })
}
