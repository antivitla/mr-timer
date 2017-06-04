<template lang="pug">
  div.titata
    div {{message}}
    petrov
</template>

<script>
  import petrov from '@/components/petrov'

  export default {
    data () {
      return {
        message: 'Hello, world'
      }
    },
    components: {
      petrov
    }
  }
</script>

<style lang="stylus">
  @import 'assets/stylesheets/variables.styl'
  @import 'assets/stylesheets/common.styl'

  body
    margin 0
    padding 0
    background-color ghostwhite
    color #333

  body
  input
  textarea
  button
  select
  option
    font-family Rubik, sans-serif
    font-size 16px
    line-height 20px
    font-weight 300
    color #333
</style>
