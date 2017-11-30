<template lang="pug">
  .get-report
    div(
      v-if="showReportModal && !download"
      @click.prevent.stop="openReportModal")
      slot content
    div(
      v-else
      @click="downloadReportWithCurrentParams()")
      slot download
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import reportMixin from '@/mixins/report'

  export default {
    props: {
      download: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        reportEndpoint: '',
        reportUrl: '',
        reportFilename: ''
      }
    },
    computed: {
      ...mapGetters([
        'showReportModal'
      ])
    },
    methods: {
      openReportModal () {
        this.openModal({ modal: 'report' })
      },
      ...mapActions([
        'openModal'
      ])
    },
    mixins: [
      reportMixin
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .get-report
    cursor pointer
    a
    a[href]
      text-decoration none
      color inherit
      display block
</style>
