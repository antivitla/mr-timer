<template lang="pug">
  .settings-settings
    .form
      .fieldset
        h5 {{ label('sidebar.toggleViews') }}
        p(v-for="(value, view) in views")
          custom-checkbox(mark
            :class="className(view)"
            v-model="models[view]")
          label(v-custom-for="classSelector(view)")
            | {{ label('view.' + view) }}

      .fieldset
        h5 {{ label('sidebar.toggleUiSettings') }}
        p(v-for="(value, setting) in settings")
          custom-checkbox(mark
            :class="className(setting)"
            v-model="models[setting]")
          label(v-custom-for="classSelector(setting)")
            | {{ label('settings.' + setting) }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import customCheckbox from '@/components/other/custom-checkbox'
  import customRadio from '@/components/other/custom-radio'
  import customFor from '@/directives/custom-for'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        models: {
          profile: false,
          authorization: false,
          l10n: false,
          migration: false,
          exportImport: false,
          newsUpdate: false,
          restoreAppState: false,
          reports: false,
          tasks: false,
          years: false,
          months: false,
          days: false,
          storage: false,
          help: false,
          displayOptions: false
        }
      }
    },
    created () {
      Object.assign(this.models, this.views)
      Object.assign(this.models, this.settings)
    },
    watch: {
      'models.profile': function () {
        this.setAvailableSettings({
          profile: this.models.profile
        })
      },
      'models.authorization': function () {
        this.setAvailableSettings({
          authorization: this.models.authorization
        })
      },
      'models.l10n': function () {
        this.setAvailableSettings({
          l10n: this.models.l10n
        })
      },
      'models.migration': function () {
        this.setAvailableSettings({
          migration: this.models.migration
        })
      },
      'models.newsUpdate': function () {
        this.setAvailableSettings({
          newsUpdate: this.models.newsUpdate
        })
      },
      'models.exportImport': function () {
        this.setAvailableSettings({
          exportImport: this.models.exportImport
        })
      },
      'models.restoreAppState': function () {
        this.setAvailableSettings({
          restoreAppState: this.models.restoreAppState
        })
      },
      'models.reports': function () {
        this.setAvailableSettings({
          reports: this.models.reports
        })
      },
      'models.displayOptions': function () {
        this.setAvailableSettings({
          displayOptions: this.models.displayOptions
        })
      },
      'models.tasks': function () {
        this.setAvailableViews({
          tasks: this.models.tasks
        })
      },
      'models.years': function () {
        this.setAvailableViews({
          years: this.models.years
        })
      },
      'models.months': function () {
        this.setAvailableViews({
          months: this.models.months
        })
      },
      'models.days': function () {
        this.setAvailableViews({
          days: this.models.days
        })
      },
      'models.storage': function () {
        this.setAvailableViews({
          storage: this.models.storage
        })
      },
      'models.help': function () {
        this.setAvailableViews({
          help: this.models.help
        })
      }
    },
    computed: {
      ...mapGetters([
        'views',
        'settings'
      ])
    },
    methods: {
      className (setting) {
        return `settings-toggle-${setting}`
      },
      classSelector (setting) {
        return `.settings-toggle-${setting}`
      },
      ...mapMutations([
        'setAvailableViews',
        'setAvailableSettings'
      ])
    },
    mixins: [
      i18nLabel
    ],
    directives: {
      customFor
    },
    components: {
      customCheckbox,
      customRadio
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .settings-settings
    margin-top -10px
    p
      display flex
    h5
      margin-top 10px

    @media (min-width titamota-screen-w-4)
      margin-top 0px
      h5
        margin-top 0px
</style>
