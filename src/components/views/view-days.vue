<template lang="pug">
  .view
    span.text-muted(v-if="!isDays") {{ label('noResultsLabel') }}
    group-item(
      v-for="day in filterGroupChildren(Days.children)"
      :key="day.name"
      :group="day")
    view-pagination(
      type="days"
      @limit="changeCurrentViewLimit"
      @offset="changeCurrentViewOffset")
</template>
<script>
  import { mapActions } from 'vuex'
  import { Days } from '@/store/groups/days'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
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
