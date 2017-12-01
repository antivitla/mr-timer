<template lang="pug">
  .view.months
    span.text-muted(v-if="!isMonths") {{ label('noResultsLabel') }}
    //- view-report(
      v-if="isMonths || true"
      :source="filterGroupChildren(Months.children)")
    group-item(
      v-for="month in filterGroupChildren(Months.children)"
      :key="month.name"
      :group="month")
    view-interval(
      v-if="isInterval"
      format="MMMM YYYY"
      :min-view="'month'"
      :max-view="'month'")
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
  import viewReport from '@/components/views/view-report'
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
      viewReport,
      viewInterval
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
