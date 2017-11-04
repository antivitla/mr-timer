import moment from 'moment'

export const locales = ({
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
    years: 'годы',
    help: 'помощь'
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
  },
  entries: {
    zero: 'записей',
    one: 'запись',
    few: 'записи',
    many: 'записей'
  },
  selected: 'выбрано',
  delete: 'удалить',
  or: 'или',
  and: 'и',
  cancel: 'отменить',
  filter: 'фильтр',
  filterPlaceholder: 'разделяй через « / »',
  noResultsLabel: 'записей не найдено',
  noTasksLabel: 'задач не найдено',
  filterByThisLabel: 'найти все записи в истории',
  clearContext: 'очистить контекст',
  upContext: 'выше контекст',
  standby: 'подождите немного',
  externalLink: 'перейти к',
  weekend: 'выходной',
  pagination: {
    later: 'позже',
    earlier: 'раньше',
    all: 'все',
    show: 'показывать',
    or: 'или',
    outOf: 'из',
    rangeEntries: 'записи с %0 по %1',
    rangeDays: '%0—%1',
    rangeMonths: '%0—%1',
    rangeYears: '%0—%1',
    numberEntries: '{entries, plural, =0{нет записей} one{# запись} few{# записи} other{# записей}}',
    numberDays: '{days, plural, =0{0 дней} one{1 день} few{# дня} other{# дней}}',
    numberMonths: '{months, plural, =0{0 месяцев} one{1 месяц} few{# месяца} other{# месяцев}}',
    numberYears: '{years, plural, =0{0 лет} one{1 год} few{# года} other{# лет}}'
  },
  settings: {
    profile: 'профиль',
    authorization: 'войти через',
    l10n: 'язык и валюта',
    exportImport: 'экспорт и импорт',
    migration: 'перенести данные',
    settings: 'включить элементы интерфейса'
  },
  sidebar: {
    icons: 'иконки',
    from: 'от',
    girls: 'девчушки',
    turnOn: 'включить',
    numberOfEntries: '{entries, plural, =0{0 записей} one{1 запись} few{# записи} other{# записей}}',
    toggleViews: 'страницы',
    toggleUiSettings: 'настройки'
  },
  profile: {
    localAccount: 'локальный аккаунт'
  },
  currency: {
    rub: 'рубль',
    usd: 'доллар',
    eur: 'евро',
    cny: 'юань'
  },
  import: 'импорт',
  importFrom: 'импорт записей из',
  export: 'экспорт',
  exportTo: 'экспорт записей в',
  startTask: 'начать задачу',
  startEdit: 'редактировать',
  setContext: 'сделать контекстом',
  logout: 'выйти',
  login: 'войти',
  tip: {
    'toggle-sidebar-top': 'открыть меню',
    'toggle-sidebar-in-sidebar': 'закрыть меню',
    'user-profile-logout': 'Выйти из своего аккаунта'
  }
})

const en = ({
  view: {
    storage: 'history',
    tasks: 'tasks',
    months: 'months',
    days: 'days',
    years: 'years',
    help: 'help'
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
  },
  entries: {
    zero: 'entries',
    one: 'entry',
    few: 'entries',
    many: 'entries'
  },
  selected: 'selected',
  delete: 'delete',
  or: 'or',
  and: 'and',
  cancel: 'cancel',
  filter: 'filter',
  filterPlaceholder: 'separate by " / "',
  noResultsLabel: 'no time records found',
  noTasksLabel: 'tasks not found',
  filterByThisLabel: 'find all entries in history',
  clearContext: 'clear context',
  upContext: 'up context',
  standby: 'please stand by',
  externalLink: 'go to',
  weekend: 'weekend',
  pagination: {
    later: 'later',
    earlier: 'earlier',
    all: 'all',
    show: 'show',
    or: 'or',
    outOf: 'out of',
    from: 'from',
    to: 'to',
    entries: 'entries',
    rangeEntries: 'entries from %0 to %1',
    rangeDays: '%0—%1',
    rangeMonths: '%0—%1',
    rangeYears: '%0—%1',
    numberEntries: '{entries, plural, =0{no entries} one{# entry} other{# entries}}',
    numberDays: '{days, plural, =0{no days} one{# day} other{# days}}',
    numberMonths: '{months, plural, =0{no months} one{# month} other{# months}}',
    numberYears: '{years, plural, =0{no years} one{# year} other{# years}}'
  },
  settings: {
    profile: 'profile',
    authorization: 'login with',
    l10n: 'Language and Currency',
    migration: 'migrate data',
    exportImport: 'Export and Import',
    settings: 'toggle UI elements'
  },
  sidebar: {
    icons: 'icons',
    from: 'from',
    girls: 'girls',
    turnOn: 'turn on',
    numberOfEntries: '{entries, plural, =0{0 entries} one{1 entry} other{# entries}}',
    toggleViews: 'toggle views',
    toggleUiSettings: 'toggle UI settings'
  },
  profile: {
    localAccount: 'local account'
  },
  currency: {
    rub: 'ruble',
    usd: 'dollar',
    eur: 'euro',
    cny: 'yuan'
  },
  import: 'import',
  importFrom: 'import entries from',
  export: 'export',
  exportTo: 'export entries to',
  startTask: 'start task',
  startEdit: 'edit',
  setContext: 'set as context',
  logout: 'logout',
  login: 'login',
  tip: {
    'toggle-sidebar-top': 'open menu',
    'toggle-sidebar-in-sidebar': 'close menu',
    'user-profile-logout': 'logout your account'
  }
})

export const translate = ({
  ru,
  en
})

const state = {
  locale: 'ru',
  currency: 'rub'
}

const getters = {
  locale: state => state.locale,
  currency: state => state.currency,
  isCurrencySymbolBefore: state => {
    return currencies[state.currency].isBefore
  }
}

const mutations = {
  setLocale (state, payload) {
    state.locale = payload.locale
  },
  setCurrency (state, payload) {
    state.currency = payload.currency
  }
}

const actions = {
  activateLocale (context, payload) {
    context.commit('setLocale', payload)
    moment.locale(payload.locale)
    context.commit('closeSidebar')
  },
  activateCurrency (context, payload) {
    context.commit('setCurrency', payload)
    context.commit('closeSidebar')
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
