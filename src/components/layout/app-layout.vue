<template lang="pug">
  div.app-layout(:class="{ 'sidebar-active': sidebarActive, 'modal-active': currentModal,  'full-width': fullWidth }")
    section.page
      slot(name="page") Content
    section.sidebar(
      v-click-outside="closeSidebar"
      v-esc-outside="closeSidebar")
      slot(name="sidebar") Sidebar
    slot(name="other")
    section.modals
      .modal-overlay(
        @click="closeModal"
        @keyup.esc="closeModal")
      slot(name="modal")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'

  export default {
    computed: {
      ...mapGetters([
        'sidebarActive',
        'currentModal',
        'fullWidth'
      ])
    },
    methods: {
      ...mapMutations([
        'closeSidebar'
      ]),
      ...mapActions([
        'closeModal'
      ])
    },
    directives: {
      clickOutside,
      escOutside
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .app-layout
    .page
      padding-top 20px
      padding-bottom 20px
      padding-left 20px
      padding-right 20px
      box-sizing border-box
      opacity 1
      margin-right 0px
      transition all 0.3s ease-out
      transform translateX(0px)
      margin-right 0
      opacity 1
      @media (min-width 480px)
        padding-left 30px
        padding-right 30px
      @media (min-width 768px)
        padding-top 60px
        padding-left 60px
        padding-right 60px
      @media (min-width 1366px)
        padding-top 60px
        padding-left 90px
        padding-right 90px

    .sidebar
      position fixed
      top 0px
      right 0px
      bottom 0px
      overflow auto
      box-sizing border-box
      width 100%
      min-width 320px
      transform translateX(100%)
      transition all 0.3s ease-out
      opacity 1
      @media (min-width titamota-tablet-w)
        max-width 400px

    &:not(.full-width)
      .page
        max-width 1280px
        @media (min-width titamota-screen-w-13)
          margin-left calc(50% - 640px)
          margin-right calc(50% - 640px)

    &.sidebar-active
      .page
        transform translateX(-100%)
        @media (min-width titamota-tablet-w)
          transform translateX(-400px)
        @media (min-width titamota-screen-w-13)
          transform translateX(0px)
          margin-right 400px
          margin-left 0px
          max-width 100%
          // padding-left 120px
          // padding-right 120px
      .sidebar
        transform translateX(0%)
        opacity 1

    .modals
      display none
      position relative
      box-sizing border-box
      @media (min-width titamota-screen-w-7)
        padding 20px

    &.modal-active
      .modals
        display block
        position fixed
        height 100vh
        overflow-y scroll
        left 0px
        top 0px
        width 100vw
        z-index 10

      .modal-overlay
        display block
        position fixed
        left 0px
        top 0px
        width 100%
        bottom 0px
        z-index 11
        background-color alpha(titamota-color-back-light, 75%)

      .page
        pointer-events none

    // &.modal-active
    //   position fixed
    //   left 0px
    //   width 100%
    //   height 100vh
    //   overflow-y scroll
    //   .page
    //     height 100vh
    //     position fixed
    //     left 0px
    //     width 100%
    //     // overflow-y scroll
    //   .modal-overlay
    //     visibility visible
    //     transition opacity 0.3s
    //     opacity 1


</style>
