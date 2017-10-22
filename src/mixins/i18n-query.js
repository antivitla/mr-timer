import { mapGetters, mapActions } from 'vuex'

export default {
  created () {
    // Detect locale and currency from url query
    const locale = this.$route.query.locale
    const currency = this.$route.query.currency
    if (locale) {
      this.activateLocale({ locale })
    }
    if (currency) {
      this.activateCurrency({ currency })
    }
    // Set url query when changing locale and currency
    this.$store.subscribeAction((action) => {
      if (action.type === 'activateLocale') {
        const name = this.$route.name
        const query = Object.assign({}, this.$route.query, {
          locale: action.payload.locale
        })
        this.$router.push({ name, query })
      }
      if (action.type === 'activateCurrency') {
        const name = this.$route.name
        const query = Object.assign({}, this.$route.query, {
          currency: action.payload.currency
        })
        this.$router.push({ name, query })
      }
    })
  },
  computed: {
    ...mapGetters([
      'locale',
      'currency'
    ])
  },
  methods: {
    ...mapActions([
      'activateLocale',
      'activateCurrency'
    ])
  }
}
