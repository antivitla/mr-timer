<template lang="pug">
  .view
    article-welcome
    article-help
</template>
<script>
  import articleHelp from '@/components/articles/article-help'
  import articleWelcome from '@/components/articles/article-welcome'

  export default {
    components: {
      articleHelp,
      articleWelcome
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
