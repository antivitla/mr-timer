import Vue from 'vue'
import Vuex from 'vuex'
import storage from './storage'
import user from './user'
import i18n from './i18n'
import timer from './timer'
import { DaysPlugin } from './groups/days'
import { MonthsPlugin } from './groups/months'
import { TasksPlugin } from './groups/tasks'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    storage,
    user,
    i18n,
    timer
  },
  plugins: [
    DaysPlugin,
    MonthsPlugin,
    TasksPlugin
  ]
})
