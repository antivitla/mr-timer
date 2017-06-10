<template lang="pug">
  .app
    //- sidebar
    .page
      //- div
      //-   | User:
      //-   strong  {{userKey}},
      //-   |  guest key:
      //-   strong {{userGuestKey}}
      //-   | , mode:
      //-   strong {{userMode}}

      //- Timer control
      timer

      //- Petrov API view
      //- petrov

      section(v-if="Storage.entries.length")

        //- View navigation
        nav.view-menu
          .view-switch
            a(
              v-for="view in ['tasks', 'months', 'days', 'storage']"
              :class="{ active: currentView === view }"
              @click="currentView = view") {{ viewLabel(view) }}

        //- Tasks view
        section.tasks.view(v-if="currentView === 'tasks'")
          group-item(
            v-for="task in Tasks.children"
            :key="task.name"
            :entry="task")

        //- Months view
        section.months.view(v-if="currentView === 'months'")
          group-item(
            v-for="month in Months.children"
            :key="month.name"
            :entry="month")

        //- Days view
        section.days.view(v-if="currentView === 'days'")
          group-item(
            v-for="day in Days.children"
            :key="day.name"
            :entry="day")

        //- Storage view
        section.storage.view(v-if="currentView === 'storage'")
          storage-item(
            v-if="currentView === 'storage'"
            v-for="entry in Storage.entries"
            :key="entry.uid()"
            :entry="entry")

        //- Footer
        site-footer
</template>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import moment from 'moment'
  import timer from '@/components/timer'
  import groupItem from '@/components/group-item'
  import storageItem from '@/components/storage-item'
  import petrov from '@/components/petrov'
  import siteFooter from '@/components/site-footer'
  import { Tasks } from '@/store/groups/tasks'
  import { Months } from '@/store/groups/months'
  import { Days } from '@/store/groups/days'
  import { Storage } from '@/store/storage'
  import { translate, languages } from '@/store/i18n'
  import capitalize from '@/utils/capitalize'

  export default {
    data () {
      return {
        Tasks,
        Months,
        Days,
        Storage,
        currentView: 'tasks'
      }
    },

    created () {
      this.refreshAppWithUserData(this.detectUserKey())
      const locale = this.detectLocale()
      this.setLocale({ locale })
      moment.locale(locale)
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
        'locale'
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
      detectLocale () {
        const l = Object.keys(languages).find(lang => {
          return this.$route.query[lang] === null
        })
        return l || 'ru'
      },
      refreshAppWithUserData (userKey) {
        this.clearEntries()
        this.clearUser()
        this.setUserKey({ key: userKey })
        this.loadEntries()
      },
      viewLabel (view) {
        return capitalize(translate[this.locale].view[view])
      },
      ...mapMutations([
        'clearEntries',
        'clearUser',
        'setUserKey',
        'setLocale'
      ]),
      ...mapActions([
        'loadEntries'
      ])
    },

    components: {
      timer,
      petrov,
      siteFooter,
      groupItem,
      storageItem
    }
  }
</script>

<style lang="stylus">
  @import 'assets/stylesheets/variables'
  @import 'assets/stylesheets/common'

  body
    margin 0
    padding 0
    background-color tttc-back-light

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
    color tttc-text

  .page
    min-height 100vh
    background-color tttc-back-light
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

  .view-menu
    display flex
    justify-content space-between
    align-items center
    border-bottom solid 1px tttc-border
    .view-switch
      margin-left auto
      line-height 24px
      display inline-flex
      text-align right
      a
        padding 0 3px
        margin-left 5px
        cursor pointer
        font-size 13px;
        display inline-block
        position relative
        &:after
          position absolute
          left 0
          bottom -2px
          height 3px
          display block
          width 100%
          background-color #dcdcdc
        &:hover:after
          content ' '
        &.active:after
          content ' '
          background-color tttc-text

  section.tasks
  section.months
  section.storage
  section.days
  section.years
    margin 20px auto 60px auto

</style>
