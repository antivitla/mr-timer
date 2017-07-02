import sortedIndexBy from 'lodash/sortedIndexBy'
import uuid from 'uuid/v1'
import Entry from './entry'

function safeGetAtIndex (id, array) {
  if (array.length > id) {
    return array[id]
  } else {
    return array.slice(-1)[0]
  }
}

// Нам могут прислать как группу и наследников
// так и записьа для них немного разная датировка
function lastUpdated (groupOrEntry) {
  let updated
  if (groupOrEntry instanceof Group) {
    updated = lastUpdated(groupOrEntry.children[0])
  } else if (groupOrEntry instanceof Entry) {
    updated = groupOrEntry.start
  } else {
    updated = new Date().getTime()
  }
  return updated
}

function generateName () {
  return `item-${uuid()}`
}

function defaultResolvePath (item) {
  return item.name ? [item.name] : [generateName()]
}

export default class Group {
  constructor ({
    children = [],
    resolvePath = defaultResolvePath,
    constructors = [Group],
    name = generateName(),
    parent
  } = {}) {
    this.children = children
    this.resolvePath = resolvePath
    this.constructors = constructors
    this.name = name
    this.parent = parent
  }

  // Рекурсивно посчитать "дату",
  // это дата старта последней записи группы,
  // и так как она первая в списке,
  // (ну, должна быть, раз он упорядочен)
  lastUpdated () {
    return lastUpdated(this.children[0])
  }

  // Рекурсивно собрать длительность детей.
  // Так как у записей тоже есть duration,
  // то их тоже и посчитают как "за своих",
  // когда доберутся
  duration () {
    return this.children
      .reduce((duration, child) => {
        return duration + child.duration()
      }, 0)
  }

  // Пройтись по предкам и собрать имена
  path () {
    const path = []
    let parent = this
    while (parent) {
      path.unshift(parent.name)
      parent = parent.parent
    }
    return path
  }

  // Путь и есть уникальный id
  uid () {
    return this.path().join('/')
  }

  batch (action, children) {
    children.forEach(child => this[action](child))
  }

  // Добавляем запись (оборачивая в узел)
  addEntry (entry, depth = 0, resolvePath) {
    // Нужно получить путь записи
    const path = resolvePath ? resolvePath(entry) : this.resolvePath(entry)
    // Айди последнего добавленного
    let lastInsertedId
    // Пытаемся вставить в уже существующего ребёнка
    const childIndex = this.children
      .findIndex(item => {
        return item.name === path[depth] &&
          item.name &&
          path[depth]
      })
    if (childIndex > -1) {
      this.children[childIndex]
        .addEntry(entry, depth + 1, resolvePath)
    } else if (path.length > depth) {
      // Более глубокое залегание,
      // создаём прокси-узел
      const ExtendedGroup = safeGetAtIndex(
        depth,
        this.constructors)
      const proxy = new ExtendedGroup({
        resolvePath: this.resolvePath,
        name: path[depth],
        parent: this,
        constructors: this.constructors
      })
      proxy.addEntry(entry, depth + 1, resolvePath) // 1
      lastInsertedId = this.addChild(proxy) // 2
    } else {
      // Финальное добавление с сортировкой
      this.addChild(entry)
    }
    // Пересортировочка
    this.refreshOrderPosition(lastInsertedId || childIndex)
  }

  // Удаляем запись рекурсивно и пустые узлы
  // в результате образовавшиеся
  removeEntry (entry) {
    const id = this.children.findIndex(item => {
      return item.uid() === entry.uid()
    })
    if (id > -1) {
      this.children.splice(id, 1)
    } else {
      // Удалить и запомнить образовавшиеся
      // пустые группы
      const empty = this.children.filter(item => {
        if (item instanceof Group) {
          item.removeEntry(entry)
          // Дочерняя группа опустела?
          if (item.children.length === 0) {
            return true
          }
        }
        // Всё в порядке
        return false
      })
      // Удаляем пустые
      empty.forEach(child => this.removeChild(child))
    }
  }

  addChild (child) {
    if (this.children.indexOf(child) < 0) {
      const id = sortedIndexBy(
        this.children, child, item => -lastUpdated(item))
      this.children.splice(id, 0, child)
    } else {
      console.warn(`Попытка добавить дубликат в ${this.path()}`, child)
    }
  }

  removeChild (child) {
    const id = this.children.indexOf(child)
    if (id > -1) {
      this.children.splice(id, 1)
    }
  }

  refreshOrderPosition (childId) {
    if (childId > -1) {
      const child = this.children.splice(childId, 1)[0]
      this.addChild(child)
    }
  }
}
