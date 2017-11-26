<template lang="pug">
  .mitaba zok
    p
      button(@click="createTimelineEvent")
        span Создать событие
    p
      div(v-for="event in events")
        span {{ event }}
</template>
<script>
  import Mitaba from '@/backend/mitaba'

  export default {
    data () {
      return {
        events: []
      }
    },
    created () {
      this.refreshTimelineEvents()
    },
    methods: {
      createTimelineEvent () {
        const event = {
          details: [],
          start: new Date().toISOString(),
          stop: new Date().toISOString()
        }
        Mitaba.postTimelineEvents([event]).then(events => {
          this.refreshTimelineEvents()
        })
      },
      refreshTimelineEvents () {
        Mitaba.getTimelineEvents().then(response => {
          this.events = response.results
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/variables'
  @import '~@/assets/stylesheets/core'

  .mitaba
    margin 60px
</style>
