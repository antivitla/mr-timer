<template lang="pug">
  .filter-entries
    span.label {{ label('filter') }}
    list-input(
      :value="filterModel"
      @input-original-event="changeFilter($event.target.value)"
      :debounce="200"
      :placeholder="label('filterPlaceholder')")
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import listInput from '@/components/other/list-input'
  import { taskDelimiter } from '@/store/ui'

  export default {
    data () {
      return {
        filterModel: []
      }
    },
    created () {
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setFilter') {
          this.filterModel = mutation.payload.filter
        }
        if (mutation.type === 'clearFilter') {
          this.filterModel = []
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    mounted () {
      if (this.isFilter) {
        this.filterModel = this.filter
      }
    },
    computed: {
      ...mapGetters([
        'filter',
        'isFilter'
      ])
    },
    methods: {
      changeFilter (filter) {
        this.filterModel = filter.split(taskDelimiter)
        this.setFilter({ filter: this.filterModel })
      },
      ...mapMutations([
        'setFilter'
      ])
    },
    mixins: [
      i18nLabel
    ],
    components: {
      listInput
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .filter-entries
    display flex
    font-size 14px
    line-height 24px
    margin 0
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
      background-color transparent
      resize none
      font-weight 500
      width 100%
      text-align left
      &::placeholder
        font-weight 400
        color lighten(titamota-color-text-muted, 20%)
</style>
