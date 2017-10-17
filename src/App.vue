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

      toggle-sidebar(slot="right")
        user-profile
        span.icon-button
          i.material-icons menu

    //- Timer
    section.timer(slot="page")
      p App Timer

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

    //- Toggle Sidebar
    toggle-sidebar(slot="sidebar")
    //- Profile
    user-profile(slot="sidebar")

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
  import toggleSidebar from '@/components/layout/toggle-sidebar'
  import userProfile from '@/components/user-profile'

  export default {
    created () {
      console.log(`Welcome to ${appTitle}`)
    },

    computed: {
      ...mapGetters([
        'currency',
        'isCurrencySymbolBefore'
      ])
    },

    components: {
      appLayout,
      appNavbar,
      toggleSidebar,
      userProfile
    }
  }
</script>

<style lang="stylus">
  @import 'assets/stylesheets/core'
  @import 'assets/stylesheets/sidebar'

  // Top Navbar Toggle Sidebar
  .app-navbar.top
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

  // Hide Top Navbar Toggle Sidebar when Sidebar active
  .app-layout.sidebar-active
    .app-navbar.top
      .toggle-sidebar
        visibility hidden

</style>
