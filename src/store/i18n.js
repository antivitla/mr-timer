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
    help: 'помощь',
    report: 'отчёт',
    timer: 'таймер'
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
  getReport: 'сформировать отчёт используя текущий вид',
  report: {
    total: 'всего',
    reportOnFor: '«%0»',
    commonReport: 'отчёт по всем задачам',
    headerDaysTasks: 'сводка по дням и задачам',
    headerTasks: 'сводка по задачам',
    headerDays: 'сводка по дням',
    headerDetailedDaysTasks: 'подробная сводка по дням и задачам',
    headerDetailedTasks: 'подробная сводка по задачам',
    discoTitle: 'отчёт-Дискотека',
    withColumnWidth: 'с шириной колонки',
    allTime: 'за всё время',
    from: 'с',
    until: 'до',
    format: {
      markdown: 'Markdown (.md)',
      plaintext: 'Plain Text (.txt)',
      spreadsheet: 'Spreadsheet (.xlsx)',
      document: 'Document (.odt)',
      html: 'HTML (.html)',
      pdf: 'PDF (.pdf)',
      csv: 'CSV (.csv)'
    },
    formatLabel: 'выбрать формат',
    structureLabel: 'структура',
    addSectionLabel: 'добавить раздел',
    previewLabel: 'предпросмотр',
    downloadLabel: 'скачать отчёт в формате',
    resultLabel: 'Показывать',
    sortBy: 'Сортировать',
    placeholderText: 'введите текст заметки',
    section: {
      header: 'заголовок',
      total: 'итого',
      text: 'произвольный текст',
      period: 'период',
      summary: 'сводка',
      summaryDays: 'сводка по дням',
      summaryTasks: 'сводка по задачам',
      summaryDetailedTasks: 'подробная сводка по задачам',
      summaryDaysTasks: 'сводка по дням и задачам',
      summaryDetailedDaysTasks: 'подробная сводка по дням и задачам'
    },
    summary: {
      days: 'по дням',
      tasks: 'по задачам',
      daysTasks: 'по дням и задачам'
    },
    nest: '{nest, plural, =0{плоская} one{с деревом} few{с глубоким деревом} other{с деревом глубиной #}}',
    depth: {
      label: '{depth, plural, =0{не учитывая подзадач} one{учитывая подзадачи} few{учитывая # уровня подзадач} other{учитывая # уровней подзадач}}',
      infinite: 'учитывая все уровни подзадач'
    },
    emptyStructure: 'создайте разделы кликом по кнопкам ниже или перетаскиванием их сюда',
    togglePreviewLabel: 'вкл/выкл предпросмотр',
    nothingToPreview: 'нет предпросмотра',
    totalMoney: 'всего денег',
    totalTime: 'времени',
    moneyPerHour: 'денег в час',
    nothingToReport: 'нет записей'
  },
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
    numberStorage: '{storage, plural, =0{# записей} one{# запись} few{# записи} other{# записей}}',
    numberDays: '{days, plural, =0{# дней} one{# день} few{# дня} other{# дней}}',
    numberMonths: '{months, plural, =0{# месяцев} one{# месяц} few{# месяца} other{# месяцев}}',
    numberYears: '{years, plural, =0{# лет} one{# год} few{# года} other{# лет}}',
    numberTasks: '{tasks, plural, =0{# задач} one{# задачу} few{# задачи} other{# задач}}',
    latest: '{gender, select, male{последний} female{последняя} other{последние}}',
    earliest: '{gender, select, male{первый} female{первая} other{первые}}',
    beginningOfTime: 'начало времён',
    now: 'сейчас'
  },
  settings: {
    profile: 'профиль',
    authorization: 'войти через',
    l10n: 'язык и валюта',
    exportImport: 'экспорт и импорт',
    restoreAppState: 'восстановить приложение',
    reports: 'отчёты',
    migration: 'перенести данные',
    settings: 'включить элементы интерфейса',
    displayOptions: 'внешний вид',
    positionOnScreen: 'расположение',
    paginationType: 'страницы',
    setPaginationStandard: 'обычные',
    setPaginationInterval: 'интервал',
    setFullWidth: 'на всю ширину',
    setCenterView: 'в центре',
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
    newsUpdate: 'новости обновлений',
    doNotShowUntilNextUpdate: 'не показывать до следующего обновления',
    lastUpdate: 'последнее обновление',
    currentView: 'текущий вид',
    warningContext: 'ВНИМАНИЕ! Импортируемые записи попадут внутрь текущего контекста',
    restoreApp: {
      title: 'Восстановление приложения',
      description: 'В любой непонятной ситуации — вырви шнур, выдави стекло и нажми эту кнопку. Потом не забудь перезагрузить страницу.',
      action: 'Очистить приложение',
      comment: 'Восстановить состояние приложения по умолчанию. Задачи останутся.'
    },
    report: {
      title: 'отчёты',
      showModal: 'показывать настройки перед загрузкой',
      showModalLong: 'показывать окно в следующий раз (изменить в настройках меню)',
      download: 'скачать отчёт',
      durationOnly: 'только время',
      costOnly: 'только стоимость',
      durationAndCost: 'время и стоимость',
      sortByDuration: 'сначала длительные',
      sortByDate: 'сначала недавние',
      perHour: 'цену в час',
      period: 'период'
    },
    confirmDeletePhrase: 'УДАЛИТЬ АККАУНТ И ДАННЫЕ',
    confirmDeleteLabel: 'Чтоб удалить свой аккаунт и все свои данные введите «УДАЛИТЬ АККАУНТ И ДАННЫЕ»',
    help: {
      openHelp: 'помощь'
    }
  },
  sidebar: {
    icons: 'иконки',
    from: 'от',
    girls: 'девчушки',
    turnOn: 'включить',
    numberOfEntries: '{entries, plural, =0{0 записей} one{1 запись} few{# записи} other{# записей}}',
    toggleViews: 'виды',
    toggleUiSettings: 'настройки'
  },
  profile: {
    firstName: 'безымянный',
    lastName: 'фрилансер',
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
  },
  modal: {
    news: {
      title: 'Новости обновлений'
    }
  }
})

const en = ({
  view: {
    storage: 'history',
    tasks: 'tasks',
    months: 'months',
    days: 'days',
    years: 'years',
    help: 'help',
    report: 'report',
    timer: 'timer'
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
  getReport: 'create report from current view',
  report: {
    total: 'total',
    reportOnFor: '"%0"',
    commonReport: 'report on all tasks',
    headerDaysTasks: 'days and tasks summary',
    headerTasks: 'tasks summary',
    headerDays: 'days summary',
    headerDetailedDaysTasks: 'detailed days and tasks summary',
    headerDetailedTasks: 'detailed tasks summary',
    discoTitle: 'report-Porn',
    withColumnWidth: 'with column width',
    from: 'from',
    until: 'until',
    allTime: 'all time',
    format: {
      markdown: 'Markdown (.md)',
      plaintext: 'Plain Text (.txt)',
      spreadsheet: 'Spreadsheet (.xlsx)',
      document: 'Document (.odt)',
      html: 'HTML (.html)',
      pdf: 'PDF (.pdf)',
      csv: 'CSV (.csv)'
    },
    formatLabel: 'choose format',
    structureLabel: 'structure',
    addSectionLabel: 'add section',
    downloadLabel: 'download report as',
    previewLabel: 'preview',
    resultLabel: 'show',
    sortBy: 'sort',
    placeholderText: 'write your comments here',
    section: {
      header: 'header',
      total: 'total',
      text: 'comment',
      period: 'period',
      summary: 'summary',
      summaryDays: 'days summary',
      summaryTasks: 'tasks summary',
      summaryDetailedTasks: 'detailed tasks summary',
      summaryDaysTasks: 'days and tasks summary',
      summaryDetailedDaysTasks: 'detailed days and tasks summary'
    },
    summary: {
      days: 'by days',
      tasks: 'by tasks',
      daysTasks: 'by days and tasks'
    },
    nest: '{nest, plural, =0{flat} one{with tree} other{with deep tree}}',
    depth: {
      label: '{depth, plural, =0{without subtasks} one{collect # subtask level} other{collect # subtask levels}}',
      infinite: 'collect all subtasks'
    },
    emptyStructure: 'create sections by clicking buttons below or dragging\'em here',
    togglePreviewLabel: 'toggle report preview',
    nothingToPreview: 'no preview',
    totalMoney: 'total money',
    totalTime: 'time',
    moneyPerHour: 'money per hour',
    nothingToReport: 'no entries'
  },
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
    numberStorage: '{storage, plural, =0{# entries} one{# entry} other{# entries}}',
    numberDays: '{days, plural, =0{# days} one{# day} other{# days}}',
    numberMonths: '{months, plural, =0{# months} one{# month} other{# months}}',
    numberYears: '{years, plural, =0{# years} one{# year} other{# years}}',
    numberTasks: '{tasks, plural, =0{# tasks} one{# task} other{# tasks}}',
    latest: '{gender, select, male{latest} female{latest} other{latest}}',
    earliest: '{gender, select, male{earliest} female{earliest} other{earliest}}',
    beginningOfTime: 'the begin',
    now: 'now'
  },
  settings: {
    profile: 'profile',
    authorization: 'login with',
    l10n: 'Language and Currency',
    migration: 'migrate data',
    exportImport: 'Export and Import',
    restoreAppState: 'restore application',
    reports: 'reports',
    settings: 'toggle UI elements',
    displayOptions: 'display options',
    positionOnScreen: 'align',
    paginationType: 'pagination',
    setPaginationStandard: 'standard',
    setPaginationInterval: 'date range',
    setFullWidth: 'full width',
    setCenterView: 'center',
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
    newsUpdate: 'news about updates',
    doNotShowUntilNextUpdate: 'do not show until next update',
    lastUpdate: 'last update',
    currentView: 'current view',
    warningContext: 'WARNING! All imported items will gain current context',
    restoreApp: {
      title: 'Restore application',
      description: 'When in trouble — push the Red Button to restore default application state. Do not forget to reload page afterwards.',
      action: 'Clean settings',
      comment: 'Restore default application state. Tasks will remain intact.'
    },
    report: {
      title: 'reports',
      showModal: 'show report settings before download',
      showModalLong: 'show modal next time (change in settings menu)',
      download: 'download report',
      durationOnly: 'time only',
      costOnly: 'cost only',
      durationAndCost: 'time and cost',
      sortByDuration: 'long duration first',
      sortByDate: 'recent first',
      perHour: 'price per hour',
      period: 'period'
    },
    confirmDeletePhrase: 'DELETE ACCOUNT AND DATA',
    confirmDeleteLabel: 'To delete your account and all your data enter "DELETE ACCOUNT AND DATA"',
    help: {
      openHelp: 'help'
    }
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
    firstName: 'Unknown',
    lastName: 'Freelancer',
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
  },
  modal: {
    news: {
      title: 'New updates'
    }
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
  },
  currencySymbol: state => currencies[state.currency].symbol
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
