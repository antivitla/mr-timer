<template lang="pug">
  .context-nav(v-if="context.length")
    span.icon-button.up(
      @click="upContextAndGetEntries"
      :title="label('context.up')")
      i.material-icons arrow_back
    span.path(:title="label('context.description')")
      span.item(v-for="item in context") {{ item }}
      span.icon-button.clear(
        @click="clearContextAndGetEntries"
        :title="label('context.clear')")
        i.material-icons close
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import viewHelper from '@/mixins/view-helper'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    computed: {
      ...mapGetters([
        'context'
      ])
    },
    methods: {
      clearContextAndGetEntries () {
        this.clearContext()
        this.getEntries({ params: this.viewGetParams() })
      },
      upContextAndGetEntries () {
        this.upContext()
        this.getEntries({ params: this.viewGetParams() })
      },
      ...mapMutations([
        'clearContext',
        'upContext'
      ])
    },
    mixins: [
      viewHelper,
      i18nLabel
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .context-nav
    font-size 24px
    line-height 40px
    font-weight 400
    display flex
    align-items flex-start
    margin-left -24px
    .icon-button
      font-size inherit
      line-height 30px
      .material-icons
        font-size inherit
    .up
      margin-right 10px
      position relative
      top 5px
      color titamota-color-text-muted
      cursor pointer
    .path
      display inline-flex
      flex-wrap wrap
      color titamota-color-text
      .clear
        margin-left 10px
        position relative
        top 1px
        color titamota-color-text-muted
        cursor pointer
      .item + .item
        margin-left 0.25em
        &:before
          content '/ '
</style>
