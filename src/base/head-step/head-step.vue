<template>
  <div id="head-step">
    <div class="head-setp">
        <div class="setp">
          <div class="setp-tips-box">
            <span :class="{active:step>index}" v-for="(item,index) in stepText">{{item}}</span>
          </div>
          <div class="setp-dot-box">
            <span :class="[{'active':index<=step+(step-1)},{'setp-line':index%2===1}]" v-for="(item,index) in stepLine"></span>
            <!-- <span class="setp-line"></span>
              <span class=""></span>
            <span class="setp-line"></span>
              <span class=""></span>
            <span class="setp-line"></span>
            <span class=""></span> -->
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "head-step",
  props: {
    step: {
      type: Number,
      default: 1
    }
  },
  data: () => ({
    stepText: ['申请人信息', '车辆信息', '证件照片', '收货地址'],
    stepLine: ['1', '2', '3', '4', '5', '6', '7']
  }),
  methods: {
    methodName() {
      //
    }
  },
  computed: {
    // stepType() {
    //   return
    // }
  }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.setp-tips-box
    padding-top:25px;display:flex
    width:84%
    margin:0 auto
    justify-content: space-between
    span
      width:75px
      height:21px
      text-align: center
      line-height:21px
      color:#999999
      font-size:13px
      display:inline-block
      color:#999
      &.active
        color:$color-theme
        position:relative
    input::-webkit-input-placeholder
      text-shadow: none
      -webkit-text-fill-color: initial
      -webkit-user-select: auto !important
  @media only screen and (min-width: 375px)
          font-size: 15px

  .setp-dot-box{
       width:67%;
       margin:0 auto;
       justify-content: space-between;
       display:flex;
       margin-top:10px;
  }
  .setp-dot-box span {
      width:14px;
      height:14px;
      background:url(./step_dot_n.png);
       background-size:100% 100%;
      display:inline-block;
      position:relative;

  }
    .setp-dot-box span.active {
        // background:url(./step_dot.png);
        bg-image('./step_dot')
        position:relative
        background-size:100% 100%

  }
   .setp-dot-box span.setp-line {
       height:1px;
        width:45px;
        margin-top:10px;
        position:relative;
        background:none;
  }
  @media only screen and (min-width: 375px) {
       .setp-dot-box{
       width:69%;
      }
      .setp-dot-box span.setp-line{
         width:63px;
      }
  }
  @media only screen and (min-width: 414px) {
    .setp-dot-box span.setp-line{
      height:1px;
       width:72px;
       margin-top:10px;
       position:relative;
       background:none;
    }
  }
  .setp-line:after{
      display: block;
      position: absolute;
      left: 0px;
      bottom: 4px;
      content: " ";
      width: 100%;
      border-top: 1px solid rgb(204, 204, 204);
  }
  .setp {
       height:93px;
       width:100%;
  }
</style>
