import Taro, { Component } from '@tarojs/taro'
import { View, Input, ScrollView, Text, Picker,Image,Canvas,Button } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import HeadStep from '../../base/head-step/head-step'
import { url } from '../../common/js/config'
import ImageUtil from './imgcomPress'
import Exif from 'exif-js' //h5使用 读取图像的原始数据的功能扩展，例如：拍照方向、相机设备型号、拍摄时间、ISO 感光度、GPS 地理位置等数据
import upng from 'upng-js' //微信端的图片转base64库

import '../user-baseinfo/userInfo.styl'
import '../login/login.styl' //微信端样式不能复用login中的样式，需要再次引用一次

import { getUserBaseInfo } from '../../store/actions/counter'
@connect(({ counter }) => ({
    counter
}), (dispatch) => ({
  getUserBaseInfo() {
		dispatch(getUserBaseInfo())
	}
}))

export default class userCarInfo extends Component{
    config = {
        navigationBarTitleText: '选择车辆'
    }
    constructor(props) {
        super(props)
        this.state = {
            isSelf: true,
            btnDisable: false,
            destroyInput: false,
            imgSrc: '',
            tipsText: '',
            canvasWidth:100,
            canvasHeight:100,
            isWeAPP: false
        }
       
        this.uploadImgSrc = [
            {src: require('./pic01.png'), isUploaded: false, IDfication: '上传身份证正面照', TypeID: 1011},
            {src: require('./pic02.png'), isUploaded: false, IDfication: '上传身份证反面照', TypeID: 1012},
            {src: require('./pic04.png'), isUploaded: false, IDfication: '上传驾驶证正页照', TypeID: 1013},
            {src: require('./pic03.png'), isUploaded: false, IDfication: '上传驾驶证副页照', TypeID: 1014},
            {src: require('./pic04.png'), isUploaded: false, IDfication: '上传行驶证正面照', TypeID: 1015},
            {src: require('./pic03.png'), isUploaded: false, IDfication: '上传行驶证反面照', TypeID: 1016},
        ]
        this.destroyInput = false // 是否销毁input元素, 解决在第二次和第一次选择的文件相同时不触发onchange事件的问题
        this.isIos = true//ImageUtil.isIos
        this.btnDisable = false
        this.forms = {}
        
    }
    componentDidShow() {
        // console.log('this', this.props.counter.userApplyStepList)
        this.props.getUserBaseInfo()
        this.apply = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.apply
        this.listphoto = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.listphoto
        if (this.listphoto) {
            this.listphoto.forEach((item)=> {
                let oldTypeID = item.TypeID.toString()
                let index = oldTypeID.substr(oldTypeID.length - 1, 1) -1 //index 的索引根据TypeID字段最后一个值来确定
                this.uploadImgSrc[index]['src'] = url + item.Url
                this.uploadImgSrc[index]['isUploaded'] = true
            })
            this.setState({isSelf: false}) // 用来辅助更新view的
        }
        if(Taro.getEnv()==='WEAPP') {
            this.setState({isWeAPP:true})
        }  
    }
    // submitInfo () {
    //     let param = {
    //         CarColor:  this.state.selectorChecked.slice(0, 1), //'蓝', //this.info.carColor.slice(0, 1), //只取第一个文字
    //         CarColorType:  this.state.CarColorType, //this.forms.CarColorType,
    //         CarNum: (this.state.carno).join(''),
    //         EngineNum: this.forms.EngineNum || '',
    //         CarVin: this.forms.CarVin || '',
    //         CarBrand: this.forms.CarBrand || '',
    //         CarLoad: this.forms.CarLoad || '',
    //     }
        
    //     if (param.EngineNum === '') {
    //         return showTips('发动机号')
    //     }
    //     if (param.CarVin === '') {
    //         return showTips('车辆识别代码')
    //     }
        
    //     if (param.CarBrand === '') {
    //         return showTips('车辆品牌')
    //     }
    //     if (param.CarLoad === '') {
    //         return showTips('核定载重')
    //     }
    //     let params = {
    //         Step: 2,
    //         CCustomerApply: param
    //     }
    //     this.setState({btnDisable: true})
    //     let that = this
    //     Taro.showLoading({ title: '提交中..' })
    //     HTTP.post('SubInfo/UserAndCar', params).then(()=> {
    //         this.setState({btnDisable: false})
    //         // 成功后
    //         that.props.getUserBaseInfo()
    //         Taro.navigateBack({url: '/pages/user-carinfo/user-carinfo'})
    //     }).catch(()=> {
    //         this.setState({btnDisable: false})
    //     })
    // }
    nextPage() {
        if (!this.uploadImgSrc[0]['isUploaded']) {
            return showTips(`请选择${this.uploadImgSrc[0]['IDfication']}`)
        }
        if (!this.uploadImgSrc[1]['isUploaded']) {
            return showTips(`请选择${this.uploadImgSrc[1]['IDfication']}`)
        }
        if (!this.uploadImgSrc[2]['isUploaded']) {
            return showTips(`请选择${this.uploadImgSrc[2]['IDfication']}`)
        }
        if (!this.uploadImgSrc[3]['isUploaded']) {
            return showTips(`请选择${this.uploadImgSrc[3]['IDfication']}`)
        }
        if (!this.uploadImgSrc[4]['isUploaded']) {
            return showTips(`请选择${this.uploadImgSrc[4]['IDfication']}`)
        }
        if (!this.uploadImgSrc[5]['isUploaded']) {
            return showTips(`请选择${this.uploadImgSrc[5]['IDfication']}`)
        }
        Taro.navigateTo({url: '/pages/user-add-address/user-add-address'})
      }
    inputChange(index) {
        if(Taro.getEnv() !== 'WEB') {
            this.wxChooseImage(index)
        } else {
            this.webChooseImagee(index.target)
        } 
    }
    webChooseImagee(obj) {
        var that = this
        //ios 修复下不能多次选择同一张图片
        this.destroyInput = true
        this.setState({destroyInput: true}) //触发view渲染
        setTimeout(() => {
          this.destroyInput = false
          this.setState({destroyInput: false})
        }, 20)
        var f = obj.files[0]
        var fileType = f.type
        var fileSize = f.size
        if (['image/jpg', 'image/jpeg', 'image/png', 'image/gif'].indexOf(fileType) < 0) {
          alert('请上传图片')
          return false
        }
        if (fileSize > 10 * 1024 * 1024) {
          alert('请上传不超过10M的图片')
          return false
        }
        var index = obj.id
        //loading载图片
        that.uploadImgSrc[index]['src'] = require('./loading.gif')
        var result = null
        // let t = this
        Exif.getData(f, function() {
          //获取图片的拍摄方向的数据
          that.Orientation = Exif.getTag(f, 'Orientation')
         
        })
        var reader = new FileReader()
        reader.readAsDataURL(f)
        
        reader.onload = function(e) {
          var quality = 0.8
          if (f.size > 1024 * 500) { //若图片大小大于0.5M，压缩比例重新设置 1M=1024*1024
            quality = 0.5
          }
           result = e.target.result //返回的dataURL
          //修正图片方向
          that.ImageCompress(result, that.Orientation, quality, function(data) {
            var img = document.createElement('img') //new Image()
            img.onload = function() {
              // oShowImg.src = data
              // console.log('data____', data)
              // var FileBase64 = cvs.toDataURL('image/jpeg', 0.5)
              that.begainUpload(data, index)
           }
            img.src = data
           // console.log(img.src);
          })
        }
      }
      /**
       * h5端图片压缩
       * @param {*} img 
       * @param {*} dir 
       * @param {*} quality 
       * @param {*} next 
       */
      ImageCompress(img, dir, quality, next) {
        var image =  document.createElement('img')//document.getElementById('canvasImage')//new Image()
        image.src = img

        this.ImageInfo = Exif.getAllTags(img)
        image.onload = function() {
          var degree = 0,
            drawWidth, drawHeight, width, height
          //原始宽高
          drawWidth =  this.naturalWidth
          drawHeight =  this.naturalHeight
          //以下改变一下图片大小
          var maxSide = Math.max(drawWidth, drawHeight)
          if (maxSide > 1024) {
            var minSide = Math.min(drawWidth, drawHeight)
            minSide = minSide / maxSide * 1024
            maxSide = 1024
            if (drawWidth > drawHeight) {
              drawWidth = maxSide
              drawHeight = minSide
            } else {
              drawWidth = minSide
              drawHeight = maxSide
            }
          }
          //使用canvas修正图片的方向
        //   let canvas = Taro.createCanvasContext('mycanvas')
          var canvas = document.getElementById('canvas')
          canvas.width = width = drawWidth
          canvas.height = height = drawHeight
          var context = canvas.getContext('2d')
          //判断图片方向，重置canvas大小，确定旋转角度，iphone默认的是home键在右方的横屏拍摄方式
          if (dir && dir !== '' && dir !== 1) {
            switch (dir) {
              //iphone横屏拍摄，此时home键在左侧
              case 3:
                degree = 180
                drawWidth = -width
                drawHeight = -height
                break
                //iphone竖屏拍摄，此时home键在下方(正常拿手机的方向)
              case 6:
                canvas.width = height
                canvas.height = width
                degree = 90
                drawWidth = width
                drawHeight = -height
                break
                //iphone竖屏拍摄，此时home键在上方
              case 8:
                canvas.width = height
                canvas.height = width
                degree = 270
                drawWidth = -width
                drawHeight = height
                break 
            }
          }
          //使用canvas旋转校正
          context.rotate(degree * Math.PI / 180)
          context.drawImage(image, 0, 0, drawWidth, drawHeight)
        //   context.draw()
          //返回校正图片
          next(canvas.toDataURL('image/jpeg', quality || 0.8))
       }
        // image.src = img
        this.setState({imgSrc: img})
      }
    wxChooseImage(ImgeIdx) {
        const self = this
        Taro.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                //获取图片信息eg.宽高
                Taro.getImageInfo({ 
                    src:tempFilePaths[0]
                }).then((resss)=>{
                    //动态设置canvas标签的宽高
                    
                    let resWidth = resss.width
                    let resHeight = resss.height
                    let scale = resWidth / resHeight
                    let limitWidth = 400 //最多宽度超过该值就做限制
                    if (resWidth > limitWidth) {
                        resWidth = limitWidth
                        resHeight = resWidth / scale
                    }
                    self.setState({canvasWidth:resWidth})
                    self.setState({canvasHeight:resHeight})

                    let canvas = Taro.createCanvasContext('mycanvas')
                    canvas.drawImage(tempFilePaths[0], 0, 0, resWidth, resHeight)
                    // var index = ImgeIdx
                    //loading载图片
                    self.uploadImgSrc[ImgeIdx]['src'] = require('./loading.gif')
                        // 1. 绘制图片至canvas
                        // canvas.draw() //drawImage后必须调用draw()后才能把信息显示在canvas上
                        canvas.draw(false, () => {
                            Taro.canvasGetImageData({
                                canvasId: 'mycanvas',
                                x: 0,
                                y: 0,
                                width: resWidth,
                                height: resHeight,
                                success(image) {
                                    // 3. png编码
                                    let pngData = upng.encode([image.data.buffer], resWidth, resHeight)
                                    // 4. base64编码
                                    let base64 = Taro.arrayBufferToBase64(pngData)
                                    // Taro.arrayBufferToBase64
                                    // console.log(base64);
                                    self.uploadImgSrc[ImgeIdx]['src'] ='data:image/png;base64,'+ base64
                                    // self.setState({imgSrc:'data:image/png;base64,'+ base64}) //1.辅助更新view 2.方便看图片有没有更新

                                    self.begainUpload('data:image/png;base64,'+ base64, ImgeIdx)
                                    // self.props.getUserBaseInfo()
                                },
                                fail(error) {
                                    console.error(error)
                                }
                            })
                        })    
                    })

              }
            })
      }
    
    begainUpload(FileBase64, index) { //
        var that = this
        var needData = {
          IDfication: that.uploadImgSrc[index]['IDfication'],
          TypeID: that.uploadImgSrc[index]['TypeID'],
          Relation: that.apply['Relation'],
          FileBase64: FileBase64
        }
        HTTP.post('SubInfo/SubPhoto', needData).then((res)=> {
            this.setState({btnDisable: false})
            // 成功后
            that.uploadImgSrc[index]['src'] = url + res.result.Url
            that.uploadImgSrc[index]['isUploaded'] = true
            that.props.getUserBaseInfo() 
            that.btnDisable = false

        }).catch(()=> {
            this.setState({btnDisable: false})
            that.uploadImgSrc[index]['src'] = require('./fail.png')
            that.uploadImgSrc[index]['isUploaded'] = false
            that.btnDisable = false
        })
      }
    render() {
        return (
            <View id='user-baseinfo'>
            {/* <Image src={this.state.imgSrc} id='canvasImage'></Image> */}
            {/* <canvas canvas-id='mycanvas' style='width:20px; height: 20px;'></canvas> */}
            {/* <Canvas style={{width:this.state.canvasWidth+ 'px', height: this.state.canvasHeight+ 'px'}} canvasId='mycanvas' /> */}
            <View style='width: 0px; height: 0px;overflow:hidden;z-index:-1;position:absolute;left:0px;visibility: hidden;'> 
              <Canvas style={{width:this.state.canvasWidth+ 'px', height: this.state.canvasHeight+ 'px'}} canvasId='mycanvas' />
            </View>
            <canvas id='canvas' style='display: none'></canvas>
                <ScrollView ref={this.scroll}>
                    <HeadStep step={3}></HeadStep>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>上传身份证照片</View>
                            </View>
                            <View className='list-box'>
                            <View className='ul'>
                                <View className='li' >
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[0]['src']} alt='' />
                                    </View> 
                                    <View className='desc'>{this.uploadImgSrc[0]['IDfication']}</View>
                                    <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />

                                    {/* {!this.state.isWeAPP&&this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    
                                    ): null}
                                     {!this.state.isWeAPP&&!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null} */}
                                    {this.state.isWeAPP ? (
                                         <Button className='input' plain type='primary' onClick={this.inputChange.bind(this,0)} id='0'>按钮</Button>
                                    ): null}
                                </View>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[1]['src']} alt='' />
                                    </View>
                                    <View className='desc'>{this.uploadImgSrc[1]['IDfication']}</View> 
                                    {!this.state.isWeAPP&&this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='1' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.state.isWeAPP&&!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='1' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                    {this.state.isWeAPP ? (
                                         <Button className='input' plain type='primary' onClick={this.inputChange.bind(this,1)}>按钮</Button>
                                    ): null}
                                </View>
                            </View>
                        </View>
                        </View>
                        <View className='h10'></View>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>上传身份证照片</View>
                            </View>
                            <View className='list-box'>
                            <View className='ul'>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[2]['src']} alt='' />
                                    </View> 
                                    <View className='desc'>{this.uploadImgSrc[2]['IDfication']}</View>
                                    {!this.state.isWeAPP&&this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='2' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.state.isWeAPP&&!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='2' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                    {this.state.isWeAPP ? (
                                         <Button className='input' plain type='primary' onClick={this.inputChange.bind(this,2)}>按钮</Button>
                                    ): null}
                                </View>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[3]['src']} alt='' />
                                    </View>
                                    <View className='desc'>{this.uploadImgSrc[3]['IDfication']}</View> 
                                    {!this.state.isWeAPP&&this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='3' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.state.isWeAPP&&!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='3' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                    {this.state.isWeAPP ? (
                                         <Button className='input' plain type='primary' onClick={this.inputChange.bind(this,3)}>按钮</Button>
                                    ): null}
                                </View>
                            </View>
                        </View>
                        </View>
                        <View className='h10'></View>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>上传身份证照片</View>
                            </View>
                            <View className='list-box'>
                            <View className='ul'>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[4]['src']} alt='' />
                                    </View> 
                                    <View className='desc' onClick={this.inputChange.bind(this)}>{this.uploadImgSrc[4]['IDfication']}</View>
                                    {!this.state.isWeAPP&&this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='4' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.state.isWeAPP&&!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='4' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                    {this.state.isWeAPP ? (
                                         <Button className='input' plain type='primary' onClick={this.inputChange.bind(this,4)}>按钮</Button>
                                    ): null}
                                </View>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[5]['src']} alt='' />
                                    </View>
                                    <View className='desc'>{this.uploadImgSrc[5]['IDfication']}</View> 
                                    {!this.state.isWeAPP&&this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='5' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.state.isWeAPP&&!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file' onChange={this.inputChange.bind(this)} id='5' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                    {this.state.isWeAPP ? (
                                         <Button className='input' plain type='primary' onClick={this.inputChange.bind(this,5)}>按钮</Button>
                                    ): null}
                                </View>
                            </View>
                        </View>
                        </View>
                        <View className='buttonBox'>
                            <View className={'button ' + (this.state.btnDisable ? 'disable': '')} onClick={this.nextPage.bind(this)}>
                                 下一步
                            </View>
                        </View>
                        <View style={{height: '40px'}}>
                        </View>
            </ScrollView>

            </View>
        )
    } 
}