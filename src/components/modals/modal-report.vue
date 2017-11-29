<template lang="pug">
  .modal.report
    //- Close modal
    .close-modal(@click="closeModal")
      i.material-icons close

    //- Structure
    .structure
      h3 {{ label('report.structureLabel') }}
      draggable.structure-sections(
        v-model="currentReportStructure"
        :options="{ group: 'structure' }"
        :empty-placeholder="label('report.emptyStructure')"
        @input="changeReportStructure")
        .section(v-for="(section, index) in currentReportStructure")
          .handler
            i.material-icons reorder
          .body(v-if="section")
            .type
              select(
                :value="section.type"
                @input="changeSectionType(section, $event.target.value, index)")
                option(
                  v-for="option in availableStructuresAsOptions"
                  :value="option.value") {{ label(option.label) }}
            .text(v-if="section.type === 'text'")
              textarea(
                spellcheck="false"
                rows="1"
                :value="section.text"
                :placeholder="label('report.placeholderText')"
                @input="changeText(section, $event.target.value, index)")
            .summary-type(v-if="section.type === 'summary'")
              select(
                :value="section.summary.type"
                @input="changeSummaryType(section, $event.target.value, index)")
                option(
                  v-for="option in availableSummariesAsOptions"
                  :value="option.value") {{ label(option.label, false) }}
            .nest(v-if="section.summary && section.summary.type !== 'days'")
              select(
                :value="section.summary.nest"
                @input="changeSummaryNest(section, $event.target.value, index)")
                option(:value="0") {{ labelFormat('report.nest', { nest: 0 }) }}
                option(:value="1") {{ labelFormat('report.nest', { nest: 1 }) }}
                option(:value="2") {{ labelFormat('report.nest', { nest: 2 }) }}
                option(:value="3") {{ labelFormat('report.nest', { nest: 3 }) }}
            .depth(v-if="section.summary && section.summary.type !== 'days'")
              select(
                :value="section.summary.depth"
                @input="changeSummaryDepth(section, $event.target.value, index)")
                option(:value="0") {{ labelFormat('report.depth.label', { depth: 0 }) }}
                option(:value="1") {{ labelFormat('report.depth.label', { depth: 1 }) }}
                option(:value="2") {{ labelFormat('report.depth.label', { depth: 2 }) }}
                option(:value="10000") {{ label('report.depth.infinite', false) }}
          .actions
            .remove(@click="removeSection(index)")
              i.material-icons delete

    //- Add
    .add
      h3 {{ label('report.addSectionLabel') }}
      draggable.sections(
        v-model="sectionTemplates"
        :options="{ group: { name: 'structure', pull: 'clone', put: false } }")
        button(
          v-for="(section, index) in sectionTemplates"
          :key="index"
          @click.prevent.stop="pushSection($event, section)")
          i.material-icons playlist_add
          | {{ sectionTemplateLabel(section) }}

    //- Report format
    .format
      h3 {{ label('report.formatLabel') }}
      select(v-model="currentReportFormat")
        option(
          v-for="option in availableFormatsAsOptions"
          :value="option.value") {{ label(option.label) }}

    //- Preview
    .preview
      h3 {{ label('report.previewLabel') }}
      .preview-content(v-if="previewVisible") {{ reportContent }}
      .preview-toggle(
        @click="toggleReportPreview()"
        :title="label('report.togglePreviewLabel')")
        i.material-icons.off(v-if="!previewVisible") visibility_on
        i.material-icons.on(v-if="previewVisible") visibility_off

    //- Download
    form.download(
      :action="reportAction()"
      method="post")
      input(
        type="hidden"
        name="report"
        :value="reportContent")
      button.primary
        i.material-icons file_download
        span {{ label('report.downloadLabel') }} {{ label('report.format.' + currentReportFormat) }}
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import reportMixin from '@/mixins/report'
  import draggable from 'vuedraggable'
  import capitalize from '@/utils/capitalize'
  import bus from '@/event-bus'
  import autosize from 'autosize'

  export default {
    data () {
      return {
        defaultSection: {
          header: { type: 'header' },
          total: { type: 'total' },
          period: { type: 'period' },
          text: { type: 'text' },
          summaryDays: {
            type: 'summary',
            summary: { type: 'days' }
          },
          summaryTasks: {
            type: 'summary',
            summary: { type: 'tasks', depth: 0, nest: 0 }
          },
          summaryDetailedTasks: {
            type: 'summary',
            summary: { type: 'tasks', depth: 0, nest: 1 }
          },
          summaryDaysTasks: {
            type: 'summary',
            summary: { type: 'daysTasks', depth: 1, nest: 0 }
          },
          summaryDetailedDaysTasks: {
            type: 'summary',
            summary: { type: 'daysTasks', depth: 1, nest: 1 }
          }
        },
        sectionTemplates: [
          { type: 'header' },
          { type: 'total' },
          { type: 'text' },
          {
            type: 'summary',
            summary: { type: 'days' }
          },
          {
            type: 'summary',
            summary: { type: 'tasks', depth: 0, nest: 0 }
          },
          {
            type: 'summary',
            summary: { type: 'tasks', depth: 0, nest: 1 }
          },
          {
            type: 'summary',
            summary: { type: 'daysTasks', depth: 1, nest: 0 }
          },
          {
            type: 'summary',
            summary: { type: 'daysTasks', depth: 1, nest: 1 }
          }
        ],
        currentReportStructure: [],
        reportContent: '',
        reportFilename: '',
        previewVisible: false,
        refreshHandler: () => {
          setTimeout(() => {
            this._refreshReportPreview()
            this.$el.querySelectorAll('textarea').forEach(el => {
              autosize(el)
            })
          }, 500)
        },
        refreshComments: () => {
          setTimeout(() => {
            this.$el.querySelectorAll('textarea').forEach(el => {
              autosize(el)
            })
          }, 100)
        }
      }
    },
    created () {
      bus.$on('get-entries-complete', this.refreshHandler)
    },
    beforeDestroy () {
      bus.$off('get-entries-complete', this.refreshHandler)
    },
    mounted () {
      this.currentReportStructure = JSON.parse(JSON.stringify(this.reportStructure))
      this._updateReportData()
      this.refreshComments()
    },
    computed: {
      currentReportFormat: {
        get () {
          return this.reportFormat
        },
        set (format) {
          this.setReportFormat({ format })
          this._refreshReportPreview()
        }
      },
      ...mapGetters([
        'context',
        'reportFormat',
        'reportStructure',
        'availableFormatsAsOptions',
        'availableStructuresAsOptions',
        'availableSummariesAsOptions'
      ])
    },
    methods: {
      sectionTemplateLabel (section) {
        let key = section.type
        if (section.type === 'summary') {
          key = 'summary' + capitalize(section.summary.type)
          if (section.summary.nest) {
            key = key.replace('summary', 'summaryDetailed')
          }
        }
        return this.label(`report.section.${key}`)
      },
      changeText (section, text, index) {
        if (text) {
          section.text = text
        } else {
          delete section.text
        }
        this._updateReportData()
        this.refreshComments()
      },
      changeSectionType (section, type, index) {
        let newSectionType = type === 'summary' ? 'summaryDaysTasks' : type
        const newSection = JSON.parse(JSON.stringify(this.defaultSection[newSectionType]))
        this.currentReportStructure.splice(index, 1, newSection)
        // this.setReportSection({
        //   section: JSON.parse(JSON.stringify(newSection)),
        //   index
        // })
        this._updateReportData()
        this.refreshComments()
      },
      changeSummaryType (section, type, index) {
        if (type === 'days') {
          delete section.summary.nest
          delete section.summary.depth
        } else if (section.summary.type === 'days' && type !== 'days') {
          section.summary.nest = 1
          section.summary.depth = 0
        }
        section.summary.type = type
        this._updateReportData()
        this.refreshComments()
      },
      changeSummaryNest (section, nest, index) {
        section.summary.nest = nest
        this._updateReportData()
      },
      changeSummaryDepth (section, depth, index) {
        section.summary.depth = depth
        this._updateReportData()
      },
      changeReportStructure (a) {
        this._updateReportData()
        this.refreshComments()
      },
      removeSection (index) {
        this.currentReportStructure.splice(index, 1)
        this._updateReportData()
        this.refreshComments()
      },
      pushSection (event, section, index) {
        if (event.target) {
          this.currentReportStructure.push(JSON.parse(JSON.stringify(section)))
          this._updateReportData()
          this.refreshComments()
        }
      },
      toggleReportPreview () {
        this.previewVisible = !this.previewVisible
        this._refreshReportPreview()
      },
      reportAction () {
        return 'https://local.mitaba.ru/api/download/report-as-text/?filename=' + this.reportFilename
      },
      _updateReportData () {
        this.setReportStructure({
          structure: this.currentReportStructure
        })
        this._refreshReportPreview()
      },
      _refreshReportPreview () {
        let report
        if (this.reportFormat === 'markdown') {
          report = this.generateMarkdownReport(this.currentReportStructure)
        } else {
          report = this.generateTextReport(this.currentReportStructure)
        }
        this.reportContent = report.content
        this.reportFilename = report.filename
      },
      ...mapMutations([
        'setReportFormat',
        'setReportStructure',
        'removeReportSection'
      ]),
      ...mapActions([
        'closeModal'
      ])
    },
    mixins: [
      reportMixin
    ],
    components: {
      draggable
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/modal'

  .modal.report
    max-width 960px
    box-shadow 1px 3px 10px 0px alpha(titamota-color-text, 10%)

    .structure
      text-align center

      .structure-sections:empty
        height 43px
        background-color titamota-color-back-light
        text-align center
        line-height 21px
        padding 10px
        border-radius 5px
        color titamota-color-text-muted
        box-sizing border-box
        &:before
          content attr(empty-placeholder)

      .section
        display flex
        margin 10px 0
        justify-content flex-start
        .handler
          cursor pointer
          margin-right 10px
          line-height 40px
          i.material-icons
            font-size 24px
        .body
          margin-right 15px
          flex-grow 1
          display flex
          flex-wrap wrap
          .type
            select
              font-weight 500
          .summary-type
            flex-grow 1
          .summary-type
          .nest
          .depth
            select
              font-size 12px
          .text
            flex-grow 1
            input
              width 100%
              display block
              box-sizing border-box
              font-weight 300
              font-size 12px
              padding-left 12px
              padding-right 12px
          & > *
            margin-right 4px
            margin-bottom 4px

        .actions
          margin-left auto
          display flex
          & > *
            text-align center
            cursor pointer
          .material-icons
            font-size 24px
            line-height 40px

    .add
      margin-top 40px
      text-align center
      .sections
        display flex
        flex-wrap wrap
        & > *
          flex-grow 1
          margin 2px
          padding-left 20px
          padding-right 20px
          text-align left
          font-weight 500

    .format
      margin-top 40px
      text-align center
      select
        width auto

    .preview
      margin-top 40px
      text-align center
      .preview-toggle
        width 40px
        line-height 40px
        height 40px
        cursor pointer
        margin 0px auto
        i.material-icons
          font-size 24px
          width 24px
          margin 0 auto
          display block
          text-align center
      .preview-content
        white-space pre
        font-family PT Sans, monospace
        text-align left
        max-width 500px
        font-size 14px
        margin 40px auto
      .preview-content + .preview-toggle
        margin-top 20px

    .download
      margin-top 40px
      button
        width 100%
        padding-left 20px
        padding-right 20px
        height 60px

    button
      *
        vertical-align middle
      i.material-icons
        margin-right 5px
        font-size 21px
    textarea
      border-radius 5px
      border solid titamota-color-border 1px
      padding: 10px
      resize none
      display block
      width 100%
      box-sizing border-box
</style>
