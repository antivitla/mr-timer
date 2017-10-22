<template lang="pug">
  .edit-task(
    :task-depth="depth")
    list-input(
      v-model="details"
      :on-submit="submit")
    span {{ data.duration() }}
</template>

<script>
  import listInput from '@/components/list-input'

  export default {
    props: ['data'],

    data () {
      return {
        details: []
      }
    },

    mounted () {
      this.details = this.data.details()
      console.log(this.details)
    },

    computed: {
      depth () {
        let depth = 0
        let parent = this.data.parent
        while (parent) {
          depth += 1
          parent = parent.parent
        }
        return depth
      }
    },

    methods: {
      submit () {
        console.log('submit', this.data.details, this.data.duration())
      }
    },

    components: {
      listInput
    }
  }
</script>

<style lang="stylus">
  @import '~@/assets/stylesheets/variables'

  .edit-task
    min-height 20px
    font-size 14px
    line-height 20px
    background-color titamota-color-back-light
    display flex
    margin-left -10px
    font-weight 400
    width 100%

    textarea
      margin 0
      padding 0px 10px
      font-size inherit
      line-height inherit
      background-color titamota-color-back-light
      color titamota-color-text
      border 0px
      resize none
      outline none
      border-radius 5px
</style>
