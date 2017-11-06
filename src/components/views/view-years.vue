<template lang="pug">
  .view
    group-item(
      v-for="year in filterGroupChildren(Years.children)"
      :key="year.name"
      :group="year")
    view-pagination(
      type="years"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { Years } from '@/store/groups/years'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Years,
        filterGroupChildren
      }
    },
    mounted () {
      this.getEntries({
        params: {
          last: 'years',
          limit: this.paginationYears.limit,
          offset: 0
        }
      })
      bus.$emit('scroll-top')
    },
    computed: {
      ...mapGetters([
        'paginationYears'
      ])
    },
    methods: {
      onChangeLimit (limit) {
        this.setYearsPagination({ limit })
        this.getEntries({
          params: {
            last: 'years',
            limit,
            offset: this.paginationYears.offset
          }
        })
        bus.$emit('scroll-top')
      },
      onChangeOffset (offset) {
        this.setYearsPagination({ offset })
        this.getEntries({
          params: {
            last: 'years',
            limit: this.paginationYears.limit,
            offset
          }
        })
        bus.$emit('scroll-top')
      },
      ...mapMutations([
        'setYearsPagination'
      ]),
      ...mapActions([
        'getEntries'
      ])
    },
    components: {
      groupItem,
      viewPagination
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
