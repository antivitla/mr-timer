<template lang="pug">
  .modal-wrapper(
    @click="closeModal"
    :inline="isInline")
    .modal-container(
      @click.prevent.stop=""
      :style="{ left: position.left + 'px', top: position.top + 'px' }")
      component(
        :is="id"
        :data="data")
</template>

<script>
  import bus from '@/event-bus'
  import editTask from '@/components/modals/edit-task'

  export default {
    props: ['id', 'data', 'position'],

    computed: {
      isInline () {
        if (this.position) {
          return true
        }
        return false
      }
    },

    methods: {
      closeModal () {
        bus.$emit('close-modal')
      }
    },

    components: {
      editTask
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables'

  .modal-wrapper
    left 0px
    top 0px
    right 0px
    bottom 0px

  .modal-wrapper:not([inline="true"])
    position fixed
    overflow auto
    background-color alpha(titamota-color-back-dark, 10%)
    .modal-container
      position absolute
      left 50%
      top 50%
      transform translateX(-50%) translateY(-50%)
      background-color titamota-color-back-light
      box-shadow 0px 0px 20px alpha(titamota-color-text, 10%)
      border-radius 5px
      padding 20px 0px

    .modal-header
    .modal-body
    .modal-footer
      padding 10px 40px
      & > :first-child
        margin-top 0px
      & > :last-child
        margin-bottom 0px

  .modal-wrapper[inline="true"]
    position absolute
    .modal-container
      position absolute
      right 0px

</style>
