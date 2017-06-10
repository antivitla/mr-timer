<template lang="pug">
  .storage
    storage-item(
      v-for="entry in entries"
      :key="entry.uid()"
      :entry="entry")
</template>

<script>
  import storageItem from '@/components/storage-item'

  export default {
    props: [
      'entries'
    ],

    components: {
      storageItem
    }
  }
</script>
