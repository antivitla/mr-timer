<template lang="pug">
  .view.view-storage
    span.text-muted(v-if="!isEntries") {{ label('noResultsLabel') }}
    storage-item(
      v-for="entry in Storage.entries"
      :key="entry.id"
      :entry="entry")
    view-pagination(
      type="entries"
      @limit="changeCurrentViewLimit"
      @offset="changeCurrentViewOffset")
</template>
<script>
  import { mapActions } from 'vuex'
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
    methods: {
      ...mapActions([
        'changeCurrentViewOffset',
        'changeCurrentViewLimit'
      ])
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
