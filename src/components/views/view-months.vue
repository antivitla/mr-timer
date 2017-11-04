<template lang="pug">
  .view
    group-item(
      v-for="month in Months.children"
      :key="month.name"
      :group="month")
    view-pagination(
      type="months"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { Months } from '@/store/groups/months'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Months
      }
    },
    mounted () {
      this.getEntries({
        params: {
          last: 'months',
          limit: this.paginationMonths.limit,
          offset: 0
        }
      })
      bus.$emit('scroll-top')
    },
    computed: {
      ...mapGetters([
        'paginationMonths'
      ])
    },
    methods: {
      onChangeLimit (limit) {
        this.setMonthsPagination({ limit })
        this.getEntries({
          params: {
            last: 'months',
            limit,
            offset: this.paginationMonths.offset
          }
        })
        bus.$emit('scroll-top')
      },
      onChangeOffset (offset) {
        this.setMonthsPagination({ offset })
        this.getEntries({
          params: {
            last: 'months',
            limit: this.paginationMonths.limit,
            offset
          }
        })
        bus.$emit('scroll-top')
      },
      ...mapMutations([
        'setMonthsPagination'
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
