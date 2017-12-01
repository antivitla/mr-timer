<template lang="pug">
  .get-report
    div(
      v-if="showReportModal && !download"
      @click.prevent.stop="openReportModal")
      slot content
    div(
      v-else
      @click="downloadReport")
      slot download
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import reportMixin from '@/mixins/report'
  import i18nLabel from '@/mixins/i18n-label'
  import { Storage } from '@/store/storage'
  import bus from '@/event-bus'

  export default {
    props: {
      download: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        reportEndpoint: '',
        reportUrl: '',
        reportFilename: ''
      }
    },
    computed: {
      ...mapGetters([
        'showReportModal'
      ])
    },
    methods: {
      openReportModal () {
        if (Storage.entries.length) {
          this.openModal({ modal: 'report' })
        } else {
          bus.$emit('toast', { content: this.label('report.nothingToReport') })
        }
      },
      downloadReport () {
        if (Storage.entries.length) {
          this.downloadReportWithCurrentParams()
          setTimeout(() => {
            this.closeModal()
          }, 100)
        } else {
          bus.$emit('toast', { content: this.label('report.nothingToReport') })
        }
      },
      ...mapActions([
        'openModal',
        'closeModal'
      ])
    },
    mixins: [
      reportMixin,
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .get-report
    cursor pointer
    a
    a[href]
      text-decoration none
      color inherit
      display block
</style>
