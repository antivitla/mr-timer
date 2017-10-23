<template lang="pug">
  .view
    div {{ storage.length }}
    div(v-for="entry in storage.entries" :key="entry.uid()")
      span {{ entry.start }}
      span &emsp;
      span {{ entry.stop - entry.start }}
      span &emsp;
      span {{ entry.details }}
</template>
<script>
  import { Storage } from '@/store/storage'
  export default {
    name: 'view-storage',
    data () {
      return {
        // storage
      }
    },
    created () {
      console.log('view-storage created', Storage)
    },
    computed: {
      storage () {
        console.log(Storage.entries)
        return Storage
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/view'
</style>
