import Entry from '@/models/entry'

let timerTimeout

function tick (context) {
  context.commit('tickTimer')
  timerTimeout = setTimeout(() => {
    tick(context)
  }, context.state.delay)
}

const state = {
  active: false,
  entry: new Entry(),
  delay: 1000
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
      details: state.entry.details.slice(0),
      id: state.entry.id // чтоб очистка контекста тоже зацепила
    })
    state.active = false
  },
  tickTimer (state, payload) {
    state.entry.stop = (new Date()).getTime()
  },
  setTimerEntry (state, payload) {
    state.entry = payload.entry
  },
  setTimerStart (state, payload) {
    state.entry.start = payload.start
  }
}

export const actions = {
  startTimer (context, payload) {
    const entry = new Entry(Object.assign({}, payload.entry, { id: 'new' }))
    context.commit('startTimer', { entry })
    tick(context)
    return context
      .dispatch('postEntries', { entries: [entry] })
      .then(entries => {
        context.commit('setTimerEntry', { entry: entries[0] })
        return context.getters.timerEntry
      })
  },
  stopTimer (context) {
    context.commit('stopTimer')
    clearTimeout(timerTimeout)
    return context.getters.timerEntry
  },
  startTimerAndGetEntries (context, payload) {
    const entry = payload.entry
    return context
      .dispatch('startTimer', { entry })
      .then(() => context.dispatch('getEntries'))
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
