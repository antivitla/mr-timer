<template lang="pug">
  .view
    group-item(
      v-for="month in Months.children"
      :key="month.name"
      :group="month")
</template>
<script>
  import { Months } from '@/store/groups/months'
  import groupItem from '@/components/items/group-item'
  export default {
    data () {
      return {
        Months
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
