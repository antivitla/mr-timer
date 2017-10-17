import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import storage from './storage'
import context from './context'
import user from './user'
import i18n from './i18n'
import timer from './timer'
import ui from './ui'
import edit from './edit'
import money from './money'
import selection from './selection'
import auth from './auth'
import { DaysPlugin } from './groups/days'
import { MonthsPlugin } from './groups/months'
import { YearsPlugin } from './groups/years'
import { TasksPlugin } from './groups/tasks'
import { appName } from './app-info'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    storage,
    context,
    user,
    i18n,
    timer,
    ui,
    edit,
    money,
    selection,
    auth
  },
  plugins: [
    DaysPlugin,
    MonthsPlugin,
    TasksPlugin,
    YearsPlugin,
    createPersistedState({
      key: appName + '-store',
      paths: [
        'user',
        'i18n',
        'ui',
        'money',
        'auth'
      ]
    })
  ]
})
