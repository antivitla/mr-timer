<template lang="pug">
  .group-item
    .item
      span.name(
        v-once
        :color="colorCode") {{ name }}
      span.duration {{ duration }}
    group-item(
      v-if="child.type"
      v-for="child in entry.children"
      :key="child.name"
      :entry="child")
</template>

<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import capitalize from '@/utils/capitalize'

  const labels = {
    month (item) {
      const d = moment(item.start)
      let label = capitalize(d.format('MMMM YYYY'))
      if (d.year() === (new Date()).getFullYear()) {
        label = label.split(' ')[0]
      }
      return label
    },

    day (item, locale) {
      const d = moment(item.start)
      let label = d.format('LL')
      if (locale === 'ru') {
        label = label.replace('г.', '').trim()
      }
      if (d.year() === (new Date()).getFullYear()) {
        label = label.split(' ').slice(0, 2).join(' ')
        if (locale === 'en') {
          label = label.replace(',', '')
        }
      }
      return label
    },

    task (item) {
      return item.name
    },

    year (item) {
      return item.name
    }
  }

  export default {
    props: [
      'entry'
    ],

    // Nested component hack
    beforeCreate () {
      this.$options.components.groupItem = require('./group-item.vue')
    },

    computed: {
      name () {
        return labels[this.entry.type](this.entry, this.locale)
      },
      updated () {
        return this.entry.lastUpdated()
      },
      duration () {
        return this.entry.duration()
      },
      colorCode () {
        if (this.entry.type === 'month' || this.entry.type === 'day') {
          return new Date(this.entry.start).getMonth()
        }
      },
      ...mapGetters([
        'locale'
      ])
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables.styl'

  .group-item
    & > .item
      margin 10px auto
      font-size 18px
    .group-item
      margin-left 20px
      .group-item
        & > .item
          margin 5px
          font-size 14px

  .view > .group-item > .item
    font-size 32px
    line-height 40px
    font-weight 400
    display flex
    justify-content space-between
    align-items baseline
    .duration
      font-size 80%
      color tttc-text-muted
      font-family PT Mono, monospace

  .view > .group-item:not(:first-child) > .item
    margin-top 40px

  .group-item
    .name[color]
      position relative
    .name[color]:before
      content ' '
      position absolute
      left -1em
      top 50%
      transform translateY(-50%)
      width 0.5em
      height 0.5em
      border-radius 30%
      background-color gainsboro
    .name[color="0"]:before
      background-color lighten(tttc-jan, 20%)
    .name[color="1"]:before
      background-color lighten(tttc-feb, 20%)
    .name[color="2"]:before
      background-color lighten(tttc-mar, 20%)
    .name[color="3"]:before
      background-color lighten(tttc-apr, 20%)
    .name[color="4"]:before
      background-color lighten(tttc-may, 20%)
    .name[color="5"]:before
      background-color lighten(tttc-jun, 20%)
    .name[color="6"]:before
      background-color lighten(tttc-jul, 20%)
    .name[color="7"]:before
      background-color lighten(tttc-aug, 20%)
    .name[color="8"]:before
      background-color lighten(tttc-sep, 20%)
    .name[color="9"]:before
      background-color lighten(tttc-oct, 20%)
    .name[color="10"]:before
      background-color lighten(tttc-nov, 20%)
    .name[color="11"]:before
      background-color lighten(tttc-dec, 20%)


</style>
