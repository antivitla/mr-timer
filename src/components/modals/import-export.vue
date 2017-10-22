<template lang="pug">
  .import-export
    nav.switch-menu-wrapper
      div.switch-menu.type
        a(
          @click="view = 'import'"
          :class="{ 'active': view === 'import' }") {{ labelImport }}
        a(
          @click="view = 'export'"
          :class="{ 'active': view === 'export' }") {{ labelExport }}
      div.switch-menu.format
        a(
          @click="format = 'json'"
          :class="{ 'active': format === 'json' }") json
        a(
          @click="format = 'csv'"
          :class="{ 'active': format === 'csv' }") csv
        a(
          @click="format = 'toggl csv'"
          :class="{ 'active': format === 'toggl csv' }") toggl csv

    //- Import
    div.import(v-if="view === 'import'")
      p.info
        | {{ labelImportDescription }}&nbsp;
        strong {{ labelFormat(format) }}:
      p
        textarea(
          v-model="importData"
          :placeholder="'Вставьте ' + format +  ' записи'"
          spellcheck="false")

      p.submit(:disabled="!importData")
        a.button.merge(@click="importMerge()")
          | Merge with existing
        a.button.replace.hero(@click="importReplace()")
          | Replace existing

    //- Export
    div.export(v-if="view === 'export'")
      p.info
        | {{ labelExportDescription }}&nbsp;
        strong {{ labelFormat(format) }}:
      p
        textarea(
          :value="exportData"
          spellcheck="false")
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { Storage } from '@/store/storage'
  import { translate } from '@/store/i18n'
  import capitalize from 'lodash/capitalize'

  export default {
    data () {
      return {
        view: 'import',
        format: 'json',
        importData: '',
        capitalize: capitalize
      }
    },

    computed: {
      exportData () {
        return JSON.stringify({
          entries: Storage.all
        }, null, '  ')
      },
      labelImport () {
        return capitalize(translate[this.locale].import)
      },
      labelExport () {
        return capitalize(translate[this.locale].export)
      },
      labelImportDescription () {
        return capitalize(translate[this.locale].importFrom)
      },
      labelExportDescription () {
        return capitalize(translate[this.locale].exportTo)
      },
      ...mapGetters([
        'locale'
      ])
    },

    methods: {
      importMerge () {
        this.importEntries({
          replace: false,
          raw: this.importData,
          format: this.format
        })
        this.closeModal()
      },
      importReplace () {
        this.importEntries({
          replace: true,
          raw: this.importData,
          format: this.format
        })
        this.closeModal()
      },
      labelFormat (format) {
        return format.toUpperCase()
      },
      ...mapMutations([
        'closeModal'
      ]),
      ...mapActions([
        'importEntries'
      ])
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .import-export
    width 320px
    @media (min-width 768px)
      width 480px
    nav
      display flex
      justify-content space-between
      & > *
        margin 0
      a
        cursor text

    .submit
      display flex
      justify-content space-between
      flex-direction column
      &[disabled]
        opacity 0.5
        pointer-events none
        cursor text
      .button
        margin-bottom 10px
        text-align center
      @media (min-width 768px)
        flex-direction row
        .button
          margin-bottom 0px

    [view="import"] .toggle-export
    [view="export"] .toggle-import
      text-decoration underline
      color titamota-color-text-muted
      cursor pointer

    textarea
      display block
      border none
      font-size 12px
      line-height 16px
      font-family PT Mono, monospace
      height 50vh
      width 100%
      padding 5px 10px
      box-sizing border-box
      border-radius 5px
    .import
      textarea
        height calc(50vh - 63px)
</style>
