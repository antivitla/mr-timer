<template lang="pug">
  .view
    storage-item(
      v-for="entry in Storage.entries"
      :key="entry.id"
      :entry="entry")
    view-pagination(type="storage")
</template>
<script>
  import { Storage } from '@/store/storage'
  import storageItem from '@/components/items/storage-item'
  import viewPagination from '@/components/views/view-pagination'
  export default {
    data () {
      return {
        Storage
      }
    },
    components: {
      storageItem,
      viewPagination
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
