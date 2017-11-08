const defaultPagination = {
  entries: {
    count: 0,
    limit: 20,
    offset: 0
  },
  days: {
    count: 0,
    limit: 3,
    offset: 0,
    next: null,
    previous: null
  },
  months: {
    count: 0,
    limit: 3,
    offset: 0,
    next: null,
    previous: null
  },
  years: {
    count: 0,
    limit: 1,
    offset: 0,
    next: null,
    previous: null
  },
  tasks: {
    count: 0,
    limit: 3,
    offset: 0,
    next: null,
    previous: null
  }
}

const state = {
  entries: {
    count: 0,
    limit: 20,
    offset: 0
  },
  days: {
    count: 0,
    limit: 3,
    offset: 0,
    next: null,
    previous: null
  },
  months: {
    count: 0,
    limit: 3,
    offset: 0,
    next: null,
    previous: null
  },
  years: {
    count: 0,
    limit: 1,
    offset: 0,
    next: null,
    previous: null
  },
  tasks: {
    count: 0,
    limit: 3,
    offset: 0,
    next: null,
    previous: null
  },
  options: {
    entries: { limit: [20, 50, 100] },
    days: { limit: [3, 7, 10] },
    months: { limit: [1, 3, 6] },
    years: { limit: [1, 2, 3] },
    tasks: { limit: [1, 3, 10] }
  }
}

const getters = {
  paginationEntries: state => state.entries,
  paginationDays: state => state.days,
  paginationMonths: state => state.months,
  paginationYears: state => state.years,
  paginationTasks: state => state.tasks,
  paginationOptions: state => state.options
}

const mutations = {
  setEntriesPagination (state, payload) {
    Object.assign(state.entries, payload)
  },
  setDaysPagination (state, payload) {
    Object.assign(state.days, payload)
  },
  setMonthsPagination (state, payload) {
    Object.assign(state.months, payload)
  },
  setYearsPagination (state, payload) {
    Object.assign(state.years, payload)
  },
  setTasksPagination (state, payload) {
    Object.assign(state.tasks, payload)
  },
  setGroupPagination (state, payload) {
    Object.assign(state[payload.group], payload)
  },
  clearPagination (state) {
    Object.assign(state, JSON.parse(JSON.stringify(defaultPagination)))
  },
  clearPaginationOffset (state) {
    Object.keys(state.options).forEach(key => {
      state[key].offset = 0
    })
  }
}

export default {
  state,
  getters,
  mutations
}
