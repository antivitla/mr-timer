import { appName } from '@/store/app-info'
import Entry from '@/models/entry'
import uuid from 'uuid/v1'
import { insertSorted } from '@/utils/sorted'
import { loadEntriesFromLocalStorage, saveEntriesToLocalStorage } from './get-entries'
import { time } from '@/utils/time'
import { defaultLimit } from '@/store/pagination'

function filterByContext (entries, context = []) {
  return entries.filter(entry => {
    const target = context.join(' / ')
    const source = entry.details.join(' / ')
    const r = new RegExp(`^${target}`)
    return source.match(r)
  })
}

const dayMilliseconds = 1000 * 60 * 60 * 24

function filterByInterval (entries, startFrom, startTo) {
  if (startFrom === 'auto' && startTo === 'auto') {
    return entries
  }
  const past = Date.parse(startFrom)
  const future = Date.parse(startTo) + dayMilliseconds - 1
  return entries.filter(entry => {
    const t = new Date(entry.start).getTime()
    if (!isNaN(past) && !isNaN(future)) {
      return t >= past && t <= future
    } else if (past) {
      return t >= past
    } else if (future) {
      return t <= future
    }
    return false
  })
}

const dateRegExp = /(\s|^)((\d{4})|(\d{1,2}\.\d{4})|(\d{1,2}\.\d{1,2}\.\d{4}))(\s|$)/

function filterByFilter (entries, filter, context = []) {
  return entries.filter(entry => {
    return filter.every(f => {
      if (f.match(dateRegExp)) {
        const df = f.split('.').map(i => parseInt(i, 10))
        const date = new Date(entry.start)
        if (df.length === 1 && df[0] === date.getFullYear()) {
          return true
        } else if (df.length === 2 && df[0] === date.getMonth() + 1 && df[1] === date.getFullYear()) {
          return true
        } else if (df.length === 3 && df[0] === date.getDate() && df[1] === date.getMonth() + 1 && df[2] === date.getFullYear()) {
          return true
        }
      } else {
        return entry.details.slice(context.length).some(d => {
          return d.toLowerCase().indexOf(f.toLowerCase()) > -1
        })
      }
    })
  })
}

function getDays (entries) {
  const days = []
  entries.forEach(entry => {
    const date = time(entry.start).format('YYYY-MM-DD')
    if (days.indexOf(date) < 0) {
      days.push(date)
    }
  })
  return days
}

function filterByDays ({ entries, group } = {}) {
  return entries.filter(entry => {
    return group.some(g => {
      return g === time(entry.start).format('YYYY-MM-DD')
    })
  })
}

function getMonths (entries) {
  const months = []
  entries.forEach(entry => {
    const date = time(entry.start).format('YYYY-MM-01')
    if (months.indexOf(date) < 0) {
      months.push(date)
    }
  })
  return months
}

function filterByMonths ({ entries, group } = {}) {
  return entries.filter(entry => {
    return group.some(g => {
      return g === time(entry.start).format('YYYY-MM-01')
    })
  })
}

function getYears (entries) {
  const years = []
  entries.forEach(entry => {
    const date = time(entry.start).format('YYYY-01-01')
    if (years.indexOf(date) < 0) {
      years.push(date)
    }
  })
  return years
}

function filterByYears ({ entries, group } = {}) {
  return entries.filter(entry => {
    return group.some(g => {
      return g === time(entry.start).format('YYYY-01-01')
    })
  })
}

function getTasks (entries, context = []) {
  const tasks = []
  entries.forEach(entry => {
    if (tasks.indexOf(entry.details[context.length]) < 0) {
      tasks.push(entry.details[context.length])
    }
  })
  return tasks
}

function filterByTasks ({ entries, group, context = [] } = {}) {
  return entries.filter(entry => {
    return group.some(g => {
      return g === entry.details[context.length]
    })
  })
}

function createGroupPagination ({ params, group } = {}) {
  const pagination = {
    previous: null,
    next: null,
    count: group.length
  }
  if (params.offset - params.limit > 0) {
    pagination.previous = group.slice(params.offset - params.limit, params.offset)
  } else {
    pagination.previous = group.slice(0, params.offset)
  }
  if (params.offset + params.limit <= group.length) {
    pagination.next = group.slice(params.offset + params.limit, params.offset + params.limit + params.limit)
  } else {
    pagination.next = group.slice(params.offset + params.limit, group.length)
  }
  if (!pagination.previous.length) {
    pagination.previous = null
  }
  if (!pagination.next.length) {
    pagination.next = null
  }
  return pagination
}

function responseWithFilteredEntries (allEntries, params) {
  const response = {
    entries: allEntries,
    pagination: {
      count: allEntries.length,
      limit: params.limit || null,
      offset: params.offset || 0
    }
  }
  if (params.context) {
    response.context = params.context.slice(0)
    response.entries = filterByContext(response.entries, response.context)
    response.pagination.count = response.entries.length
  }
  if (params.filter) {
    response.entries = filterByFilter(response.entries, params.filter, response.context)
    response.pagination.count = response.entries.length
  }
  if (params.start_from || params.start_to) {
    response.pagination.limit = null
    response.pagination.offset = 0
    response.entries = filterByInterval(response.entries, params.start_from, params.start_to)
  }
  if (params.last) {
    response.pagination.group = params.last
    const getGroup = {
      days: getDays,
      months: getMonths,
      years: getYears,
      tasks: getTasks
    }
    const filterByGroup = {
      days: filterByDays,
      months: filterByMonths,
      years: filterByYears,
      tasks: filterByTasks
    }
    // decide group
    const group = getGroup[params.last](response.entries, response.context)
    // filter by group
    if (!params.limit) {
      response.entries = filterByGroup[params.last]({
        entries: response.entries,
        group: group.slice(params.offset),
        context: response.context
      })
    } else {
      response.entries = filterByGroup[params.last]({
        entries: response.entries,
        group: group.slice(params.offset, params.offset + params.limit),
        context: response.context
      })
    }
    Object.assign(response.pagination, createGroupPagination({ params, group }))
  } else {
    if (params.limit === null) {
      response.entries = response.entries.slice(params.offset, params.offset + defaultLimit.storage)
      response.pagination.limit = defaultLimit.storage
    } else if (!params.limit) {
      response.entries = response.entries.slice(params.offset)
    } else {
      response.entries = response.entries.slice(params.offset, params.offset + params.limit)
    }
  }
  if (!response.entries.length) {
    const error = new Error('Not Found')
    error.response = new Response('Not Found', {
      status: 404,
      ok: false,
      statusText: 'Not Found'
    })
    throw error
  } else {
    response.pagination = JSON.parse(JSON.stringify(response.pagination))
    return response
  }
}

class LocalBackendDriver {
  constructor () {
    this.key = `${appName}-entries-local`
    this.entries = []
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify({ entries: [] }))
    }
  }

  getEntries ({ params = {} } = {}) {
    return loadEntriesFromLocalStorage(this.key).then(entries => {
      this._addEntries(entries)
      return responseWithFilteredEntries(entries, params)
    })
  }

  postEntries (entries) {
    const postedEntries = entries.map(entry => {
      const newEntry = new Entry(entry)
      newEntry.id = uuid()
      return newEntry
    })
    this._addEntries(postedEntries)
    return saveEntriesToLocalStorage(this.entries, this.key).then(() => {
      return postedEntries
    })
  }

  patchEntries (entries) {
    this._removeEntries(entries)
    this._addEntries(entries)
    return saveEntriesToLocalStorage(this.entries, this.key).then(() => {
      return entries
    })
  }

  deleteEntries (entries) {
    this._removeEntries(entries)
    return saveEntriesToLocalStorage(this.entries, this.key)
  }

  _addEntries (entries) {
    entries.forEach(entry => {
      if (this._findEntryIndex(entry) < 0) {
        insertSorted({
          child: entry,
          children: this.entries,
          compare: (a, b) => a.start - b.start,
          dir: 1
        })
      }
    })
  }

  _removeEntries (entries) {
    entries.forEach(entry => {
      const id = this._findEntryIndex(entry)
      if (id > -1) {
        this.entries.splice(id, 1)
      }
    })
  }

  _findEntryIndex (entry) {
    let id = this.entries.indexOf(entry)
    if (id < 0) {
      return this.entries.findIndex(item => {
        return entry.id === item.id
      })
    } else {
      return id
    }
  }
}

export default new LocalBackendDriver()
