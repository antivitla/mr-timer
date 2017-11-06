<template lang="pug">
  .view
    group-item(
      v-for="task in filterGroupChildren(Tasks.children)"
      :key="task.name"
      :group="task")
</template>
<script>
  import { Tasks } from '@/store/groups/tasks'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  export default {
    data () {
      return {
        Tasks,
        filterGroupChildren
      }
    },
    components: {
      groupItem
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
