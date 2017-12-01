<template lang="pug">
  .view.years
    span.text-muted(v-if="!isYears") {{ label('noResultsLabel') }}
    group-item(
      v-for="year in filterGroupChildren(Years.children)"
      :key="year.name"
      :group="year")
    view-interval(
      v-if="isInterval"
      format="D MMM YYYY"
      initial-view="year")
    view-pagination(
      v-else
      type="years")
</template>
<script>
  import { mapGetters } from 'vuex'
  import { Years } from '@/store/groups/years'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import viewInterval from '@/components/views/view-interval'
  import i18nLabel from '@/mixins/i18n-label'

  export default {
    data () {
      return {
        Years,
        filterGroupChildren
      }
    },
    computed: {
      isYears () {
        return Years.children.length
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
