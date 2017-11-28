<template lang="pug">
  .settings-display
    .form
      .fieldset
        h5 {{ label('settings.positionOnScreen') }}
        p
          custom-radio(
            id="full-width"
            :value="'timer-full-width'"
            :model="timerWidthModel"
            @input="setTimerWidth($event)")
          label(for="full-width") {{ label('settings.setFullWidth') }}
        p
          custom-radio(
            id="center-width"
            :value="'timer-center'"
            :model="timerWidthModel"
            @input="setTimerWidth($event)")
          label(for="center-width") {{ label('settings.setCenterView') }}
      .fieldset
        h5 Что-то ещё
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import customRadio from '@/components/other/custom-radio'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        timerWidthModel: ''
      }
    },
    created () {
      this.timerWidthModel = this.fullWidth ? 'timer-full-width' : 'timer-center'
    },
    computed: {
      ...mapGetters([
        'fullWidth'
      ])
    },
    methods: {
      setTimerWidth (value) {
        this.timerWidthModel = value
        this.setFullWidth({
          fullWidth: value === 'timer-full-width'
        })
      },
      ...mapMutations([
        'setFullWidth'
      ])
    },
    mixins: [
      i18nLabel
    ],
    components: {
      customRadio
    }
  }
</script>
<style lang="stylus">
  //
</style>
