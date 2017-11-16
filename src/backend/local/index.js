import { appName } from '@/store/app-info'
import Entry from '@/models/entry'
// import uuid from 'uuid/v1'
// import { insertSorted } from '@/utils/sorted'

// const local = {
//   entries: []
// }

// function saveEntries ({ entries = [], key } = {}) {
//   if (!key) {
//     throw new Error(`The key '${key}' was not found in localStorage`)
//   }
//   localStorage.setItem(key, JSON.stringify({ entries }))
// }

class LocalBackendDriver {
  constructor () {
    this.key = `${appName}-entries-local`
    this.entries = []
  }

  getEntries ({ params }) {
    return this._loadEntriesFromLocalStorage()
      .then(() => {
        console.log(this.entries, params)
      })
  }

  // postEntries (entries) {
  //   return new Promise((resolve, reject) => {
  //     const postedEntries = entries.map(entry => {
  //       const newEntry = new Entry(entry)
  //       newEntry.id = uuid()
  //       return newEntry
  //     })
  //     postedEntries.forEach(entry => {
  //       insertSorted({
  //         child: entry,
  //         children: local.entries,
  //         compare: (a, b) => a.start - b.start,
  //         dir: 1
  //       })
  //     })
  //     try {
  //       saveEntries({ entries: postedEntries, key: this.key })
  //       resolve(postedEntries.map(entry => new Entry(entry)))
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  // patchEntries (entries) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       // saveEntries(this.key)
  //       resolve(entries.map(entry => new Entry(entry)))
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  // deleteEntries (entries) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       saveEntries(this.key)
  //       resolve(true)
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  _loadEntriesFromLocalStorage () {
    return new Promise((resolve, reject) => {
      const raw = localStorage.getItem(this.key)
      if (!raw) {
        const statusText = `Not Found ${this.key} in LocalStorage`
        reject(new Response(statusText, {
          status: 404,
          ok: false,
          statusText
        }))
      } else {
        let entries
        try {
          entries = JSON.parse(raw).entries.map(entry => new Entry(entry))
        } catch (error) {
          try {
            const forced = raw.split('},{').slice(0, -1).join('},{') + '}]}'
            entries = JSON.parse(forced).entries
          } catch (error) {
            const statusText = `Corrupted data in '${this.key}'`
            reject(new Response(statusText, {
              status: 500,
              ok: false,
              statusText
            }))
          }
        }
        if (entries) {
          this.entries = entries.map(entry => new Entry(entry))
          resolve({ entries })
        }
      }
    })
  }
}

export default new LocalBackendDriver()
