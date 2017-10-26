<template lang="pug">
  .view
    group-item(
      v-for="year in Years.children"
      :key="year.name"
      :group="year")
</template>
<script>
  import { Years } from '@/store/groups/years'
  import groupItem from '@/components/items/group-item'
  export default {
    data () {
      return {
        Years
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
