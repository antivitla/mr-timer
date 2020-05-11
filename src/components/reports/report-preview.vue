<template lang="pug">
  .report-preview(
    :format="reportFormat"
    :column-width="previewTextColumnWidth") {{ reportTextContent }}
</template>
<script>
  import { mapGetters } from 'vuex'
  import reportMixin from '@/mixins/report'
  import i18nLabel from '@/mixins/i18n-label'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        reportTextContent: '',
        handleRefreshPreview: () => {
          setTimeout(() => {
            this.refreshPreview()
          }, 100)
        }
      }
    },
    created () {
      this.refreshPreview()
      this.unsubscribe = this.$store.subscribe(mutation => {
        const types = [
          'setReportStructure',
          'setReportFormat',
          'setReportPeriod',
          'setReportResult',
          'setReportSortBy',
          'setReportPerHour'
        ]
        if (types.indexOf(mutation.type) > -1) {
          setTimeout(() => {
            this.refreshPreview()
          }, 1)
        }
      })
      bus.$on('get-entries-complete', this.handleRefreshPreview)
      bus.$on('refresh-report-preview', this.handleRefreshPreview)
    },
    beforeDestroy () {
      this.unsubscribe()
      bus.$off('get-entries-complete', this.handleRefreshPreview)
      bus.$on('refresh-report-preview', this.handleRefreshPreview)
    },
    computed: {
      ...mapGetters([
        'reportFormat',
        'reportStructure'
      ])
    },
    methods: {
      refreshPreview () {
        const report = this.generateReportWithCurrentParams()
        if (report) {
          this.reportTextContent = report.content
        } else {
          this.reportTextContent = this.label('report.nothingToPreview')
        }
      }
    },
    mixins: [
      reportMixin,
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  .report-preview
    white-space pre
    font-family PT Sans, monospace
    text-align left
    font-size 14px
    margin 40px auto
    &[format="plaintext"][column-width="40"]
      max-width calc(0.55em * 39)
    &[format="plaintext"][column-width="50"]
      max-width calc(0.55em * 49)
    &[format="plaintext"][column-width="60"]
      max-width calc(0.55em * 59)
    &[format="plaintext"][column-width="70"]
      max-width calc(0.55em * 69)
    &[format="plaintext"][column-width="80"]
      max-width calc(0.55em * 79)
    &[format="plaintext"][column-width="100"]
      max-width calc(0.55em * 99)
    &[format="plaintext"][column-width="120"]
      max-width calc(0.55em * 119)
</style>
