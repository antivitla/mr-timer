import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  render: h => h(App)
})
