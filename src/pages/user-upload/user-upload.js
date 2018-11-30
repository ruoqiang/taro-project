import Taro, { Component } from '@tarojs/taro'
import { View, Input, ScrollView, Text, Picker,Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as HTTP from '../../common/js/http'
import { showTips } from '../../common/js/util'
import HeadStep from '../../base/head-step/head-step'
import ImageUtil from './imgcomPress'

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
            btnDisable: false,
            destroyInput: false,
            tipsText: ''
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
        this.newApply = this.props.counter.userApplyStepList && this.props.counter.userApplyStepList.apply
        if (this.newApply) {
            this.isSelf = this.newApply['IsOwnerApply'] || true
            this.sex = this.newApply['Sex'] || '1'
            this.setState({isSelf: this.isSelf}) // 用来辅助更新view的
            this.setState({selectorChecked: this.newApply['CarColor']})
            // this.setState({CarColorType: Number(this.newApply['CarColorType'])})
            this.forms = this.newApply
            this.setState({
                carno:( this.newApply && this.newApply.CarNum &&(this.newApply.CarNum).split('')) || ['沪','A','B']
            })
        }
    }
    onChange = e => {
        this.setState({
          selectorChecked: this.state.selector[e.detail.value]
        })
        this.setState({
            CarColorType:e.detail.value
          })
        console.log(e);
      }
    handleInputChange(keywords, e) {
        this.forms[keywords] = e.target.value
    }
    submitInfo () {
        let param = {
            CarColor:  this.state.selectorChecked.slice(0, 1), //'蓝', //this.info.carColor.slice(0, 1), //只取第一个文字
            CarColorType:  this.state.CarColorType, //this.forms.CarColorType,
            CarNum: (this.state.carno).join(''),
            EngineNum: this.forms.EngineNum || '',
            CarVin: this.forms.CarVin || '',
            CarBrand: this.forms.CarBrand || '',
            CarLoad: this.forms.CarLoad || '',
        }
        
        if (param.EngineNum === '') {
            return showTips('发动机号')
        }
        if (param.CarVin === '') {
            return showTips('车辆识别代码')
        }
        
        if (param.CarBrand === '') {
            return showTips('车辆品牌')
        }
        if (param.CarLoad === '') {
            return showTips('核定载重')
        }
        let params = {
            Step: 2,
            CCustomerApply: param
        }
        debugger
        this.setState({btnDisable: true})
        let that = this
        Taro.showLoading({ title: '提交中..' })
        HTTP.post('SubInfo/UserAndCar', params).then(()=> {
            this.setState({btnDisable: false})
            // 成功后
            that.props.getUserBaseInfo()
            Taro.navigateBack({url: '/pages/user-carinfo/user-carinfo'})
        }).catch(()=> {
            this.setState({btnDisable: false})
        })
    }
    switchSelf(val) {
        this.isSelf = val
        this.setState({isSelf: val}) //只有prop或者state变化了view才会更新，因此我们加了一个触发页面更新的字段isSelf在state中，
    }
    switchSex (val) {
        this.sex = val
        this.setState({sex: val}) // 用来辅助更新view的
    }
    selectCarNoShow () {
        this.refs.selectCarNo.show()
    }
    selectedCarValue(val) { //选择车牌号
        this.setState({carno: val})
      }
    render() {
        return (
            <View id='user-baseinfo'>
                <ScrollView ref={this.scroll}>
                    <HeadStep step={3}></HeadStep>
                        <View className='form-box'>
                            <View className='form-list'>
                                    <View className='form-title'>上传身份证照片</View>
                            </View>
                            <View className='list-box'>
                            <View className='ul'>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[0]['src']} alt='' />
                                    </View> 
                                    <View className='desc'>{this.uploadImgSrc[0]['IDfication']}</View>
                                    {this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file'  onChange={this.inputChange} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file'  onChange={this.inputChange} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                </View>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[1]['src']} alt='' />
                                    </View>
                                    <View className='desc'>{this.uploadImgSrc[1]['IDfication']}</View> 
                                    <Input className='input' type='file'  onChange={this.inputChange} text='请选择图片' id='1' accept='image/jpg,image/jpeg,image/png,image/gif' />
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
                                    {this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file'  onChange={this.inputChange} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file'  onChange={this.inputChange} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                </View>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[3]['src']} alt='' />
                                    </View>
                                    <View className='desc'>{this.uploadImgSrc[3]['IDfication']}</View> 
                                    <Input className='input' type='file'  onChange={this.inputChange} text='请选择图片' id='1' accept='image/jpg,image/jpeg,image/png,image/gif' />
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
                                    <View className='desc'>{this.uploadImgSrc[4]['IDfication']}</View>
                                    {this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file'  onChange={this.inputChange} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                     {!this.isIos && !this.destroyInput ? (
                                        <Input className='input' type='file'  onChange={this.inputChange} id='0' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                    ): null}
                                </View>
                                <View className='li'>
                                    <View className='img-box'>
                                        <Image className='img' src={this.uploadImgSrc[5]['src']} alt='' />
                                    </View>
                                    <View className='desc'>{this.uploadImgSrc[5]['IDfication']}</View> 
                                    <Input className='input' type='file'  onChange={this.inputChange} text='请选择图片' id='1' accept='image/jpg,image/jpeg,image/png,image/gif' />
                                </View>
                            </View>
                        </View>
                        </View>
                        <View className='buttonBox'>
                            <View className={'button ' + (this.state.btnDisable ? 'disable': '')} onClick={this.submitInfo.bind(this)}>
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