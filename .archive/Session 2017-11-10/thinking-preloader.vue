<template lang="pug">
  .thinking-preloader
    img(src="static/img/cat-preloader.gif")
    span {{ thinkingLabel }}
</template>
<script>
  import { mapGetters } from 'vuex'
  import { translate } from '@/store/i18n'
  import capitalize from 'lodash/capitalize'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'
  import bus from '@/event-bus'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  export default {
    data () {
      return {
        thinkingLabel: '...'
      }
    },
    created () {
      this.refreshThinkingLabel()
      bus.$on('batch-thinking-start', () => {
        this.refreshThinkingLabel()
      })
      bus.$on('load-entries-start', () => {
        this.refreshThinkingLabel()
      })
    },
    computed: {
      ...mapGetters([
        'locale'
      ])
    },
    methods: {
      refreshThinkingLabel () {
        const task = funnyTask(this.locale)
        const wait = translate[this.locale].standby
        this.thinkingLabel = capitalize(`${task}, ${wait}...`)
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .thinking-preloader
    text-align center
    color titamota-color-text-muted
    margin-top 40px;
    margin-bottom 40px;
    img
      display block
      opacity 0.25
      margin 0px auto 10px auto
</style>
