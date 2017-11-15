<template lang="pug">
  .view
    span.text-muted(v-if="!isMonths") {{ label('noResultsLabel') }}
    group-item(
      v-for="month in filterGroupChildren(Months.children)"
      :key="month.name"
      :group="month")
    view-pagination(type="months")
</template>
<script>
  import { Months } from '@/store/groups/months'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
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
      }
    },
    mixins: [
      i18nLabel
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
