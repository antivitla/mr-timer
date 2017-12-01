<template lang="pug">
  .view-interval
    .from
      datepicker(
        v-model="start"
        :language="locale"
        :initialView="initialView"
        :monday-first="true"
        :clear-button="true"
        :clear-button-icon="'clear-date material-icons'"
        @selected="selectIntervalStart"
        :format="customFormatter")
      i.material-icons.open keyboard_arrow_down
      .auto(v-if="!start") начало времён
    .to
      i.material-icons.open keyboard_arrow_down
      datepicker(
        v-model="stop"
        :language="locale"
        :initialView="initialView"
        :monday-first="true"
        :clear-button="true"
        :clear-button-icon="'clear-date material-icons'"
        @selected="selectIntervalStop"
        :format="customFormatter")
      .auto(v-if="!stop") сегодня
</template>
<script>
  import moment from 'moment'
  import { mapGetters, mapMutations } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import capitalize from '@/utils/capitalize'

  // function cleamDa

  export default {
    props: {
      format: {
        type: String,
        default: 'DD MMMM YYYY'
      },
      initialView: String
    },
    data () {
      return {
        start: new Date(),
        stop: 'auto'
      }
    },
    created () {
      this.start = this.intervalStart
      this.stop = this.intervalStop
    },
    computed: {
      ...mapGetters([
        'locale',
        'intervalStart',
        'intervalStop'
      ])
    },
    methods: {
      customFormatter (date) {
        return capitalize(moment(date).format(this.format))
      },
      selectIntervalStart (start) {
        this.setIntervalStart({ start })
      },
      selectIntervalStop (stop) {
        this.setIntervalStop({ stop })
      },
      ...mapMutations([
        'setIntervalStart',
        'setIntervalStop'
      ])
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
    .clear-date
      position absolute
      top 0px
      font-size 14px
      width 24px
      text-align center
      color titamota-color-text-muted
      &:before
        content: 'close'
    .open
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
        max-width 135px
        box-sizing border-box
        padding 0
        font-weight 300
        @media (max-width titamota-screen-w-4)
          max-width 135px
    .auto
      position absolute
      top 0px
      pointer-events none
    .from
    .to
      display flex
      align-items center
      position relative
    .from
      .open
        left 0px
      .clear-date
        right 0px
      input[type]
        padding-left 24px
      .vdp-datepicker__calendar
        left 0px
        bottom 24px
      .auto
        left 24px
    .to
      .open
        right 0px
      .clear-date
        left 0px
      input[type]
        text-align right
        padding-right 24px
      .vdp-datepicker__calendar
        right 0px
        bottom 24px
      .auto
        right 24px
</style>
