import { mapGetters, mapMutations, mapActions } from 'vuex'
import bus from '@/event-bus'
import capitalize from '@/utils/capitalize'

export default {
  computed: {
    currentPagination () {
      if (this.currentView === 'storage') {
        return this.paginationEntries
      } else {
        return this[`pagination${capitalize(this.currentView)}`]
      }
    },
    ...mapGetters([
      'currentView',
      'paginationDays',
      'paginationMonths',
      'paginationYears',
      'paginationTasks',
      'paginationEntries',
      'filter'
    ])
  },
  methods: {
    viewGetParams () {
      const params = {
        limit: this.currentPagination.limit,
        offset: this.currentPagination.offset
      }
      if (this.currentView === 'storage') {
        params.filter = this.filter
      } else {
        params.last = this.currentView
      }
      return params
    },
    setCurrentPagination (payload) {
      if (this.currentView === 'storage') {
        return this.setEntriesPagination(payload)
      } else {
        return this[`set${capitalize(this.currentView)}Pagination`](payload)
      }
    },
    onChangeLimit (limit) {
      this.setCurrentPagination({ limit })
      this.getEntries({ params: this.viewGetParams() })
      bus.$emit('scroll-top')
    },
    onChangeOffset (offset) {
      this.setCurrentPagination({ offset })
      this.getEntries({ params: this.viewGetParams() })
      bus.$emit('scroll-top')
    },
    ...mapMutations([
      'setDaysPagination',
      'setMonthsPagination',
      'setYearsPagination',
      'setTasksPagination',
      'setEntriesPagination'
    ]),
    ...mapActions([
      'getEntries'
    ])
  }
}
