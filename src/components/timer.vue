<template lang="pug">
  .timer(
    :class="{ active: timerActive }")
    button(@click="toggle")
      span.main
        span.hrs(
          :class="{ low: hrs < 1 }") {{ hrs }}
        span.delimiter(
          :class="{ low: min < 1 && hrs < 1 }") :
        span.min(
          :class="{ low: min < 1 && hrs < 1 }") {{ min }}
      span.sec {{ sec }}
      span.ms {{ ms }}
    list-input(
      v-model="details"
      :debounce="500"
      :on-submit="toggle"
      :focus="timerActive"
      :reset-focus-on="resetFocusOnEvent"
      :placeholder="placeholder")
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import listInput from './list-input'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'
  import capitalize from 'lodash/capitalize'
  import Entry from '@/models/entry'
  import { duration, durationFraction } from '@/utils/duration'
  import bus from '@/event-bus'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  let tickTimeout

  export default {
    data () {
      return {
        details: [],
        placeholder: '',
        ms: '000',
        resetFocusOnEvent: 'start-task'
      }
    },

    created () {
      this.placeholder = capitalize(funnyTask(this.locale))
      bus.$on('start-task', payload => {
        this.start(payload.entry)
        this.$emit(this.resetFocusOnEvent)
      })
    },

    watch: {
      details (details, prev) {
        // If timer running, changes to task name
        // will replace active entry's details
        if (this.timerActive) {
          // Guarantee to have some details,
          // event if user deleted them
          if (!details.length) {
            this.details = [capitalize(funnyTask(this.locale))]
          }
          // Do not trigger on change, that comes
          // when we start timer with empty details
          // (we will start that task little later in 'toggle').
          // We can detect this by absense of previous details
          if (prev.length) {
            const entry = this.timerEntry
            const update = { details: this.details }
            this.updateEntry({ entry, update })
              .then(updatedEntry => {
                this.setTimerEntry({ entry: updatedEntry })
              })
          }
        }
      }
    },

    computed: {
      hrs () {
        return duration(this.timerDuration)
          .format('HH')
      },
      min () {
        return durationFraction(this.timerDuration)
          .format('mm')
      },
      sec () {
        return durationFraction(this.timerDuration)
          .format('ss')
      },
      ...mapGetters([
        'locale',
        'timerDuration',
        'timerActive',
        'timerEntry'
      ])
    },

    methods: {
      toggle () {
        if (!this.timerActive) {
          this.start()
        } else {
          this.stop()
        }
      },
      start (newEntry) {
        this.stop()
        // Start timer with guaranteed details
        let details = [this.placeholder]
        if (newEntry) {
          this.details = newEntry.details.slice(0)
        } else if (this.details.length) {
          details = this.details.slice(0)
        } else {
          this.details = details
        }
        const entry = newEntry || new Entry({ details })
        this.startTimer({ entry })
        // Start ms tick
        this.tick()
        // Add new entry
        this.addEntry({ entry })
        this.placeholder = capitalize(funnyTask(this.locale))
      },
      stop () {
        // Stop
        this.stopTimer()
        // Stop ms tick
        this.stopTick()
      },
      tick () {
        const d = new Date().getTime() - this.timerEntry.start
        this.ms = durationFraction(d)
          .format('ms')
        tickTimeout = setTimeout(this.tick, 50)
      },
      stopTick () {
        clearTimeout(tickTimeout)
      },
      ...mapMutations([
        'setTimerEntry'
      ]),
      ...mapActions([
        'startTimer',
        'stopTimer',
        'addEntry',
        'removeEntry',
        'updateEntry'
      ])
    },

    components: { listInput }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables.styl'

  .timer
    position relative

    button
      height 60px
      box-sizing border-box
      border none
      cursor pointer
      border-radius 10px
      background-color transparent
      width 100%
      text-align center
      outline none
      border-bottom solid 4px titamota-color-border
      background-color titamota-color-back-gray
      position relative
      &:active
        border-bottom-width 0px
        border-top solid 4px darken(titamota-color-red, 20%)
        background-color titamota-color-red
        color white

      .main
      .sec
      .ms
        font-family PT Mono, monospace
        position absolute
        top 50%
        left 50%
        transform translateY(-50%) translateX(-50%)
      .main
        font-size 30px
        line-height 30px
        margin-left -15px
        display flex
      .delimiter
        font-size 26px
      .sec
        font-size 14px
        line-height 15px
        width: 30px
        text-align center
        display block
        margin-top: -6px
        margin-left 50px
      .ms
        font-size 10px
        line-height 10px
        width: 30px
        margin-top 6px
        margin-left 50px
        text-align center
        display block
      .hrs.low
      .delimiter.low
      .min.low
        opacity 0.5

    textarea
      margin-top 20px
      height 60px
      border-radius 10px
      display block
      outline none
      width 100%
      box-sizing border-box
      padding 14px 20px 14px 20px
      text-align center
      resize none
      background-color white
      border solid 1px titamota-color-border
      font-size 24px
      line-height 30px
      &::placeholder
        color lighten(titamota-color-text-muted, 20%)

    &.active
      button
        border-bottom-width 0px
        border-top solid 4px darken(titamota-color-red, 20%)
        background-color titamota-color-red
        color white

      textarea
        background-color lighten(titamota-color-back-dark, 10%)
        color titamota-color-text-invert-highlight
        border-color titamota-color-back-dark
        border-bottom-width 1px

    @media (min-width 768px)
      button
        position absolute
        left 0px
        top 0px
        width 200px
        bottom 0px
        height auto
        border-top-right-radius 0px
        border-bottom-right-radius 0px

      textarea
        padding-left 220px
        text-align left
        margin-top 0px
</style>
