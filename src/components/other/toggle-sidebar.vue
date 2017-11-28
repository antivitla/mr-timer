<template lang="pug">
  .toggle-sidebar(@click.stop.prevent="toggleSidebar")
    slot
</template>
<script>
  import { mapMutations } from 'vuex'
  export default {
    methods: {
      ...mapMutations([
        'toggleSidebar'
      ])
    }
  }
</script>
