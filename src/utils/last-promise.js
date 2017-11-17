const promises = {}

function winner ({ type, promise, result }) {
  if (!promises[type] || promises[type] === promise) {
    return Promise.resolve(result)
  } else {
    return Promise.reject(new Error('ignore'))
  }
}

function participant ({ type, promise }) {
  promises[type] = promise
}

export default function ({ type, promise }) {
  participant({ type, promise })
  return promise.then(result => winner({ type, promise, result }))
}
