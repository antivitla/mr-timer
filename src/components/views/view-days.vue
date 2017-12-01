<template lang="pug">
  .view.days
    span.text-muted(v-if="!isDays") {{ label('noResultsLabel') }}
    //- view-report(
      v-if="isDays || true"
      :source="filterGroupChildren(Days.children)")
    group-item(
      v-for="day in filterGroupChildren(Days.children)"
      :key="day.name"
      :group="day")
    view-interval(
      v-if="isInterval"
      format="D MMMM YYYY")
    view-pagination(
      v-else
      type="days")
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Days } from '@/store/groups/days'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import viewReport from '@/components/views/view-report'
  import viewInterval from '@/components/views/view-interval'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        Days,
        filterGroupChildren
      }
    },
    computed: {
      isDays () {
        return Days.children.length
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
      viewInterval,
      viewReport
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
