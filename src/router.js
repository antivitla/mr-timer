import Vue from 'vue'
import Router from 'vue-router'
import App from './App'

Vue.use(Router)

export default new Router({
  mode: 'history',
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
