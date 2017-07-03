<template lang="pug">
  .task-context
    span.name {{ name }}
    span.icon-button.clear(
      :class="{ 'active': !timerActive }"
      @click="clearContext()"
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
          details = `(${capitalize(moment(Storage.period.value)
            .format('MMMM'))}) ` + details
        } else if (period && period.type === 'day') {
          details = `(${moment(period.value)
            .format('ll').replace(' г.', '')}) ` + details
        }
        return details
      },
      clearContextLabel () {
        return capitalize(translate[this.locale].clearContext)
      },
      ...mapGetters([
        'locale',
        'timerActive'
      ])
    },

    methods: {
      ...mapActions([
        'clearContext'
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
      pointer-events none
      opacity 0
      cursor pointer
      margin-left 5px
      transition all 0.3s
      &.active
        pointer-events all
        opacity 1
</style>
