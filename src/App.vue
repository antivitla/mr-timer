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
        custom-switch(:options="availableViewsAsOptions" v-model="currentView")

    //- Views
    component(:is="viewComponent[currentView]" slot="page")

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
  import { mapGetters } from 'vuex'
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

  export default {
    data () {
      return {
        currentView: 'help',
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
    },
    computed: {
      ...mapGetters([
        'currency',
        'isAuthorized',
        'isCurrencySymbolBefore',
        'availableViewsAsOptions'
      ])
    },

    mixins: [
      auth,
      appTips,
      i18nLabel,
      i18nQuery
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
