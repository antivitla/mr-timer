const state = {
  key: 'local',
  guestKey: '',
  mode: '',
  avatar: 'static/img/040-ladybug.svg'
}

const getters = {
  userKey: state => state.key,
  userGuestKey: state => state.guestKey,
  userMode: state => state.mode,
  userAvatar: state => state.avatar
}

const mutations = {
  setUserKey (state, payload) {
    state.key = payload.key
  },
  setUserGuestKey (state, payload) {
    state.guestKey = payload.guestKey
  },
  setUserMode (state, payload) {
    state.mode = payload.mode
  },
  setUserAvatar (state, payload) {
    state.avatar = payload.avatar
  },
  clearUser (state) {
    state.key = ''
    state.guestKey = ''
    state.mode = ''
    state.avatar = 'static/img/040-ladybug.svg'
  }
}

const actions = {
  loadAvatar ({ state, commit, rootState }) {
    // load avatar
    // set avatar
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
