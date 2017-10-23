function defaultCompare (a, b) {
  return a - b
}

// Найти ближайший по значению элемент в упорядоченном массиве
function closestSorted ({
  child,
  children,
  compare = defaultCompare,
  dir
} = {}) {
  if (children.length < 2) {
    return children[0]
  }
  if (!dir && children.length > 1) {
    dir = compare(children[0], children[1])
  }
  const midpoint = parseInt(children.length * 0.5, 10)
  const result = compare(child, children[midpoint])
  if (result * dir > 0 && children.length > 1) {
    return closestSorted({
      child,
      children: children.slice(0, midpoint),
      compare,
      dir
    })
  } else if (result * dir < 0 && children.length > 1) {
    return closestSorted({
      child,
      children: children.slice(midpoint),
      compare,
      dir
    })
  }
  return children[midpoint]
}

// Вставить в упорядоченный массив элемент на своё место
function insertSorted ({
  child,
  children,
  compare = defaultCompare,
  dir
} = {}) {
  if (!dir && children.length > 1) {
    dir = compare(children[0], children[1])
  }
  const id = children.indexOf(closestSorted({
    child,
    children,
    compare,
    dir
  }))
  if (id === -1 && !children.length) {
    children.push(child)
    return 0
  } else {
    const where = compare(child, children[id])
    const i = where * dir >= 0 ? id : id + 1
    children.splice(i, 0, child)
    return i
  }
}

export {
  closestSorted,
  insertSorted
}
