<template lang="pug">
  .app
    //- sidebar
    .page
      div
        | User:
        strong  {{userKey}},
        |  guest key:
        strong {{userGuestKey}}
        | , mode:
        strong {{userMode}}

      //- Timer control
      timer

      //- Petrov API view
      petrov

      //- Storage view
      storage(v-bind:entries="storageEntries")
</template>

<script>
  import timer from '@/components/timer'
  import storage from '@/components/storage'
  import petrov from '@/components/petrov'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import moment from 'moment'

  moment.locale('ru')

  export default {
    created () {
      this.refreshAppWithUserData(this.detectUserKey())
    },

    watch: {
      '$route' (to, from) {
        this.refreshAppWithUserData(this.detectUserKey())
      }
    },

    computed: {
      ...mapGetters([
        'userKey',
        'userMode',
        'userGuestKey',
        'storageEntries'
      ])
    },

    methods: {
      detectUserKey () {
        if (this.$route.params && this.$route.params.user) {
          return this.$route.params.user
        } else {
          return 'local'
        }
      },
      refreshAppWithUserData (userKey) {
        this.clearEntries()
        this.clearUser()
        this.setUserKey({ key: userKey })
        this.loadEntries()
      },
      ...mapMutations([
        'clearEntries',
        'clearUser',
        'setUserKey'
      ]),
      ...mapActions([
        'loadEntries'
      ])
    },

    components: {
      timer,
      storage,
      petrov
    }
  }
</script>

<style lang="stylus">
  @import 'assets/stylesheets/variables.styl'
  @import 'assets/stylesheets/common.styl'

  body
    margin 0
    padding 0
    background-color ttt-light-background
    color #333

  body
  input
  textarea
  button
  select
  option
    font-family Rubik, sans-serif
    font-size 16px
    line-height 20px
    font-weight 300
    color #333

  .page
    min-height 100vh
    background-color ttt-light-background
    padding-top 80px
    padding-bottom 20px
    padding-left 20px
    padding-right 20px
    box-sizing border-box
    @media (min-width 480px)
      padding-left 30px
      padding-right 30px
    @media (min-width 768px)
      padding-left 60px
      padding-right 60px
    @media (min-width 1366px)
      padding-left 140px
      padding-right 140px
</style>
