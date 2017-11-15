<template lang="pug">
  .timer(:class="{ 'active': timerActive || timerIsQuickActivated }")
    button(@click="toggle" @mousedown="quickActivate")
      span.main
        span.hrs(:class="{ 'low': hrs < 1 }") {{ hrs }}
        span.delimiter(:class="{ 'low': min < 1 && hrs < 1 }") :
        span.min(:class="{ 'low': min < 1 && hrs < 1 }") {{ min }}
      span.sec {{ sec }}
      span.ms {{ ms }}
    list-input(
      :value="edit.details"
      @input-original-event="updateDetails($event)"
      :debounce="50"
      :on-submit="toggle"
      :focus="timerActive"
      :reset-focus-on="resetFocusOnEvent"
      :placeholder="placeholder")
</template>
<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import funny from 'mr-funny'
  import funnyTemplates from '@/funny/templates'
  import Entry from '@/models/entry'
  import listInput from '@/components/other/list-input'
  import { Storage } from '@/store/storage'
  import { taskDelimiter } from '@/store/ui'
  import capitalize from '@/utils/capitalize'
  import { duration, durationFraction } from '@/utils/duration'

  function funnyTask (locale) {
    return funny.phrase(funnyTemplates[locale].base)
  }

  function parseList (list) {
    return (typeof list === 'string' ? list.split(taskDelimiter) : list)
      .map(item => item.replace(/\n/g, '').trim())
      .filter(item => item)
  }

  export default {
    data () {
      return {
        details: [],
        edit: {
          details: ''
        },
        placeholder: '',
        ms: '000',
        resetFocusOnEvent: 'start-task',
        Storage: Storage,
        timerIsQuickActivated: false,
        saveDelayMin: 0.02,
        lastSaveDate: new Date().getTime(),
        tickTimeout: undefined
      }
    },
    created () {
      // Set funny placholer initially
      this.placeholder = capitalize(funnyTask(this.locale))

      // React on stop and start of timer
      const actions = {
        'startTimer': action => {
          this.onStart(action.payload.entry)
          this.$emit(this.resetFocusOnEvent)
        },
        'stopTimer': action => {
          this.onStop()
        }
      }
      this.unsubscribeActions = this.$store.subscribeAction(action => {
        if (actions[action.type]) {
          actions[action.type](action)
        }
      })

      // React on mutations
      const mutations = {
        'tickTimer': mutation => {
          // Save stop time (patch) every this.saveDelayMin minutes
          if (this.timerEntry.id !== 'new') {
            const wait = (new Date().getTime() - this.lastSaveDate) / 60000
            if (wait > this.saveDelayMin) {
              this.patchEntries({
                remove: [this.timerEntry],
                add: [this.timerEntry]
              })
              this.lastSaveDate = new Date().getTime()
            }
          }
        },
        'addEntries': mutation => {
          // If we are tracking one of patched entries,
          // change accordingly
          const timerEntry = mutation.payload.entries.find(entry => {
            return entry.id === this.timerEntry.id
          })
          if (timerEntry) {
            this.setTimerEntry({
              entry: timerEntry
            })
            this.details = timerEntry.details.slice(0)
            this.edit.details = this.details.join(taskDelimiter)
          }
        }
      }
      this.unsubscribe = this.$store.subscribe(mutation => {
        mutations[mutation.type] && mutations[mutation.type](mutation)
      })
    },
    beforeDestroy () {
      this.unsubscribeActions()
      this.unsubscribe()
    },
    computed: {
      hrs () {
        return duration(this.timerDuration).format('HH')
      },
      min () {
        return durationFraction(this.timerDuration).format('mm')
      },
      sec () {
        return durationFraction(this.timerDuration).format('ss')
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
          const details = this.details.length ? this.details.slice(0) : [this.placeholder]
          this.startTimer({
            entry: new Entry({ details })
          })
        } else {
          this.patchEntries({
            remove: [this.timerEntry],
            add: [this.timerEntry]
          })
          this.stopTimer()
        }
      },
      quickActivate () {
        if (!this.timerActive) {
          this.timerIsQuickActivated = true
          setTimeout(() => {
            this.timerIsQuickActivated = false
          }, 300)
        }
      },
      onStart (entry) {
        this.onStop()
        this.details = entry.details.slice(0)
        this.edit.details = this.details.join(taskDelimiter)
        this.placeholder = capitalize(funnyTask(this.locale))
        this.tick()
      },
      onStop () {
        this.stopTick()
      },
      updateDetails (event) {
        let details = parseList(event.target.value)
        this.edit.details = event.target.value
        this.details = details
        // If timer running, changes to task name
        // will replace active entry's details
        if (this.timerActive) {
          if (!details || !details.length) {
            details = [capitalize(funnyTask(this.locale))]
          }
          const entry = new Entry(Object.assign({}, this.timerEntry, { details }))
          this.patchEntries({
            remove: [this.timerEntry],
            add: [entry]
          })
        }
      },
      tick () {
        const d = new Date().getTime() - this.timerEntry.start
        this.ms = durationFraction(d).format('ms')
        this.tickTimeout = setTimeout(this.tick, 50)
      },
      stopTick () {
        clearTimeout(this.tickTimeout)
      },
      ...mapMutations([
        'setTimerEntry'
      ]),
      ...mapActions([
        'startTimer',
        'stopTimer',
        'patchEntries'
      ])
    },
    components: {
      listInput
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .timer
    position relative
    margin-bottom 60px
    transform translateX(-10px)
    width calc(100% + 20px)
    @media (max-width titamota-screen-w-7)
      margin-bottom 40px

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
      margin-top 10px
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

    &.with-context
      textarea
        padding-top 34px
        @media (min-width 768px)
          padding-top 14px

    .task-context
      position absolute
      top 80px
      left 50%
      transform translateX(-50%)
      font-size 12px
      z-index 10
      @media (min-width 768px)
        display none
        top 10px
        left 222px
        transform none
</style>
