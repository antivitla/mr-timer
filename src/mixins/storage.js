import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentView',
      'pagination',
      'isPagination',
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
      } else {
        return {
          start_from: new Date(),
          start_to: new Date()
        }
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
