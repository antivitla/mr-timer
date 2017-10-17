<template lang="pug">
  div.app-layout(:class="appLayoutClass")
    section.page
      slot(name="page") Content
    section.sidebar
      slot(name="sidebar") Sidebar
    section.modal
      slot(name="modal") Modal
</template>
<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'app-layout',
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
    }
  }
</script>
<style lang="stylus">
  @import '../../assets/stylesheets/variables'

  .app-layout
    .page
      padding-top 20px
      padding-bottom 20px
      padding-left 20px
      padding-right 20px
      box-sizing border-box
      opacity 1
      transition all 0.3s ease-out
      transform translateX(0px)
      // filter blur(0px) grayscale(0%)
      opacity 1
      @media (min-width 480px)
        padding-left 30px
        padding-right 30px
      @media (min-width 768px)
        padding-top 60px
        padding-left 60px
        padding-right 60px

    .sidebar
      background titamota-color-back-dark url('../../assets/images/misty-mountains-bw.png') no-repeat center top
      background-position -30px -90px
      background-size auto 290px
      color titamota-color-text-invert
      position fixed
      top 0px
      right 0px
      bottom 0px
      overflow auto
      box-sizing border-box
      padding 180px 40px 60px 40px
      width 100%
      box-shadow inset 10px 0px 20px -10px rgba(0,0,0,0.5)
      transform translateX(100%)
      transition all 0.3s ease-out
      font-size 14px
      opacity 0
      pointer-events none
      @media (min-width 768px)
        max-width 50vw

    &.sidebar-active
      .page
        transform translateX(-50vw)
        pointer-events none
      .sidebar
        transform translateX(0%)
        opacity 1
        pointer-events all

    &.modal-active
      .page
        // filter blur(10px) grayscale(100%)
        opacity 0.25
        pointer-events none
</style>
