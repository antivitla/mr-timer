import { mapActions, mapMutations, mapGetters } from 'vuex'
import { authSteps } from '@/store/auth'
import Mitaba from '@/mitaba'

export default {
  created () {
    // Check redirected state
    if (this._isAuthRedirected) {
      // finish auth process
      this.authorizeWithMitaba({
        provider: this._provider,
        code: this._code
      }).then(profile => {
        // Close sidebar
        this.closeSidebar()
      })
      .catch(error => {
        console.log(error)
      })
      // return home state
      this.$router.push({ name: 'home' })
    }
    // Check authorized state and load token
    if (this.authStep === authSteps.AUTHORIZED) {
      Mitaba.token = this.authToken
    }
  },
  computed: {
    _isAuthRedirected () {
      return this.$route.name === 'providerAuthRedirect'
    },
    _code () {
      return this.$route.query.code
    },
    _provider () {
      return this.$route.params.provider
    },
    ...mapGetters([
      'authToken',
      'authStep'
    ])
  },
  methods: {
    ...mapMutations([
      'closeSidebar'
    ]),
    ...mapActions([
      'authorizeWithMitaba'
    ])
  }
}
