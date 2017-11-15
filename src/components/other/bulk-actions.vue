<template lang="pug">
  .bulk-actions
    span.icon-button.delete(
      :title="deleteLabel"
      @click="deleteSelectedEntries()")
      i.material-icons delete
    span.label {{ selectedLabel(Selected.entries.length) }}
    span.icon-button.delete(
      :title="cancelLabel"
      @click="clearSelected()")
      i.material-icons block
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import pluralize from '@/utils/pluralize'
  import capitalize from 'lodash/capitalize'
  import { translate } from '@/store/i18n'
  import { Selected } from '@/store/selected'
  import storage from '@/mixins/storage'

  export default {
    data () {
      return {
        Selected
      }
    },
    computed: {
      deleteLabel () {
        return capitalize(translate[this.locale].delete)
      },
      cancelLabel () {
        return capitalize(translate[this.locale].cancel)
      },
      ...mapGetters([
        'locale'
      ])
    },
    methods: {
      selectedLabel (q) {
        const t = translate[this.locale]
        const entries = pluralize(q, {
          zero: t.entries.zero,
          one: t.entries.one,
          few: t.entries.few,
          many: t.entries.many
        })
        const or = t.or
        return q + ' ' + entries + ' ' + or
      },
      deleteSelectedEntries () {
        const entries = Selected.entries.slice(0)
        this.deleteAndGetEntries({ entries })
        this.clearSelected()
      },
      ...mapMutations([
        'clearSelected'
      ])
    },
    mixins: [
      storage
    ]
  }
</script>
<style lang="stylus">
  .bulk-actions
    display flex
    font-size 14px
    line-height 24px
    .label
      color titamota-color-text-muted
    .icon-button
      cursor pointer
      margin-right 0.375em
      margin-left 0.375em
      font-size 20px
      position relative
      top -2px
      &:first-child
        margin-left 0em
</style>
