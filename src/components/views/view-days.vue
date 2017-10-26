<template lang="pug">
  .view
    group-item(
      v-for="day in Days.children"
      :key="day.name"
      :group="day")
</template>
<script>
  import { Days } from '@/store/groups/days'
  import groupItem from '@/components/items/group-item'
  export default {
    data () {
      return {
        Days
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
