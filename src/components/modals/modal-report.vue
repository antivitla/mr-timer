<template lang="pug">
  .modal.report
    div Report
    .close-modal(@click="closeModal")
      i.material-icons close
</template>
<script>
  import { mapActions } from 'vuex'

  export default {
    methods: {
      ...mapActions([
        'closeModal'
      ])
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/modal'
</style>
