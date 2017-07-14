<template lang="pug">
  .task-context
    span.icon-button.back(
      :class="{ 'active': !timerActive }"
      @click="upContext()"
      :title="upContextLabel"
    )
      i.material-icons arrow_back
    span.name
      span {{ name }}
      span.icon-button.clear(
        :class="{ 'active': !timerActive }"
        @click="clearContext"
        :title="clearContextLabel"
      )
        i.material-icons close
</template>

<script>
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'
  import { rootDetails } from '@/utils/group'
  import capitalize from 'lodash/capitalize'
  import { translate } from '@/store/i18n'
  import { Storage } from '@/store/storage'
  import { taskDelimiter } from '@/store/ui'

  window.stor = Storage

  export default {
    props: [
      'context'
    ],

    data () {
      return {
        Storage
      }
    },

    computed: {
      name () {
        let details = rootDetails(this.context)
          .join(taskDelimiter)
        const period = Storage.period
        if (period && period.type === 'month') {
          if (new Date(Storage.period.value).getFullYear() === new Date().getFullYear()) {
            details = `(${capitalize(moment(Storage.period.value)
              .format('MMMM'))}) ` + details
          } else {
            const m = moment(Storage.period.value)
            details = `(${capitalize(m
              .format('MMMM'))} ${m.format('YYYY')}) ` + details
          }
        } else if (period && period.type === 'day') {
          details = `(${moment(period.value)
            .format('ll').replace(' г.', '')}) ` + details
        }
        return details
      },
      clearContextLabel () {
        return capitalize(translate[this.locale].clearContext)
      },
      upContextLabel () {
        return capitalize(translate[this.locale].upContext)
      },
      ...mapGetters([
        'locale',
        'timerActive'
      ])
    },

    methods: {
      upContext () {
        if (this.context.parent && this.context.parent.parent) {
          this.setUpperContext({ context: this.context.parent })
        } else {
          this.clearContext()
        }
      },
      ...mapActions([
        'clearContext',
        'setContext',
        'setUpperContext'
      ])
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables'

  .task-context
    font-size 14px
    display flex
    align-items center
    .name
      white-space nowrap
      overflow hidden
      color titamota-color-text-muted
      text-overflow ellipsis
    .clear
    .back
      pointer-events none
      opacity 0
      cursor pointer
      transition all 0.3s
      &.active
        pointer-events all
        opacity 1
    .back
      margin-right 0.25em
      vertical-align middle
    .clear
      vertical-align middle
      margin-left 0.2em
      color titamota-color-text
</style>
