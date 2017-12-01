<template lang="pug">
  .view.tasks
    span.text-muted(v-if="!isTasks") {{ label('noResultsLabel') }}
    group-item(
      v-for="task in filterGroupChildren(Tasks.children)"
      :key="task.name"
      :group="task")
    view-interval(
      v-if="isInterval"
      format="D MMM YYYY")
    view-pagination(
      v-else
      type="tasks")
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Tasks } from '@/store/groups/tasks'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import viewInterval from '@/components/views/view-interval'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        Tasks,
        filterGroupChildren
      }
    },
    computed: {
      isTasks () {
        return Tasks.children.length
      },
      ...mapGetters([
        'isContext',
        'isInterval'
      ])
    },
    mixins: [
      i18nLabel
    ],
    components: {
      groupItem,
      viewPagination,
      viewInterval
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
