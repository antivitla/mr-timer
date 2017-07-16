<template lang="pug">
  .app(
    :class="{ 'timer-active': timerActive, 'sidebar-active': sidebarActive, 'modal-active': modalActive }"
    :lang="locale"
    :currency="currency"
    :is-currency-symbol-before="isCurrencySymbolBefore"
    v-body-scrolltop-on="scrollTopEvents")
    .page(:class="{ 'modal-active': modalActive }")
      main
        nav.app-menu(:class="{ 'with-context': context }")
          div.left
            task-context(
              v-if="context"
              :context="context")
          div.right
            div.toggle-sidebar(@click.stop.prevent="toggleSidebar")
              span.account {{ userKey }}
              span.icon-button
                i.material-icons menu

        //- Timer control
        timer

        //- Petrov API debug
        //- petrov

        //- View navigation
        nav.view-menu
          price-per-hour(
            v-if="currentView !== 'storage' && currentView !== 'help' && isEntries"
          )
          .filter-entries(
            v-if="currentView === 'storage' && !isSelectedEntries && isEntries"
          )
            span.label {{ filterLabel }}
            list-input(
              v-model="filter"
              :debounce="50"
              :placeholder="filterPlaceholderLabel")
          batch-actions(
            v-if="currentView === 'storage' && isSelectedEntries")
          div.view-switch
            a(
              v-for="view in getViewsAvailable()"
              :class="{ active: currentView === view }"
              @click="setCurrentView({ view })") {{ viewLabel(view) }}

        section.help.view(v-if="currentView === 'help'")
          help-article

        //- Tasks view
        section.tasks.view(v-if="currentView === 'tasks'")
          p.no-tasks(v-if="!isEntries && !isThinking") {{ noTasksLabel }}
          thinking-preloader(v-if="isThinking")
          group-item(
            v-for="task in filterGroupChildren(Tasks.children)"
            :key="task.name"
            :group="task")

        //- Years view
        section.years.view(v-if="currentView === 'years'")
          p.no-tasks(v-if="!isEntries && !isThinking") {{ noTasksLabel }}
          thinking-preloader(v-if="isThinking")
          group-item(
            v-for="year in filterGroupChildren(Years.children)"
            :key="year.name"
            :group="year")

        //- Months view
        section.months.view(v-if="currentView === 'months'")
          p.no-tasks(v-if="!isEntries && !isThinking") {{ noTasksLabel }}
          thinking-preloader(v-if="isThinking")
          group-item(
            v-for="month in filterGroupChildren(Months.children)"
            :key="month.name"
            :group="month")

        //- Days view
        section.days.view(v-if="currentView === 'days'")
          p.no-tasks(v-if="!isEntries && !isThinking") {{ noTasksLabel }}
          thinking-preloader(v-if="isThinking")
          group-item(
            v-for="day in filterGroupChildren(Days.children)"
            :key="day.name"
            :group="day")

        //- Storage view
        section.storage.view(v-if="currentView === 'storage'")
          p.no-results(
            v-if="!filteredEntries.length && !isThinking"
          ) {{ noResultsLabel }}
          thinking-preloader(v-if="isThinking")
          storage-item(
            v-else
            v-for="entry in filteredEntries"
            :key="entry.uid()"
            :entry="entry")

      //- Footer
      site-footer(v-if="isEntries")

    //- Настройки
    sidebar

    //- Попапы
    modal(v-if="modalActive")
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
  import modal from '@/components/modal'
  import thinkingPreloader from '@/components/thinking-preloader'
  import Group from '@/models/group'
  import { Tasks } from '@/store/groups/tasks'
  import { Years } from '@/store/groups/years'
  import { Months } from '@/store/groups/months'
  import { Days } from '@/store/groups/days'
  import { Storage } from '@/store/storage'
  import { Selektion } from '@/store/selection'
  import { translate, locales, currencies } from '@/store/i18n'
  import capitalize from 'lodash/capitalize'
  import { timeEditable } from '@/utils/time'
  import { filterGroupChildren } from '@/utils/group'
  import debounce from '@/utils/debounce'
  import bus from '@/event-bus'
  import bodyScrolltopOn from '@/directives/body-scrolltop-on'

  export default {
    data () {
      return {
        Tasks,
        Years,
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
        filter: [],
        locales,
        currencies,
        debounceRefreshView: debounce(),
        isThinking: false
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
      // Thinking toggle
      bus.$on('batch-thinking-start', () => {
        this.isThinking = true
      })
      bus.$on('batch-thinking-done', () => {
        this.isThinking = false
      })
      bus.$on('load-entries-start', () => {
        this.isThinking = true
      })
      bus.$on('load-entries-done', () => {
        this.isThinking = false
      })
    },

    watch: {
      '$route' (to, from) {
        if (to.params.user !== from.params.user) {
          const user = to.params.user ? to.params.user : 'local'
          this.refreshAppWithUserData(user)
        }
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
      noTasksLabel () {
        return capitalize(translate[this.locale].noTasksLabel)
      },
      isEntries () {
        return Storage.entries.length
      },
      isSelectedEntries () {
        return Selektion.entries.length
      },
      isDays () {
        return Days.children.length > 1
      },
      isMonths () {
        return Months.children.length > 1
      },
      isYears () {
        return Years.children.length > 1
      },
      isTasks () {
        return Storage.entries.length > 1
      },
      isNestedTasks () {
        return Tasks.children.find(child => {
          return child.children.find(g => g instanceof Group)
        })
      },
      ...mapGetters([
        'userKey',
        'userMode',
        'userGuestKey',
        'locale',
        'currency',
        'isCurrencySymbolBefore',
        'currentView',
        'timerActive',
        'sidebarActive',
        'modalActive',
        'viewsAvailable',
        'context'
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
        const l = Object.keys(locales).find(code => {
          return this.$route.query.locale === code
        })
        return l || this.locale || 'ru'
      },
      detectCurrency () {
        const c = Object.keys(currencies).find(code => {
          return this.$route.query.currency === code
        })
        return c || this.currency || 'rub'
      },
      refreshAppWithUserData (userKey) {
        this.clearEntries()
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
      getViewsAvailable () {
        let views = Object
          .keys(this.viewsAvailable)
          .filter(key => this.viewsAvailable[key])
        // check current view
        this.debounceRefreshView(() => {
          if (views.indexOf(this.currentView) < 0) {
            this.setCurrentView({
              view: views.slice(-1)[0]
            })
          }
        }, 500)
        return views
      },
      ...mapMutations([
        'clearEntries',
        'clearUser',
        'setUserKey',
        'setLocale',
        'setCurrency',
        'setCurrentView',
        'selectionClear',
        'toggleSidebar'
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
      sidebar,
      modal,
      thinkingPreloader
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

  .page-wrapper
    position relative

  .page
    background-color titamota-color-back-light
    padding-top 20px
    padding-bottom 20px
    padding-left 20px
    padding-right 20px
    box-sizing border-box
    opacity 1
    transition all 0.3s ease-out
    @media (min-width 480px)
      padding-left 30px
      padding-right 30px
    @media (min-width 768px)
      padding-top 60px
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
  .no-tasks
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
    margin-left -5px
    width calc(100% + 10px)
    @media (min-width 768px)
      margin-bottom 90px

  .app-menu
    box-sizing border-box
    margin-bottom 20px
    display flex
    align-items center
    justify-content space-between
    line-height 40px
    &.with-context
      @media (min-width 768px)
        margin-bottom 80px
    .left
      .task-context
        display none
        font-size 48px
        line-height 1.125
        margin-left calc(-48px - 0.25em)
        .name
          color titamota-color-text
          font-weight 300
          white-space normal
          padding-right 1em
        .clear
        .back
          font-size 87.5%
          color titamota-color-text-muted
        @media (min-width 768px)
          display flex
    .right
      margin-left auto
    .toggle-sidebar
      display flex
      cursor pointer
      .material-icons
        font-size 18px
      .account
        font-size 14px
        margin-right 10px

    @media (min-width 768px)
      max-width 1040px

  .app
    .page
      transform translateX(0px)
      filter blur(0px) grayscale(0%)
      opacity 1
    &.sidebar-active .page
      transform translateX(-50vw)
      pointer-events none
      .toggle-sidebar
        visibility hidden
    &.modal-active .page
      filter blur(10px) grayscale(100%)
      opacity 0.25
      pointer-events none
</style>
