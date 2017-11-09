<template lang="pug">
  .view
    span.text-muted(v-if="!isTasks") {{ label('noResultsLabel') }}
    group-item(
      v-for="task in filterGroupChildren(Tasks.children)"
      :key="task.name"
      :group="task")
    view-pagination(
      v-if="!isContext"
      type="tasks"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Tasks } from '@/store/groups/tasks'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import i18nLabel from '@/mixins/i18n-label'
  import viewHelper from '@/mixins/view-helper'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Tasks,
        filterGroupChildren
      }
    },
    mounted () {
      this.getEntries({ params: this.viewGetParams() })
      bus.$emit('scroll-top')
    },
    computed: {
      isTasks () {
        return Tasks.children.length
      },
      ...mapGetters([
        'context',
        'isContext'
      ])
    },
    methods: {
      ...mapActions([
        'getEntries'
      ])
    },
    mixins: [
      i18nLabel,
      viewHelper
    ],
    components: {
      groupItem,
      viewPagination
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
