<template lang="pug">
  span {{ displayName }}
</template>

<script>
  import moment from 'moment'
  import { mapGetters } from 'vuex'
  import capitalize from 'lodash/capitalize'

  export default {
    props: ['entry'],

    computed: {
      displayName () {
        return this[this.entry.type]
      },
      task () {
        return this.entry.name
      },
      year () {
        return this.entry.name
      },
      month () {
        const d = moment(this.entry.start)
        let label = capitalize(d.format('MMMM YYYY'))
        if (d.year() === (new Date()).getFullYear()) {
          label = label.split(' ')[0]
        }
        return label
      },
      day () {
        const d = moment(this.entry.start)
        let label = d.format('LL')
        if (this.locale === 'ru') {
          label = label.replace('г.', '').trim()
        }
        if (d.year() === (new Date()).getFullYear()) {
          label = label.split(' ').slice(0, 2).join(' ')
          if (this.locale === 'en') {
            label = label.replace(',', '')
          }
        }
        return label
      },
      ...mapGetters([
        'locale'
      ])
    }
  }
</script>

<style lang="stylus">
  .item-name
    font-weight 700
</style>
