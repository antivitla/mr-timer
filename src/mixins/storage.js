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
    const onMutations = {
      'setAuthorized': () => {
        this.setBackend({ backend: 'mitaba' })
        this.getEntries()
      },
      'setNotAuthorized': () => {
        this.setBackend({ backend: 'local' })
        this.getEntries()
      }
    }
    this.unsubscribeMutations = this.$store.subscribe(mutation => {
      if (onMutations[mutation.type]) {
        onMutations[mutation.type]()
      }
    })
  },
  beforeDestroy () {
    this.unsubscribeMutations()
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
