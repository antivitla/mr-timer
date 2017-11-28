<template lang="pug">
  .context-nav(v-if="isContext")
    //- Path to current task
    div.path(v-if="context.length > 1")
      span.item(
        v-for="(item, index) in path"
        :title="label('context.setAsCurrentTask')"
        @click="setAsCurrentTask(item, index)") {{ parseDetail(item) }}
    //- Current task
    div.task
      span.item(:title="label('context.task')") {{ parseDetail(task) }}
      a.icon-button.clear(
        @click="clearContextAndGetEntries"
        :title="label('context.clear')")
        i.material-icons close
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import i18nLabel from '@/mixins/i18n-label'
  import storage from '@/mixins/storage'
  import parseDetail from '@/utils/parseDetail'

  export default {
    data () {
      return {
        parseDetail
      }
    },
    computed: {
      path () {
        return this.context.slice(0, -1)
      },
      task () {
        return this.context.slice(-1)[0]
      },
      ...mapGetters([
        'context',
        'isContext'
      ])
    },
    methods: {
      clearContextAndGetEntries () {
        this.clearContext()
        this.getEntriesWithCurrentParams()
      },
      setAsCurrentTask (item, index) {
        this.setContext({ context: this.context.slice(0, index + 1) })
        this.getEntriesWithCurrentParams()
      },
      ...mapMutations([
        'clearContext',
        'setContext'
      ])
    },
    mixins: [
      i18nLabel,
      storage
    ]
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .context-nav
    .path
      line-height 20px
      font-size 18px
      font-weight 400
      display flex
      margin-top -20px
      @media (max-width titamota-screen-w-7)
        font-size 14px
        font-weight 400
        position relative
        top 15px
      .item
        cursor pointer
        opacity 0.25
        &:hover
          opacity 1
        &:after
          content ' /'
          margin-right 0.25em
        &:last-child:after
          content none
    .task
      line-height 60px
      display flex
      .item
        font-size 45px
        font-weight 500
        letter-spacing -1px
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        display block
        @media (max-width titamota-screen-w-7)
          font-size 24px
          letter-spacing -0.02em

    .clear
      margin-left 10px
      position relative
      top 3px
      opacity 0.25
      &:hover
        opacity 1
      .material-icons
        font-size 30px
      @media (max-width titamota-screen-w-7)
        top 1px
        .material-icons
          font-size 18px
</style>
