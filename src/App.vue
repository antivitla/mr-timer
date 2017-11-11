<template lang="pug">
  app-layout(
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore"
    v-body-scroll-top-on="'scroll-top'")
    //- Top nav
    app-navbar.top(slot="page")
      context-nav(slot="left")
      toggle-sidebar#toggle-sidebar-top(
        slot="right"
        :title="tipToggleSidebarTop")
        span(v-if="isAuthorized") {{ userName }}&emsp;
        span.icon-button
          i.material-icons menu
    //- Timer
    timer(slot="page")
    //- Optional
    //- section.optional(slot="page")
    //- Navbar
    app-navbar.menu(slot="page")
      div(slot="left")
        filter-entries(v-if="isFiltersVisible")
        bulk-actions(v-if="isBulkActionsVisible")
        price-per-hour(v-if="isPricePerHourVisible")
      div(slot="right")
        custom-switch(
          :options="availableViewsAsOptions"
          v-model="viewModel")
        icon-preloader(v-if="viewGetPreloader || false" icon="refresh")
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
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import bodyScrollTopOn from '@/directives/body-scroll-top-on'
  import bus from '@/event-bus'
  import Mitaba from '@/backend/mitaba'

  // Components
  import appNavbar from '@/components/layout/app-navbar'
  import appLayout from '@/components/layout/app-layout'
  import toggleSidebar from '@/components/other/toggle-sidebar'
  import collectionSidebar from '@/components/collections/collection-sidebar'
  import collectionFooter from '@/components/collections/collection-footer'
  import customSwitch from '@/components/other/custom-switch'
  import filterEntries from '@/components/other/filter-entries'
  import bulkActions from '@/components/other/bulk-actions'
  import pricePerHour from '@/components/other/price-per-hour'
  import contextNav from '@/components/other/context-nav'
  import iconPreloader from '@/components/other/icon-preloader'
  import timer from '@/components/timer'

  // Store
  import { appTitle } from '@/store/app-info'
  import { Selected } from '@/store/selected'

  // Views
  import viewHelp from '@/components/views/view-help'
  import viewTasks from '@/components/views/view-tasks'
  import viewYears from '@/components/views/view-years'
  import viewMonths from '@/components/views/view-months'
  import viewDays from '@/components/views/view-days'
  import viewStorage from '@/components/views/view-storage'

  // Mixins
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'

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
        filter: [],
        viewGetPreloader: false
      }
    },
    created () {
      console.log(`Welcome to ${appTitle}`)

      // Finish auth, if redirected
      if (this.$route.name === 'providerAuthRedirect') {
        this.authorizeWithMitaba({
          provider: this.$route.params.provider,
          code: this.$route.query.code
        })
        this.$router.push({ name: 'home' })
      }

      // Init auth
      if (this.isAuthorized) {
        Mitaba.token = this.authToken
        this.setBackend({ backend: 'mitaba' })
      } else {
        this.clearUser()
        this.setBackend({ backend: 'local' })
      }

      // Init current view
      this.viewModel = this.currentView
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setCurrentView') {
          this.viewModel = mutation.payload.view
        }
      })

      // Init view preloaders
      bus.$on('get-entries-pending', () => {
        this.viewGetPreloader = true
      })
      bus.$on('get-entries-complete', () => {
        this.viewGetPreloader = false
      })

      // Init i18n
      this.activateLocale({ locale: this.$route.query.locale || this.locale })
      this.activateCurrency({ currency: this.$route.query.currency || this.currency })
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
      isPricePerHourVisible () {
        return this.viewModel !== 'storage'
      },
      ...mapGetters([
        'currency',
        'locale',
        'currentView',
        'isAuthorized',
        'isCurrencySymbolBefore',
        'availableViewsAsOptions',
        'userName',
        'authToken'
      ])
    },
    methods: {
      ...mapMutations([
        'setCurrentView',
        'setBackend',
        'clearSelected',
        'clearFilter',
        'clearUser'
      ]),
      ...mapActions([
        'activateLocale',
        'activateCurrency',
        'authorizeWithMitaba'
      ])
    },
    mixins: [
      appTips,
      i18nLabel
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
      pricePerHour,
      contextNav,
      iconPreloader,
      viewHelp,
      viewTasks,
      viewYears,
      viewMonths,
      viewDays,
      viewStorage,
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
    min-height 60px
    margin-bottom 60px
    .toggle-sidebar
      display flex
      cursor pointer
      margin-top 15px
      white-space nowrap
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
    position relative
    .icon-preloader
      position absolute
      left 50%
      transform translateX(-50%)
      bottom calc(100% + 5px)
      color titamota-color-text-muted

  // Hide toggle-sidebar-top
  .sidebar-active
    #toggle-sidebar-top
      // display none
</style>
