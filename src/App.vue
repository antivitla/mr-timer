<template lang="pug">
  app-layout(
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore"
    v-body-scroll-top-on="'scroll-top'")
    //- Top nav
    app-navbar.top(slot="page")
      context-nav(slot="left")
      toggle-sidebar(
        slot="right"
        :class="{ 'pending': isPending }"
        :title="tipToggleSidebarTop")
        span.user-name(v-if="isAuthorized") {{ userName }}
        span.icon-button.menu
          i.material-icons menu
        icon-preloader(icon="refresh")
    //- Timer
    timer(slot="page")
    //- Timeline
    timeline(slot="page")
    //- Debug Bdckend
    mitaba(slot="page")
    //- Navbar
    app-navbar.menu(slot="page")
      div(slot="left")
        filter-entries(v-if="isFiltersVisible")
        bulk-actions(v-if="isBulkActionsVisible")
        price-per-hour(v-if="isPricePerHourVisible")
      div(slot="right" style="display: flex;")
        custom-switch(
          :options="availableViewsAsOptions"
          v-model="viewModel")
        get-report
    //- Views
    component(:is="viewComponent[currentView]" slot="page")
    //- Sidebar
    collection-sidebar(slot="sidebar")
    //- Footer
    collection-footer(slot="sidebar")
    //- Messages
    toaster(slot="other")
    //- Modals
    modal-report(slot="modal" v-if="currentModal === 'report'")
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
  import toaster from '@/components/other/toaster'
  import getReport from '@/components/other/get-report'
  import timer from '@/components/timer'
  import timeline from '@/components/timeline'
  import mitaba from '@/components/mitaba'
  import modalReport from '@/components/modals/modal-report'
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
        isPending: false
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
      this.getEntriesWithCurrentParams()

      // Global mutation dependencies
      const viewsWithEntries = ['days', 'months', 'years', 'tasks', 'storage']
      const mutations = {
        setCurrentView: mutation => {
          this.viewModel = mutation.payload.view
          if (mutation.payload.view !== 'storage') {
            this.clearSelected()
            this.clearFilter()
            this.clearPagination()
          }
          if (viewsWithEntries.indexOf(mutation.payload.view) > -1) {
            this.getEntriesWithCurrentParams()
            bus.$emit('scroll-top')
          }
        },
        setAuthorized: mutation => {
          this.clearContext()
          this.clearSelected()
          this.clearFilter()
          this.clearPagination()
          this.setBackend({ backend: 'mitaba' })
          this.getProfile()
          this.getEntriesWithCurrentParams()
          this.closeSidebar()
          bus.$emit('scroll-top')
        },
        setNotAuthorized: mutation => {
          this.clearUser()
          this.clearContext()
          this.clearSelected()
          this.clearFilter()
          this.clearPagination()
          this.setBackend({ backend: 'local' })
          this.getEntriesWithCurrentParams()
          this.closeSidebar()
          bus.$emit('scroll-top')
        },
        setFilter: mutation => {
          this.getEntries({
            params: {
              limit: this.pagination.storage.limit,
              offset: 0,
              filter: mutation.payload.filter.map(f => f.trim()).filter(f => f)
            }
          })
          bus.$emit('scroll-top')
        },
        updatePagination: mutation => {
          this.getEntriesWithCurrentParams()
          bus.$emit('scroll-top')
        }
      }
      this.unsubscribe = this.$store.subscribe(mutation => {
        mutations[mutation.type] && mutations[mutation.type](mutation)
      })

      // Global actions dependencies
      const actions = {
        activateLocale: action => {
          document.documentElement.setAttribute('lang', action.payload.locale)
          // const name = this.$route.name
          // const query = Object.assign({}, this.$route.query, {
          //   locale: action.payload.locale
          // })
          // this.$router.push({ name, query })
        },
        activateCurrency: action => {
          // const name = this.$route.name
          // const query = Object.assign({}, this.$route.query, {
          //   currency: action.payload.currency
          // })
          // this.$router.push({ name, query })
        }
      }
      this.unsubscribeAction = this.$store.subscribeAction(action => {
        actions[action.type] && actions[action.type](action)
      })

      // Init view preloaders
      bus.$on('get-entries-pending', () => {
        this.isPending = true
      })
      bus.$on('get-entries-complete', () => {
        this.isPending = false
      })

      // Init i18n
      this.activateLocale({ locale: this.$route.query.locale || this.locale })
      this.activateCurrency({ currency: this.$route.query.currency || this.currency })
    },
    beforeDestroy () {
      this.unsubscribe()
      this.unsubscribeAction()
    },
    watch: {
      'viewModel': function (view) {
        if (view && view !== this.currentView) {
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
        'authToken',
        'pagination',
        'currentModal'
      ])
    },
    methods: {
      ...mapMutations([
        'setCurrentView',
        'setBackend',
        'clearSelected',
        'clearFilter',
        'clearUser',
        'clearContext',
        'clearPagination',
        'closeSidebar'
      ]),
      ...mapActions([
        'getProfile',
        'getEntries',
        'activateLocale',
        'activateCurrency',
        'authorizeWithMitaba'
      ])
    },
    mixins: [
      appTips,
      i18nLabel,
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
      pricePerHour,
      contextNav,
      iconPreloader,
      viewHelp,
      viewTasks,
      viewYears,
      viewMonths,
      viewDays,
      viewStorage,
      timer,
      timeline,
      mitaba,
      toaster,
      getReport,
      modalReport
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
    .left
      max-width 80%
      @media (min-width titamota-screen-w-7)
        max-width 70%
    .toggle-sidebar
      display flex
      cursor pointer
      margin-top 13px
      @media (max-width titamota-screen-w-7)
        margin-top 11px
      white-space nowrap
      .material-icons
        font-size 18px
        line-height 40px
      .icon-preloader
        display none
        width 18px
        color titamota-color-text
      .user-name
        padding-right 15px
        position relative
        top 1px
      &.pending
        .user-name
          color titamota-color-text-muted
        .icon-button.menu
          display none
        .icon-preloader
          display block
    @media (max-width titamota-screen-w-7)
      margin-bottom 15px
      .toggle-sidebar
        margin-top 12px
        .user-name
          display none

  // Menu Navbar
  .app-navbar.menu
    line-height 24px
    border-bottom solid titamota-color-border 1px
    @media (max-width titamota-screen-w-7)
      display none
</style>
