<template lang="pug">
  div.storage-item
    span.start {{ start }}
    span.details {{ details }}
    span.duration {{ duration }}
</template>

<script>
  import moment from 'moment'
  import 'moment-duration-format'

  export default {
    props: ['entry'],
    // data () {
    //   return {
    //     startMoment: moment(this.entry.start)
    //   }
    // },
    computed: {
      details () {
        return this.entry.details.join(' / ')
      },
      duration () {
        return moment
          .duration(this.entry.stop - this.entry.start)
          .format('HH:mm', { trim: false })
      },
      start () {
        return moment(this.entry.start).format('DD MMM YYYY в HH:mm')
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables.styl'

  .storage-item
    display flex
    flex-direction column
    margin 10px auto
    @media (min-width 768px)
      flex-direction row

    .start
    .details
    .duration
      display inline-block

    .start
      color ttt-text-muted
      font-size 14px
      font-family PT Mono
      width 180px

    .details
      @media (min-width 768px)
        max-width calc(100% - 260px)
        margin 0px 10px 0px 10px

    .duration
      color ttt-text-muted
      font-family PT Mono
      font-size 14px
      width 50px
      &:before
        content "="
        margin-right 10px

</style>
