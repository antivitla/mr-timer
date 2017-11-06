import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'currentView',
      'paginationDays',
      'paginationMonths',
      'paginationYears',
      'paginationEntries',
      'filter'
    ])
  },
  methods: {
    getParams () {
      const pagination = {
        days: this.paginationDays,
        months: this.paginationMonths,
        years: this.paginationYears,
        storage: this.paginationEntries
      }
      const params = {
        limit: pagination[this.currentView].limit,
        offset: pagination[this.currentView].offset
      }
      if (this.currentView === 'storage') {
        params.filter = this.filter
      } else {
        params.last = this.currentView
      }
      return params
    }
  }
}
