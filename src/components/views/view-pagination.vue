<template lang="pug">
  .view-pagination
    .left(v-if="!offsetOnly")
      .limit
        span.text-muted {{ label('pagination.show') }}&nbsp;
        span.selectable(
          :class="{'active': currentLimit === currentOptions.limit[0]}"
          @click="changeLimit(currentOptions.limit[0])") {{labelNumber(currentOptions.limit[0])}}
        span.selectable(
          :class="{'active': currentLimit === currentOptions.limit[1]}"
          @click="changeLimit(currentOptions.limit[1])") {{labelNumber(currentOptions.limit[1])}}
        span.selectable(
          :class="{'active': currentLimit === currentOptions.limit[2]}"
          @click="changeLimit(currentOptions.limit[2])") {{labelNumber(currentOptions.limit[2])}}
        span.text-muted &nbsp;{{ label('pagination.or', false) }}&nbsp;
        span.selectable(
          :class="{'active': currentLimit === currentCount}"
          @click="changeLimit(currentCount)") {{ labelAll }}
    .right(v-if="!limitOnly")
      .earlier(
        v-if="earlierExist"
        :title="label('pagination.earlier')"
        @click="changeOffset(1)")
        span {{ label('pagination.earlier', false) }}
        span &larr;
        //- span.text-muted {{currentLimit === 1 ? earlierItemLabel : earlierRange}}
      .current.text-muted {{currentLimit === 1 ? currentItemLabel : currentRange}}
      .later(
        v-if="laterExist"
        :title="label('pagination.later')"
        @click="changeOffset(-1)")
        span &rarr;
        //- span.text-muted {{currentLimit === 1 ? laterItemLabel : laterRange}}
        span {{ label('pagination.later', false) }}
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Days } from '@/store/groups/days'
  import { Months } from '@/store/groups/months'
  import { Years } from '@/store/groups/years'
  import moment from 'moment'
  import i18nLabel from '@/mixins/i18n-label'
  import capitalize from '@/utils/capitalize'

  function labelItem ({ type, offset, days, months, years, date }) {
    if (type === 'entries') {
      return offset + 1
    }
    if (type === 'days' && days && days.length) {
      return moment(date(days[0])).format('LL').replace(' г.', '')
    }
    if (type === 'months' && months && months.length) {
      return moment(date(months[0])).format('MMMM YYYY')
    }
    if (type === 'years' && years && years.length) {
      return moment(date(years[0])).format('YYYY')
    }
    return 'Unknown item'
  }

  function labelRange ({ type, offset, limit, items, date, rangeLabels, label }) {
    let range = {}
    if (type === 'entries') {
      range = {
        from: offset + 1,
        to: offset + limit
      }
    }
    if (items && items.length) {
      range = rangeLabels({
        to: moment(date(items[0])),
        from: moment(date(items.slice(-1)[0]))
      })
    }
    return label.replace('%0', range.from).replace('%1', range.to)
  }

  export default {
    props: {
      type: String,
      offsetOnly: Boolean,
      limitOnly: Boolean
    },
    data () {
      return {
        Days,
        pagination: {
          entries: () => this.paginationEntries,
          days: () => this.paginationDays,
          months: () => this.paginationMonths,
          years: () => this.paginationYears
        }
      }
    },
    computed: {
      currentOffset () {
        return this.pagination[this.type]().offset
      },
      currentLimit () {
        return this.pagination[this.type]().limit
      },
      currentCount () {
        return this.pagination[this.type]().count
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
          date: item => item.name,
          days: Days.children,
          months: Months.children,
          years: Years.children
        })
      },
      laterItemLabel () {
        return labelItem({
          type: this.type,
          offset: this.currentOffset + 1,
          date: item => item,
          days: this.paginationDays.previous,
          months: this.paginationMonths.previous,
          years: this.paginationYears.previous
        })
      },
      earlierItemLabel () {
        return labelItem({
          type: this.type,
          offset: this.currentOffset - 1,
          date: item => item,
          days: this.paginationDays.next,
          months: this.paginationMonths.next,
          years: this.paginationYears.next
        })
      },
      currentRange () {
        const items = {
          days: Days.children,
          months: Months.children,
          years: Years.children
        }
        return labelRange({
          type: this.type,
          offset: this.currentOffset,
          limit: this.currentLimit,
          date: item => item.name,
          items: items[this.type],
          rangeLabels: this[this.type + 'RangeLabels'],
          label: this.label('pagination.range' + capitalize(this.type), false)
        })
      },
      laterRange () {
        const items = {
          days: this.paginationDays.previous,
          months: this.paginationMonths.previous,
          years: this.paginationYears.previous
        }
        return labelRange({
          type: this.type,
          offset: this.currentOffset,
          limit: this.currentLimit,
          date: item => item,
          items: items[this.type],
          rangeLabels: this[this.type + 'RangeLabels'],
          label: this.label('pagination.range' + capitalize(this.type), false)
        })
      },
      earlierRange () {
        const items = {
          days: this.paginationDays.next,
          months: this.paginationMonths.next,
          years: this.paginationYears.next
        }
        return labelRange({
          type: this.type,
          offset: this.currentOffset,
          limit: this.currentLimit,
          date: item => item,
          items: items[this.type],
          rangeLabels: this[this.type + 'RangeLabels'],
          label: this.label('pagination.range' + capitalize(this.type), false)
        })
      },
      labelAll () {
        return `${this.label('pagination.all', false)} ${this.labelNumber(this.currentCount)}`
      },
      ...mapGetters([
        'paginationEntries',
        'paginationDays',
        'paginationMonths',
        'paginationYears',
        'paginationOptions',
        'locale'
      ])
    },
    methods: {
      changeLimit (limit) {
        this.$emit('limit', limit)
      },
      changeOffset (direction) {
        let offset = this.currentOffset + direction * this.currentLimit
        this.$emit('offset', offset >= 0 ? offset : 0)
      },
      labelNumber (items) {
        const all = {
          entries: 'pagination.numberEntries',
          days: 'pagination.numberDays',
          months: 'pagination.numberMonths',
          years: 'pagination.numberYears'
        }
        return this.labelFormat(all[this.type], { [this.type]: items })
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

    .limit
      margin-left 0px
      margin-right auto
      display flex
    .later
      margin-left 15px
      margin-right 0px
      cursor pointer
      * + *
        margin-left 5px
    .current
      margin-left 0px
      margin-right 0px
    .earlier
      margin-left auto
      margin-right 15px
      cursor pointer
      * + *
        margin-left 5px

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

</style>
