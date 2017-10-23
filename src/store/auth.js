import Mitaba from '@/backend/mitaba'

export const authSteps = {
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  AUTHORIZED: 'AUTHORIZED',
  WAITING_FOR_REDIRECT: 'WAITING_FOR_REDIRECT',
  WAITING_FOR_MITABA_AUTH: 'WAITING_FOR_MITABA_AUTH'
}

const state = {
  authStep: authSteps.NOT_AUTHORIZED,
  authProvider: null,
  authToken: null
}

const getters = {
  authStep: state => state.authStep,
  authProvider: state => state.authProvider,
  authToken: state => state.authToken,
  isAuthorized: state => state.authStep === authSteps.AUTHORIZED,
  whichProviderWaitingForAuth: state => {
    const waiting = state.authStep === authSteps.WAITING_FOR_MITABA_AUTH
    return waiting && state.authProvider
  }
}

const mutations = {
  waitForProviderAuthRedirect (state, payload) {
    state.authStep = authSteps.WAITING_FOR_REDIRECT
    state.authProvider = payload.provider
  },
  waitForMitabaAuth (state, payload) {
    state.authStep = authSteps.WAITING_FOR_MITABA_AUTH
    state.authProvider = payload.provider
  },
  setAuthorized (state, payload) {
    state.authProvider = null
    state.authStep = authSteps.AUTHORIZED
    state.authToken = payload.authToken
  },
  setNotAuthorized (state, payload) {
    state.authStep = authSteps.NOT_AUTHORIZED
    state.authProvider = null
    state.authToken = null
  }
}

const actions = {
  authorizeWithProvider (context, payload) {
    // set 'waiting for redirect' state
    context.commit('waitForProviderAuthRedirect', payload)
    // redirect to provider auth dialog
    Mitaba.authorizeWithProvider(payload.provider)
  },

  authorizeWithMitaba (context, payload) {
    // set 'waiting auth from mitaba'
    context.commit('waitForMitabaAuth', payload)
    // do authorization with mitaba
    return Mitaba.authorize(payload)
      .then(auth => {
        context.commit('setAuthorized', {
          authToken: auth.token
        })
        return Mitaba.getProfile()
      })
      .then(profile => {
        context.commit('setUserProfile', {
          email: profile.email,
          firstName: profile.first_name,
          lastName: profile.last_name,
          avatar: profile.avatar,
          providers: profile.providers
        })
        return Promise.resolve(profile)
      })
      .catch(error => {
        context.commit('setNotAuthorized')
        return Promise.reject(error)
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
