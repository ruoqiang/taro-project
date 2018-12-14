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
```
7. 选择的图片提交时转为base64格式字符串
，参考[这里](https://github.com/zh8637688/wx-cardscanner,'参考示例')
```js
import upng from 'upng-js'

this.state = {
            imgSrc: ''
        }
chooseImage() {
    const self = this
    Taro.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            console.log(tempFilePaths);
            let canvas = Taro.createCanvasContext('mycanvas')
            // 1. 绘制图片至canvas
            canvas.drawImage(tempFilePaths[0], 0, 0, 80, 80)
            // canvas.draw() //drawImage后必须调用draw()后才能把信息显示在canvas上
            canvas.draw(false, () => {
                //2. 获取图像数据
                Taro.canvasGetImageData({
                    canvasId: 'mycanvas',
                    x: 0,
                    y: 0,
                    width: 80,
                    height: 80,
                    success(image) {
                        // 3. png编码
                        let pngData = upng.encode([image.data.buffer], image.width, image.height)
                        // 4. base64编码
                        let base64 = Taro.arrayBufferToBase64(pngData)
                        Taro.arrayBufferToBase64
                        console.log(base64);
                        self.setState({imgSrc:'data:image/png;base64,'+ base64})
                    },
                    fail(error) {
                        console.error(error)
                    }
                    })
            })
        }
        })
    }
```
8. h5端图片base64与旋转需要动态创建img标签的onload事件后去实现 由于taro已经提供有Image组件了，再通过new Image()创建图片会失败，无法得到img标签。换种方式。
如何直接在页面中先定义好一个img标签 在选择图片的时候没法执行到img的onload事件，在canvas画图是会提示错误，得到的解决方案是：You cannot call the drawImage() method before the image has loaded. To ensure that the image has been loaded
```js
let image = document.createElement('img') //代替let image = new Image()
```