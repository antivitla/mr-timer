<template lang="pug">
  app-layout(
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore")

    //- TODO
    //- - Body Scroll Top Directive

    //- Top nav
    app-navbar.top(slot="page")
      h2(slot="left") Context
      toggle-sidebar#toggle-sidebar-top(
        slot="right"
        :title="tipToggleSidebarTop")
        span.icon-button
          i.material-icons menu

    //- Timer
    section.timer(slot="page")

    //- Optional
    //- section.optional(slot="page")

    //- Navbar
    app-navbar.menu(slot="page")
      div(slot="left") Actions
      div(slot="right")
        custom-switch(:options="availableViewsAsOptions" v-model="viewModel")

    //- Views
    component(:is="viewComponent[viewModel]" slot="page")

    //- Footer
    footer(slot="page")
      p Footer

    //- Sidebar
    collection-sidebar(slot="sidebar")

    //- Modals
    p(slot="modal") Modals
    p(slot="modal") Modals 2
</template>

<script>
  import { appTitle } from '@/store/app-info'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import appNavbar from '@/components/layout/app-navbar'
  import appLayout from '@/components/layout/app-layout'
  import toggleSidebar from '@/components/toggle-sidebar'
  import collectionSidebar from '@/components/collections/collection-sidebar'
  import customSwitch from '@/components/custom-switch'

  // Views
  import viewHelp from '@/components/views/view-help'
  import viewTasks from '@/components/views/view-tasks'
  import viewYears from '@/components/views/view-years'
  import viewMonths from '@/components/views/view-months'
  import viewDays from '@/components/views/view-days'
  import viewStorage from '@/components/views/view-storage'

  // Mixins
  import auth from '@/mixins/auth'
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'
  import i18nQuery from '@/mixins/i18n-query'
  import storage from '@/mixins/storage'

  export default {
    data () {
      return {
        viewModel: 'help',
        viewComponent: {
          help: viewHelp,
          tasks: viewTasks,
          years: viewYears,
          months: viewMonths,
          days: viewDays,
          storage: viewStorage
        }
      }
    },
    created () {
      console.log(`Welcome to ${appTitle}`)
      // Init current view
      this.viewModel = this.currentView
      console.log(this.viewModel)
      // Initial get entries
      this.getEntries().then(r => {
        console.log(r)
      })
    },
    watch: {
      'viewModel': function (view) {
        console.log(view)
        this.setCurrentView({ view })
      }
    },
    computed: {
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
        'setCurrentView'
      ]),
      ...mapActions([
        'getEntries'
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
      customSwitch,
      viewHelp,
      viewTasks,
      viewYears,
      viewMonths,
      viewDays,
      viewStorage
    }
  }
</script>

<style lang="stylus">
  @import 'assets/stylesheets/core'

  // Top Navbar Toggle Sidebar
  .app-navbar.top
    line-height 40px
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

  // Hide toggle-sidebar-top
  .sidebar-active
    #toggle-sidebar-top
      display none
</style>
