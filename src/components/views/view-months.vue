<template lang="pug">
  .view.months
    span.text-muted(v-if="!isMonths") {{ label('noResultsLabel') }}
    group-item(
      v-for="month in filterGroupChildren(Months.children)"
      :key="month.name"
      :group="month")
    view-interval(
      v-if="isInterval"
      format="D MMM YYYY"
      initial-view="month")
    view-pagination(
      v-else
      type="months")
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Months } from '@/store/groups/months'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import viewInterval from '@/components/views/view-interval'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        Months,
        filterGroupChildren
      }
    },
    computed: {
      isMonths () {
        return Months.children.length
      },
      ...mapGetters([
        'isInterval'
      ])
    },
    mixins: [
      i18nLabel
    ],
    components: {
      groupItem,
      viewPagination,
      viewInterval
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
