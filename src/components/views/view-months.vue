<template lang="pug">
  .view
    span.text-muted(v-if="!isMonths") {{ label('noResultsLabel') }}
    group-item(
      v-for="month in filterGroupChildren(Months.children)"
      :key="month.name"
      :group="month")
    view-pagination(
      type="months"
      @limit="onChangeLimit"
      @offset="onChangeOffset")
</template>
<script>
  import { mapActions } from 'vuex'
  import { Months } from '@/store/groups/months'
  import { filterGroupChildren } from '@/utils/group'
  import groupItem from '@/components/items/group-item'
  import viewPagination from '@/components/views/view-pagination'
  import i18nLabel from '@/mixins/i18n-label'
  import viewHelper from '@/mixins/view-helper'
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        Months,
        filterGroupChildren
      }
    },
    mounted () {
      this.getEntries({ params: this.viewGetParams() })
      bus.$emit('scroll-top')
    },
    computed: {
      isMonths () {
        return Months.children.length
      }
    },
    methods: {
      ...mapActions([
        'getEntries'
      ])
    },
    mixins: [
      i18nLabel,
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
