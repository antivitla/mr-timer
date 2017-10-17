import Vue from 'vue'
import Router from 'vue-router'
import App from './App'

Vue.use(Router)

function isDev () {
  return Boolean(window.location.host.match(/local\./))
}

export default new Router({
  mode: 'history',
  base: (isDev() ? '/' : '/titamota/'),
  routes: [
    {
      path: '/:provider(facebook|github|google|vk|yandex)-auth-redirect',
      name: 'providerAuthRedirect',
      component: App
    },
    // {
    //   path: '/:user',
    //   name: 'petrov',
    //   component: App
    // },
    {
      path: '/',
      name: 'home',
      component: App
    }
  ]
})
