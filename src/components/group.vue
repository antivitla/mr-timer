<template lang="pug">
  .group
    group-item(
      v-for="entry in entries"
      :key="entry.uid()"
      :entry="entry")
</template>

<script>
  import groupItem from '@/components/group-item'

  export default {
    props: [
      'entries'
    ],

    components: {
      groupItem
    }
  }
</script>
