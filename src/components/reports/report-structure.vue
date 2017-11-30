<template lang="pug">
  .report-structure
    //- Change sections
    h3 {{ label('report.structureLabel') }}
    draggable.structure-sections(
      v-model="currentReportStructure"
      :options="{ group: 'structure' }"
      :empty-placeholder="label('report.emptyStructure')"
      @input="updateReportStructure")
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
              option(
                v-for="nest in nestOptions"
                :value="nest") {{ labelFormat('report.nest', { nest: nest }) }}
          .depth(v-if="section.summary && section.summary.type !== 'days'")
            select(
              :value="section.summary.depth"
              @input="changeSummaryDepth(section, $event.target.value, index)")
              option(
                v-for="depth in depthOptions"
                :value="depth") {{ labelFormat('report.depth.label', { depth: depth }) }}
              option(:value="10000") {{ label('report.depth.infinite', false) }}
        .actions
          .remove(@click="removeSection(index)")
            i.material-icons delete

    //- Add sections
    h3 {{ label('report.addSectionLabel') }}
    draggable.add-sections(
      v-model="availableSections"
      :options="{ group: { name: 'structure', pull: 'clone', put: false } }")
      button(
        v-for="(section, index) in availableSections"
        :key="index"
        @click.prevent.stop="pushSection($event, section)")
        i.material-icons playlist_add
        | {{ availableSectionLabel(section) }}
</template>
<script>
  import autosize from 'autosize'
  import { mapGetters, mapMutations } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import capitalize from '@/utils/capitalize'
  import draggable from 'vuedraggable'
  import { defaultSections } from '@/store/report'
  // import bus from '@/event-bus'

  export default {
    data () {
      return {
        defaultSections,
        availableSections: [],
        currentReportStructure: [],
        nestOptions: [0, 1, 2],
        depthOptions: [0, 1, 2],
        refreshTextareas: () => {
          setTimeout(() => {
            this.$el.querySelectorAll('textarea').forEach(el => {
              autosize(el)
            })
          }, 100)
        }
      }
    },
    created () {
      this.availableSections = Object
        .keys(this.defaultSections)
        .map(key => JSON.parse(JSON.stringify(this.defaultSections[key])))
      this.currentReportStructure = this.reportStructure
    },
    mounted () {
      this.refreshTextareas()
    },
    computed: {
      ...mapGetters([
        'reportStructure',
        'availableStructuresAsOptions',
        'availableSummariesAsOptions'
      ])
    },
    methods: {
      availableSectionLabel (section) {
        let key = section.type
        if (section.type === 'summary') {
          key = 'summary' + capitalize(section.summary.type)
          if (section.summary.nest) {
            key = key.replace('summary', 'summaryDetailed')
          }
        }
        return this.label(`report.section.${key}`)
      },
      pushSection (event, section, index) {
        if (event.target) {
          this.currentReportStructure.push(JSON.parse(JSON.stringify(section)))
          this.updateReportStructure()
          this.refreshTextareas()
        }
      },
      removeSection (index) {
        this.currentReportStructure.splice(index, 1)
        this.updateReportStructure()
      },
      changeSectionType (section, type, index) {
        let newSectionType = type === 'summary' ? 'summaryDaysTasks' : type
        const newSection = JSON.parse(JSON.stringify(this.defaultSections[newSectionType]))
        this.currentReportStructure.splice(index, 1, newSection)
        this.updateReportStructure()
        this.refreshTextareas()
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
        this.updateReportStructure()
      },
      changeSummaryNest (section, nest, index) {
        section.summary.nest = nest
        this.updateReportStructure()
      },
      changeSummaryDepth (section, depth, index) {
        section.summary.depth = depth
        this.updateReportStructure()
      },
      changeText (section, text, index) {
        if (text) {
          section.text = text
        } else {
          delete section.text
        }
        this.updateReportStructure()
        this.refreshTextareas()
      },
      updateReportStructure () {
        this.setReportStructure({
          structure: this.currentReportStructure
        })
      },
      ...mapMutations([
        'setReportStructure'
      ])
    },
    mixins: [
      i18nLabel
    ],
    components: {
      draggable
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .report-structure
    .structure-sections
      &:empty
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

    .add-sections
      display flex
      flex-wrap wrap
      & > *
        flex-grow 1
        margin 2px
        padding-left 20px
        padding-right 20px
        text-align left
        font-weight 500

    button
      i.material-icons
        margin-right 5px
        font-size 21px
        vertical-align middle

    textarea
      border-radius 5px
      border solid titamota-color-border 1px
      padding: 10px
      resize none
      display block
      width 100%
      box-sizing border-box
</style>
