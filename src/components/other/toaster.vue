<template lang="pug">
  .toaster
    .toast(
      @click.prevent.stop="removeToast(toast)"
      :class="{ 'error': toast.type === 'error', 'default': !toast.type }"
      v-for="toast in toasts")
      span {{ toast.content }}
</template>
<script>
  import bus from '@/event-bus'

  export default {
    data () {
      return {
        toasts: [],
        delay: 5000
      }
    },
    created () {
      bus.$on('toast', toast => {
        this.addToast(toast)
      })
    },
    beforeDestroy () {
      bus.$off('toast')
    },
    methods: {
      removeToast (toast) {
        this.toasts.splice(this.toasts.indexOf(toast), 1)
      },
      addToast (toast) {
        this.toasts.unshift(toast)
        setTimeout(() => {
          this.removeToast(toast)
        }, this.delay)
      }
    }
  }
</script>
<style lang="stylus">
  @import '~@/assets/stylesheets/core'

  .toaster
    position fixed
    left 50%
    top 20px
    transform translateX(-50%)
    min-width 200px
    max-width calc(100% - 20px)
    .toast
      display block
      padding 10px 40px
      border-radius 3px
      box-shadow 3px 3px 20px 0px alpha(titamota-color-text, 20%)
      margin 10px auto
      text-align center
      color titamota-color-text-invert-highlight
      cursor pointer
      font-weight 400
      &:active
        position relative
        top 2px
      &.error
        background-color titamota-color-red
      &.default
        background-color titamota-color-back-dark
</style>
