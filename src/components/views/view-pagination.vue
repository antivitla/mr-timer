<template lang="pug">
  .view-pagination
    .left(v-if="!offsetOnly")
      .limit
        span.text-muted {{ label('pagination.show') }}&nbsp;
        span.selectable(
          :class="{ 'active': currentLimit === currentOptions.limit[0] }"
          @click="changeLimit(currentOptions.limit[0])")
          | {{ labelNumber(currentOptions.limit[0]) }}
        span.selectable(
          :class="{ 'active': currentLimit === currentOptions.limit[1] }"
          @click="changeLimit(currentOptions.limit[1])")
          | {{ labelNumber(currentOptions.limit[1]) }}
        span.selectable(
          :class="{ 'active': currentLimit === currentOptions.limit[2] }"
          @click="changeLimit(currentOptions.limit[2])")
          | {{ labelNumber(currentOptions.limit[2]) }}
        span.text-muted(v-if="currentExist && currentCount > currentLimit")
          | &nbsp;{{ label('pagination.or', false) }}&nbsp;
        span.selectable(
          v-if="currentExist && currentCount > currentLimit"
          :class="{ 'active': currentLimit === currentCount }"
          @click="changeLimit(currentCount)")
          | {{ labelAll }}

    .right(v-if="!limitOnly && currentCount > 1")
      .latest(
        v-if="currentOffset > 0"
        @click="latestOffset()")
        | {{ latestLabel }} &lArr; &ensp;
      .later(
        v-if="laterExist"
        :title="label('pagination.later')"
        @click="changeOffset(-1)")
        | {{ label('pagination.later', false) }} &larr; &ensp;
        //- span.text-muted {{ currentLimit === 1 ? laterItemLabel : laterRange }}
      .current.text-muted {{ currentLimit === 1 ? currentItemLabel : currentRange }}
      .earlier(
        v-if="earlierExist"
        :title="label('pagination.earlier')"
        @click="changeOffset(1)")
        | &ensp; &rarr; {{ label('pagination.earlier', false) }}
        //- span.text-muted {{ currentLimit === 1 ? earlierItemLabel : earlierRange }}
      .earliest(
        v-if="currentOffset + currentLimit < currentCount"
        @click="earliestOffset()")
        | &ensp; &rArr; {{ earliestLabel }}
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Days } from '@/store/groups/days'
  import { Months } from '@/store/groups/months'
  import { Years } from '@/store/groups/years'
  import { Tasks } from '@/store/groups/tasks'
  import { Storage } from '@/store/storage'
  import moment from 'moment'
  import i18nLabel from '@/mixins/i18n-label'
  import capitalize from '@/utils/capitalize'

  function labelItem ({ type, offset, value }) {
    if (type === 'storage') {
      return offset + 1
    }
    if (value) {
      if (type === 'days') {
        return moment(value).format('LL').replace(' г.', '')
      } else if (type === 'months') {
        return moment(value).format('MMMM YYYY')
      } else if (type === 'years') {
        return moment(value).format('YYYY')
      } else {
        return value
      }
    }
    return 'Unknown value'
  }

  function labelRange ({ type, offset, limit, count, items, rangeLabels, label }) {
    let range = {}
    if (type === 'storage') {
      let to = count - offset - limit
      range = {
        from: count - offset,
        to: to < 1 ? 1 : to
      }
    } else if (items && items.length) {
      if (type === 'days' || type === 'months' || type === 'years') {
        range = rangeLabels({
          from: moment(items[0]),
          to: moment(items.slice(-1)[0])
        })
      } else if (type === 'tasks') {
        range = rangeLabels({
          from: items[0],
          to: items.slice(-1)[0]
        })
      }
    }
    return label.replace('%0', range.from).replace('%1', range.to)
  }

  export default {
    props: {
      type: String,
      offsetOnly: Boolean,
      limitOnly: Boolean
    },
    computed: {
      currentViewItems () {
        const items = {
          storage: Storage.entries,
          days: Days.children,
          months: Months.children,
          years: Years.children,
          tasks: Tasks.children
        }
        return items[this.currentView] ? items[this.currentView] : []
      },
      currentOffset () {
        return this.pagination[this.currentView].offset
      },
      currentLimit () {
        return this.pagination[this.currentView].limit
      },
      currentCount () {
        return this.pagination[this.currentView].count
      },
      currentExist () {
        return Storage.entries.length
      },
      earlierExist () {
        return this.currentOffset + this.currentLimit < this.currentCount
      },
      laterExist () {
        return this.currentOffset > 0
      },
      currentOptions () {
        return this.paginationOptions[this.type]
      },
      currentItemLabel () {
        return labelItem({
          type: this.type,
          offset: this.currentOffset,
          value: this.currentViewItems[0] && this.currentViewItems[0].name
        })
      },
      laterItemLabel () {
        return labelItem({
          type: this.type,
          offset: this.currentOffset + 1,
          value: this.pagination[this.currentView].previous[0]
        })
      },
      earlierItemLabel () {
        return labelItem({
          type: this.type,
          offset: this.currentOffset - 1,
          value: this.pagination[this.currentView].next[0]
        })
      },
      currentRange () {
        return this.generalRange(this.currentViewItems.map(i => i.name))
      },
      laterRange () {
        return this.generalRange(this.pagination[this.currentView].previous)
      },
      earlierRange () {
        return this.generalRange(this.pagination[this.currentView].next)
      },
      labelAll () {
        return `${this.label('pagination.all', false)} ${this.labelNumber(this.currentCount)}`
      },
      latestLabel () {
        if (this.currentLimit === 1) {
          return this.labelFormat('pagination.latest', {
            gender: this.type === 'storage' ? 'female' : 'male'
          })
        } else {
          return this.labelFormat('pagination.latest', { gender: 'other' })
        }
      },
      earliestLabel () {
        if (this.currentLimit === 1) {
          return this.labelFormat('pagination.earliest', {
            gender: this.type === 'storage' ? 'female' : 'male'
          })
        } else {
          return this.labelFormat('pagination.earliest', { gender: 'other' })
        }
      },
      ...mapGetters([
        'pagination',
        'paginationOptions',
        'currentView',
        'locale'
      ])
    },
    methods: {
      changeLimit (limit) {
        this.$emit('limit', { limit })
      },
      changeOffset (direction) {
        let offset = this.currentOffset + direction * this.currentLimit
        this.$emit('offset', {
          offset: (offset >= 0 ? offset : 0)
        })
      },
      earliestOffset () {
        let offset = Math.floor(this.currentCount / this.currentLimit) * this.currentLimit
        this.$emit('offset', {
          offset: (offset >= this.currentCount ? offset - this.currentLimit : offset)
        })
      },
      latestOffset () {
        this.$emit('offset', { offset: 0 })
      },
      labelNumber (items) {
        return this.labelFormat(`pagination.number${capitalize(this.type)}`, {
          [this.type]: items
        })
      },
      generalRange (items) {
        return labelRange({
          type: this.type,
          offset: this.currentOffset,
          limit: this.currentLimit,
          count: this.currentCount,
          items,
          rangeLabels: this.currentViewRangeLabels,
          label: this.label('pagination.range' + capitalize(this.type), false)
        })
      },
      currentViewRangeLabels (payload) {
        return this[`${this.currentView}RangeLabels`](payload)
      },
      daysRangeLabels ({ from, to }) {
        const result = {
          from: from.format('LL').replace(' г.', ''),
          to: to.format('LL').replace(' г.', '')
        }
        if (from.year() === to.year()) {
          if (from.month() === to.month()) {
            if (this.locale === 'ru') {
              result.from = from.format('D')
              result.to = to.format('D MMMM YYYY')
            }
            if (this.locale === 'en') {
              result.from = from.format('D')
              result.to = to.format('D of MMMM YYYY')
            }
          } else {
            if (this.locale === 'ru') {
              result.from = from.format('D MMMM ')
              result.to = to.format(' D MMMM YYYY')
            }
            if (this.locale === 'en') {
              result.from = from.format('D of MMMM ')
              result.to = to.format(' D of MMMM YYYY')
            }
          }
        }
        return result
      },
      monthsRangeLabels ({ from, to }) {
        const result = {
          from: from.format('MMMM YYYY'),
          to: to.format('MMMM YYYY')
        }
        if (from.year() === to.year()) {
          result.from = from.format('MMMM')
          result.to = to.format('MMMM YYYY')
        }
        return result
      },
      yearsRangeLabels ({ from, to }) {
        return {
          from: from.format('YYYY'),
          to: to.format('YYYY')
        }
      },
      tasksRangeLabels ({ from, to }) {
        return { from, to }
      }
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .view-pagination
    display flex
    margin-top titamota-view-margin
    line-height 24px
    border-top solid titamota-color-border 1px
    font-size 13px
    .left
      display flex
      margin-left 0px
      margin-right auto
    .right
      display flex
      margin-left auto
      margin-right 0px
      & > *:not(.current)
        cursor pointer
    .limit
      margin-left 0px
      margin-right auto
      display flex
    .hidden
      visibility hidden
    .selectable
      position relative
      padding 0px 3px
      margin 0px 2px
      cursor pointer
      &:after
        position absolute
        left 0
        top -2px
        height 3px
        display block
        width 100%
        background-color #dcdcdc
      &:hover:after
        content ' '
      &.active:after
        content ' '
        background-color titamota-color-text

    @media (max-width titamota-screen-w-7)
      display none
</style>
