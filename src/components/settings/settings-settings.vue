<template lang="pug">
  .settings-settings
    .form
      .fieldset
        h5 {{ label('sidebar.toggleViews') }}
        p
          custom-checkbox(
            :class="className('tasks')"
            v-model="settings.tasks")
          label(v-custom-for="classSelector('tasks')")
            | {{ label('view.tasks') }}
        p
          custom-checkbox(
            :class="className('years')"
            v-model="settings.years")
          label(v-custom-for="classSelector('years')")
            | {{ label('view.years') }}
        p
          custom-checkbox(
            :class="className('months')"
            v-model="settings.months")
          label(v-custom-for="classSelector('months')")
            | {{ label('view.months') }}
        p
          custom-checkbox(
            :class="className('days')"
            v-model="settings.days")
          label(v-custom-for="classSelector('days')")
            | {{ label('view.days') }}
        p
          custom-checkbox(
            :class="className('storage')"
            v-model="settings.storage")
          label(v-custom-for="classSelector('storage')")
            | {{ label('view.storage') }}
        p
          custom-checkbox(
            :class="className('help')"
            v-model="settings.help")
          label(v-custom-for="classSelector('help')")
            | {{ label('view.help') }}

      .fieldset
        h5 {{ label('sidebar.toggleUiSettings') }}
        p
          custom-checkbox(
            :class="className('profile')"
            v-model="settings.profile")
          label(v-custom-for="classSelector('profile')")
            | {{ label('sidebar.profile') }}
        p
          custom-checkbox(
            :class="className('authorization')"
            v-model="settings.authorization")
          label(v-custom-for="classSelector('authorization')")
            | {{ label('sidebar.authorization') }}
        p
          custom-checkbox(
            :class="className('l10n')"
            v-model="settings.l10n")
          label(v-custom-for="classSelector('l10n')")
            | {{ label('sidebar.l10n') }}
        p
          custom-checkbox(
            :class="className('migration')"
            v-model="settings.migration")
          label(v-custom-for="classSelector('migration')")
            | {{ label('sidebar.migration') }}
        //- p
        //-   custom-checkbox(
        //-     :class="className('export-import')"
        //-     v-model="settings.exportImport")
        //-   label(v-custom-for="classSelector('export-import')")
        //-     | {{ label('sidebar.exportImport') }}

</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import customCheckbox from '@/components/custom-checkbox'
  import customFor from '@/directives/custom-for'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    name: 'settings-settings',
    data () {
      return {
        settings: {
          profile: false,
          authorization: false,
          l10n: false,
          migration: false,
          exportImport: false,
          tasks: false,
          years: false,
          months: false,
          days: false,
          storage: false,
          help: false
        }
      }
    },
    created () {
      Object.assign(this.settings, this.viewsAvailable)
      Object.assign(this.settings, this.settingsAvailable)
    },
    watch: {
      'settings.profile': function () {
        this.setAvailableSettings({
          profile: this.settings.profile
        })
      },
      'settings.authorization': function () {
        this.setAvailableSettings({
          authorization: this.settings.authorization
        })
      },
      'settings.l10n': function () {
        this.setAvailableSettings({
          l10n: this.settings.l10n
        })
      },
      'settings.migration': function () {
        this.setAvailableSettings({
          migration: this.settings.migration
        })
      },
      'settings.exportImport': function () {
        this.setAvailableSettings({
          exportImport: this.settings.exportImport
        })
      },
      'settings.tasks': function () {
        this.setAvailableViews({
          tasks: this.settings.tasks
        })
      },
      'settings.years': function () {
        this.setAvailableViews({
          years: this.settings.years
        })
      },
      'settings.months': function () {
        this.setAvailableViews({
          months: this.settings.months
        })
      },
      'settings.days': function () {
        this.setAvailableViews({
          days: this.settings.days
        })
      },
      'settings.storage': function () {
        this.setAvailableViews({
          storage: this.settings.storage
        })
      },
      'settings.help': function () {
        this.setAvailableViews({
          help: this.settings.help
        })
      }
    },
    computed: {
      ...mapGetters([
        'viewsAvailable',
        'settingsAvailable'
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
      customCheckbox
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
