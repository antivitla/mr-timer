<template lang="pug">
  .view
    span.text-muted(v-if="!isYears") {{ label('noResultsLabel') }}
    group-item(
      v-for="year in filterGroupChildren(Years.children)"
      :key="year.name"
      :group="year")
    view-pagination(
      type="years"
      @limit="changeCurrentViewLimit"
      @offset="changeCurrentViewOffset")
</template>
<script>
  import { mapActions } from 'vuex'
  import { Years } from '@/store/groups/years'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
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
      }
    },
    methods: {
      ...mapActions([
        'changeCurrentViewOffset',
        'changeCurrentViewLimit'
      ])
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
