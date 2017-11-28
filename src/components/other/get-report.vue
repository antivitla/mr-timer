<template lang="pug">
  .get-report(
    @click.prevent.stop="openReportModal"
    :title="label('getReport')")
    i.material-icons timeline
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import report from '@/mixins/report'
  import { taskDelimiter } from '@/store/ui'
  import { Tasks } from '@/store/groups/tasks'

  export default {
    computed: {
      ...mapGetters([
        'reportFormat',
        'currentView',
        'context'
      ])
    },
    methods: {
      openReportModal () {
        console.log('report modal')
        this.openModal({ modal: 'report' })
      },
      getReport () {
        // Формат отчёта
        const format = this.reportFormat
        // Отчёт это а) заглавие (контекст), б) краткая и в) подробная часть.
        // Плюс г) название/заглавие интервала(ов) в краткой и подробной частях
        const report = {
          title: this.context.join(taskDelimiter)
        }
        // Отчёт может не иметь именованного интервала, тогда группируется по дням
        // Если отчёт имеет интервалы, внутри они дополнительно делятся по дням
        // Единственная сложность - зависимости и построение дерева:
        // в одном случае не требует таймлайн, в других - требуется
        // Для этого нужно знать текущий вид
        const view = this.currentView
        // Если текущий вид - задачи или хранилище, то
        if (view === 'tasks' || view === 'storage') {
          report.short = this.generateReport({
            children: Tasks.children
          })
          report.long = this.generateReport({
            tree: Tasks.children,
            groupTitleDisplay: 'block' // 'inline'
          })
        }
        console.log(format, report)
      },
      ...mapActions([
        'openModal'
      ])
    },
    mixins: [
      i18nLabel,
      report
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
