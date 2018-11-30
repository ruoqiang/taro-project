# taro-project
a taro project
## 注意点
1. taro 的render中jsx里面this.xx的状态更新在h5与微信端小程序依赖解析的不一样,
 h5中view的变化直接是this..xx 微信小程序却是this.state.xx
因此 h5中状态修改依赖this.xx = cxvd 
小程序中 this.setState({xx:cxvd})  
taro底层代码解析器的锅

2. 支付宝 百度
taro小程序中 最好先build重新生成dist目录 然后再dev 解决意外报错
3. 自定义组件 和react中写法基本一致 
    注意：传递方法的时候记得以on开头
4. 路由跳转传参  Taro.navigateTo({url: '/pages/index/index?type=1'})
    获取路由跳转传参 this.$router.params.type
5. this.setState({sex: val}) // 用来辅助更新view的
6. Picker组件的数据如果是动态得到的，当设置默认选中项value的时候失效.原因是编译的的时候数据还没有导致设置不了。解决办法-->加个数据是否存在的判断就可以了。
```html
{
    this.state.provinces.length>0&& (
        <Picker className='carcolor' mode='multiSelector' rangeKey='name' value={[1,1,3]} range={[this.state.provinces,this.state.citys,this.state.districts]}  onColumnchange={this.onColumnchange.bind(this)}>  <View className='picker'>
        {this.defaultArea}
    </View>
    </Picker>
    )}
