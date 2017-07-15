import moment from 'moment'
import Entry from '@/models/entry'
import Group from '@/models/group'
import Task from '@/models/task'
// import _ from 'lodash'
import { taskDelimiter } from '@/store/ui'

export function parseStartMoment (name, start, formats) {
  const supportedTypes = ['string', 'number', 'function']
  const types = {
    string: name => moment(name, formats),
    number: name => moment().month(parseInt(name, 10)),
    function: name => moment(name())
  }
  let validStart
  if (start && start.isValid()) {
    validStart = start
  } else if (supportedTypes.indexOf(typeof name) > -1) {
    validStart = types[typeof name](name)
  } else {
    validStart = moment()
  }
  return validStart.isValid() ? validStart : moment()
}

export function extractEntries (item) {
  let entries = []
  item.children.forEach(child => {
    if (child instanceof Entry) {
      entries.push(child)
    } else if (child instanceof Group) {
      entries = entries.concat(extractEntries(child))
    }
  })
  return entries
}

export function parentOfDifferentType (item) {
  let parent = item
  const type = item.type
  while (parent && parent.type === type) {
    parent = parent.parent
  }
  if (parent !== item && parent.parent) {
    return parent
  }
}

export function filterContext ({ entries, context } = {}) {
  // У нас может быть текущий контекст задачей, месяцем, днём, годом.
  // Но так же если текущий это задача, родительский - месяц, день, год,
  // и нужно проверять и по ним
  const ctype = context.type
  const pdtype = parentOfDifferentType(context)
  const isTaskOnly = ctype === 'task' && !pdtype
  const isPeriodOnly = ctype.match(/day|month|year/)
  const isTaskInsidePeriod = ctype === 'task' &&
    pdtype && pdtype.type && pdtype.type.match(/day|month|year/)
  // Cache context info
  const contextDetails = rootDetails(context).join()
  function equalDetails (e, cdj) {
    return e.details.join().indexOf(cdj) > -1
  }
  const equalPeriod = {
    month (d1, d2) {
      return d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    },
    day (d1, d2) {
      return d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    },
    year (d1, d2) {
      return d1.getFullYear() === d2.getFullYear()
    }
  }
  let contextStart
  if (isPeriodOnly) {
    contextStart = new Date(context.start)
  } else if (isTaskInsidePeriod) {
    contextStart = new Date(pdtype.start)
  }

  return entries.filter(entry => {
    if (isTaskOnly) {
      return equalDetails(entry, contextDetails)
    } else if (isPeriodOnly) {
      return equalPeriod[ctype](
        new Date(entry.start), contextStart)
    } else if (isTaskInsidePeriod) {
      return equalPeriod[pdtype.type](
        new Date(entry.start),
        contextStart) && equalDetails(entry, contextDetails)
    }
  })
}

export function getTaskDepth (item) {
  let depth = 0
  let parent = item
  while (parent.parent) {
    depth = depth + 1
    parent = parent.parent
  }
  return depth
}

export function filterGroupChildren (children) {
  return children.filter(child => child instanceof Group)
}

export function rootDetails (group) {
  let descendantsPath = []
  let child = group.children[0]
  while (child instanceof Task) {
    descendantsPath.push(child.name)
    child = child.children[0]
  }
  const details = child.details
  const rootDetails = details.slice(0, -1 * descendantsPath.length)
  return rootDetails
}

export function wrapContextDetails (contextItem, details) {
  const rd = rootDetails(contextItem)
  return rd.concat(details)
}

export function unwrapContextDetails (contextItem, details) {
  const rd = rootDetails(contextItem)
  return details.join(taskDelimiter)
    .replace(new RegExp('^' + rd.join(taskDelimiter)), '')
    .split(taskDelimiter)
    .filter(d => d)
    .map(d => d.trim())
    .filter(d => d)
}
