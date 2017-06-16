import Entry from '@/models/entry'

let timerTimeout
const saveDelay = 60000
let lastSaveTime = new Date().getTime()

function tick (context) {
  context.commit('tickTimer')
  if (new Date().getTime() - lastSaveTime > saveDelay) {
    context.dispatch('saveEntries')
    lastSaveTime = new Date().getTime()
  }
  timerTimeout = setTimeout(() => {
    tick(context)
  }, context.state.delay)
}

const state = {
  active: false,
  entry: new Entry(),
  delay: 400
}

export const getters = {
  timerStart: state => state.entry.start,
  timerStop: state => state.entry.stop,
  timerDuration: state => state.entry.stop - state.entry.start,
  timerActive: state => state.active,
  timerDelay: state => state.delay,
  timerEntry: state => state.entry
}

export const mutations = {
  startTimer (state, payload) {
    state.entry = payload.entry
    state.active = true
  },
  stopTimer (state, payload) {
    state.entry = new Entry({
      start: state.entry.start,
      stop: state.entry.stop,
      details: state.entry.details.slice(0)
    })
    state.active = false
  },
  tickTimer (state, payload) {
    state.entry.stop = (new Date()).getTime()
  },
  setTimerEntry (state, payload) {
    state.entry = payload.entry
  }
}

export const actions = {
  startTimer (context, payload) {
    context.commit('startTimer', payload)
    tick(context)
  },
  stopTimer (context) {
    context.commit('stopTimer')
    clearTimeout(timerTimeout)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
