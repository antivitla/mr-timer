/*

PETROV backend: key, guestKey, mode
MITABA backend: avatar, email, firstName, etc.
COMMON: type (local|remote)

*/

export const userTypes = {
  LOCAL: 'LOCAL',
  REMOTE: 'REMOTE'
}

const state = {
  key: 'local',
  guestKey: '',
  mode: '',
  type: userTypes.LOCAL,
  avatar: 'static/img/040-ladybug.svg',
  email: '',
  firstName: '',
  lastName: '',
  providers: []
}

const getters = {
  userKey: state => state.key,
  userGuestKey: state => state.guestKey,
  userName: state => `${state.firstName} ${state.lastName}`,
  userMode: state => state.mode,
  userType: state => state.type,
  userAvatar: state => state.avatar,
  userProfile (state) {
    const fields = [
      'avatar',
      'email',
      'firstName',
      'lastName',
      'providers'
    ]
    const profile = {}
    fields.forEach(f => {
      profile[f] = state[f]
    })
    return profile
  }
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
  setUserType (state, payload) {
    state.type = payload.type
  },
  setUserAvatar (state, payload) {
    state.avatar = payload.avatar
  },
  setUserProfile (state, payload) {
    const fields = [
      'avatar',
      'email',
      'firstName',
      'lastName',
      'providers'
    ]
    fields.forEach(f => {
      if (payload[f]) {
        state[f] = payload[f]
      }
    })
  },
  clearUser (state) {
    state.key = ''
    state.guestKey = ''
    state.mode = ''
    state.type = userTypes.LOCAL
    state.avatar = 'static/img/040-ladybug.svg'
    state.email = ''
    state.firstName = ''
    state.lastName = ''
    state.providers = []
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}
