<template lang="pug">
  app-layout(
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore")

    //- TODO
    //- - Body Scroll Top Directive

    //-
    //- Page
    //-

    //- Top
    app-navbar.top(slot="page")
      h2(slot="left") Context

      toggle-sidebar#toggle-sidebar-top(
        slot="right"
        :title="tipToggleSidebarTop")
        span.icon-button
          i.material-icons menu

    //- Timer
    section.timer(slot="page")
      //- p App Timer

    //- Optional
    section.optional(slot="page")
      p Optional

    //- Navbar
    app-navbar.menu(slot="page")
      p(slot="left") Actions
      p(slot="right") Views Menu

    //- Main
    main.views(slot="page")
      p Main view

    //- Footer
    footer(slot="page")
      p Footer

    //-
    //- Sidebar
    //-

    collection-sidebar(slot="sidebar")

    //-
    //- Modals
    //-

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
  // Articles
  import articleWelcome from '@/components/articles/article-welcome'
  import articleHelp from '@/components/articles/article-help'
  // Mixins
  import authMixin from '@/mixins/auth'
  import appTips from '@/mixins/app-tips'
  import i18nLabel from '@/mixins/i18n-label'
  import i18nQuery from '@/mixins/i18n-query'

  export default {
    created () {
      console.log(`Welcome to ${appTitle}`)
    },

    computed: {
      ...mapGetters([
        'currency',
        'isAuthorized',
        'isCurrencySymbolBefore'
      ])
    },

    mixins: [
      authMixin,
      appTips,
      i18nLabel,
      i18nQuery
    ],

    components: {
      appLayout,
      appNavbar,
      toggleSidebar,
      collectionSidebar,
      articleWelcome,
      articleHelp
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
