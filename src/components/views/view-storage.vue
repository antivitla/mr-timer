<template lang="pug">
  .view.view-storage
    span.text-muted(v-if="!isEntries") {{ label('noResultsLabel') }}
    storage-item(
      v-for="entry in Storage.entries"
      :key="entry.id"
      :entry="entry")
    view-pagination(
      v-if="isPaginationNeeded"
      type="entries"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { Storage } from '@/store/storage'
  import storageItem from '@/components/items/storage-item'
  import viewPagination from '@/components/views/view-pagination'
  // import { taskDelimiter } from '@/store/ui'
  import i18nLabel from '@/mixins/i18n-label'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Storage
      }
    },
    created () {
      this.unsubscribe = this.$store.subscribe(mutation => {
        if (mutation.type === 'setFilter') {
          this.getEntries({
            params: {
              limit: this.paginationEntries.limit,
              offset: 0,
              filter: mutation.payload.filter
                .map(f => f.trim())
                .filter(f => f)
            }
          })
        }
      })
    },
    beforeDestroy () {
      this.unsubscribe()
    },
    mounted () {
      this.getEntries({
        params: {
          limit: this.paginationEntries.limit,
          offset: 0,
          filter: (this.isFilter ? this.filter : null)
        }
      })
      bus.$emit('scroll-top')
    },
    computed: {
      isPaginationNeeded () {
        return this.paginationEntries.count >= this.paginationEntries.limit || true
      },
      isEntries () {
        return Storage.entries.length
      },
      ...mapGetters([
        'isFilter',
        'filter',
        'paginationEntries'
      ])
    },
    methods: {
      onChangeLimit (limit) {
        this.setEntriesPagination({ limit })
        this.getEntries({
          params: {
            limit,
            offset: this.paginationEntries.offset,
            filter: (this.isFilter ? this.filter : null)
          }
        })
        bus.$emit('scroll-top')
      },
      onChangeOffset (offset) {
        this.setEntriesPagination({ offset })
        this.getEntries({
          params: {
            limit: this.paginationEntries.limit,
            offset,
            filter: (this.isFilter ? this.filter : null)
          }
        })
        bus.$emit('scroll-top')
      },
      ...mapMutations([
        'setEntriesPagination',
        'clearSelected',
        'clearFilter',
        'setFilter'
      ]),
      ...mapActions([
        'getEntries'
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
