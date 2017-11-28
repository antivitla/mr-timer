<template lang="pug">
  .modal.report
    .close-modal(@click="closeModal")
      i.material-icons close
    .format.text {{ reportText }}
    //- textarea(:value="reportData" style="width: 100%; height: 500px; box-sizing: border-box;")
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import reportMixin from '@/mixins/report'
  // import Report from '@/report'

  export default {
    data () {
      return {
        reportData: '',
        reportText: ''
      }
    },
    created () {
      const structure = [
        { type: 'summary', summary: { type: 'daysTasks', nest: 1, depth: 1 } },
        { type: 'summary', summary: { type: 'tasks', nest: 2, depth: 2 } },
        { type: 'summary', summary: { type: 'tasks', nest: 0, depth: 1 } },
        { type: 'summary', summary: { type: 'tasks', nest: 0, depth: 0 } },
        { type: 'summary', summary: { type: 'days' } }
      ]
      const report = this.generateMarkdownReport(structure)
      this.reportText = report.content
      console.log(report.filename)
    },
    computed: {
      ...mapGetters([
        'context'
      ])
    },
    methods: {
      ...mapActions([
        'closeModal'
      ])
    },
    mixins: [
      reportMixin
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/modal'

  .modal.report
    .format.text
      white-space pre-wrap
      font-family 'PT Sans', monospace
      font-size 12px
      line-height 20px
</style>
