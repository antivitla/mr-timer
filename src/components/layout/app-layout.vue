<template lang="pug">
  div.app-layout(:class="appLayoutClass")
    section.page
      slot(name="page") Content
    section.sidebar(
      v-click-outside="closeSidebar"
      v-esc-outside="closeSidebar")
      slot(name="sidebar") Sidebar
    //- section.modal(
    //-   v-click-outside="closeModal"
    //-   v-esc-outside="closeModal")
    //-   slot(name="modal")
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'

  export default {
    computed: {
      appLayoutClass () {
        return {
          'sidebar-active': this.sidebarActive,
          'modal-active': this.modalActive
        }
      },
      ...mapGetters([
        'sidebarActive',
        'modalActive'
      ])
    },
    methods: {
      ...mapMutations([
        'closeSidebar',
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
      opacity 1
      @media (min-width 480px)
        padding-left 30px
        padding-right 30px
      @media (min-width 768px)
        padding-top 60px
        padding-left 60px
        padding-right 60px

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

    &.sidebar-active
      .page
        transform translateX(-100%)
        @media (min-width titamota-tablet-w)
          transform translateX(-400px)
      .sidebar
        transform translateX(0%)
        opacity 1

    &.modal-active
      .page
        opacity 0.25
        pointer-events none
</style>
