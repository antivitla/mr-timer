function closestSorted (child, array, compare) {
  if (array.length < 2) {
    return array[0]
  }
  const midpoint = parseInt(array.length * 0.5, 10)
  const result = compare(child, array[midpoint])
  if (result > 0 && array.length > 1) {
    return closestSorted(child,
      array.slice(0, midpoint),
      compare)
  } else if (result < 0 && array.length > 1) {
    return closestSorted(child,
      array.slice(midpoint),
      compare)
  }
  return array[midpoint]
}

function insertSorted ({child, children, compare} = {}) {
  const id = children.indexOf(closestSorted(child,
    children,
    compare))
  if (id === -1 && !children.length) {
    children.push(child)
    return children.length - 1
  } else {
    const dir = compare(child, children[id])
    const i = dir >= 0 ? id : id + 1
    children.splice(i, 0, child)
    return i
  }
}

export {
  closestSorted,
  insertSorted
}
