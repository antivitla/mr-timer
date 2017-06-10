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
      //- petrov

      //- Tasks view
      .tasks
        group-item(
          v-for="task in Tasks.children"
          :key="task.name"
          :entry="task")

      //- Months view
      .months
        group-item(
          v-for="month in Months.children"
          :key="month.name"
          :entry="month")

      //- Storage view
      //- storage-item(
        v-for="entry in Storage.entries"
        :key="entry.uid()
        :entry="entry")
</template>

<script>
  import moment from 'moment'
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import timer from '@/components/timer'
  import groupItem from '@/components/group-item'
  import storageItem from '@/components/storage-item'
  import petrov from '@/components/petrov'
  import { Tasks } from '@/store/groups/tasks'
  import { Months } from '@/store/groups/months'
  import { Days } from '@/store/groups/days'
  import { Storage } from '@/store/storage'

  moment.locale('ru')

  export default {
    data () {
      return {
        Tasks,
        Months,
        Days,
        Storage
      }
    },

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
        'userGuestKey'
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
      petrov,
      groupItem,
      storageItem
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
