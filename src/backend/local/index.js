import { appName } from '@/store/app-info'
import Entry from '@/models/entry'

class LocalBackendDriver {
  constructor () {
    this.key = `${appName}-entries-local`
  }

  getEntries () {
    return new Promise((resolve, reject) => {
      const raw = localStorage.getItem(this.key)
      if (!raw) {
        reject(new Response(null, {
          status: 404,
          statusText: `Not Found: ${this.key}`
        }))
      } else {
        let entries
        try {
          entries = JSON.parse(raw).entries
        } catch (error) {
          try {
            const forced = raw.split('},{').slice(0, -1).join('},{') + '}]}'
            entries = JSON.parse(forced).entries
          } catch (error) {
            reject(new Response(null, {
              status: 500,
              statusText: `Internal Server Error`
            }))
          }
        }
        if (entries) {
          resolve({
            entries: entries.map(e => new Entry(e))
          })
        }
      }
    })
  }
}

export default new LocalBackendDriver()
