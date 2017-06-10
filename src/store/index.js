import Vue from 'vue'
import Vuex from 'vuex'
import storage from './storage'
import user from './user'
import i18n from './i18n'
import { DayPlugin, DayGroupStore } from './day'
import { MonthPlugin, MonthGroupStore } from './month'
import { TaskPlugin, TaskGroupStore } from './task'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  modules: {
    storage,
    user,
    i18n,
    DayGroupStore,
    MonthGroupStore,
    TaskGroupStore
  },
  plugins: [DayPlugin, MonthPlugin, TaskPlugin]
})
