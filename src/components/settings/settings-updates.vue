<template lang="pug">
  .settings-updates
    p
      custom-checkbox(
        class="show-news-modal"
        v-model="hideUntilNextUpdate")
      label(v-custom-for="'.show-news-modal'")
        span {{ label('settings.doNotShowUntilNextUpdate') }}

    p
      small {{ label('settings.lastUpdate') }} {{ displayLastUpdate }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import customCheckbox from '@/components/other/custom-checkbox'
  import customFor from '@/directives/custom-for'
  import { time } from '@/utils/time'

  export default {
    computed: {
      hideUntilNextUpdate: {
        get () {
          return this.lastUpdate <= this.lastReadUpdate
        },
        set (value) {
          this.setLastReadUpdate({
            lastReadUpdate: value ? new Date() : new Date(null)
          })
        }
      },
      displayLastUpdate () {
        return time(this.lastUpdate.getTime()).format('D MMM YYYY', this.locale)
      },
      ...mapGetters([
        'locale',
        'lastUpdate',
        'lastReadUpdate'
      ])
    },
    methods: {
      ...mapMutations([
        'setLastReadUpdate'
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
