<template lang="pug">
  .view.tasks
    span.text-muted(v-if="!isTasks") {{ label('noResultsLabel') }}
    group-item(
      v-for="task in filterGroupChildren(Tasks.children)"
      :key="task.name"
      :group="task")
    view-pagination(
      v-if="!isContext"
      type="tasks")
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Tasks } from '@/store/groups/tasks'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
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
        'isContext'
      ])
    },
    mixins: [
      i18nLabel
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
