<template lang="pug">
  .view
    group-item(
      v-for="task in Tasks.children"
      :key="task.name"
      :group="task")
</template>
<script>
  import { Tasks } from '@/store/groups/tasks'
  import groupItem from '@/components/items/group-item'
  export default {
    data () {
      return {
        Tasks
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
