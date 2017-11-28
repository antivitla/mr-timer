<template lang="pug">
  .task-context
    span.icon-button.back(
      :class="{ 'active': !timerActive }"
      @click="upContext()"
      :title="upContextLabel")
      i.material-icons arrow_back
    span.name
      span {{ name }}
      span.icon-button.clear(
        :class="{ 'active': !timerActive }"
        @click="clearContext()"
        :title="clearContextLabel")
        i.material-icons close
</template>
<script>
  import moment from 'moment'
  import { mapGetters, mapActions } from 'vuex'
  import capitalize from 'lodash/capitalize'
  import { translate } from '@/store/i18n'
  import { taskDelimiter } from '@/store/ui'

  export default {
    props: ['context'],
    computed: {
      name () {
        let details = this.contextDetails ? this.contextDetails.join(taskDelimiter) : ''
        const periodType = this.contextDateType
        const periodValue = this.contextDateValue
        if (periodType === 'month') {
          if (new Date(periodValue).getFullYear() === new Date().getFullYear()) {
            details = `(${capitalize(moment(periodValue)
              .format('MMMM'))}) ` + details
          } else {
            const m = moment(periodValue)
            details = `(${capitalize(m
              .format('MMMM'))} ${m.format('YYYY')}) ` + details
          }
        } else if (periodType === 'day') {
          details = `(${moment(periodValue)
            .format('ll').replace(' г.', '')}) ` + details
        } else if (periodType === 'year') {
          details = `(${new Date(periodValue).getFullYear()}) ` + details
        }
        return details.trim()
      },
      clearContextLabel () {
        return capitalize(translate[this.locale].clearContext)
      },
      upContextLabel () {
        return capitalize(translate[this.locale].upContext)
      },
      ...mapGetters([
        'locale',
        'timerActive',
        'contextDetails',
        'contextDateType',
        'contextDateValue'
      ])
    },
    methods: {
      upContext () {
        if (this.contextDetails) {
          this.setUpperContext()
        } else {
          this.clearContext()
        }
      },
      ...mapActions([
        'clearContext',
        'setUpperContext'
      ])
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

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
      visibility hidden
      cursor pointer
      transition all 0.3s
      &.active
        pointer-events all
        visibility visible
    .back
      margin-right 0.375em
      margin-top 0.2em
      align-self flex-start
      color titamota-color-text
    .clear
      vertical-align middle
      margin-left 0.375em
      color titamota-color-text
</style>
