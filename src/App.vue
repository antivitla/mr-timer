<template lang="pug">
  .app(
    :class="{ 'timer-active': timerActive, 'modal-active': modal.active }"
    :lang="locale"
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore")
    .page
      main
        //- Timer control
        timer

        //- Petrov API debug
        //- petrov

        //- View navigation
        nav.view-menu(v-if="Storage.entries.length")
          price-per-hour
          .view-switch
            a(
              v-for="view in ['tasks', 'months', 'days', 'storage']"
              :class="{ active: currentView === view }"
              @click="setCurrentView({ view })") {{ viewLabel(view) }}

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
      site-footer(v-if="Storage.entries.length")

    //- modal(
    //-   v-if="modal.active && modal.position"
    //-   :id="modal.id"
    //-   :data="modal.data"
    //-   :position="modal.position")
</template>

<script>
  import { mapMutations, mapGetters, mapActions } from 'vuex'
  import moment from 'moment'
  import timer from '@/components/timer'
  import petrov from '@/components/petrov'
  import pricePerHour from '@/components/price-per-hour'
  import groupItem from '@/components/group-item'
  import storageItem from '@/components/storage-item'
  import siteFooter from '@/components/site-footer'
  import modal from '@/components/modal'
  // import editTaskModal from '@/components/modals/edit-task-modal'
  import { Tasks } from '@/store/groups/tasks'
  import { Months } from '@/store/groups/months'
  import { Days } from '@/store/groups/days'
  import { Storage } from '@/store/storage'
  import { translate, languages, currencies } from '@/store/i18n'
  import capitalize from '@/utils/capitalize'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Tasks,
        Months,
        Days,
        Storage,
        modal: {
          active: false,
          id: null,
          data: null,
          position: undefined
        }
      }
    },

    created () {
      this.refreshAppWithUserData(this.detectUserKey())
      this.refreshLocale()
      this.loadRates()
      bus.$on('open-modal', this.openModal.bind(this))
      bus.$on('close-modal', this.closeModal.bind(this))
    },

    watch: {
      '$route' (to, from) {
        this.refreshAppWithUserData(this.detectUserKey())
        this.refreshLocale()
        this.refreshCurrency()
      }
    },

    computed: {
      ...mapGetters([
        'userKey',
        'userMode',
        'userGuestKey',
        'locale',
        'currency',
        'isCurrencySymbolBefore',
        'currentView',
        'timerActive'
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
          return this.$route.query[lang] !== undefined
        })
        return l || 'ru'
      },
      detectCurrency () {
        const c = Object.keys(currencies).find(code => {
          return this.$route.query[code] !== undefined
        })
        return c || 'rub'
      },
      refreshAppWithUserData (userKey) {
        this.clearEntries()
        this.clearUser()
        this.setUserKey({ key: userKey })
        this.loadEntries()
      },
      refreshLocale () {
        const locale = this.detectLocale()
        this.setLocale({ locale })
        moment.locale(locale)
      },
      refreshCurrency () {
        const currency = this.detectCurrency()
        this.setCurrency({ currency })
      },
      viewLabel (view) {
        return capitalize(translate[this.locale].view[view])
      },
      openModal (modal) {
        this.modal.active = true
        this.modal.id = modal.id
        this.modal.data = modal.data
        this.modal.position = modal.position
      },
      closeModal () {
        this.modal.active = false
      },
      ...mapMutations([
        'clearEntries',
        'clearUser',
        'setUserKey',
        'setLocale',
        'setCurrency',
        'setCurrentView'
      ]),
      ...mapActions([
        'loadEntries',
        'loadRates'
      ])
    },

    components: {
      petrov,
      timer,
      pricePerHour,
      groupItem,
      storageItem,
      siteFooter,
      modal
    }
  }
</script>

<style lang="stylus">
  @import 'assets/stylesheets/variables'
  @import 'assets/stylesheets/common'
  @import 'directives/long-click'

  body
    margin 0
    padding 0
    background-color tttc-back-light
    position relative

  .app > .scrollable
    height 100vh
    overflow auto

  .page-wrapper
    position relative

  .page
    background-color tttc-back-light
    padding-top 60px
    padding-bottom 20px
    padding-left 20px
    padding-right 20px
    box-sizing border-box
    filter grayscale(0%)
    opacity 1
    transition all 0.3s ease-out
    &.modal-active
      filter grayscale(50%)
      opacity 0.25
    @media (min-width 480px)
      padding-left 30px
      padding-right 30px
    @media (min-width 768px)
      padding-top 110px
      padding-left 60px
      padding-right 60px
    @media (min-width 1366px)
      padding-left 140px
      padding-right 140px

  .view-menu
    display flex
    flex-direction column
    align-items center
    border-bottom solid 1px tttc-line

    .price-per-hour
      margin-bottom 20px
      display none

    .view-switch
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

    @media (min-width 768px)
      flex-direction row
      .price-per-hour
        display block
        margin-bottom 0px
      .view-switch
        margin-left auto

  section.tasks
  section.months
  section.storage
  section.days
  section.years
    margin 20px auto 20px auto

  main
    max-width 1000px
    margin-left auto
    margin-right auto

  .timer
    margin-bottom 60px
    @media (min-width 768px)
      margin-bottom 90px
</style>
