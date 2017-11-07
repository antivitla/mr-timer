<template lang="pug">
  .settings-i18n
    p
      select(v-model="selectedLocale")
        option(
          v-for="l in locales"
          :value="l.code") {{ capitalize(l.label) }}
    p
      select(v-model="selectedCurrency")
        option(
          v-for="c in currencies"
          :value="c.code") {{ label('currency.' + c.code) }}
</template>
<script>
  import { mapActions } from 'vuex'
  import { locales, currencies } from '@/store/i18n'
  import capitalize from '@/utils/capitalize'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        capitalize,
        selectedLocale: null,
        selectedCurrency: null,
        locales,
        currencies
      }
    },
    created () {
      this.selectedLocale = this.locale
      this.selectedCurrency = this.currency
      this.unsubscribe = this.$store.subscribeAction(action => {
        if (action.type === 'activateLocale') {
          this.selectedLocale = action.payload.locale
        }
        if (action.type === 'activateCurrency') {
          this.selectedCurrency = action.payload.currency
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    watch: {
      'selectedLocale': function (locale) {
        if (locale !== this.locale) {
          this.activateLocale({ locale })
        }
      },
      'selectedCurrency': function (currency) {
        if (currency !== this.currency) {
          this.activateCurrency({ currency })
        }
      }
    },
    methods: {
      ...mapActions([
        'activateLocale',
        'activateCurrency'
      ])
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .settings-i18n
    display flex
    flex-wrap wrap
    justify-content space-between
    p
      width 45%
</style>
