<template>
  div.mr-timer
    div {{message}}
    petrov
</template>

<script>
  // import petrov from '@/components/petrov'

  export default {
    data () {
      return {
        message: 'Hello, world'
      }
    }
    // components: {
    //   petrov
    // }
  }
</script>

<style lang="stylus" scoped>
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

  select
  option
    font-size 14px

  body
    margin 0
    background-color ghostwhite
    color #333

  h1
  h2
  h3
  h4
  h5
  h6
  strong
    font-weight 400
    margin 20px auto

  p
    margin 20px auto
    font-weight 300

  h4
    font-size 16px
    line-height 24px

  h2
    font-size 32px
    line-height 40px
    margin-bottom 15px

  .material-icons
    font-size 18px

  * + .material-icons
  .material-icons + *
    margin-left 5px

  [valign="middle"]
    vertical-align middle

  a[href]
    color steelblue
</style>
