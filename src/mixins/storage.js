import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentView',
      'pagination',
      'isPagination',
      'isInterval',
      'intervalStart',
      'intervalStop',
      'filter'
    ])
  },
  methods: {
    currentViewParams () {
      if (this.isPagination) {
        const pagination = this.pagination[this.currentView]
        const params = {
          limit: pagination.limit,
          offset: pagination.offset
        }
        if (this.currentView === 'storage') {
          if (this.filter.length) {
            params.filter = this.filter.slice(0)
          }
        } else {
          params.last = this.currentView
        }
        return params
      } else if (this.isInterval) {
        /* eslint-disable camelcase */
        let params = {}
        const start_from = this.intervalStart && new Date(this.intervalStart).toISOString()
        const start_to = this.intervalStop && new Date(this.intervalStop).toISOString()
        if (start_from && start_to) {
          params = { start_from, start_to }
        } else if (start_from) {
          params = { start_from }
        } else if (start_to) {
          params = { start_to }
        } else {
          params = { start_from: 'auto', start_to: 'auto' }
        }
        return params
      }
    },
    getEntriesWithCurrentParams () {
      const params = this.currentViewParams()
      return this.getEntries({ params })
    },
    deleteAndGetEntries (payload) {
      return this
        .deleteEntries(payload)
        .then(() => this.getEntries({ params: this.currentViewParams() }))
    },
    ...mapActions([
      'deleteEntries',
      'getEntries'
    ])
  }
}
