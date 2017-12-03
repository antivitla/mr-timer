<template lang="pug">
  .report-result
    h3 {{ label('report.resultLabel') }}
    .row
      div
        custom-radio(
          id="report-duration-only"
          :value="'report-duration-only'"
          :model="reportResult"
          @input="setReportResultModel($event)")
        label(for="report-duration-only") {{ label('settings.report.durationOnly') }}
      div
        custom-radio(
          id="report-cost-only"
          :value="'report-cost-only'"
          :model="reportResult"
          @input="setReportResultModel($event)")
        label(for="report-cost-only") {{ label('settings.report.costOnly') }}
      div
        custom-radio(
          id="report-duration-and-cost"
          :value="'report-duration-and-cost'"
          :model="reportResult"
          @input="setReportResultModel($event)")
        label(for="report-duration-and-cost") {{ label('settings.report.durationAndCost') }}
      div(v-if="reportResult === 'report-duration-and-cost'")
        custom-checkbox(
          mark
          off-box
          id="report-per-hour"
          v-model="reportPerHourModel")
        label(for="report-per-hour") {{ label('settings.report.perHour') }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import reportMixin from '@/mixins/report'
  import i18nLabel from '@/mixins/i18n-label'
  import customRadio from '@/components/other/custom-radio'
  import customCheckbox from '@/components/other/custom-checkbox'
  import bus from '@/event-bus'

  export default {
    created () {
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setReportPerHour' || mutation.type === 'setReportResult') {
          bus.$emit('refresh-report-preview')
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    computed: {
      reportResultModel () {
        return this.reportResult
      },
      reportPerHourModel: {
        get () {
          return this.reportPerHour
        },
        set (value) {
          this.setReportPerHour({
            reportPerHour: value
          })
        }
      },
      ...mapGetters([
        'reportResult',
        'reportPerHour'
      ])
    },
    methods: {
      setReportResultModel (result) {
        this.setReportResult({
          reportResult: result
        })
      },
      ...mapMutations([
        'setReportResult',
        'setReportPerHour'
      ])
    },
    mixins: [
      reportMixin,
      i18nLabel
    ],
    components: {
      customRadio,
      customCheckbox
    }
  }
</script>
<style lang="stylus">
  .report-result
    .row
      display flex
      flex-wrap wrap
      justify-content center
      line-height 24px
      & > div
        margin 10px
</style>
