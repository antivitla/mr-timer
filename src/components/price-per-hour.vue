<template lang="pug">
  .price-per-hour(:class="{ active: price > 0 }")
    span.label {{ labelPrice}}
    span.symbol-before
    input(
      type="text"
      :value="price"
      @input="updatePrice($event.target.value)"
      :placeholder="placeholder")
    span.symbol-after
    span.label {{ labelPerHour }}
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import debounce from '@/utils/debounce'
  import capitalize from 'lodash/capitalize'
  import { translate } from '@/store/i18n'

  export default {
    data () {
      return {
        debounceSetPrice: debounce()
      }
    },

    computed: {
      labelPrice () {
        return capitalize(
          translate[this.locale].price.label)
      },
      labelPerHour () {
        return translate[this.locale].price.perHour
      },
      placeholder () {
        return parseInt(this.rate * 100) * 10
      },
      ...mapGetters([
        'price',
        'locale',
        'rate'
      ])
    },

    methods: {
      updatePrice (price) {
        if (!price) {
          this.clearPrice()
        } else {
          this.debounceSetPrice(() => {
            this.setPrice({ price })
          }, 1)
        }
      },
      ...mapActions([
        'setPrice',
        'clearPrice'
      ])
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables.styl'

  [currency="rub"]
    .symbol-before:before
    .symbol-after:before
      content '₽'
  [currency="usd"]
    .symbol-before:before
    .symbol-after:before
      content '$'
  [currency="eur"]
    .symbol-before:before
    .symbol-after:before
      content '€'
  [currency="cny"]
    .symbol-before:before
    .symbol-after:before
      content '¥'

  .price-per-hour
    font-size 14px
    line-height 24px
    color tttc-text-muted

    &.active
      .symbol-before
      .symbol-after
        color tttc-text

    .symbol-before
      display none

    .symbol-after
      display inline-block

    .label:first-child
      margin-right 0.5em
    .label:last-child
      margin-left 0.5em

    input
      border 0
      padding 0 3px
      background-color transparent
      font-size 14px
      height 20px
      line-height 20px
      display inline-block
      outline none
      width 50px
      text-align right
      font-weight 500;
      &::placeholder
        color lighten(tttc-text-muted, 20%)

  [is-currency-symbol-before="true"]
    .price-per-hour
      .symbol-before
        display inline-block
      .symbol-after
        display none
      input
        text-align left
</style>
