<template lang="pug">
  .settings-report
    p
      custom-checkbox(
        mark
        off-box
        class="show-report-modal"
        v-model="showReportSettings")
      label(v-custom-for="'.show-report-modal'")
        span {{ label('settings.report.showModal') }}
    p
      get-report
        button.block {{ label('settings.report.download') }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import customCheckbox from '@/components/other/custom-checkbox'
  import customFor from '@/directives/custom-for'
  import getReport from '@/components/reports/get-report'

  export default {
    computed: {
      showReportSettings: {
        get () {
          return this.showReportModal
        },
        set (value) {
          this.setShowReportModal({
            showReportModal: !this.showReportModal
          })
        }
      },
      ...mapGetters([
        'showReportModal'
      ])
    },
    methods: {
      ...mapMutations([
        'setShowReportModal'
      ])
    },
    mixins: [
      i18nLabel
    ],
    directives: {
      customFor
    },
    components: {
      customCheckbox,
      getReport
    }
  }
</script>
<style lang="stylus">
  .settings-report
    label > *
      vertical-align middle
    p + p
      margin-top 20px
    .get-report
      width 100%
</style>
