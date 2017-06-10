<template lang="pug">
  .group-item
    span.updated {{ updated }}
    span.name {{ name }}
    span.duration {{ duration }}
</template>

<script>
  export default {
    props: [
      'entry'
    ],

    computed: {
      name () {
        return this.entry.name
      },
      updated () {
        return this.entry.lastUpdated()
      },
      duration () {
        return this.entry.duration()
      }
    }
  }
</script>

<style lang="stylus">
  // @import '../assets/stylesheets/variables.styl'
</style>
