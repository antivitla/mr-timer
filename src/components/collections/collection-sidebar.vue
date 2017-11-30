<template lang="pug">
  .collection-sidebar.invert
    toggle-sidebar(:title="tipToggleSidebarInSidebar")
    //- Profile
    settings-profile(v-if="settings.profile")
    //- Auth
    div(v-if="settings.authorization && !isAuthorized")
      h4 {{ label('settings.authorization') }}
      settings-login
    //- View
    div.switch-current-view
      h4 {{ label('settings.currentView') }}
      select(v-model="viewModel")
        option(
          v-for="option in availableViewsAsOptions"
          :value="option.value") {{ label(option.label) }}
    //- Report
    div(v-if="settings.reports")
      h4 {{ label('settings.report.title') }}
      settings-report
    //- Display
    div(v-if="settings.displayOptions")
      h4 {{ label('settings.displayOptions') }}
      settings-display
    //- I18n
    div(v-if="settings.l10n")
      h4 {{ label('settings.l10n') }}
      settings-i18n
    //- Migration
    div(v-if="settings.migration")
      h4 {{ label('settings.migration') }}
      settings-migration
    //- Export Import
    div(v-if="settings.exportImport")
      h4 {{ label('settings.exportImport') }}
      settings-export-import
    //- Restore Application
    div(v-if="settings.restoreAppState")
      h4 {{ label('settings.restoreApp.title') }}
      settings-restore
    //- Settings
    div
      h4 {{ label('settings.settings') }}
      settings-settings
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'

  // Components
  import toggleSidebar from '@/components/other/toggle-sidebar'
  import settingsProfile from '@/components/settings/settings-profile'
  import settingsLogin from '@/components/settings/settings-login'
  import settingsI18n from '@/components/settings/settings-i18n'
  import settingsMigration from '@/components/settings/settings-migration'
  import settingsExportImport from '@/components/settings/settings-export-import'
  import settingsSettings from '@/components/settings/settings-settings'
  import settingsDisplay from '@/components/settings/settings-display'
  import settingsRestore from '@/components/settings/settings-restore'
  import settingsReport from '@/components/settings/settings-report'

  // Tips
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        viewModel: null
      }
    },
    created () {
      this.viewModel = this.currentView
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setCurrentView') {
          this.viewModel = mutation.payload.view
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    watch: {
      viewModel: function (view) {
        if (view && view !== this.currentView) {
          this.setCurrentView({ view })
          this.closeSidebar()
        }
      }
    },
    mixins: [
      appTips,
      i18nLabel
    ],
    computed: {
      ...mapGetters([
        'isAuthorized',
        'availableViewsAsOptions',
        'settings',
        'currentView'
      ])
    },
    methods: {
      ...mapMutations([
        'setCurrentView',
        'closeSidebar'
      ])
    },
    components: {
      toggleSidebar,
      settingsProfile,
      settingsLogin,
      settingsI18n,
      settingsMigration,
      settingsExportImport,
      settingsSettings,
      settingsDisplay,
      settingsRestore,
      settingsReport
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/core'

  // No scrollbar
  .sidebar::-webkit-scrollbar
    display none

  // Core
  .sidebar
    font-size 14px
    padding 220px 40px 20px 40px
    box-shadow inset 10px 0px 20px -10px rgba(0,0,0,0.5)
    background titamota-color-back-dark url('~@/assets/images/misty-mountains-bw.png') no-repeat center top
    background-position -30px -90px
    background-size auto 290px
    color titamota-color-text-invert
    option
    select
    button
    .button
      font-size 14px
    a
      color titamota-color-text-invert
    p
      margin-top 5px
      margin-bottom 5px
      &.legend
        margin-top 20px
    h4
      font-size 16px
      line-height 24px
      font-weight 300
      margin 60px auto 15px auto
      color titamota-color-text-invert-highlight
      a
        color inherit
      i
        line-height 1
        vertical-align top
        display inline
        position relative
        top 2px
    h5
      font-size small
      font-weight 500
      margin-bottom 10px
      margin-top 0px

  // Toggle sidebar
  .sidebar
    .toggle-sidebar
      position absolute
      left 0px
      top 0px
      right 0px
      height 150px
      color titamota-color-text-invert
      cursor pointer
      .icon-button
        position absolute
        left 40px
        top 85px
        color titamota-color-text-invert-highlight

  // Forms & settings
  .sidebar
    .form-action
      margin-top 20px
    .form
      display flex
      flex-direction column
      justify-content space-between
      .fieldset
        width 100%
    @media (min-width titamota-screen-w-4)
      .form
        flex-direction row
        .fieldset
          width 45%

    @media (min-width titamota-screen-w-7)
      .settings-settings
        .fieldset:first-child
          width 40%
        .fieldset:last-child
          width 50%

  // Mobile
  @media (min-width titamota-screen-w-7)
    .sidebar
      .switch-current-view
        display none
</style>
