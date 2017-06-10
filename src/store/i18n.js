export const languages = ({
  ru: {
    code: 'ru',
    label: 'русский'
  },
  en: {
    code: 'en',
    label: 'english'
  }
})

export const currencies = ({
  rub: {
    code: 'rub',
    symbol: '₽',
    isBefore: false
  },
  usd: {
    code: 'usd',
    symbol: '$',
    isBefore: true
  },
  eur: {
    code: 'eur',
    symbol: '€',
    isBefore: true
  },
  chy: {
    code: 'cny',
    symbol: '¥',
    isBefore: false
  }
})

const ru = ({
  view: {
    storage: 'хранилище',
    tasks: 'задачи',
    months: 'месяцы',
    days: 'дни',
    years: 'годы'
  }
})

const en = ({
  view: {
    storage: 'storage',
    tasks: 'tasks',
    months: 'months',
    days: 'days',
    years: 'years'
  }
})

export const translate = ({
  ru,
  en
})

const state = {
  language: 'ru',
  currency: 'rub',
  languages,
  currencies
}

const getters = {
  locale (state) {
    return state.language
  }
}

const mutations = {
  setLocale (state, payload) {
    console.log(payload)
    state.language = payload.locale
  }
}

export default {
  state,
  getters,
  mutations
}
