const state = {
  currentView: 'tasks',
  recent: {
    tasks: 2,
    months: 2,
    days: 2
  }
}

const getters = {
  currentView: state => state.currentView
}

const mutations = {
  setCurrentView (state, payload) {
    state.currentView = payload.view
  }
}

export default {
  state,
  getters,
  mutations
}
