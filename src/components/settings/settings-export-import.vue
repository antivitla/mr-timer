<template lang="pug">
  .settings-export-import
    app-navbar
      custom-switch(
        slot="left"
        :options="importExportToggleOptions"
        v-model="importExportToggleModel")
      custom-switch(
        slot="right"
        :options="formatsOptions"
        v-model="formatsModel")
    .import(v-if="isImport")
      p
        textarea(
          v-model="importData"
          :placeholder="label('settings.importPlaceholder')")
      p
        button.block(
          :class="{ 'pending': isPending }"
          :disabled="isPending"
          @click.prevent.stop="importEntries")
          i.refresh.material-icons autorenew
          span {{ label('settings.importEntries') }}
    .export(v-if="isExport")
      p
        textarea(
          v-model="exportData"
          :placeholder="label('settings.exportPlaceholder')")
      p
        button.block(
          :class="{ 'pending': isPending }"
          :disabled="isPending"
          @click.prevent.stop="loadAllEntries")
          i.refresh.material-icons autorenew
          span {{ label('settings.loadAllEntries') }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import customSwitch from '@/components/other/custom-switch'
  import appNavbar from '@/components/layout/app-navbar'
  import i18nLabel from '@/mixins/i18n-label'
  import storage from '@/mixins/storage'
  import { driver } from '@/store/storage'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        exportData: null,
        importData: null,
        importExportToggleOptions: [
          { value: 'import', label: 'settings.import' },
          { value: 'export', label: 'settings.export' }
        ],
        importExportToggleModel: '',
        formatsOptions: [
          { value: 'json', label: 'settings.json' }
        ],
        formatsModel: '',
        isPending: false
      }
    },
    created () {
      this.importExportToggleModel = 'import'
      this.formatsModel = 'json'
    },
    computed: {
      isExport () {
        return this.importExportToggleModel === 'export'
      },
      isImport () {
        return this.importExportToggleModel === 'import'
      },
      ...mapGetters([
        'backend'
      ])
    },
    methods: {
      loadAllEntries () {
        this.isPending = true
        driver[this.backend]
          .getEntries({ params: { limit: false } })
          .then(response => {
            delete response.pagination
            this.exportData = JSON.stringify(response, null, '    ')
            this.isPending = false
          })
      },
      importEntries () {
        this.isPending = true
        try {
          const entries = JSON.parse(this.importData).entries
          driver[this.backend]
            .postEntries(entries)
            .then(() => {
              this.getEntriesWithCurrentParams()
              this.isPending = false
              this.importData = ''
              this.closeSidebar()
            })
        } catch (error) {
          this.isPending = false
          const content = `Import entries: ${error.message}`
          bus.$emit('toast', { content, type: 'error' })
          console.warn(error)
        }
      },
      ...mapMutations([
        'closeSidebar'
      ])
    },
    mixins: [
      i18nLabel,
      storage
    ],
    components: {
      customSwitch,
      appNavbar
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .settings-export-import
    .app-navbar
      border-bottom solid titamota-color-border-invert 1px

    textarea
      background-color transparent
      border 0px
      color titamota-color-text-invert
      display block
      font-weight 400
      font-size 12px
      height 100px
      resize none
      width 100%
      padding 0
      margin 10px auto

    .refresh
      animation spin 0.75s infinite linear
      transform rotate(0deg)
      vertical-align middle
      position relative
      top -1px
      text-align center
      display none
    .pending
      .refresh
        display inline-block
</style>
