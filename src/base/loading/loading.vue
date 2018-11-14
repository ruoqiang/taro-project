<template>
  <div class="loading" :class="displayType">
    <img :width="size" :height="size" src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      },
      size: {
        type: String,
        default: '24'
      },
      displayType: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      flag: true
    }),
    methods: {
      show() {
        this.flag = true
      },
      hide() {
        this.flag = false
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading
    width: 100%
    text-align: center
    &.oneLine
      display: flex
      justify-content: center
    .desc
      line-height: 20px
      font-size: $font-size-small
      color: $color-text-l
</style>
