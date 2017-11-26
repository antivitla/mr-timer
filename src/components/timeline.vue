<template lang="pug">
  .timeline
    p Timeline
    .body
      .event(v-for="event in Timeline.events")
        span {{ event }}
      .axis
    .actions
      span туда или сюда
</template>
<script>
  import Mitaba from '@/backend/mitaba'
  import { Timeline } from '@/store/timeline'
  console.log(Timeline)

  /*

  Схема таймлайна

  Есть ось, это 100%

  Все позиции это float-числа 0-100

  Визуально лучше положить сайм таймлайн в контейнер, отделив от интерфейса дополнительного

  */
  export default {
    data () {
      return {
        Timeline
      }
    },
    mounted () {
      this.getTimelineEvents()
    },
    methods: {
      getTimelineEvents () {
        Mitaba.getTimelineEvents().then(result => {
          console.log(result)
        })
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .timeline

    // Body
    .body
      position relative

    // Axis
    .axis
      height 1px
      background-color titamota-color-text
</style>
