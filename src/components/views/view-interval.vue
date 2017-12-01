<template lang="pug">
  .view-interval
    .from
      datepicker(
        v-model="from"
        :language="locale"
        :minimumView="minView"
        :maximumView="maxView"
        :format="customFormatter")
      i.material-icons keyboard_arrow_down
    .to
      i.material-icons keyboard_arrow_down
      datepicker(
        v-model="to"
        :language="locale"
        :minimumView="minView"
        :maximumView="maxView"
        :format="customFormatter")
</template>
<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import bus from '@/event-bus'
  import { Storage } from '@/store/storage'
  import capitalize from '@/utils/capitalize'

  export default {
    props: {
      format: {
        type: String,
        default: 'DD MMMM YYYY'
      },
      minView: String,
      maxView: String
    },
    data () {
      return {
        from: new Date(),
        to: new Date(),
        handleUpdateDates: () => {
          setTimeout(() => {
            if (Storage.entries.length) {
              this.from = new Date((Storage.entries[Storage.entries.length - 1].start))
              this.to = new Date((Storage.entries[0].start))
            }
          }, 100)
        }
      }
    },
    created () {
      this.handleUpdateDates()
      bus.$on('get-entries-complete', this.handleUpdateDates)
    },
    beforeDestroy () {
      bus.$off('get-entries-complete', this.handleUpdateDates)
    },
    computed: {
      ...mapGetters([
        'locale'
      ])
    },
    methods: {
      customFormatter (date) {
        return capitalize(moment(date).format(this.format))
      }
    },
    components: {
      Datepicker
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .view-interval
    display flex
    justify-content space-between
    align-items flex-start
    margin-top titamota-view-margin
    line-height 24px
    border-top solid titamota-color-border 1px
    font-size 13px
    .material-icons
      margin 0px
      font-size 18px
      height 24px
      line-height 24px
      position absolute
      top 0px
      z-index 10
      pointer-events none
      & + *
        margin-left 0px
    .vdp-datepicker
      input[type="text"]
        cursor pointer
        border none
        line-height 24px
        height 24px
        font-size 13px
        background-color transparent
        max-width 150px
        box-sizing border-box
        padding 0
        @media (max-width titamota-screen-w-4)
          max-width 140px
    .from
    .to
      display flex
      align-items center
      position relative
    .from
      .material-icons
        left 0px
      input[type]
        padding-left 24px
      .vdp-datepicker__calendar
        left 0px
        bottom 24px
    .to
      .material-icons
        right 0px
      input[type]
        text-align right
        padding-right 24px
      .vdp-datepicker__calendar
        right 0px
        bottom 24px

</style>
