<template lang="pug">
  .view
    storage-item(
      v-for="entry in Storage.entries"
      :key="entry.id"
      :entry="entry")
</template>
<script>
  import { Storage } from '@/store/storage'
  import storageItem from '@/components/items/storage-item'
  export default {
    data () {
      return {
        Storage
      }
    },
    components: {
      storageItem
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
