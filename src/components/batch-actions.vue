<template lang="pug">
  .batch-actions
    span.icon-button.delete(
      :title="deleteLabel"
      @click="batchRemove(selectionEntries)")
      i.material-icons delete
    span.label {{ selectedLabel(selectionEntries.length) }}
    span.icon-button.delete(
      :title="cancelLabel"
      @click="selectionClear()")
      i.material-icons block
</template>

<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import pluralize from '@/utils/pluralize'
  import capitalize from 'lodash/capitalize'
  import { translate } from '@/store/i18n'

  export default {
    computed: {
      deleteLabel () {
        return capitalize(translate[this.locale].delete)
      },
      cancelLabel () {
        return capitalize(translate[this.locale].cancel)
      },
      ...mapGetters([
        'locale',
        'selectionEntries'
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
      batchRemove (entries) {
        this.batchRemoveEntries({
          entries: this.selectionEntries
        })
        this.selectionClear()
      },
      ...mapMutations([
        'selectionClear'
      ]),
      ...mapActions([
        'batchRemoveEntries'
      ])
    }
  }
</script>

<style lang="stylus">
  .batch-actions
    display flex
    font-size 14px
    line-height 24px
    .label
      color tttc-text-muted
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
