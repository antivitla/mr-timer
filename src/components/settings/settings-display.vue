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
        h5 {{ label('settings.paginationType') }}
        p
          custom-radio(
            id="paging-standard"
            :value="'paging-standard'"
            :model="pagingModel"
            @input="setPaging($event)")
          label(for="paging-standard") {{ label('settings.setPaginationStandard') }}
        p
          custom-radio(
            id="paging-interval"
            :value="'paging-interval'"
            :model="pagingModel"
            @input="setPaging($event)")
          label(for="paging-interval") {{ label('settings.setPaginationInterval') }}
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import customRadio from '@/components/other/custom-radio'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        timerWidthModel: '',
        pagingModel: ''
      }
    },
    created () {
      this.timerWidthModel = this.fullWidth ? 'timer-full-width' : 'timer-center'
      this.pagingModel = this.isPagination ? 'paging-standard' : 'paging-interval'
    },
    computed: {
      ...mapGetters([
        'fullWidth',
        'isPagination'
      ])
    },
    methods: {
      setTimerWidth (value) {
        this.timerWidthModel = value
        this.setFullWidth({
          fullWidth: value === 'timer-full-width'
        })
      },
      setPaging (value) {
        this.pagingModel = value
        this.setPaginationOrInterval({
          paginationOrInterval: value === 'paging-standard' || false
        })
      },
      ...mapMutations([
        'setFullWidth',
        'setPaginationOrInterval'
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
