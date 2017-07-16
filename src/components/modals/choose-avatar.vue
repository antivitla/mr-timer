<template lang="pug">
  .choose-avatar
    ul
      li(v-for="ava in avatars")
        a(@click="avatar(ava)")
          img(:src="ava")
          span {{ labelAvatar(ava) }}
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    data () {
      return {
        avatars: ['static/img/001-hyena.svg', 'static/img/002-sloth.svg', 'static/img/003-chimpanzee.svg', 'static/img/004-duck-1.svg', 'static/img/005-chameleon.svg', 'static/img/006-mole.svg', 'static/img/007-skunk.svg', 'static/img/008-mink.svg', 'static/img/009-bullfinch.svg', 'static/img/010-crane.svg', 'static/img/011-ostrich.svg', 'static/img/012-sparrow.svg', 'static/img/013-deadlock.svg', 'static/img/014-orca.svg', 'static/img/015-wasp.svg', 'static/img/016-dove.svg', 'static/img/017-beetle.svg', 'static/img/018-butterfly-1.svg', 'static/img/019-crocodile.svg', 'static/img/020-penguin-2.svg', 'static/img/021-albatross.svg', 'static/img/022-deer.svg', 'static/img/023-animals-1.svg', 'static/img/024-tiger.svg', 'static/img/025-animals.svg', 'static/img/026-animal-8.svg', 'static/img/027-cat-1.svg', 'static/img/028-animal-7.svg', 'static/img/029-animal-6.svg', 'static/img/030-cow-1.svg', 'static/img/031-animal-2.svg', 'static/img/032-animal-5.svg', 'static/img/033-bulldog.svg', 'static/img/034-animal-4.svg', 'static/img/035-animal-1.svg', 'static/img/036-animal-3.svg', 'static/img/037-animal.svg', 'static/img/038-wolf.svg', 'static/img/039-panda-bear.svg', 'static/img/040-ladybug.svg', 'static/img/041-koala.svg', 'static/img/042-pig.svg', 'static/img/043-bee.svg', 'static/img/044-frog.svg', 'static/img/045-goat.svg', 'static/img/046-snake.svg', 'static/img/047-squirrel.svg', 'static/img/048-parrot.svg', 'static/img/049-owl.svg', 'static/img/050-piranha.svg', 'static/img/051-lion.svg', 'static/img/052-bear.svg', 'static/img/053-eagle.svg', 'static/img/054-starfish.svg', 'static/img/055-goldfish.svg', 'static/img/056-hedgehog.svg', 'static/img/057-mouse.svg', 'static/img/058-guinea-pig.svg', 'static/img/059-fox.svg', 'static/img/060-elephant.svg', 'static/img/061-butterfly.svg', 'static/img/062-raccoon.svg', 'static/img/063-monkey.svg', 'static/img/064-duck.svg', 'static/img/065-sheep.svg', 'static/img/066-cat.svg', 'static/img/067-cow.svg', 'static/img/068-shark.svg', 'static/img/069-penguin-1.svg', 'static/img/070-penguin.svg']
      }
    },

    methods: {
      avatar (url) {
        this.setUserAvatar({ avatar: url })
        this.closeModal()
      },
      labelAvatar (url) {
        return url.split('/').slice(-1)[0].replace('.svg', '')
      },
      ...mapMutations([
        'setUserAvatar',
        'closeModal'
      ])
    }
  }
</script>

<style lang="stylus">
  @import '../../assets/stylesheets/variables'

  .choose-avatar
    width 320px
    text-align center
    @media (min-width 768px)
      width 480px
    @media (min-width 1024px)
      width 45em
    ul
      display flex
      flex-wrap wrap
      margin 20px auto
      padding 0px
      list-style none
      max-height 75vh
      overflow auto
      justify-content space-around
    li
      padding 0
      text-align center
      margin-bottom 20px
      width 30%
      @media (min-width 768px)
        width 25%
      @media (min-width 1024px)
        width 20%
      font-size 12px
      font-weight 400
      img
        display block
        margin 0 auto
        height 50px
        margin-bottom 5px

</style>
