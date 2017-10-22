import Petrov from '@/petrov'
export default {
  methods: {
    loadEntriesFromLocalStorage (key) {
      return new Promise((resolve, reject) => {
        const raw = localStorage[key]
        let entries
        if (!raw) {
          reject(new Error(404))
        } else {
          try {
            entries = JSON.parse(raw).entries
            resolve(entries)
          } catch (error) {
            reject(new Error(500))
          }
        }
      })
    },
    loadEntriesFromPetrov (account) {
      return new Promise((resolve, reject) => {
        Petrov
          .get(account)
          .then(response => {
            let entries
            try {
              entries = JSON.parse(response.data)
              return entries.entries
            } catch (error) {
              let forced = response.data
                .split('},{')
                .slice(0, -1)
                .join('},{') + '}]}'
              try {
                entries = JSON.parse(forced)
                return entries.entries
              } catch (error) {
                return new Error('Bad entries')
              }
            }
          })
          .then(entries => resolve(entries))
          .catch(error => reject(new Error(error.message)))
      })
    }
  }
}
