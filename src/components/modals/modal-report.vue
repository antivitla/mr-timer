<template lang="pug">
  .modal.report
    h2 {{ label('report.discoTitle') }}
    //- Result
    report-result
    //- Structure
    report-structure
    //- Format
    .format
      h3 {{ label('report.formatLabel') }}
      .row
        select(v-model="currentReportFormat")
          option(
            v-for="option in availableFormatsAsOptions"
            :value="option.value") {{ label(option.label) }}
        .options(v-if="currentReportFormat === 'plaintext'")
          span.label {{ label('report.withColumnWidth', false) }}
          select(v-model="columnWidthModel")
            option(
              v-for="option in availablePreviewTextColumnWidthsAsOptions"
              :value="option.value") {{ option.value }}
    //- Preview
    .preview(v-if="reportFormat === 'markdown' || reportFormat === 'plaintext'")
      h3 {{ label('report.previewLabel') }}
      .preview-toggle(
        v-if="previewVisible"
        @click="toggleReportPreview()"
        :title="label('report.togglePreviewLabel')")
        i.material-icons.off(v-if="!previewVisible") visibility_on
        i.material-icons.on(v-if="previewVisible") visibility_off
      report-preview(v-if="previewVisible")
      .preview-toggle(
        @click="toggleReportPreview()"
        :title="label('report.togglePreviewLabel')")
        i.material-icons.off(v-if="!previewVisible") visibility_on
        i.material-icons.on(v-if="previewVisible") visibility_off
    //- Download
    get-report.download(:download="true")
      button.primary
        i.material-icons file_download
        span {{ label('report.downloadLabel') }} {{ label('report.format.' + currentReportFormat) }}
    //- Show modal next time
    .show-modal
      custom-checkbox(
        mark
        class="show-report-modal"
        v-model="showReportSettings")
      label(v-custom-for="'.show-report-modal'")
        span {{ label('settings.report.showModalLong') }}
    //- Close
    .close-modal(@click="closeModal")
      i.material-icons close
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import getReport from '@/components/reports/get-report'
  import reportStructure from '@/components/reports/report-structure'
  import reportPreview from '@/components/reports/report-preview'
  import reportResult from '@/components/reports/report-result'
  import customCheckbox from '@/components/other/custom-checkbox'
  import customFor from '@/directives/custom-for'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        previewVisible: false
      }
    },
    created () {
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setPreviewTextColumnWidth') {
          bus.$emit('refresh-report-preview')
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    computed: {
      columnWidthModel: {
        get () {
          return this.previewTextColumnWidth
        },
        set (value) {
          this.setPreviewTextColumnWidth({
            previewTextColumnWidth: parseInt(value, 10)
          })
        }
      },
      currentReportFormat: {
        get () {
          return this.reportFormat
        },
        set (format) {
          this.setReportFormat({ format })
        }
      },
      showReportSettings: {
        get () {
          return this.showReportModal
        },
        set (value) {
          this.setShowReportModal({
            showReportModal: value
          })
        }
      },
      ...mapGetters([
        'reportFormat',
        'showReportModal',
        'availableFormatsAsOptions',
        'previewTextColumnWidth',
        'availablePreviewTextColumnWidthsAsOptions'
      ])
    },
    methods: {
      toggleReportPreview () {
        this.previewVisible = !this.previewVisible
      },
      ...mapMutations([
        'setReportFormat',
        'setShowReportModal',
        'setPreviewTextColumnWidth'
      ]),
      ...mapActions([
        'closeModal'
      ])
    },
    mixins: [
      i18nLabel
    ],
    directives: {
      customFor
    },
    components: {
      getReport,
      reportStructure,
      reportPreview,
      reportResult,
      customCheckbox
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/modal'

  .modal.report
    max-width 960px
    box-shadow 1px 3px 10px 0px alpha(titamota-color-text, 10%)
    h3
      margin-top 40px

    .format
      .options
        & > *
          vertical-align top
      .row
        display flex
        flex-wrap wrap
        align-items center
        justify-content center
      .label
        margin 0 1em
        line-height 40px
        display inline-block
      select
        width auto

    .preview
      .preview-toggle
        width 40px
        line-height 40px
        height 40px
        cursor pointer
        margin 0px auto 40px auto
        i.material-icons
          font-size 24px
          width 24px
          margin 0 auto
          display block
          text-align center
      .report-preview + .preview-toggle
        margin-top 20px

    .format + .download
      margin-top 40px

    .download
      button
        width 100%
        padding-left 20px
        padding-right 20px
        height 60px
        & > *
          vertical-align middle

    .show-modal
      margin-top 20px
</style>
