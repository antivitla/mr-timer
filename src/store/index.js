import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import storage from './storage'
import user from './user'
import i18n from './i18n'
import timer from './timer'
import ui from './ui'
import edit from './edit'
import money from './money'
import selection from './selection'
import { DaysPlugin } from './groups/days'
import { MonthsPlugin } from './groups/months'
import { TasksPlugin } from './groups/tasks'
import appName from './app-name'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    storage,
    user,
    i18n,
    timer,
    ui,
    edit,
    money,
    selection
  },
  plugins: [
    DaysPlugin,
    MonthsPlugin,
    TasksPlugin,
    createPersistedState({
      key: appName + '-store',
      paths: [
        'user',
        'i18n',
        'ui',
        'money'
      ]
    })
  ]
})
