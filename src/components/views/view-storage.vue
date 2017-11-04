<template lang="pug">
  .view.view-storage
    storage-item(
      v-for="entry in Storage.entries"
      :key="entry.id"
      :entry="entry")
    view-pagination(
      type="entries"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { Storage } from '@/store/storage'
  import storageItem from '@/components/items/storage-item'
  import viewPagination from '@/components/views/view-pagination'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Storage
      }
    },
    mounted () {
      this.getEntries({
        params: {
          limit: this.paginationEntries.limit,
          offset: 0
        }
      })
      bus.$emit('scroll-top')
    },
    computed: {
      ...mapGetters([
        'paginationEntries'
      ])
    },
    methods: {
      onChangeLimit (limit) {
        this.setEntriesPagination({ limit })
        this.getEntries({
          params: {
            limit,
            offset: this.paginationEntries.offset
          }
        })
        bus.$emit('scroll-top')
      },
      onChangeOffset (offset) {
        this.setEntriesPagination({ offset })
        this.getEntries({
          params: {
            limit: this.paginationEntries.limit,
            offset
          }
        })
        bus.$emit('scroll-top')
      },
      ...mapMutations([
        'setEntriesPagination'
      ]),
      ...mapActions([
        'getEntries'
      ])
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
