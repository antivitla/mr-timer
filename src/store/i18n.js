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
  filterByThis: 'найти все записи в истории',
  standby: 'подождите немного',
  externalLink: 'перейти к',
  weekend: 'выходной',
  context: {
    clear: 'убрать  контекст',
    task: 'текущая задача',
    setAsCurrentTask: 'сделать текущей задачей'
  },
  pagination: {
    later: 'позже',
    earlier: 'раньше',
    all: 'все',
    show: 'показывать',
    or: 'или',
    outOf: 'из',
    rangeStorage: 'записи с %0 по %1',
    rangeDays: '%0—%1',
    rangeMonths: '%0—%1',
    rangeYears: '%0—%1',
    rangeTasks: '%0 — %1',
    numberStorage: '{storage, plural, =0{нет записей} one{# запись} few{# записи} other{# записей}}',
    numberDays: '{days, plural, =0{0 дней} one{1 день} few{# дня} other{# дней}}',
    numberMonths: '{months, plural, =0{0 месяцев} one{1 месяц} few{# месяца} other{# месяцев}}',
    numberYears: '{years, plural, =0{0 лет} one{1 год} few{# года} other{# лет}}',
    numberTasks: '{tasks, plural, =0{0 задач} one{1 задачу} few{# задачи} other{# задач}}',
    latest: '{gender, select, male{последний} female{последняя} other{последние}}',
    earliest: '{gender, select, male{первый} female{первая} other{первые}}'
  },
  settings: {
    profile: 'профиль',
    authorization: 'войти через',
    l10n: 'язык и валюта',
    exportImport: 'экспорт и импорт',
    migration: 'перенести данные',
    settings: 'включить элементы интерфейса',
    export: 'экспорт',
    import: 'импорт',
    doImport: 'импортировать',
    timer30local: 'таймер 3.0, локальный аккаунт',
    timer31local: 'таймер 3.1, локальный аккаунт',
    migrateAccountPlaceholder: 'имя онлайн-аккаунта для импорта',
    emptyAccountTitle: 'не введено имя аккаунта',
    entriesNotFound: 'не найдено записей',
    server: 'сервер',
    json: 'JSON',
    exportPlaceholder: 'здесь будут все ваши записи после загрузки по кнопке ниже',
    importPlaceholder: 'скопируйте сюда ваши записи (например после использования экспорта ранее)',
    loadAllEntries: 'загрузить сюда все записи',
    importEntries: 'импортировать записи',
    currentView: 'текущий вид'
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
  filterByThis: 'find all entries in history',
  standby: 'please stand by',
  externalLink: 'go to',
  weekend: 'weekend',
  context: {
    clear: 'clear current task',
    task: 'current task',
    setAsCurrentTask: 'set as current task'
  },
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
    rangeStorage: 'entries from %0 to %1',
    rangeDays: '%0—%1',
    rangeMonths: '%0—%1',
    rangeYears: '%0—%1',
    rangeTasks: '%0 — %1',
    numberStorage: '{storage, plural, =0{no entries} one{# entry} other{# entries}}',
    numberDays: '{days, plural, =0{no days} one{# day} other{# days}}',
    numberMonths: '{months, plural, =0{no months} one{# month} other{# months}}',
    numberYears: '{years, plural, =0{no years} one{# year} other{# years}}',
    numberTasks: '{tasks, plural, =0{0 tasks} one{1 task} other{# tasks}}',
    latest: '{gender, select, male{latest} female{latest} other{latest}}',
    earliest: '{gender, select, male{earliest} female{earliest} other{earliest}}'
  },
  settings: {
    profile: 'profile',
    authorization: 'login with',
    l10n: 'Language and Currency',
    migration: 'migrate data',
    exportImport: 'Export and Import',
    settings: 'toggle UI elements',
    export: 'export',
    import: 'import',
    doImport: 'import',
    timer30local: 'timer 3.0, local account',
    timer31local: 'timer 3.1, local account',
    migrateAccountPlaceholder: 'title of account for import',
    emptyAccountTitle: 'title of account not entered',
    entriesNotFound: 'entries not found',
    server: 'server',
    json: 'JSON',
    exportPlaceholder: 'here will be all your entries after loading by button below',
    importPlaceholder: 'paste here your entries (may be using from previous export)',
    loadAllEntries: 'load all entries here',
    importEntries: 'import entries',
    currentView: 'current view'
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
  },
  activateCurrency (context, payload) {
    context.commit('setCurrency', payload)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
