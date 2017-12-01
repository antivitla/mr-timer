<template lang="pug">
  .view.storage
    span.text-muted(v-if="!isEntries") {{ label('noResultsLabel') }}
    storage-item(
      v-for="entry in Storage.entries"
      :key="entry.id"
      :entry="entry")
    view-interval(
      v-if="isInterval"
      format="D MMM YYYY")
    view-pagination(
      v-else
      type="storage")
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Storage } from '@/store/storage'
  import storageItem from '@/components/items/storage-item'
  import viewPagination from '@/components/views/view-pagination'
  import viewInterval from '@/components/views/view-interval'
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
      },
      ...mapGetters([
        'isInterval'
      ])
    },
    mixins: [
      i18nLabel
    ],
    components: {
      storageItem,
      viewPagination,
      viewInterval
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
