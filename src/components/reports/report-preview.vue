<template lang="pug">
  .report-preview(:format="reportFormat") {{ reportTextContent }}
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
        onEntriesComplete: () => {
          setTimeout(() => {
            this.refreshPreview()
          }, 100)
        }
      }
    },
    created () {
      this.refreshPreview()
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setReportStructure' || mutation.type === 'setReportFormat') {
          setTimeout(() => {
            this.refreshPreview()
          }, 100)
        }
      })
      bus.$on('get-entries-complete', this.onEntriesComplete)
    },
    beforeDestroy () {
      this.unsubscribe()
      bus.$off('get-entries-complete', this.onEntriesComplete)
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
    &[format="plaintext"]:not([money])
      max-width 510px
</style>
