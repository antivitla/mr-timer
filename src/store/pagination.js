const state = {
  entries: {
    count: 0,
    limit: 50,
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
  options: {
    entries: { limit: [20, 50, 100] },
    days: { limit: [3, 7, 10] },
    months: { limit: [1, 3, 6] },
    years: { limit: [1, 2, 3] }
  }
}

const getters = {
  paginationEntries: state => state.entries,
  paginationDays: state => state.days,
  paginationMonths: state => state.months,
  paginationYears: state => state.years,
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
  setGroupPagination (state, payload) {
    Object.assign(state[payload.group], payload)
  }
}

export default {
  state,
  getters,
  mutations
}
