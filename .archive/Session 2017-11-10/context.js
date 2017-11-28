import {
  parentOfDifferentType,
  rootDetails } from '@/utils/group'
import { parseDayFormat } from '@/models/day'
import { parseMonthFormat } from '@/models/month'
import { parseYearFormat } from '@/models/year'
import { Storage } from '@/store/storage'
import bus from '@/event-bus'

/*
context: {
  details: ['zok', 'zak'],
  date: {
    month: 125464123154
  },
  @project: 'Netuleny'
}

*/
export function filterContext ({ entries, context } = {}) {
  // Контекст может быть деталями задачи, датой и/или ещё чем-то
  const contextDetails = context.details && context.details.join()
  const contextDateType = context.date && Object.keys(context.date)[0]
  const contextDateValue = context.date && new Date(context.date[contextDateType])
  const dateInContext = function (target) {
    let valid = false
    if (contextDateType === 'day') {
      valid = contextDateValue.getDate() === target.getDate() &&
        contextDateValue.getMonth() === target.getMonth() &&
        contextDateValue.getFullYear() === target.getFullYear()
    } else if (contextDateType === 'month') {
      valid = contextDateValue.getMonth() === target.getMonth() &&
        contextDateValue.getFullYear() === target.getFullYear()
    } else if (contextDateType === 'year') {
      valid = contextDateValue.getFullYear() === target.getFullYear()
    }
    return valid
  }
  const detailsInContext = function (d) {
    return d.join().indexOf(contextDetails) === 0
  }
  return entries.filter(entry => {
    let valid = true
    if (context.details) {
      valid = valid && detailsInContext(entry.details)
    }
    if (context.date) {
      valid = valid && dateInContext(new Date(entry.start))
    }
    return valid
  })
}

export function extractDateContextFromGroup (group) {
  let context = {}
  const values = {
    day: parseDayFormat,
    month: parseMonthFormat,
    year: parseYearFormat
  }
  const p = group.type.match(/year|month|day/) ? group : parentOfDifferentType(group)
  if (p && p.type.match(/year|month|day/)) {
    context = {
      date: {
        [p.type]: values[p.type](p.name)
      }
    }
  }
  return context
}

export function extractDetailsContextFromGroup (group) {
  let context = {}
  const details = rootDetails(group)
  if (details.length) {
    context = {
      details
    }
  }
  return context
}

export function extractContextFromGroup (group) {
  return Object.assign({},
    extractDateContextFromGroup(group),
    extractDetailsContextFromGroup(group))
}

function parseEmpty (context) {
  let parsed = context
  if (!context) {
    parsed = null
  } else if (!context.date && !(context.details && context.details.length)) {
    parsed = null
  }
  return parsed
}

const state = ({
  contextInfo: null
})

export const getters = ({
  context (state) {
    return state.contextInfo
  },
  contextItemByType (state) {
    return function (type) {
      const contextItemOfType = state.contextInfo.find(item => item.type === type)
      if (contextItemOfType) {
        return contextItemOfType.value
      }
    }
  },
  contextDetails (state) {
    return state.contextInfo && state.contextInfo.details
  },
  contextDate (state) {
    return state.contextInfo && state.contextInfo.date
  },
  contextDateType (state) {
    return state.contextInfo && state.contextInfo.date &&
      Object.keys(state.contextInfo.date)[0]
  },
  contextDateValue (state) {
    const type = state.contextInfo &&
      state.contextInfo.date &&
      Object.keys(state.contextInfo.date)[0]
    if (type) {
      return state.contextInfo.date[type]
    }
  }
})

export const mutations = ({
  setContext (state, payload) {
    state.contextInfo = parseEmpty(payload.context)
  },

  setUpperContextDetails (state) {
    if (state.contextInfo.details) {
      state.contextInfo.details = state.contextInfo.details.slice(0, -1)
      if (state.contextInfo.details.length < 1) {
        delete state.contextInfo.details
      }
      state.contextInfo = parseEmpty(state.contextInfo)
    }
  },

  clearContext (state) {
    state.contextInfo = null
  }
})

export const actions = ({
  setContext (context, payload) {
    context.commit('setContext', payload)
    bus.$emit('set-context', payload)
    context.commit('clearEntries')
    bus.$emit('batch-thinking-start')
    return context.dispatch('loadContextEntries', payload)
      .then(() => {
        bus.$emit('batch-thinking-done')
        return true
      })
  },

  clearContext (context) {
    context.commit('clearContext')
    bus.$emit('clear-context')
    context.commit('clearEntries')
    bus.$emit('batch-thinking-start')
    return context.dispatch('getEntries')
      .then(result => {
        Storage.all = result.entries
        return context.dispatch('batchAddEntries', {
          entries: result.entries
        })
      })
  },

  setContextByGroup (context, payload) {
    return context.dispatch('setContext', {
      context: extractContextFromGroup(payload.group)
    })
  },

  setUpperContext (context) {
    context.commit('setUpperContextDetails')
    if (context.state.contextInfo) {
      context.dispatch('setContext', {
        context: Object.assign({}, context.state.contextInfo)
      })
    } else {
      context.dispatch('clearContext')
    }
  },

  loadContextEntries (context, payload) {
    return context.dispatch('getEntries')
      .then(result => {
        Storage.all = result.entries
        return context.dispatch('batchAddEntries', {
          entries: filterContext({
            entries: result.entries,
            context: payload.context
          })
        })
      })
  }
})

export default {
  state,
  getters,
  mutations,
  actions
}
