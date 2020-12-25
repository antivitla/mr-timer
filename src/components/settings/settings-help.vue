<template lang="pug">
  p.settings-help
    button.block(@click="openHelp()") {{ label('settings.help.openHelp') }}
</template>
<script>
  import { mapMutations, mapActions } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    methods: {
      openHelp () {
        this.toggleSidebar()
        this.openModal({ modal: 'help' })
      },
      ...mapMutations([
        'toggleSidebar'
      ]),
      ...mapActions([
        'openModal'
      ])
    },
    mixins: [
      i18nLabel
    ]
  }
</script>
