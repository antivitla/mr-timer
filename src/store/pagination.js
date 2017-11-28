const state = {
  pagination: {
    storage: {
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
  },
  options: {
    storage: { limit: [20, 50, 100] },
    days: { limit: [3, 7, 10] },
    months: { limit: [1, 3, 6] },
    years: { limit: [1, 2, 3] },
    tasks: { limit: [1, 3, 10] }
  }
}

const getters = {
  pagination: state => state.pagination,
  paginationOptions: state => state.options
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
  }
}

export default {
  state,
  getters,
  mutations
}
