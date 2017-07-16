import moment from 'moment'
import Entry from '@/models/entry'
import Group from '@/models/group'
import Task from '@/models/task'
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

export function wrapContextDetails (contextDetails, details) {
  return contextDetails.concat(details)
}

export function unwrapContextDetails (contextDetails, details) {
  if (!contextDetails) {
    return details.slice(0)
  } else {
    return details.join(taskDelimiter)
      .replace(new RegExp('^' + contextDetails.join(taskDelimiter)), '')
      .split(taskDelimiter)
      .filter(d => d)
      .map(d => d.trim())
      .filter(d => d)
  }
}
