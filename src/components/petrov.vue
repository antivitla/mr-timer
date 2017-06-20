<template lang="pug">
  div.petrov
    h2 Petrov API
    p.url
      span.method {{method}}
      input(
        type="text"
        v-bind:class="{error: !account}"
        @keyup.13="send()"
        v-model.trim="account"
        placeholder="код аккаунта")

    p.send
      button(
        v-for="method in methods"
        @click="send(method.name)"
        v-bind:class="isLastMethod(method.name)"
        v-bind:disabled="isDisabled") {{method.name}}

    p.response(v-bind:class="{error: !status}" v-if="response")
      pre {{response}}
</template>

<script>
  import Petrov from '@/petrov'

  const methods = [
    { name: 'GET' },
    { name: 'POST' },
    { name: 'PUT' },
    { name: 'DELETE' }
  ]

  export default {
    name: 'petrov',
    data () {
      return {
        url: Petrov.baseUrl,
        account: '',
        methods,
        method: 'GET',
        response: '',
        status: true,
        waiting: false
      }
    },
    computed: {
      isDisabled () {
        return this.waiting || !this.account
      }
    },
    methods: {
      send (method) {
        this.method = method || this.method
        this.waiting = true
        Petrov[this.method.toLowerCase()](this.account)
          .then(data => {
            this.response = data
            this.status = true
            this.waiting = false
          })
          .catch(error => {
            this.response = error.message
            this.status = false
            this.waiting = false
          })
      },
      isLastMethod (method) {
        return {
          active: this.method === method
        }
      }
    }
  }
</script>

<style lang="stylus">
  @import '../assets/stylesheets/variables'

  .petrov
    padding 20px
    margin 20px

    .method
      margin-right 20px
      &:after
        content "/"

    .url
      display flex

    input[type="text"]
      border 0
      padding 0
      background-color transparent
      font-weight 500
      outline none
      &::placeholder
        color silver
      &.error
        text-align center
        box-shadow 0px 1px 0px 0px titamota-color-red

    .send
      align-items flex-start
      button + button
        margin-left 10px

    button
      border none
      border-radius 3px
      border-bottom solid 3px gainsboro
      background-color #ececec
      height 40px
      padding 0 15px
      min-width 70px
      cursor pointer
      outline none
      vertical-align top
      &[disabled]
        opacity 0.5
        cursor default
        pointer-events none

      &:hover
      &.active
        background-color titamota-color-red
        color white
        border-color titamota-color-red
      &:active
        background-color titamota-color-red
        color white
        border-bottom none
        border-top solid 3px titamota-color-red

    .response
      overflow-x hidden
      margin 40px 0px
      &.error
        color titamota-color-red
      pre
        margin 0
</style>
