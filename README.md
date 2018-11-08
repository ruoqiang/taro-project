# taro-project
a taro project

1. taro 的render中jsx里面this.xx的状态更新在h5与微信端小程序依赖解析的不一样,
 h5中view的变化直接是this..xx 微信小程序却是this.state.xx
因此 h5中状态修改依赖this.xx = cxvd 
小程序中 this.setState({xx:cxvd})  
taro底层代码解析器的锅

2. 支付宝 百度
taro小程序中 最好先build重新生成dist目录 然后再dev 解决意外报错
3. 自定义组件 和react中写法基本一致 
    注意：传递方法的时候记得以on开头
4. 路由跳转传参  Taro.navigateBack({url: '/pages/index/index?type=1'})
    获取路由跳转传参 this.$router.params.type
