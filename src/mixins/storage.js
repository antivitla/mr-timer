import { mapGetters, mapMutations, mapActions } from 'vuex'

export default {
  created () {
    // Decide initial backend
    if (this.isAuthorized) {
      this.setBackend({ backend: 'mitaba' })
    } else {
      this.setBackend({ backend: 'local' })
    }
    // Resolve authorization backends
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setAuthorized') {
        this.setBackend({ backend: 'mitaba' })
        this.getEntries()
      }
      if (mutation.type === 'setNotAuthorized') {
        this.setBackend({ backend: 'local' })
        this.getEntries()
      }
    })
  },
  computed: {
    ...mapGetters([
      'isAuthorized'
    ])
  },
  methods: {
    ...mapMutations([
      'setBackend'
    ]),
    ...mapActions([
      'getEntries'
    ])
  }
}
