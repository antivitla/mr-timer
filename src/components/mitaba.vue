<template lang="pug">
  div.api-debug
    h2 Mitaba API
</template>

<script>
  import Mitaba from '@/mitaba'

  export default {
    name: 'mitaba',
    data () {
      return {}
    },
    created () {
      Mitaba.test('Vitla')
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/api'
</style>
