import axios from 'axios'
import { currencies } from './i18n'

const state = {
  price: {
    rub: null,
    usd: null,
    eur: null,
    cny: null
  },
  rates: {
    rub: 1,
    usd: 0.017,
    eur: 0.015,
    cny: 0.119
  }
}

const getters = {
  price (state, getters) {
    return state.price[getters.currency]
  },
  rate (state, getters) {
    return state.rates[getters.currency]
  }
}

const mutations = {
  setPrice (state, payload) {
    const updatedPrice = payload.price
    const currency = payload.currency
    // set price of current currency
    state.price[currency] = updatedPrice
    // recalc price for other currencies
    Object.keys(state.price).forEach(code => {
      if (code !== currency) {
        let price
        if (currency === 'rub') {
          price = updatedPrice * state.rates[code]
        } else {
          price = updatedPrice *
            state.rates[code] /
            state.rates[currency]
        }
        price = Math.ceil(price)
        state.price[code] = price || 1
      }
    })
  },
  setRates (state, payload) {
    state.rates = payload.rates
  },
  clearPrice (state) {
    Object.keys(state.price).forEach(code => {
      state.price[code] = null
    })
  }
}

const actions = {
  loadRates (context) {
    // ajax fixer.io and set rates
    const symbols = Object
      .keys(currencies)
      .join(',')
      .toUpperCase()
    axios
      .get(location.protocol + '//api.fixer.io/latest?base=RUB&symbols=' + symbols)
      .then(result => {
        const rates = {}
        Object.keys(result.data.rates)
          .forEach(code => {
            rates[code.toLowerCase()] = result.data.rates[code]
          })
        rates.rub = 1
        context.commit('setRates', { rates })
      })
  },
  setPrice (context, payload) {
    const currency = context.getters.currency
    const price = parseInt(payload.price, 10)
    if (!price) {
      context.commit('clearPrice')
    } else {
      context.commit('setPrice', { currency, price })
    }
  },
  clearPrice ({ commit }) {
    commit('clearPrice')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
