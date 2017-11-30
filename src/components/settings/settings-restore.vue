<template lang="pug">
  .settings-restore
    p.notes
      small {{ label('settings.restoreApp.description') }}
    button.hero(@click='restoreApplicationState()')
      strong {{ label('settings.restoreApp.comment') }}
</template>
<script>
  import i18nLabel from '@/mixins/i18n-label'
  import { appName } from '@/store/app-info'

  export default {
    methods: {
      restoreApplicationState () {
        delete window.localStorage.removeItem(appName + '-store')
      }
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  .settings-restore
    .notes
      margin-bottom 20px
</style>
