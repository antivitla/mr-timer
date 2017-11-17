import Entry from '@/models/entry'

export function loadEntriesFromLocalStorage (key) {
  return new Promise((resolve, reject) => {
    const raw = localStorage.getItem(key)
    if (!raw) {
      reject(new Error(`Get entries: not found '${key}' key in LocalStorage`))
    } else {
      let entries
      try {
        entries = JSON.parse(raw).entries.map(entry => new Entry(entry))
      } catch (error) {
        try {
          const forced = raw.split('},{').slice(0, -1).join('},{') + '}]}'
          entries = JSON.parse(forced).entries
        } catch (error) {
          reject(new Error(`Get entries: corrupted data in '${key}' key in LocalStorage`))
        }
      }
      if (entries) {
        resolve(entries)
      }
    }
  })
}

export function saveEntriesToLocalStorage (entries, key) {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem(key, JSON.stringify({ entries }))
      resolve()
    } catch (error) {
      reject(error.message)
    }
  })
}
