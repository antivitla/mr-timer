<template lang="pug">
  .view
    article-welcome
    article-help
</template>
<script>
  import articleHelp from '@/components/articles/article-help'
  import articleWelcome from '@/components/articles/article-welcome'
  import bus from '@/event-bus'

  export default {
    mounted () {
      bus.$emit('scroll-top')
    },
    components: {
      articleHelp,
      articleWelcome
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
