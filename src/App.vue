<template lang="pug">
  //- .app(
  //-     :class="{ 'timer-active': timerActive, 'modal-active': modal.active }"
  .app(
    :class="{ 'timer-active': timerActive }"
    :lang="locale"
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore"
    v-body-scrolltop-on="scrollTopEvents")
    .page
      main
        //- Context
        nav.app-menu
          div.left
          div.right
            div.toggle-sidebar
              span.account(v-if="userKey !== 'local'")
                | {{ userKey }}
              span.icon-button
                i.material-icons menu

        //- Timer control
        timer

        //- Petrov API debug
        //- petrov

        //- View navigation
        nav.view-menu(v-if="Storage.entries.length")
          price-per-hour(
            v-if="currentView !== 'storage'")
          .filter-entries(
            v-if="currentView === 'storage' && !Selektion.entries.length")
            span.label {{ filterLabel }}
            list-input(
              v-model="filter"
              :debounce="50"
              :placeholder="filterPlaceholderLabel")
          batch-actions(
            v-if="currentView === 'storage' && Selektion.entries.length")
          div.view-switch
            a(
              v-for="view in ['tasks', 'months', 'days', 'storage']"
              :class="{ active: currentView === view }"
              @click="setCurrentView({ view })") {{ viewLabel(view) }}

        //- Tasks view
        section.tasks.view(v-if="currentView === 'tasks'")
          group-item(
            v-for="task in filterGroupChildren(Tasks.children)"
            :key="task.name"
            :group="task")

        //- Months view
        section.months.view(v-if="currentView === 'months'")
          group-item(
            v-for="month in filterGroupChildren(Months.children)"
            :key="month.name"
            :group="month")

        //- Days view
        section.days.view(v-if="currentView === 'days'")
          group-item(
            v-for="day in filterGroupChildren(Days.children)"
            :key="day.name"
            :group="day")

        .filter-entries(
          v-if="currentView === 'storage' && !Selektion.entries.length && Storage.entries.length")
          span.label {{ filterLabel }}
          list-input(
            v-model="filter"
            :debounce="50"
            :placeholder="filterPlaceholderLabel")

        //- Storage view
        section.storage.view(v-if="currentView === 'storage' && Storage.entries.length")
          p.no-results(
            v-if="!filteredEntries.length") {{ noResultsLabel }}
          storage-item(
            v-else
            v-for="entry in filteredEntries"
            :key="entry.uid()"
            :entry="entry")

      //- Хелп
      help-article(v-if="!Storage.entries.length")

      //- Footer
      site-footer(v-if="Storage.entries.length")

      //- Хелп
      help-article(v-if="Storage.entries.length")

    //- Настройки
    sidebar

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
  import batchActions from '@/components/batch-actions'
  import listInput from '@/components/list-input'
  import taskContext from '@/components/task-context'
  import helpArticle from '@/components/help-article'
  import sidebar from '@/components/sidebar'
  // import modal from '@/components/modal'
  // import editTaskModal from '@/components/modals/edit-task-modal'
  import { Tasks } from '@/store/groups/tasks'
  import { Months } from '@/store/groups/months'
  import { Days } from '@/store/groups/days'
  import { Storage } from '@/store/storage'
  import { Selektion } from '@/store/selection'
  import { translate, languages, currencies } from '@/store/i18n'
  import capitalize from 'lodash/capitalize'
  import { timeEditable } from '@/utils/time'
  import { filterGroupChildren } from '@/utils/group'
  import bus from '@/event-bus'
  import bodyScrolltopOn from '@/directives/body-scrolltop-on'

  export default {
    data () {
      return {
        Tasks,
        Months,
        Days,
        Storage,
        Selektion,
        filterGroupChildren,
        scrollTopEvents: [
          'start-task',
          'filter-entries',
          'set-context'
        ],
        filter: []
      }
    },

    created () {
      this.refreshAppWithUserData(this.detectUserKey())
      this.refreshLocale()
      this.loadRates()
      // bus.$on('open-modal', this.openModal.bind(this))
      // bus.$on('close-modal', this.closeModal.bind(this))
      // filter entries (switch to storage and set filter)
      bus.$on('filter-entries', (payload) => {
        this.setCurrentView({ view: 'storage' })
        this.filter = payload.filter
      })
      // Clear filter on view switch
      this.$store.subscribe(mutation => {
        if (mutation.type === 'setCurrentView' && mutation.payload.view !== 'storage') {
          this.filter = []
        }
      })
      // Clear selection on view switch
      this.$store.subscribe(mutation => {
        if (mutation.type === 'setCurrentView' &&
          mutation.type !== this.currentView) {
          this.selectionClear()
        }
      })
    },

    watch: {
      '$route' (to, from) {
        this.refreshAppWithUserData(this.detectUserKey())
        this.refreshLocale()
        this.refreshCurrency()
      }
    },

    computed: {
      filteredEntries () {
        let filtered
        if (!this.filter || !this.filter.length) {
          filtered = Storage.entries
        } else {
          filtered = Storage.entries.filter(entry => {
            const str = timeEditable
              .stringify(entry.start) +
              ' ' +
              entry.details.join('/')
            return this.filter.every(f => {
              return str.toLowerCase().match(f.toLowerCase())
            })
          })
        }
        return filtered
      },
      filterLabel () {
        return capitalize(translate[this.locale].filter)
      },
      filterPlaceholderLabel () {
        return translate[this.locale].filterPlaceholder
      },
      noResultsLabel () {
        return capitalize(translate[this.locale].noResultsLabel)
      },
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
        return l || this.locale || 'ru'
      },
      detectCurrency () {
        const c = Object.keys(currencies).find(code => {
          return this.$route.query[code] !== undefined
        })
        return c || this.currency || 'rub'
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
      // openModal (modal) {
      //   this.modal.active = true
      //   this.modal.id = modal.id
      //   this.modal.data = modal.data
      //   this.modal.position = modal.position
      // },
      // closeModal () {
      //   this.modal.active = false
      // },
      ...mapMutations([
        'clearEntries',
        'clearUser',
        'setUserKey',
        'setLocale',
        'setCurrency',
        'setCurrentView',
        'selectionClear'
      ]),
      ...mapActions([
        'loadEntries',
        'loadRates'
      ])
    },

    directives: {
      bodyScrolltopOn
    },

    components: {
      petrov,
      timer,
      pricePerHour,
      groupItem,
      storageItem,
      siteFooter,
      batchActions,
      listInput,
      taskContext,
      helpArticle,
      sidebar
      // modal
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
    background-color titamota-color-back-light
    position relative

  .app > .scrollable
    height 100vh
    overflow auto

  .page-wrapper
    position relative

  .page
    background-color titamota-color-back-light
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
    border-bottom solid 1px titamota-color-line

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
          background-color titamota-color-text

    @media (min-width 768px)
      flex-direction row
      .price-per-hour
        display block
        margin-bottom 0px
      .view-switch
        margin-left auto

  .filter-entries
    display flex
    font-size 14px
    line-height 24px
    width 100%
    margin 20px auto 40px auto
    flex-direction column
    text-align center
    .label
      margin-right 0.5em
    textarea
      font-size inherit
      line-height 20px
      padding 2px 0px
      display block
      border: none
      margin 0
      border-radius 5px
      background-color white
      resize none
      font-weight 500
      width 100%
      text-align center
      &::placeholder
        font-weight 400
        color lighten(titamota-color-text-muted, 20%)
  .no-results
    color titamota-color-text-muted
    text-align center
  .view-menu
    .filter-entries
      display none

  @media (min-width 768px)
    .filter-entries
      display none
    .view-menu
      .filter-entries
        display flex
        flex-direction row
        margin 0
        textarea
          width calc(50%)
          text-align left
          background-color transparent

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

  .app-menu
    position absolute
    left 50%
    width calc(100% - 50px)
    padding 0 20px
    max-width 990px
    transform: translateX(-50%)
    top 20px
    display flex
    align-items center
    justify-content space-between
    line-height 40px
    .right
      margin-left auto
    .toggle-sidebar
      display flex
      .account
        font-size 14px
        margin-right 10px
    @media (min-width 480px)
      width calc(100% - 70px)
    @media (min-width 768px)
      top 40px
      width calc(100% - 130px)
</style>
