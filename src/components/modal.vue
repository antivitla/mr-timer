<template lang="pug">
  .modal-wrapper
    .modal-container(
      v-click-outside="closeModal"
      v-esc-outside="closeModal")
      component(:is="modalActive")
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import importExport from '@/components/modals/import-export'
  import chooseAvatar from '@/components/modals/choose-avatar'
  import clickOutside from '@/directives/click-outside'
  import escOutside from '@/directives/esc-outside'

  export default {
    computed: {
      ...mapGetters([
        'modalActive'
      ])
    },

    methods: {
      ...mapMutations([
        'closeModal',
        'openModal'
      ])
    },

    directives: {
      clickOutside,
      escOutside
    },

    components: {
      importExport,
      chooseAvatar
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  .modal-wrapper
    left 0px
    top 0px
    right 0px
    bottom 0px
    position fixed
    overflow auto
    background-color alpha(titamota-color-back-dark, 0%)
    .modal-container
      position absolute
      left 50%
      top 50%
      transform translateX(-50%) translateY(-50%)
</style>
