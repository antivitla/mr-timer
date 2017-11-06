<template lang="pug">
  app-layout(
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore"
    v-body-scroll-top-on="'scroll-top'")

    //- Top nav
    app-navbar.top(slot="page")
      div(slot="left") Context
      toggle-sidebar#toggle-sidebar-top(
        slot="right"
        :title="tipToggleSidebarTop")
        span.icon-button
          i.material-icons menu
    //- Timer
    timer(slot="page")
    //- Optional
    //- section.optional(slot="page")
      mitaba
    //- Navbar
    app-navbar.menu(slot="page")
      div(slot="left")
        filter-entries(v-if="isFiltersVisible")
        bulk-actions(v-if="isBulkActionsVisible")
        div(v-if="viewModel !== 'storage'") Currency
      div(slot="right")
        custom-switch(
          :options="availableViewsAsOptions"
          v-model="viewModel")
    //- Views
    component(:is="viewComponent[currentView]" slot="page")
    //- Footer
    collection-footer(slot="page")

    //- Sidebar
    collection-sidebar(slot="sidebar")

    //- Modals
    //- p(slot="modal") Modals
    //- p(slot="modal") Modals 2
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import appNavbar from '@/components/layout/app-navbar'
  import appLayout from '@/components/layout/app-layout'
  import toggleSidebar from '@/components/other/toggle-sidebar'
  import collectionSidebar from '@/components/collections/collection-sidebar'
  import collectionFooter from '@/components/collections/collection-footer'
  import customSwitch from '@/components/other/custom-switch'
  import filterEntries from '@/components/other/filter-entries'
  import bulkActions from '@/components/other/bulk-actions'
  import timer from '@/components/timer'

  // Store
  import { appTitle } from '@/store/app-info'
  import { Selected } from '@/store/selected'

  // Debug
  import mitaba from '@/components/debug/mitaba'

  // Views
  import viewHelp from '@/components/views/view-help'
  import viewTasks from '@/components/views/view-tasks'
  import viewYears from '@/components/views/view-years'
  import viewMonths from '@/components/views/view-months'
  import viewDays from '@/components/views/view-days'
  import viewStorage from '@/components/views/view-storage'

  // Other
  import bodyScrollTopOn from '@/directives/body-scroll-top-on'

  // Mixins
  import auth from '@/mixins/auth'
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'
  import i18nQuery from '@/mixins/i18n-query'
  import storage from '@/mixins/storage'

  export default {
    data () {
      return {
        viewModel: '',
        viewComponent: {
          help: viewHelp,
          tasks: viewTasks,
          years: viewYears,
          months: viewMonths,
          days: viewDays,
          storage: viewStorage
        },
        Selected,
        filter: []
      }
    },
    created () {
      console.log(`Welcome to ${appTitle}`)
      // Init current view
      this.viewModel = this.currentView
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setCurrentView') {
          this.viewModel = mutation.payload.view
          if (mutation.payload.view !== 'storage') {
            this.clearSelected()
            this.clearFilter()
          }
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    watch: {
      'viewModel': function (view) {
        if (view) {
          this.setCurrentView({ view })
        }
      }
    },
    computed: {
      isFiltersVisible () {
        return this.viewModel === 'storage' && !Selected.entries.length
      },
      isBulkActionsVisible () {
        return this.viewModel === 'storage' && Selected.entries.length
      },
      ...mapGetters([
        'currency',
        'currentView',
        'isAuthorized',
        'isCurrencySymbolBefore',
        'availableViewsAsOptions'
      ])
    },
    methods: {
      ...mapMutations([
        'setCurrentView',
        'clearSelected',
        'clearFilter'
      ])
    },
    mixins: [
      auth,
      appTips,
      i18nLabel,
      i18nQuery,
      storage
    ],
    components: {
      appLayout,
      appNavbar,
      toggleSidebar,
      collectionSidebar,
      collectionFooter,
      customSwitch,
      filterEntries,
      bulkActions,
      viewHelp,
      viewTasks,
      viewYears,
      viewMonths,
      viewDays,
      viewStorage,
      mitaba,
      timer
    },
    directives: {
      bodyScrollTopOn
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/core'
  @import '~@/assets/stylesheets/error'
  @import '~@/directives/long-click'

  // Top Navbar Toggle Sidebar
  .app-navbar.top
    line-height 40px
    margin-bottom 60px
    .toggle-sidebar
      display flex
      cursor pointer
      .material-icons
        font-size 18px
      .user-profile
        margin-right 10px;
        .avatar
        .logout
          display none

  // Menu Navbar
  .app-navbar.menu
    line-height 24px
    border-bottom solid titamota-color-border 1px

  // Hide toggle-sidebar-top
  .sidebar-active
    #toggle-sidebar-top
      display none
</style>
