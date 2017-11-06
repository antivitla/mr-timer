<template lang="pug">
  .view
    group-item(
      v-for="day in filterGroupChildren(Days.children)"
      :key="day.name"
      :group="day")
    view-pagination(
      type="days"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { Days } from '@/store/groups/days'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Days,
        filterGroupChildren
      }
    },
    mounted () {
      this.getEntries({
        params: {
          last: 'days',
          limit: this.paginationDays.limit,
          offset: 0
        }
      })
      bus.$emit('scroll-top')
    },
    computed: {
      ...mapGetters([
        'paginationDays'
      ])
    },
    methods: {
      onChangeLimit (limit) {
        this.setDaysPagination({ limit })
        this.getEntries({
          params: {
            last: 'days',
            limit,
            offset: this.paginationDays.offset
          }
        })
        bus.$emit('scroll-top')
      },
      onChangeOffset (offset) {
        this.setDaysPagination({ offset })
        this.getEntries({
          params: {
            last: 'days',
            limit: this.paginationDays.limit,
            offset
          }
        })
        bus.$emit('scroll-top')
      },
      ...mapMutations([
        'setDaysPagination'
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
