<template lang="pug">
  .view.view-storage
    span.text-muted(v-if="!isEntries") {{ label('noResultsLabel') }}
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
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        Storage
      }
    },
    computed: {
      isEntries () {
        return Storage.entries.length
      }
    },
    mixins: [
      i18nLabel
    ],
    components: {
      storageItem,
      viewPagination
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
