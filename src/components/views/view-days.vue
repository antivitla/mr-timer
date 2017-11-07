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
  import { mapActions } from 'vuex'
  import { Days } from '@/store/groups/days'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import viewHelper from '@/mixins/view-helper'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Days,
        filterGroupChildren
      }
    },
    mounted () {
      this.getEntries({ params: this.viewGetParams() })
      bus.$emit('scroll-top')
    },
    methods: {
      ...mapActions([
        'getEntries'
      ])
    },
    mixins: [
      viewHelper
    ],
    components: {
      groupItem,
      viewPagination
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
