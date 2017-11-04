import { appName } from '@/store/app-info'

class LocalBackendDriver {
  constructor () {
    this.key = `${appName}-entries-local`
  }

  getEntries () {
    return (new Promise((resolve, reject) => {
      const raw = localStorage.getItem(this.key)
      if (!raw) {
        const body = `The key '${this.key}' was not found in localStorage`
        reject(new Response(body, {
          status: 404,
          ok: false,
          statusText: `Not Found ${this.key} in LocalStorage`
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
            reject(new Response(`Corrupted data in '${this.key}'`, {
              status: 500,
              statusText: 'Internal Server Error'
            }))
          }
        }
        if (entries) {
          resolve({ entries })
        }
      }
    }))
  }
}

export default new LocalBackendDriver()
