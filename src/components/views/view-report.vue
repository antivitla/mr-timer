<template lang="pug">
  .report
    //- div(style="display: flex;")
    //-   div
    //-     span Максимальная глубина
    //-     select
    //-       option 1
    //-       option 2
    //-       option 3
    //-       option Нет
    //-   div &emsp;
    //-   div
    //-     span Показывать результаты
    //-     select
    //-       option Время и деньги
    //-       option Только время
    //-       option Только деньги
    //-       option Ничего
    textarea.report(
      :value="textReport"
      rows="1"
      spellcheck="false")
</template>
<script>
  import autosize from 'autosize'
  import { mapGetters } from 'vuex'
  import report from '@/mixins/report'
  import bus from '@/event-bus'

  export default {
    name: 'view-report',
    props: {
      source: Array
    },
    data () {
      return {
        handler: () => {
          setTimeout(() => {
            autosize.update(this.$el.querySelector('textarea'))
          }, 100)
        }
      }
    },
    created () {
      bus.$on('get-entries-complete', this.handler)
    },
    mounted () {
      autosize(this.$el.querySelector('textarea'))
    },
    updated () {
      autosize(this.$el.querySelector('textarea'))
    },
    beforeDestroy () {
      bus.$off('get-entries-complete', this.handler)
    },
    computed: {
      textReport () {
        let title = this.context.join(' / ')
        title = `${title}\n${'='.repeat(title.length)}\n\n`
        const report = JSON.stringify(this.generateReport(this.source), null, '  ')
        // .join('\n') // .replace(/\n{4,}/g, '\n\n')
        return (this.context.length ? title : '') + report.trim()
      },
      ...mapGetters([
        'context'
      ])
    },
    mixins: [
      report
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/report'
</style>
