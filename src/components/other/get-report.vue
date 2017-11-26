<template lang="pug">
  .get-report(
    @click.prevent.stop="openReportModal"
    :title="label('getReport')")
    i.material-icons timeline
</template>
<script>
  import { mapActions } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    methods: {
      openReportModal () {
        console.log('report modal')
        this.openModal({ modal: 'report' })
      },
      ...mapActions([
        'openModal'
      ])
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .get-report
    margin-left 10px
    cursor pointer
    .material-icons
      font-size 21px
      vertical-align middle
</style>
