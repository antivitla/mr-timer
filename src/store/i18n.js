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
  cny: {
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
  },
  time: {
    at: 'в'
  },
  price: {
    label: 'цена',
    perHour: 'в час'
  },
  duration: {
    hr: {
      zero: 'часов',
      one: 'час',
      few: 'часа',
      many: 'часов'
    },
    min: 'мин',
    sec: 'сек'
  }
})

const en = ({
  view: {
    storage: 'storage',
    tasks: 'tasks',
    months: 'months',
    days: 'days',
    years: 'years'
  },
  time: {
    at: 'at'
  },
  price: {
    label: 'price',
    perHour: 'per hour'
  },
  duration: {
    hr: {
      zero: 'h',
      one: 'h',
      few: 'h',
      many: 'h'
    },
    min: 'min',
    sec: 'sec'
  }
})

export const translate = ({
  ru,
  en
})

const state = {
  language: 'ru',
  currency: 'rub'
}

const getters = {
  locale: state => state.language,
  currency: state => state.currency,
  isCurrencySymbolBefore: state => {
    return currencies[state.currency].isBefore
  }
}

const mutations = {
  setLocale (state, payload) {
    state.language = payload.locale
  },
  setCurrency (state, payload) {
    state.currency = payload.currency
  }
}

export default {
  state,
  getters,
  mutations
}
