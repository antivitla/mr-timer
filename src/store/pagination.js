function monthStartDate () {
  const d = new Date()
  return new Date(`${d.getFullYear()}-${d.getMonth() + 1}-01T00:00:00`)
}

function cleanDate (date) {
  const d = new Date(date)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return d
}

export const defaultLimit = {
  storage: 20,
  days: 7,
  months: 1,
  years: 1,
  tasks: 3
}

const state = {
  pagination: {
    storage: {
      count: 0,
      limit: defaultLimit.storage,
      offset: 0
    },
    days: {
      count: 0,
      limit: defaultLimit.days,
      offset: 0,
      next: null,
      previous: null
    },
    months: {
      count: 0,
      limit: defaultLimit.months,
      offset: 0,
      next: null,
      previous: null
    },
    years: {
      count: 0,
      limit: defaultLimit.years,
      offset: 0,
      next: null,
      previous: null
    },
    tasks: {
      count: 0,
      limit: defaultLimit.tasks,
      offset: 0,
      next: null,
      previous: null
    }
  },
  options: {
    storage: { limit: [20, 50, 100] },
    days: { limit: [3, 7, 10] },
    months: { limit: [1, 3, 6] },
    years: { limit: [1, 2, 3] },
    tasks: { limit: [1, 3, 10] }
  },
  interval: {
    start: monthStartDate(),
    stop: null
  }
}

const getters = {
  pagination: state => state.pagination,
  paginationOptions: state => state.options,
  intervalStart: state => state.interval.start,
  intervalStop: state => state.interval.stop
}

const mutations = {
  setPagination (state, payload) {
    state.pagination[payload.group] = Object.assign({}, payload)
    delete state.pagination[payload.group].group
  },
  updatePagination (state, payload) {
    Object.assign(state.pagination[payload.group], payload)
    delete state.pagination[payload.group].group
  },
  clearPagination (state) {
    Object.keys(state.options).forEach(key => {
      state.pagination[key] = Object.assign({}, state.pagination[key], {
        offset: 0,
        count: 0,
        next: null,
        previous: null
      })
    })
  },
  setIntervalStart (state, payload) {
    state.interval.start = payload.start ? cleanDate(payload.start) : null
  },
  setIntervalStop (state, payload) {
    state.interval.stop = payload.stop ? cleanDate(payload.stop) : null
  }
}

export default {
  state,
  getters,
  mutations
}
